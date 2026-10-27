#!/usr/bin/env python3
"""circle-frame helper: the torn hole in the paper, and the clip the hole cuts to.

  card-hole.png  the sheet: card.png (a photographed deckled card, kit/material) centred on a 1080x1920 frame, with a
                 round hole torn at CIRCLE (the radius wanders a few px round the circle, a soft fibre edge) and a
                 soft shadow just inside the hole where the paper's thickness falls on the picture
  broll.mp4      (with --clip) the real thing the line names, square, for the effect's whole window: it holds its
                 first frame until the cue word, then plays from --src at --speed, framed on --fx (0 left .. 1 right);
                 a wide shot whose subject runs across it takes --span x0,x1 instead: that part of its width fits the
                 square and the frame is mirrored out above and below

Run: PY fx/circle-frame/mkhole.py <project> [<id>] [--clip FILE --src S --speed X --fx F | --span X0,X1 --cue WORD]
  reads   <project>/fx/<id>/fx.js (CIRCLE), <project>/edit.py (the FX entry), <project>/words.json, card.png
  writes  <project>/fx/<id>/card-hole.png[, broll.mp4]
<id> defaults to this script's folder name. Rerun after changing CIRCLE, the window or the clip.
"""
import argparse
import importlib.util
import json
import math
import os
import re
import subprocess
import sys

import numpy as np
from PIL import Image, ImageFilter

FPS = 30
W, H = 1080, 1920


def consts(js):
    m = re.search(r"var CIRCLE\s*=\s*\[([^\]]+)\]", js)
    return [float(x) for x in m.group(1).split(",")]


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


