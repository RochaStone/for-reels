#!/usr/bin/env python3
"""Setup: checks what reel-kit needs on this computer and installs its own pieces. Safe to run again any time.

Run with any Python 3.10+:  python3 setup/setup.py [--check] [--matte]
  --check  report only, change nothing: one STATUS line per piece, then READY or NOT READY
  --matte  also install PyTorch for pipeline/matte.py (smoother cutouts for lo-fi, about 1 GB)

Prints a numbered "Step n of N" line before every stage and a STATUS line after it. A MISSING line ends with the
exact fix for this computer. Ends with READY or NOT READY and the total time. Nothing stays silent for more than
15 seconds: long downloads print their progress. Standard library only, so it runs before anything else is
installed. Everything it installs goes in $REEL_KIT_HOME (default ~/For Reels/.kit: bin/, node/, .venv/, vendor/),
next to the style pack and projects, never inside the skill folder. It also creates the "For Reels" folder
with Inbox/ (clip and photos go in) and Reels/ (finished reels come out).
Everything it prints is also appended to REEL_KIT_HOME/setup.log (a --check run prints only). On a Mac that has no ffmpeg or
Node, setup downloads static builds into REEL_KIT_HOME/bin itself: no Homebrew, no sudo.
"""
import hashlib
import os
import platform
import re
import shutil
import subprocess
import sys
import tarfile
import threading
import time
import urllib.request
import zipfile

# python.org Python on macOS ships without root certificates until "Install Certificates.command" is run: fall back
# to the system bundle so font and GSAP downloads don't fail with CERTIFICATE_VERIFY_FAILED
if sys.platform == "darwin" and not os.environ.get("SSL_CERT_FILE") and os.path.exists("/etc/ssl/cert.pem"):
    os.environ["SSL_CERT_FILE"] = "/etc/ssl/cert.pem"

# some download hosts (the static ffmpeg site) refuse Python's default user agent with a 403
_op = urllib.request.build_opener()
_op.addheaders = [("User-Agent", "Mozilla/5.0 (reel-kit setup)")]
urllib.request.install_opener(_op)

KIT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
HOME = os.path.expanduser(os.environ.get("REEL_KIT_HOME", "~/For Reels/.kit"))   # same default as pipeline/common.py
ROOT = os.path.dirname(HOME) if os.path.basename(HOME) == ".kit" else HOME       # the "For Reels" folder: Inbox/, Reels/, .kit/
WIN = os.name == "nt"
BIN = os.path.join(HOME, "bin")                        # static ffmpeg / ffprobe and links to the kit's own node
NODE_DIR = os.path.join(HOME, "node")                  # an official Node tarball, unpacked
os.environ["PATH"] = BIN + os.pathsep + os.environ.get("PATH", "")   # the kit's own tools win, same as common.py
VENV = os.path.join(HOME, ".venv")                     # everything setup makes lives in HOME: the skill folder may be read-only
VENV_PY = os.path.join(VENV, "Scripts", "python.exe") if WIN else os.path.join(VENV, "bin", "python")
HF = ["npx.cmd" if WIN else "npx", "-y", "hyperframes@0.8.139"]
GSAP_VERSION = "3.15.0"
GSAP_URL = f"https://cdn.jsdelivr.net/npm/gsap@{GSAP_VERSION}/dist/gsap.min.js"
GSAP_PATH = os.path.join(HOME, "vendor", "gsap.min.js")
CHECK = "--check" in sys.argv
OS = "macos" if sys.platform == "darwin" else "windows" if WIN else "linux"
ARCH = platform.machine().lower()
FFMPEG_SITE = "https://ffmpeg.martin-riedl.de"         # static macOS and Linux builds with libvpx and libx264, each with a .sha256
NODE_DIST = "https://nodejs.org/dist/latest-v22.x/"     # official tarballs with SHASUMS256.txt
FIX = {
    "ffmpeg": {"macos": "setup downloads ffmpeg itself; if that failed, check the internet connection and run setup again",
               "linux": "sudo apt install ffmpeg",
               "windows": "winget install --id Gyan.FFmpeg -e   (then reopen the terminal)"},
    "node": {"macos": "setup downloads Node itself; if that failed, check the internet connection and run setup again",
             "linux": "Node 22+ (the render engine needs it; apt's is usually older): "
                      "curl -fsSL https://deb.nodesource.com/setup_22.x | sudo -E bash - && sudo apt-get install -y nodejs",
             "windows": "winget install --id OpenJS.NodeJS.LTS -e   (then reopen the terminal)"},
    "python": {"macos": "install Python 3.12 from https://www.python.org/downloads/macos/ (the macOS installer, two clicks), "
                        "then run setup again",
               "linux": "sudo apt install python3 python3-venv",
               "windows": "winget install --id Python.Python.3.12 -e"},
}
ok = True
SANDBOX = os.environ.get("CODEX_SANDBOX")   # Codex marks its sandboxed commands; the render browser can't start in it
FULL_ACCESS = ("give this session full access (Codex: Full access in the permissions menu, or start it with "
               "`codex --sandbox danger-full-access`), then run setup again")
