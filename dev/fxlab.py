#!/usr/bin/env python3
"""Dev only: the effects lab. A showcase project on the stand-in footage (dev/standin.py) whose script triggers every
effect in the library, so each one can be built, tested and previewed in a real composition. Its fx/ folder is a link
to this kit's fx/ library: an agent working in the lab edits the library itself.

Run: .venv/bin/python dev/fxlab.py [--pack default|bold|soft]  -> dev/out/fx-home/projects/fx-lab/
     .venv/bin/python dev/fxlab.py --previews [id ...]            -> rewrites fx/<id>/preview.jpg from the lab
Then: PY pipeline/fxsandbox.py <lab> <your-name> --only <ids> --at <times>
"""
import json
import os
import shutil
import subprocess
import sys

KIT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
PY = sys.executable
HOME = os.path.join(KIT, "dev", "out", "fx-home")
LAB = os.path.join(HOME, "projects", "fx-lab")
STANDIN = os.path.join(KIT, "dev", "out", "standin", "standin.mp4")

# the script on the OUTPUT timeline: (start, end, line). Every line calls for one effect.
LINES = [
    (0.10, 2.40, "I didn't edit a single second of this video."),
    (2.60, 4.30, "No timeline, no presets, nothing."),
    (4.60, 7.40, "Before, I edited for hours. Now it takes one sentence."),
    (7.30, 9.10, "Now it looks like a magazine cover."),
    (9.55, 12.80, "My goddesses, my team, my trip, my people."),
    (12.90, 14.60, "A few minutes later, this is the video."),
    (14.70, 15.70, "Make it moody."),
    (16.00, 17.50, "Lots of people do this."),
    (17.60, 19.20, "I just ordered this amazing pudding."),
    (19.30, 20.70, "Just between us, nothing about yoga."),
    (20.80, 22.30, "I never open an editing app."),
    (22.50, 23.80, "Bigger captions."),
    (24.00, 25.50, "I recorded a walkthrough."),
    (25.70, 28.20, "Comment EDIT and I'll send it to you."),
]

EDIT = '''"""FX LAB (dev only): the stand-in footage with one line per library effect. Edit freely in your sandbox copy."""
TITLE = "FX Lab"
STYLE = "showcase"
SRC = "{src}"
KEEP = [(0.0, 7.2), (7.3, 16.0), (16.1, 28.7)]     # two joins, so there are picture cuts for the transitions
FACE_BOX = (390, 585, 690, 960)                     # the stand-in's head, known: the composition model uses it instead of measuring
FRAMES = {{"WIDE": (1080, 1920, 0, 0), "CLOSE": (864, 1536, 108, 192)}}
SHOTS = [(0.000, "WIDE"), (7.500, "CLOSE"), (16.200, "WIDE")]
HOLD = 0.5
FIXES = {{}}
PROMPT = ""
CAPS = []
KARAOKE = dict(huge=[], hide=[(4.60, 7.40), (9.55, 12.80), (12.90, 14.60), (16.00, 17.50), (22.40, 23.90), (25.60, 28.70)])   # the effects that carry the words
BOXES = []
OVERLAYS = []
BEHIND = []
CUT_WINDOWS = [(0.0, 2.50), (4.60, 7.40), (7.60, 9.45), (20.80, 22.40)]
BW = []
GRADES = [(7.00, 14.60, "warm"), (14.60, 16.20, "moody")]
CAMERA = dict(settles=[], open=(1.0, 0.01), zooms=[])
CARDS = []
END_CARD = None
FX = [
    dict(id="kinetic-hook", layer="behind", at=0.0, end=2.50, frames=[0.2, 0.8, 1.75, 2.3], note="the hook"),
    dict(id="kinetic-hook-front", layer="top", at=0.0, end=0.37),
    dict(id="icon-strike", layer="top", at=2.50, end=4.50, frames=[2.98, 3.94, 4.30], note="no timeline, no presets, nothing"),
    dict(id="strike-swap-behind", layer="behind", at=4.60, end=7.40),
    dict(id="strike-swap", layer="top", at=4.60, end=7.40),
    dict(id="photo-collage", layer="top", at=9.55, end=12.80),
    dict(id="sd-card", layer="over", at=12.90, end=14.60),
    dict(id="put-a-finger-down", layer="top", at=16.00, end=17.50),
    dict(id="photo-dive", layer="top", at=17.60, end=19.20),
    dict(id="circle-frame", layer="cam", at=19.30, end=20.70),
    dict(id="magazine-cover", layer="behind", at=7.60, end=9.45, frames=[7.9, 8.6, 9.2], note="a magazine cover"),
    dict(id="word-stamp", layer="behind", at=20.80, end=22.40, frames=[21.6, 22.35], note="NEVER behind the head"),
    dict(id="giant-captions", layer="over", at=22.40, end=23.90, frames=[22.8, 23.5], note="bigger captions"),
    dict(id="comment-cta", layer="top", at=25.60, end="end", frames=[26.20, 28.00, 28.90], note="the CTA"),
    dict(id="camera-transitions", layer="over", at=0.0, end="end"),
]
SOUND = dict(sfx=[], music=None)
CARD_SFX = []
NEEDS = []
GENERATED = []
'''


