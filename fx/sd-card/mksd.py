#!/usr/bin/env python3
"""sd-card helper ("Lately in my SD card"): cuts the clips that play full-bleed, one per beat.

  reel.mp4   the effect's video for its whole window: clip 1 from A, then a hard cut to the next clip on each cue
             word (the words are looked up in words.json after A), muted H.264, 1080x1920, 30 fps

Run: PY fx/sd-card/mksd.py <project> [<id>]
  reads   <project>/edit.py (the FX entry <id>: at, end), <project>/words.json,
          <project>/fx/<id>/clips.json: {"cues": [word, ...], "clips": [[file, source in-point s, focus x 0..1(, y)], ...]}
          (one clip per segment: the first runs from A to the first cue, then one per cue; a clip may repeat; a
          photo (jpg/png) holds with a slow push, its in-point ignored)
  writes  <project>/fx/<id>/reel.mp4
<id> defaults to this script's folder name. Rerun when the window, the words or the clips change. Clips should
move (a pour, a splash, a turn): a near-still reads as a photo.
"""
import argparse
import importlib.util
import json
import os
import subprocess
import sys
import tempfile

FPS = 30
W, H = 1080, 1920


def window(project, fid):
    spec = importlib.util.spec_from_file_location("edit", os.path.join(project, "edit.py"))
    E = importlib.util.module_from_spec(spec)
    spec.loader.exec_module(E)
    fx = next((f for f in E.FX if f["id"] == fid), None)
    if fx is None:
        sys.exit(f"no FX entry {fid!r} in edit.py")
    end = fx["end"]
    if end == "end":
        tl = json.load(open(os.path.join(project, "timeline.json")))
        end = tl.get("duration") or tl.get("end")
    return float(fx["at"]), float(end)


def cues(project, words, A, B):
    ws = json.load(open(os.path.join(project, "words.json")))
    norm = lambda t: "".join(ch for ch in t.lower() if ch.isalnum() or ch == "'")
    out, after = [], A
    for w in words:
        hit = next((x["start"] for x in ws if x["start"] >= after - 1e-6 and norm(x["text"]) == norm(w)), None)
        if hit is None or hit >= B:
            sys.exit(f"cue word {w!r} not found between {after:.2f} and {B:.2f}")
        out.append(hit)
        after = hit + 0.01
    return out


def reel(project, out, spec, A, B):
    ts = cues(project, spec["cues"], A, B)
    edges = [round(A * FPS)] + [round(t * FPS) for t in ts] + [round(B * FPS)]
    clips = spec["clips"]
    if len(clips) < len(edges) - 1:
        sys.exit(f"clips.json: {len(edges) - 1} segments need {len(edges) - 1} clips, got {len(clips)}")
    tmp = tempfile.mkdtemp()
    parts = []
    for i in range(len(edges) - 1):
        n = edges[i + 1] - edges[i]
        f, t0, fx = clips[i][:3]
        fy = clips[i][3] if len(clips[i]) > 3 else 0.5
        f = f if os.path.isabs(f) else os.path.join(project, f)
        p = os.path.join(tmp, f"s{i}.mp4")
        still = f.lower().endswith((".jpg", ".jpeg", ".png", ".webp"))
        # a photo gets a slow push so it reads as a moment, not a freeze
        push = (f",scale=iw*(1+0.06*n/{max(1, n - 1)}):-2:eval=frame" if still else "")
        vf = (f"fps={FPS},scale={W}:{H}:force_original_aspect_ratio=increase{push},"
              f"crop={W}:{H}:(iw-{W})*{fx}:(ih-{H})*{fy},setsar=1,format=yuv420p")
        src = ["-loop", "1", "-i", f] if still else ["-ss", f"{t0:.3f}", "-i", f]
        subprocess.run(["ffmpeg", "-v", "error", "-y"] + src + ["-vf", vf, "-frames:v", str(n),
                        "-an", "-c:v", "libx264", "-crf", "14", "-preset", "slow", p], check=True)
        parts.append(p)
        print(f"segment {i}: frames {edges[i]}-{edges[i + 1] - 1}  {os.path.basename(f)} @ {t0:.2f}s")
    lst = os.path.join(tmp, "list.txt")
    open(lst, "w").write("".join(f"file '{p}'\n" for p in parts))
    dst = os.path.join(out, "reel.mp4")
    subprocess.run(["ffmpeg", "-v", "error", "-y", "-f", "concat", "-safe", "0", "-i", lst, "-an", "-c:v", "libx264",
                    "-crf", "14", "-preset", "slow", "-pix_fmt", "yuv420p", "-r", str(FPS), "-movflags", "+faststart", dst],
                   check=True)
    print(f"{dst}: {edges[-1] - edges[0]} frames, cuts at {', '.join(f'{t:.2f}' for t in ts)}")


def main():
    ap = argparse.ArgumentParser(description=__doc__.split("\n\n")[0])
    ap.add_argument("project")
    ap.add_argument("id", nargs="?", default=os.path.basename(os.path.dirname(os.path.abspath(__file__))))
    a = ap.parse_args()
    project = os.path.abspath(os.path.expanduser(a.project))
    out = os.path.join(project, "fx", a.id)
    if os.path.realpath(out) == os.path.realpath(os.path.dirname(os.path.abspath(__file__))) and \
            "fx-lab" not in os.path.realpath(project):
        sys.exit("refusing to write into the library folder: run it on a project")
    A, B = window(project, a.id)
    spec = json.load(open(os.path.join(out, "clips.json")))
    reel(project, out, spec, A, B)


if __name__ == "__main__":
    main()