T0 = time.time()
STEPS = 7 if OS != "windows" else 6
step_n = 0


LOG = os.path.join(HOME, "setup.log")


def say(msg):
    """print, and keep a copy in HOME/setup.log so a stuck buyer can paste it"""
    print(msg, flush=True)
    if CHECK:
        return
    try:
        os.makedirs(HOME, exist_ok=True)
        with open(LOG, "a") as fh:
            fh.write(msg + "\n")
    except OSError:
        pass


def step(label, about=""):
    """the numbered progress line a buyer's agent relays: what is happening and roughly how long"""
    global step_n
    step_n += 1
    say(f"Step {step_n} of {STEPS}: {label}" + (f" ({about})" if about else ""))


def status(name, good, detail="", fix=""):
    global ok
    ok = ok and good
    line = f"STATUS {name:<11} {'OK     ' if good else 'MISSING'} {detail}"
    if not good and fix:
        line += f"\n           fix: {fix}"
    say(line)


def run(cmd, **kw):
    return subprocess.run(cmd, capture_output=True, text=True, **kw)


def version_of(cmd):
    try:
        out = run(cmd)
        return (out.stdout + out.stderr).strip()
    except OSError:
        return ""


def watched(cmd, **kw):
    """run a long command, printing a dot every 15 seconds so nothing looks stuck; returns the CompletedProcess"""
    p = subprocess.Popen(cmd, stdout=subprocess.PIPE, stderr=subprocess.STDOUT, text=True, **kw)
    out, last, quiet = [], time.time(), True
    def pump():
        for line in p.stdout:
            out.append(line)
    t = threading.Thread(target=pump, daemon=True)
    t.start()
    while p.poll() is None:
        time.sleep(1)
        if time.time() - last >= 15:
            print(".", end="", flush=True)
            last, quiet = time.time(), False
    t.join(timeout=5)
    if not quiet:
        print(flush=True)
    return subprocess.CompletedProcess(cmd, p.returncode, "".join(out), "")


def download(url, dest, label=""):
    """urlretrieve with progress every 15 seconds; raises on failure"""
    os.makedirs(os.path.dirname(dest), exist_ok=True)
    last = [time.time(), False]
    def hook(blocks, size, total):
        if time.time() - last[0] >= 15:
            done = blocks * size
            pct = f"{100 * done // total}%" if total > 0 else f"{done // (1 << 20)} MB"
            say(f"  {label or os.path.basename(dest)}: {pct}")
            last[0], last[1] = time.time(), True
    tmp = dest + ".part"
    urllib.request.urlretrieve(url, tmp, hook)
    os.replace(tmp, dest)


def sha256(path):
    h = hashlib.sha256()
    with open(path, "rb") as fh:
        for chunk in iter(lambda: fh.read(1 << 20), b""):
            h.update(chunk)
    return h.hexdigest()


# ---------------------------------------------------------------- static tools (macOS without Homebrew)

def ffmpeg_release_dir():
    """the newest numbered release folder for this Mac on the static-build site (snapshots are skipped)"""
    arch = "arm64" if ARCH in ("arm64", "aarch64") else "amd64"
    page = urllib.request.urlopen(FFMPEG_SITE + "/", timeout=30).read().decode("utf-8", "ignore")
    dirs = re.findall(rf'/download/macos/{arch}/(\d+)_(\d+\.\d+(?:\.\d+)?)/ffmpeg\.zip"', page)
    if not dirs:
        return None
    stamp, ver = max(dirs, key=lambda d: int(d[0]))
    return f"{FFMPEG_SITE}/download/macos/{arch}/{stamp}_{ver}/", ver


