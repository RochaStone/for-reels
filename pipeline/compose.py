#!/usr/bin/env python3
"""Composition model: where the speaker's head is, and where Instagram's own interface sits, so every effect
places its type and prints in clear space instead of on a face.

For each effect window (edit.FX) it measures the head on the first, middle and last frame of the window from the cutout's alpha
(public/subject.webm: one frame out through ffmpeg, a threshold, a bounding box), and writes per-effect CSS tokens
onto the effect's wrapper div, which the effect's css and fx.js read:
  --face-top / --face-bottom / --face-left / --face-right   px at 1080 x 1920: the head, hair and hat included, grown
                                                             for sway and for the camera's punch-in
  --safe-top 250, --safe-bottom 400, --safe-right 120        Instagram's interface (profile row, caption, right rail)
  --clear-zone  top | left | right | below | none            the clear zone with the most room, and its rectangle
  --clear-x / --clear-y / --clear-w / --clear-h
  --zone-top / --zone-left / --zone-right / --zone-below   every zone as "x y w h" (all 0 when it holds no type)
An effect that has its own idea of where to sit asks fx.js for `ZONE('{{ID}}')` (build.py), which hands back the same
numbers and the four zone rectangles.

The head is found from the silhouette: the top of the alpha, down to where the shoulders begin; a take where the head
fills the frame (no shoulders to find) is read as head down to 60% of the visible subject, which is what a tight
chest-up take is. edit.FACE_BOX = (left, top, right, bottom) overrides the measure (the effects lab sets it from the
stand-in's known box; a creator can set it when a measure is wrong).

Run: PY pipeline/compose.py <project>   -> prints each effect's tokens
"""
import json
import os
import subprocess
import sys

import numpy as np

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

W, H = 1080, 1920
SAFE = dict(top=250, bottom=400, right=120, left=35)         # Instagram's interface; the left margin is the sides rule
PAD = 24                                                      # clear air between the head box and a zone, px
SCALE = 4                                                     # the alpha is read at 1/4 size
MIN_SIDE = 120                                                # a zone narrower or shorter than this holds no type