# the frame that sells each effect: its preview.jpg (540 x 960) is this time of the lab
PREVIEW = {"kinetic-hook": 1.75, "kinetic-hook-front": 0.20, "icon-strike": 3.94, "strike-swap": 6.60, "strike-swap-behind": 6.60,
           "magazine-cover": 8.60, "photo-collage": 12.40, "sd-card": 14.00, "put-a-finger-down": 17.20, "photo-dive": 18.70,
           "circle-frame": 20.10, "word-stamp": 21.60, "giant-captions": 23.50, "comment-cta": 28.00, "camera-transitions": 7.56}


def previews(only=None):
    """build the lab (the lint warns, never stops) and write each effect's preview.jpg from the PREVIEW times"""
    sys.path.insert(0, os.path.join(KIT, "pipeline"))
    env = dict(os.environ, REEL_KIT_HOME=HOME, FX_LINT="warn")
    subprocess.run([PY, os.path.join(KIT, "pipeline", "build.py"), LAB, "--stills"], check=True, env=env)
    os.environ["REEL_KIT_HOME"] = HOME
    from storyboard import snapshot
    ids = [i for i in PREVIEW if not only or i in only]
    out = os.path.join(LAB, "work", "previews")
    names = snapshot(LAB, [PREVIEW[i] for i in ids], out)
    for i, n in zip(ids, names):
        shutil.copy(os.path.join(out, n), os.path.join(KIT, "fx", i, "preview.jpg"))
        print(f"{i:20} preview.jpg  (lab t={PREVIEW[i]})")
    shutil.rmtree(os.path.join(LAB, "public", "snapshots"), ignore_errors=True)


def run(*cmd):
    subprocess.run(cmd, check=True, env=dict(os.environ, REEL_KIT_HOME=HOME))


def words():
    out = []
    for a, b, line in LINES:
        ws = line.split()
        step = (b - a) / len(ws)
        for i, w in enumerate(ws):
            out.append({"text": w, "start": round(a + i * step, 3), "end": round(a + (i + 0.85) * step, 3)})
    return out


def main():
    if "--previews" in sys.argv:
        previews([a for a in sys.argv[sys.argv.index("--previews") + 1:] if not a.startswith("--")])
        return
    pack = sys.argv[sys.argv.index("--pack") + 1] if "--pack" in sys.argv else "default"
    if not os.path.exists(STANDIN):
        run(PY, os.path.join(KIT, "dev", "standin.py"), "video", STANDIN, "32")
    shutil.rmtree(LAB, ignore_errors=True)
    style = os.path.join(HOME, "style")
    shutil.rmtree(style, ignore_errors=True)
    shutil.copytree(os.path.join(KIT, "examples", "packs", pack), style)
    run(PY, os.path.join(KIT, "pipeline", "style.py"), os.path.join(style, "style.json"))
    run(PY, os.path.join(KIT, "pipeline", "new.py"), "fx-lab", STANDIN, "FX Lab", "--mode", "showcase")
    with open(os.path.join(LAB, "edit.py"), "w") as fh:
        fh.write(EDIT.format(src=STANDIN))
    shutil.rmtree(os.path.join(LAB, "fx"), ignore_errors=True)
    os.symlink(os.path.join(KIT, "fx"), os.path.join(LAB, "fx"))
    run(PY, os.path.join(KIT, "pipeline", "cut.py"), LAB)
    json.dump(words(), open(os.path.join(LAB, "words.json"), "w"), indent=1)
    shutil.copy(os.path.join(LAB, "assets", "aroll.mp4"), os.path.join(LAB, "public", "clean.mp4"))
    run(PY, os.path.join(KIT, "dev", "standin.py"), "matte", os.path.join(LAB, "assets", "aroll.mp4"),
        os.path.join(LAB, "assets", "subject.webm"))
    shutil.copy(os.path.join(LAB, "assets", "subject.webm"), os.path.join(LAB, "public", "subject.webm"))
    # silence for the master: there is no voice to mix
    tl = json.load(open(os.path.join(LAB, "timeline.json")))
    subprocess.run(["ffmpeg", "-v", "error", "-y", "-f", "lavfi", "-i", "anullsrc=r=48000:cl=stereo", "-t",
                    f"{tl['total']:.3f}", "-c:a", "pcm_s16le", os.path.join(LAB, "public", "master.wav")], check=True)
    print(f"LAB {LAB}  ({tl['total']:.2f}s, pack {pack}); fx/ -> {os.path.join(KIT, 'fx')}")


if __name__ == "__main__":
    main()