def install_ffmpeg():
    """ffmpeg and ffprobe static builds into HOME/bin, each verified against the site's .sha256"""
    found = ffmpeg_release_dir()
    if not found:
        say("  could not find a macOS build on the download site")
        return False
    base, ver = found
    os.makedirs(BIN, exist_ok=True)
    for tool in ("ffmpeg", "ffprobe"):
        zpath = os.path.join(BIN, f"{tool}.zip")
        download(base + f"{tool}.zip", zpath, f"{tool} {ver}")
        want = urllib.request.urlopen(base + f"{tool}.zip.sha256", timeout=30).read().decode().split()[0].lower()
        got = sha256(zpath)
        if got != want:
            os.remove(zpath)
            say(f"  {tool}: checksum mismatch (expected {want[:12]}, got {got[:12]}); not installed")
            return False
        with zipfile.ZipFile(zpath) as z:
            z.extract(tool, BIN)
        os.chmod(os.path.join(BIN, tool), 0o755)
        os.remove(zpath)
    # macOS quarantines downloads; the binaries are ours now
    subprocess.run(["xattr", "-d", "com.apple.quarantine", os.path.join(BIN, "ffmpeg"), os.path.join(BIN, "ffprobe")],
                   capture_output=True)
    return bool(version_of([os.path.join(BIN, "ffmpeg"), "-version"]))


def install_node():
    """an official Node 22 tarball into HOME/node, verified against SHASUMS256.txt, linked from HOME/bin"""
    sums = urllib.request.urlopen(NODE_DIST + "SHASUMS256.txt", timeout=30).read().decode()
    plat = "darwin" if OS == "macos" else "linux"
    arch = "arm64" if ARCH in ("arm64", "aarch64") else "x64"
    m = re.search(rf"^([0-9a-f]{{64}})\s+(node-v22[\w.]*-{plat}-{arch}\.tar\.gz)$", sums, re.M)
    if not m:
        say(f"  no Node 22 build listed for {plat}-{arch}")
        return False
    want, name = m.group(1), m.group(2)
    tgz = os.path.join(HOME, name)
    download(NODE_DIST + name, tgz, name)
    if sha256(tgz) != want:
        os.remove(tgz)
        say("  Node: checksum mismatch; not installed")
        return False
    shutil.rmtree(NODE_DIR, ignore_errors=True)
    with tarfile.open(tgz) as t:
        t.extractall(HOME, filter="data") if hasattr(tarfile, "data_filter") else t.extractall(HOME)
    os.rename(os.path.join(HOME, name[:-len(".tar.gz")]), NODE_DIR)
    os.remove(tgz)
    os.makedirs(BIN, exist_ok=True)
    for tool in ("node", "npm", "npx"):
        link = os.path.join(BIN, tool)
        if os.path.lexists(link):
            os.remove(link)
        os.symlink(os.path.join(NODE_DIR, "bin", tool), link)
    return bool(re.match(r"v22", version_of([os.path.join(BIN, "node"), "--version"])))


# ---------------------------------------------------------------- render test

FRAME = """<!doctype html><html><head><meta charset="utf-8"><title>render test</title></head><body>
<div id="root" data-composition-id="main" data-start="0" data-duration="1.000" data-fps="30" data-width="1080" data-height="1920"
 style="width:1080px;height:1920px;background:#222"></div>
<script src="vendor/gsap.min.js"></script>
<script>window.__timelines = window.__timelines || {}; window.__timelines["main"] = gsap.timeline({ paused: true }).to({}, { duration: 1 });</script>
</body></html>"""

BROWSER_FILE = os.path.join(HOME, "vendor", "browser-path.txt")     # a browser setup picked; the pipeline uses it
PLAYWRIGHT = "playwright@1.56.1"