def alpha_rows(webm, t):
    """the cutout's alpha at time t, read at 1/SCALE size -> bool array (H/SCALE, W/SCALE), or None"""
    cmd = ["ffmpeg", "-v", "error", "-c:v", "libvpx-vp9", "-ss", f"{max(t, 0):.3f}", "-i", webm, "-frames:v", "1",
           "-vf", f"alphaextract,scale={W // SCALE}:{H // SCALE},format=gray", "-f", "rawvideo", "-"]
    r = subprocess.run(cmd, capture_output=True)
    n = (W // SCALE) * (H // SCALE)
    if r.returncode or len(r.stdout) < n:
        return None
    return np.frombuffer(r.stdout[:n], np.uint8).reshape(H // SCALE, W // SCALE) > 128


def head_from_alpha(m):
    """(left, top, right, bottom) of the head in px at 1080 x 1920 from a bool alpha, or None when nothing is in it"""
    rows = np.where(m.any(1))[0]
    if len(rows) < 8:
        return None
    top = rows[0]
    h = m.shape[0]
    cols = [np.where(m[y])[0] for y in range(h)]
    w = np.array([(c[-1] - c[0]) if len(c) else 0 for c in cols], dtype=float)
    vis = h - top                                              # the visible subject, top of the hair to the frame foot
    # shoulders: the first row clearly wider than the head above it
    shoulder, peak = None, 0.0
    for y in range(top + 1, h):
        if y - top > 6 and w[y] > 1.3 * peak and w[y] > 0.55 * m.shape[1]:
            shoulder = y
            break
        peak = max(peak, w[y])
    if shoulder is not None and (shoulder - top) < 0.62 * vis and peak < 0.7 * m.shape[1]:
        chin = top + 0.8 * (shoulder - top)                    # neck and a little of the collar sit under the chin
    else:
        chin = top + 0.60 * vis                                # the head fills the frame: tight chest-up
    chin = int(min(chin, h - 1))
    xs = [cols[y] for y in range(top, chin + 1) if len(cols[y])]
    left, right = min(c[0] for c in xs), max(c[-1] for c in xs)
    return int(left) * SCALE, int(top) * SCALE, int(right + 1) * SCALE, int(chin + 1) * SCALE


def caption_floor(E, a, b):
    """where type may reach down to: the interface (y 1520), or, while the captions are on, the line above them. An effect
    whose window sits inside a KARAOKE hide (it carries the words itself) may use the caption band too."""
    S = getattr(E, "S", None) or {}
    y = ((S.get("captions") or {}).get("lofi") or {}).get("y", 1318) if getattr(E, "STYLE", "") != "hifi" else \
        ((S.get("captions") or {}).get("hifi") or {}).get("y", 1236)
    for h0, h1 in (getattr(E, "KARAOKE", {}) or {}).get("hide", []):
        if min(b, h1) - max(a, h0) >= 0.8 * (b - a):
            return H - SAFE["bottom"]
    return min(H - SAFE["bottom"], y - 18)


def camera_growth(E, a, b):
    """the biggest sustained camera scale (pushes, zooms, the opening settle) inside [a, b]: the head grows by it about the camera origin"""
    C, s = getattr(E, "CAMERA", {}) or {}, 1.0                 # a punch-in lasts 0.18 s and is left out: type may touch it
    for x0, x1, k in C.get("pushes", []):
        if x0 <= b and x1 >= a:
            s = max(s, k)
    for x0, x1, k in C.get("zooms", []):
        if x0 <= b and x1 >= a:
            s = max(s, k)
    o = C.get("open", (1.0, 0))
    if a < o[1]:
        s = max(s, o[0])
    return s


def zones(face, y_end=None):
    """the four clear rectangles round a head box, inside the Instagram safe area: {name: (x, y, w, h)}"""
    l, t, r, b = face
    x0, x1, y0, y1 = SAFE["left"], W - SAFE["right"], SAFE["top"], y_end or H - SAFE["bottom"]
    z = {"top": (x0, y0, x1 - x0, t - PAD - y0),
         "left": (x0, y0, l - PAD - x0, y1 - y0),
         "right": (r + PAD, y0, x1 - (r + PAD), y1 - y0),
         "below": (x0, b + PAD, x1 - x0, y1 - (b + PAD))}
    return {k: tuple(int(v) for v in rect) if rect[2] >= MIN_SIDE and rect[3] >= MIN_SIDE else (0, 0, 0, 0)
            for k, rect in z.items()}


def clear_zone(zs):
    best = max(zs, key=lambda k: zs[k][2] * zs[k][3])
    return best if zs[best][2] * zs[best][3] else "none"


def tokens(face, zs):
    name = clear_zone(zs)
    x, y, w, h = zs[name] if name != "none" else (0, 0, 0, 0)
    f = {"--face-top": face[1], "--face-bottom": face[3], "--face-left": face[0], "--face-right": face[2],
         "--safe-top": SAFE["top"], "--safe-bottom": SAFE["bottom"], "--safe-right": SAFE["right"],
         "--clear-x": x, "--clear-y": y, "--clear-w": w, "--clear-h": h}
    css = "".join(f"{k}:{v}px;" for k, v in f.items())
    css += "".join(f"--zone-{k}:{r[0]} {r[1]} {r[2]} {r[3]};" for k, r in zs.items())     # unitless "x y w h"
    return css + f"--clear-zone:{name};"


def measure(E, project, T):
    """{fx id: dict(face=(l, t, r, b), zones=..., zone=name, css=...)} for every effect in edit.FX (T = build.T,
    which turns an effect's end, a time or "end", into seconds)"""
    only = [x for x in os.environ.get("FX_ONLY", "").split(",") if x]
    out, cache = {}, {}
    webm = os.path.join(project, "public", "subject.webm")
    known = getattr(E, "FACE_BOX", None)
    key = f"{os.path.getsize(webm)}-{int(os.path.getmtime(webm))}" if os.path.exists(webm) else "none"
    cpath = os.path.join(project, "work", "compose-cache.json")
    try:
        saved = json.load(open(cpath))
        if saved.get("key") == key:
            cache = saved["frames"]
    except (OSError, ValueError, KeyError):
        pass
    ox, oy = getattr(E, "CAM_ORIGIN", None) or (W // 2, 760)
    for F in getattr(E, "FX", []):
        if only and F["id"] not in only:
            continue
        a, b = F["at"], T(E, F["end"])
        if known:
            box, how = tuple(known), "FACE_BOX"
        else:
            boxes = []
            for t in sorted({round(a + 0.04, 3), round((a + b) / 2, 3), round(max(a + 0.04, b - 0.1), 3)}):
                if str(t) not in cache:                        # the first frame, the middle and the last: she moves
                    m = alpha_rows(webm, t) if os.path.exists(webm) else None
                    cache[str(t)] = list(head_from_alpha(m)) if m is not None and head_from_alpha(m) else None
                if cache[str(t)]:
                    boxes.append(cache[str(t)])
            box, how = ((min(x[0] for x in boxes), min(x[1] for x in boxes), max(x[2] for x in boxes), max(x[3] for x in boxes)), "alpha") if boxes else (None, "")
            if box is None:                                    # no cutout yet: a centred head, the usual chest-up
                box, how = (310, 330, 770, 900), "prior"
        l, t_, r, b_ = box
        s = camera_growth(E, a, b)
        l, r = ox + (l - ox) * s, ox + (r - ox) * s
        t_, b_ = oy + (t_ - oy) * s, oy + (b_ - oy) * s
        sway = 14                                              # the head drifts a little between the first frame and the end
        face = (max(0, int(l - sway)), max(0, int(t_ - sway)), min(W, int(r + sway)), min(H, int(b_ + sway)))
        zs = zones(face, caption_floor(E, a, b))
        out[F["id"]] = dict(face=face, zones=zs, zone=clear_zone(zs), css=tokens(face, zs), how=how, growth=s)
    try:
        os.makedirs(os.path.dirname(cpath), exist_ok=True)
        json.dump({"key": key, "frames": cache}, open(cpath, "w"))
    except OSError as e:
        print(f"compose: could not cache the head measures ({e})", file=sys.stderr)
    return out


def main():
    from common import load_edit, project_arg, timeline
    import build
    project = project_arg()
    E = load_edit(project)
    build.setup(E, timeline(project))
    for fid, c in measure(E, project, build.T).items():
        print(f"{fid:20} {c['how']:8} face {c['face']}  clear {c['zone']:6} {c['zones'].get(c['zone'])}  growth {c['growth']:.2f}")


if __name__ == "__main__":
    main()
