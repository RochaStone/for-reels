#!/usr/bin/env python3
"""Render: build the composition, lint it, render it, QA it (cuts, lip sync, loudness), make the phone copy and,
when QA passes, deliver both next to the source clip. Refuses to render while any card is still a placeholder.
Run: PY pipeline/render.py <project> [name] [--no-deliver]   -> <project>/renders/<name>.mp4 (default <slug>-v1)
"""
import os
import shutil
import subprocess
import sys

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from common import HF, PY, hf, load_edit, project_arg  # noqa: E402

HERE = os.path.dirname(os.path.abspath(__file__))


HDR_TRC = ("arib-std-b67", "smpte2084")


def sdr_media(pub):
    """an HDR clip anywhere in public/ (iPhone b-roll an effect cut in) switches HyperFrames to its HDR layered composite,
    which drops the behind-the-head layer: convert each one to BT.709 in place before rendering"""
    for root, _, files in os.walk(pub):
        if ".transcode-cache" in root:
            continue
        for f in files:
            if not f.lower().endswith((".mp4", ".mov", ".m4v")):
                continue
            path = os.path.join(root, f)
            trc = subprocess.run(["ffprobe", "-v", "error", "-select_streams", "v:0", "-show_entries",
                                  "stream=color_transfer,color_primaries", "-of", "default=nw=1", path],
                                 capture_output=True, text=True).stdout
            if not any(t in trc for t in HDR_TRC) and "bt2020" not in trc:
                continue
            tmp = path + ".sdr.mp4"
            subprocess.run(["ffmpeg", "-v", "error", "-y", "-i", path, "-vf",
                            "colorspace=all=bt709:iall=bt2020:fast=1,format=yuv420p", "-c:v", "libx264", "-crf", "16",
                            "-preset", "slow", "-color_primaries", "bt709", "-color_trc", "bt709", "-colorspace", "bt709",
                            "-c:a", "copy", tmp], check=True)
            os.replace(tmp, path)
            print(f"HDR -> BT.709: {os.path.relpath(path, pub)}")


def main():
    project = project_arg()
    E = load_edit(project)
    rest = [a for a in sys.argv[2:] if not a.startswith("--")]
    name = rest[0] if rest else f"{os.path.basename(project)}-v1"
    pub = os.path.join(project, "public")
    from build import sync_cards                      # bring finished card mp4s in before checking for them
    sync_cards(E, project, pub)
    missing = [c[0] for c in E.CARDS if not os.path.exists(os.path.join(pub, c[1]))]
    if missing:
        sys.exit(f"cards not rendered yet: {missing}")
    for f in ("clean.mp4", "master.wav"):
        if not os.path.exists(os.path.join(pub, f)):
            sys.exit(f"public/{f} missing (clean.mp4 = assets/aroll.mp4; master.wav from mix.py)")
    subprocess.run([PY, os.path.join(HERE, "build.py"), project], check=True)
    chk = hf(["check"], pub)
    print(chk.stdout[-600:])
    os.makedirs(os.path.join(project, "renders"), exist_ok=True)
    out = os.path.join("..", "renders", f"{name}.mp4")
    # a preview session can leave browser proxies here; an H.264 proxy of subject.webm has no alpha and would paint the
    # speaker over everything behind the head, so the render always starts from the real files
    shutil.rmtree(os.path.join(pub, ".transcode-cache"), ignore_errors=True)
    sdr_media(pub)
    hf(["render", "-q", "delivery", "--quiet", "-o", out], pub)
    shutil.rmtree(os.path.join(pub, "snapshots"), ignore_errors=True)
    # the renderer's own audio pass can come out ~0.7 dB under the mix on graphics-heavy edits: lay
    # the exact master.wav over the rendered picture (video copied untouched, both start at 0, so sync can't move)
    final = os.path.join(project, "renders", f"{name}.mp4")
    tmp = final.replace(".mp4", ".mix.mp4")
    subprocess.run(["ffmpeg", "-v", "error", "-y", "-i", final, "-i", os.path.join(pub, "master.wav"), "-map", "0:v",
                    "-map", "1:a", "-c:v", "copy", "-c:a", "aac", "-b:a", "320k", "-ar", "48000", "-shortest",
                    "-movflags", "+faststart", tmp], check=True)
    os.replace(tmp, final)
    qa = subprocess.run([PY, os.path.join(HERE, "qa.py"), project, os.path.join("renders", f"{name}.mp4"), "--phone"])
    if qa.returncode:
        sys.exit("QA failed: fix what it reports, render again. Nothing was delivered.")
    if "--no-deliver" not in sys.argv:
        deliver(E, name, final)


def deliver(E, name, final):
    """the render and its phone copy next to the source clip: '<Title> v1.mp4' and '<Title> v1 (phone).mp4'"""
    ver = name.rsplit("-", 1)[-1] if name.rsplit("-", 1)[-1].startswith("v") else name
    dest = os.path.dirname(os.path.abspath(os.path.expanduser(E.SRC)))
    title = "".join(ch for ch in E.TITLE if ch not in '/\\:*?"<>|').strip() or "Video"
    pairs = [(final, f"{title} {ver}.mp4"), (final.replace(".mp4", "-phone.mp4"), f"{title} {ver} (phone).mp4")]
    for src, out in pairs:
        if os.path.exists(src) and os.access(dest, os.W_OK):
            shutil.copy(src, os.path.join(dest, out))
            print("delivered", os.path.join(dest, out))


if __name__ == "__main__":
    main()