def frame_test(browser=None):
    """one frame of a one-second composition with the render browser; returns (ok, output)"""
    import glob
    import tempfile
    d = tempfile.mkdtemp(prefix="reel-kit-render-test-")
    os.makedirs(os.path.join(d, "vendor"))
    shutil.copy(GSAP_PATH, os.path.join(d, "vendor", "gsap.min.js"))
    shutil.copy(os.path.join(KIT, "kit", "hyperframes.json"), d)
    with open(os.path.join(d, "index.html"), "w") as fh:
        fh.write(FRAME)
    env = dict(os.environ, **({"HYPERFRAMES_BROWSER_PATH": browser} if browser else {}))
    r = subprocess.run(HF + ["snapshot", "--at", "0.5", "--no-end", "--describe", "false"], cwd=d,
                       capture_output=True, text=True, env=env)
    good = r.returncode == 0 and bool(glob.glob(os.path.join(d, "snapshots", "frame-*.png")))
    shutil.rmtree(d, ignore_errors=True)
    return good, r.stdout + r.stderr


def linux_browser():
    """Linux on ARM (Claude Cowork's VM, Raspberry Pi, ARM servers) has no headless Chrome build, and Ubuntu's
    chromium-browser is a snap wrapper that won't start in a VM or container: install Playwright's Chromium into
    HOME/browsers instead and remember it. Returns the path that renders, or None."""
    dest = os.path.join(HOME, "browsers")
    env = dict(os.environ, PLAYWRIGHT_BROWSERS_PATH=dest)
    say("  installing a render browser that works on this Linux (Chromium, about 200 MB, once)")
    root = hasattr(os, "geteuid") and os.geteuid() == 0
    cmd = ["npx", "-y", PLAYWRIGHT, "install"] + (["--with-deps"] if root else []) + ["chromium"]
    r = watched(cmd, env=env)
    if r.returncode and not root:
        say("  note: if it still can't start, its system libraries are missing: "
            f"sudo npx -y {PLAYWRIGHT} install-deps chromium")
    import glob
    found = sorted(glob.glob(os.path.join(dest, "chromium_headless_shell-*", "*", "headless_shell"))) + \
        sorted(glob.glob(os.path.join(dest, "chromium-*", "*", "chrome")))
    for b in found:
        if frame_test(b)[0]:
            os.makedirs(os.path.dirname(BROWSER_FILE), exist_ok=True)
            with open(BROWSER_FILE, "w") as fh:
                fh.write(b)
            return b
    return None


def render_test():
    """launch the render browser for real: one frame of a one-second composition. READY has to mean it can render"""
    saved = open(BROWSER_FILE).read().strip() if os.path.exists(BROWSER_FILE) else None
    good, out = frame_test(saved if saved and os.path.exists(saved) else None)
    if not good and OS == "linux" and not SANDBOX and not CHECK:
        b = linux_browser()
        if b:
            good, out = True, ""
            say(f"  render browser: {b}")
    if good:
        status("render", True, "the render browser launched and drew a frame")
    elif SANDBOX or "MachPortRendezvousServer" in out:
        status("render", False, "BLOCKED: this agent's sandbox stops the render browser from starting", FULL_ACCESS)
    else:
        status("render", False, "the test frame failed:\n" + out[-1200:],
               f"{' '.join(HF)} browser ensure, or point HYPERFRAMES_BROWSER_PATH at any Chrome or Chromium")


def find_python():
    """this Python if it is 3.10+, else the newest python3.1x on PATH (or python.org's / Homebrew's), else None"""
    if sys.version_info >= (3, 10):
        return sys.executable
    names = ["python3.13", "python3.12", "python3.11", "python3.10"] + (["py"] if WIN else [])
    extra = ["/opt/homebrew/bin/python3", "/usr/local/bin/python3"] + \
        [f"/Library/Frameworks/Python.framework/Versions/3.{v}/bin/python3" for v in (13, 12, 11, 10)]
    for c in [shutil.which(n) for n in names] + [p for p in extra if os.path.exists(p)]:
        if not c:
            continue
        m = re.search(r"Python 3\.(\d+)", version_of([c, "--version"]))
        if m and int(m.group(1)) >= 10:
            return c
    return None