def hole(folder, cx, cy, r):
    """card.png centred on the frame, a torn hole at (cx, cy, r)"""
    card = Image.open(os.path.join(folder, "card.png")).convert("RGBA")
    cw, ch = card.size
    k = min((W - 40) / cw, (H - 60) / ch)          # the sheet fills the frame with a little ground round its edge
    card = card.resize((int(cw * k), int(ch * k)), Image.LANCZOS)
    cw, ch = card.size
    sheet = Image.new("RGBA", (W, H), (0, 0, 0, 0))
    sheet.paste(card, ((W - cw) // 2, (H - ch) // 2), card)
    a = np.asarray(sheet).astype(np.float32)
    ys, xs = np.mgrid[0:H, 0:W]
    dx, dy = xs - cx, ys - cy
    d = np.hypot(dx, dy)
    th = np.arctan2(dy, dx)
    rng = np.random.default_rng(7)
    wob = np.zeros_like(th)
    for k, amp in ((3, 5.0), (7, 3.0), (13, 1.6), (29, 0.8)):          # the tear wanders, bigger waves and finer nicks
        wob += amp * np.sin(k * th + rng.uniform(0, 2 * math.pi))
    edge = r + wob
    # the paper's alpha: gone inside the tear, a 2 px fibre fade at the edge
    cut = np.clip((d - edge) / 2.0 + 0.5, 0, 1)
    alpha = a[..., 3] * cut
    # the fibres: the paper lightens a touch in the last 3 px before the tear
    fibre = np.clip(1 - (d - edge) / 3.0, 0, 1) * cut
    rgb = a[..., :3] * (1 + 0.10 * fibre[..., None])
    # the paper's thickness: a soft shadow on the picture just inside the hole
    inner = np.clip(1 - (edge - d) / 16.0, 0, 1) * (d < edge)
    sh = (inner ** 1.6) * 0.42 * 255
    rgb = np.where((d < edge)[..., None], 0, rgb)
    alpha = np.where(d < edge, sh, alpha)
    out = np.dstack([np.clip(rgb, 0, 255), np.clip(alpha, 0, 255)]).astype(np.uint8)
    img = Image.fromarray(out, "RGBA")
    # 256 colours with alpha keep the file small; the paper's edge comes through unchanged
    img = img.quantize(colors=256, method=Image.Quantize.FASTOCTREE, dither=Image.Dither.FLOYDSTEINBERG)
    img.save(os.path.join(folder, "card-hole.png"), optimize=True)
    return img.size


def broll(project, out, A, B, clip, src, speed, fx, cue, side, span=None):
    ws = json.load(open(os.path.join(project, "words.json")))
    norm = lambda t: "".join(ch for ch in t.lower() if ch.isalnum())
    tc = next((w["start"] for w in ws if A - 1e-6 <= w["start"] < B and norm(w["text"]) == norm(cue)), None)
    if tc is None:
        sys.exit(f"cue word {cue!r} not found in {A:.2f}-{B:.2f}")
    pre, n = round(tc * FPS) - round(A * FPS), round(B * FPS) - round(A * FPS)
    side += side % 2
    if span:                       # a wide shot: fit this span of its width, mirror the frame out to the square
        x0, x1 = span
        wh = subprocess.run(["ffprobe", "-v", "error", "-select_streams", "v:0", "-show_entries", "stream=width,height",
                             "-of", "csv=p=0", clip], capture_output=True, text=True, check=True).stdout.split(",")
        iw, ih = float(wh[0]), float(wh[1])
        h = int(round(side * ih / (iw * (x1 - x0)) / 2)) * 2
        pt = (side - h) // 2
        fit = (f"crop=iw*{x1 - x0}:ih:iw*{x0}:0,scale={side}:{h},pad={side}:{side}:0:{pt},"
               f"fillborders=top={pt}:bottom={side - h - pt}:mode=mirror")
    else:
        fit = f"scale={side}:{side}:force_original_aspect_ratio=increase,crop={side}:{side}:(iw-{side})*{fx}:(ih-{side})*0.5"
    # the clip holds its first frame for `pre` frames (the paper lands first), then plays at --speed
    vf = f"setpts=PTS/{speed},fps={FPS},{fit},tpad=start={pre}:start_mode=clone,setsar=1,format=yuv420p"
    dst = os.path.join(out, "broll.mp4")
    subprocess.run(["ffmpeg", "-v", "error", "-y", "-ss", f"{src:.3f}", "-i", clip, "-vf", vf, "-frames:v", str(n), "-an",
                    "-c:v", "libx264", "-crf", "14", "-preset", "slow", "-pix_fmt", "yuv420p", "-movflags", "+faststart", dst],
                   check=True)
    print(f"{dst}: {n} frames ({side}x{side}), holds {pre} frames, plays from {tc:.2f}s")


def main():
    ap = argparse.ArgumentParser(description=__doc__.split("\n\n")[0])
    ap.add_argument("project")
    ap.add_argument("id", nargs="?", default=os.path.basename(os.path.dirname(os.path.abspath(__file__))))
    ap.add_argument("--clip"); ap.add_argument("--src", type=float, default=0.0)
    ap.add_argument("--speed", type=float, default=1.0); ap.add_argument("--fx", type=float, default=0.5)
    ap.add_argument("--cue")
    ap.add_argument("--span", help="x0,x1: fit this part of a wide shot's width (0..1) instead of cropping to --fx")
    a = ap.parse_args()
    project = os.path.abspath(os.path.expanduser(a.project))
    out = os.path.join(project, "fx", a.id)
    if os.path.realpath(out) == os.path.realpath(os.path.dirname(os.path.abspath(__file__))) and \
            "fx-lab" not in os.path.realpath(project):
        sys.exit("refusing to write into the library folder: run it on a project")
    cx, cy, r = consts(open(os.path.join(out, "fx.js"), encoding="utf-8").read())
    print(f"{out}/card-hole.png {hole(out, cx, cy, r)}")
    if a.clip:
        if not a.cue:
            sys.exit("--clip needs --cue (the word the clip starts playing on)")
        A, B = window(project, a.id)
        span = [float(x) for x in a.span.split(",")] if a.span else None
        broll(project, out, A, B, a.clip, a.src, a.speed, a.fx, a.cue, int(round(2 * r * 1.12)), span)


if __name__ == "__main__":
    main()