def main():
    if not CHECK:
        say(f"--- setup run {time.strftime('%Y-%m-%d %H:%M:%S')} ---")
    say(f"reel-kit setup on {OS} ({ARCH}), kit at {KIT}")
    say(f"Your folder: {ROOT}   (put the clip and photos in Inbox, finished reels appear in Reels; tools live in .kit)")
    if CHECK:
        say("check only: nothing is installed or changed")
    else:
        for d in ("Inbox", "Reels"):
            os.makedirs(os.path.join(ROOT, d), exist_ok=True)
        say("First setup takes 15 to 30 minutes and downloads about 3 GB (a render browser, the speech model, Node). "
            "Leave it running. Later runs take seconds.")
    if SANDBOX:
        net = " with the network off" if os.environ.get("CODEX_SANDBOX_NETWORK_DISABLED") else ""
        say(f"note: running inside Codex's sandbox ({SANDBOX}){net}. Rendering launches a headless browser, which "
            f"this sandbox blocks: {FULL_ACCESS}")

    # 1. Python 3.10+ for the kit's environment (a stock Mac's python3 is 3.9: look for a newer one first)
    step("checking Python", "needs 3.10 or newer")
    base = find_python()
    status("python", bool(base), (version_of([base, "--version"]) + f" ({base})") if base else platform.python_version(),
           FIX["python"][OS])
    if not base:
        say("NOT READY: Python 3.10 or newer is the one thing setup cannot install for you. Apply the fix above, "
            "then run setup again.")
        sys.exit(1)

    # 2. ffmpeg / ffprobe, with the VP9 encoder the cutout needs; on a Mac without them, a static build of our own
    step("checking ffmpeg", "downloads a static build on a Mac that has none, about 80 MB")
    have = shutil.which("ffmpeg") and shutil.which("ffprobe")
    if not have and OS == "macos" and not CHECK:
        try:
            have = install_ffmpeg()
        except Exception as e:                                        # a network or site error: report, don't crash
            say(f"  ffmpeg download failed: {e}")
    detail = version_of(["ffmpeg", "-version"]).split("\n")[0][:60] if have else ""
    if have and shutil.which("ffmpeg", path=BIN):
        detail += " (the kit's own, in bin/)"
    status("ffmpeg", bool(have), detail, FIX["ffmpeg"][OS])
    if have and "libvpx-vp9" not in version_of(["ffmpeg", "-hide_banner", "-encoders"]):
        say("  note: this ffmpeg has no VP9 encoder (libvpx); cutouts behind the speaker need it")

    # 3. Node 22+ (HyperFrames refuses older); on a Mac without it, the official tarball
    step("checking Node", "downloads Node 22 on a Mac that has none, about 50 MB")
    def node_ok():
        v = version_of(["node", "--version"]) if shutil.which("node") else ""
        m = re.match(r"v(\d+)", v)
        return (bool(m and int(m.group(1)) >= 22), v)
    good, v = node_ok()
    if not good and OS in ("macos", "linux") and not CHECK:
        try:
            if install_node():
                good, v = node_ok()
        except Exception as e:
            say(f"  Node download failed: {e}")
    status("node", good, v + ("" if good else " (needs 22+)") + (" (the kit's own, in bin/)" if good and os.path.exists(os.path.join(BIN, "node")) else ""),
           FIX["node"][OS])

    # 4. the kit's own Python environment
    step("the kit's Python environment", "numpy, scipy, pillow, faster-whisper; 2 to 5 minutes")
    reqs = os.path.join(KIT, "setup", "requirements.txt")
    if not os.path.exists(VENV_PY) and not CHECK:
        say(f"  creating .venv with {base}")
        os.makedirs(HOME, exist_ok=True)
        subprocess.run([base, "-m", "venv", VENV], check=True)
    if os.path.exists(VENV_PY) and not CHECK:
        say("  installing Python packages")
        watched([VENV_PY, "-m", "pip", "install", "-q", "--upgrade", "pip"])
        r = watched([VENV_PY, "-m", "pip", "install", "-q", "-r", reqs])
        if r.returncode:
            say(r.stdout[-1500:])
    probe = run([VENV_PY, "-c", "import numpy, scipy, PIL, faster_whisper"]) if os.path.exists(VENV_PY) else None
    status("venv", bool(probe and probe.returncode == 0), VENV_PY,
           f"python3 {os.path.join(KIT, 'setup', 'setup.py')}")

    # 5. GSAP (standard license, downloaded here rather than committed), HyperFrames and its render browser
    step("the render engine", "HyperFrames and a headless Chrome, about 300 MB; 2 to 10 minutes")
    if not os.path.exists(GSAP_PATH) and not CHECK:
        try:
            download(GSAP_URL, GSAP_PATH, "gsap")
        except OSError as e:
            say(f"  GSAP download failed: {e}")
    good = os.path.exists(GSAP_PATH) and f"GSAP {GSAP_VERSION}" in open(GSAP_PATH, errors="ignore").read(400)
    status("gsap", good, GSAP_VERSION, f"download {GSAP_URL} to {GSAP_PATH}")
    found = False
    if shutil.which("npx" if not WIN else "npx.cmd"):
        hv = version_of(HF + ["--version"]) if CHECK else watched(HF + ["--version"]).stdout.strip()
        status("hyperframes", "0.8.139" in hv, "hyperframes 0.8.139",
               FULL_ACCESS if SANDBOX else "check your internet connection, then run setup again")
        if not CHECK:
            say("  making sure the render browser is installed")
            r = watched(HF + ["browser", "ensure"])
            if r.returncode:
                say(r.stdout[-800:])
        chrome = run(HF + ["browser", "path"])
        found = chrome.returncode == 0 and bool(chrome.stdout.strip())
        if OS != "linux" or found:                  # on Linux the render step installs a browser that works
            status("browser", found, "found" if found else "", FULL_ACCESS if SANDBOX else f"{' '.join(HF)} browser ensure")
    else:
        status("hyperframes", False, "needs Node first", FIX["node"][OS])

    # 6. the transcription model (downloaded once, about 1.5 GB, into the Hugging Face cache)
    step("the speech model", "Whisper medium, about 1.5 GB, once; 3 to 10 minutes")
    if os.path.exists(VENV_PY):
        probe_cmd = [VENV_PY, "-c", "from faster_whisper.utils import download_model; download_model('medium', local_files_only=True)"]
        have = run(probe_cmd)
        if have.returncode and not CHECK:
            say("  downloading the transcription model")
            watched([VENV_PY, "-c", "from faster_whisper.utils import download_model; download_model('medium')"])
            have = run(probe_cmd)
        status("speech", have.returncode == 0, "medium", "check your internet connection, then run setup again")
    else:
        status("speech", False, "needs the Python environment first", f"python3 {os.path.join(KIT, 'setup', 'setup.py')}")

    # 7. a real render: one frame through the browser. READY means it can render
    if OS != "windows":
        step("a test render", "one frame through the render browser")
        if os.path.exists(GSAP_PATH) and (found or OS == "linux"):
            render_test()
        else:
            status("render", False, "skipped: the render engine is not installed yet", "run setup again after the fixes above")

    # optional: smoother cutouts
    if "--matte" in sys.argv and os.path.exists(VENV_PY):
        if not CHECK:
            cmd = [VENV_PY, "-m", "pip", "install", "-q", "torch"]
            if OS == "linux" and not shutil.which("nvidia-smi"):
                cmd += ["--index-url", "https://download.pytorch.org/whl/cpu"]
            say("  installing PyTorch (about 1 GB)")
            watched(cmd)
        t = run([VENV_PY, "-c", "import torch; print(torch.__version__)"])
        status("matte", t.returncode == 0, t.stdout.strip(), "python3 setup/setup.py --matte")

    # the creator's style (made by onboarding, not by setup; the first reel runs without one)
    pack = os.path.join(HOME, "style", "style.json")
    say(f"STATUS style       {'OK     ' if os.path.exists(pack) else 'NONE YET'} "
        f"{pack if os.path.exists(pack) else 'the first reel uses the neutral pack; say set up my style after it'}")
    mins, secs = divmod(int(time.time() - T0), 60)
    say(("READY" if ok else "NOT READY: apply the fixes above, then run setup again") + f"  (setup took {mins} min {secs} s)")
    sys.exit(0 if ok else 1)


if __name__ == "__main__":
    main()
