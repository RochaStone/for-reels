#!/usr/bin/env python3
"""Effect lint, run by build.py before `hyperframes check`. Two parts:

static   every fx.html / fx.js in the build sets its type from the pack's scale only: font-size is var(--fx-xl),
         var(--fx-l) or var(--fx-s) (400 / 200 / 56 px at 1080 wide), never a number
runtime  the built composition is opened in the render browser, each effect's window is sampled, and any text or print
         element whose box overlaps the head box (pipeline/compose.py) or sits inside Instagram's interface zone
         (top 250, bottom 400, right 120 px) fails, with the element, the frame and the fix

Marks an effect puts on its own elements:
  data-fx-print      a photo, scan or card placed in the frame (checked like type)
  data-fx-face-ok    this text or print may cover the head: a full-frame cut-in has replaced the speaker, or the
                     effect is about the face (the peek hole)
  data-fx-ui-ok      this may sit in the interface zone (a full-frame picture's own content)
Effects on the `behind` layer sit under the cutout: the head covers them by design, so they fail only when more than
35% of a word is hidden by the head. FX_LINT=warn prints the findings without failing (fxsandbox.py sets it);
FX_LINT=off skips the lint.

Run: PY pipeline/build.py <project>  (it calls this)
"""
import glob
import json
import os
import re
import subprocess
import sys

SCALE_FIX = "use var(--fx-xl) 400px, var(--fx-l) 200px or var(--fx-s) 56px; in fx.js, fitStep(el, maxW, maxH) takes the largest that fits"
OK_SIZE = re.compile(r"^(var\(--fx-(xl|l|s)\)|inherit|1em|100%)$")


def _strip(text, kind):
    text = re.sub(r"/\*.*?\*/", lambda m: "\n" * m.group(0).count("\n"), text, flags=re.S)
    if kind == "html":
        text = re.sub(r"<!--.*?-->", lambda m: "\n" * m.group(0).count("\n"), text, flags=re.S)
    else:
        text = re.sub(r"(?m)^\s*//.*$", "", text)
    return text


def static(project, ids):
    """[message] for every font-size in the effects' files that is not on the scale"""
    out = []
    for fid in ids:
        for name, kind in (("fx.html", "html"), ("fx.js", "js")):
            path = os.path.join(project, "fx", fid, name)
            if not os.path.exists(path):
                continue
            text = _strip(open(path, encoding="utf-8").read(), kind)
            for n, line in enumerate(text.split("\n"), 1):
                for m in re.finditer(r"font-size\s*:\s*([^;}\"'\n]+)", line):
                    v = m.group(1).strip().rstrip(",")
                    if not OK_SIZE.match(v):
                        out.append(f"fx/{fid}/{name}:{n}  font-size: {v}  ->  {SCALE_FIX}")
                for m in re.finditer(r"(?<![-\w])font\s*:\s*([^;}\"'\n]+)", line):
                    sz = re.search(r"(?:^|\s)(var\(--fx-(?:xl|l|s)\)|[\d.]+(?:px|em|rem|%))(?:/|\s|$)", m.group(1))
                    if not sz or not sz.group(1).startswith("var(--fx-"):
                        out.append(f"fx/{fid}/{name}:{n}  font: {m.group(1).strip()}  ->  {SCALE_FIX} (split the shorthand: font-family, font-weight, font-size)")
                if kind == "js":
                    for m in re.finditer(r"fontSize\s*[=:]\s*([^;\n]+)", line):
                        v = m.group(1).strip()
                        if "getComputedStyle" in line[:m.start()] or not v or v.startswith("="):
                            continue
                        if not ("var(--fx-" in v or "STEP" in v):
                            out.append(f"fx/{fid}/{name}:{n}  fontSize = {v[:60]}  ->  {SCALE_FIX}")
    return out


LINT_JS = r"""
(function () {
  var DATA = __DATA__, SAFE = { top: 250, bottom: 400, right: 120 }, found = [];
  function vis(el) {                                   // effective opacity up the tree; 0 when hidden
    var o = 1;
    for (var e = el; e && e !== document.documentElement; e = e.parentElement) {
      var cs = getComputedStyle(e);
      if (cs.display === 'none' || cs.visibility === 'hidden') return 0;
      o *= parseFloat(cs.opacity);
    }
    return o;
  }
  function clip(el, r, root) {                         // what an overflow:hidden ancestor lets show
    for (var e = el.parentElement; e && e !== root.parentElement; e = e.parentElement) {
      var cs = getComputedStyle(e);
      if (cs.overflowX !== 'visible' || cs.overflowY !== 'visible') {
        var b = e.getBoundingClientRect();
        r = { l: Math.max(r.l, b.left), t: Math.max(r.t, b.top), r: Math.min(r.r, b.right), b: Math.min(r.b, b.bottom) };
      }
    }
    return r;
  }
  function label(el, txt) {
    var s = el.tagName.toLowerCase() + (el.id ? '#' + el.id : '') + (typeof el.className === 'string' && el.className ? '.' + el.className.trim().split(/\s+/)[0] : '');
    return txt ? s + ' "' + txt.trim().slice(0, 28) + '"' : s;
  }
  function items(root) {                               // [{el, r, text}] boxes of type and prints, as shown now
    var out = [];
    Array.prototype.forEach.call(root.querySelectorAll('*'), function (el) {
      if (el.closest('[data-fx-ignore]')) return;
      var print = el.hasAttribute('data-fx-print');
      if (print) {
        var b = el.getBoundingClientRect();
        out.push({ el: el, r: { l: b.left, t: b.top, r: b.right, b: b.bottom }, text: '', print: true });
      }
      Array.prototype.forEach.call(el.childNodes, function (n) {
        if (n.nodeType !== 3 || !n.nodeValue.trim()) return;
        var rg = document.createRange(); rg.selectNodeContents(n);
        Array.prototype.forEach.call(rg.getClientRects(), function (c) {
          var pad = c.height * 0.12;                   // a line box is taller than its letters
          out.push({ el: el, r: { l: c.left, t: c.top + pad, r: c.right, b: c.bottom - pad }, text: n.nodeValue, print: false });
        });
      });
    });
    return out;
  }
  function run() {
    var tl = window.__timelines.main;
    DATA.forEach(function (F) {
      var root = document.getElementById(F.id), seen = {};
      if (!root) return;
      if (getComputedStyle(root).display === 'none') { found.push({ id: F.id, kind: 'hidden' }); return; }
      F.times.forEach(function (t) {
        tl.time(t, false);
        var its = items(root);
        if (F.layer === 'behind') {                      // a behind word is judged whole: the letters of one line together
          its = (function () {
            var by = [], out2 = [];
            its.forEach(function (it) {
              if (it.print || vis(it.el) < 0.35) { out2.push(it); return; }
              var p = it.el.parentElement, k = by.indexOf(p);
              if (k < 0) { by.push(p); out2.push({ el: it.el, r: { l: it.r.l, t: it.r.t, r: it.r.r, b: it.r.b }, text: it.text, print: false, g: by.length - 1 }); }
              else { for (var j = 0; j < out2.length; j++) if (out2[j].g === k) { var r0 = out2[j].r; r0.l = Math.min(r0.l, it.r.l); r0.t = Math.min(r0.t, it.r.t); r0.r = Math.max(r0.r, it.r.r); r0.b = Math.max(r0.b, it.r.b); } }
            });
            return out2;
          })();
        }
        its.forEach(function (it) {
          if (vis(it.el) < 0.35) return;
          var r = clip(it.el, it.r, root), w = r.r - r.l, h = r.b - r.t;
          if (F.layer === 'behind' && !it.print && h < 0.5 * (it.r.b - it.r.t)) return;   // a line caught mid-reveal in its mask
          if (w < 4 || h < 4) return;
          var what = label(it.el, it.text), k;
          if (!it.el.closest('[data-fx-ui-ok]')) {
            var why = r.t < SAFE.top - 2 ? 'the top 250 px (profile row)' : r.b > 1920 - SAFE.bottom + 2 ? 'the bottom 400 px (caption and buttons)' : r.r > 1080 - SAFE.right + 2 ? 'the right 120 px (the button rail)' : '';
            k = what + 'ui';
            if (why && !seen[k]) { seen[k] = 1; found.push({ id: F.id, t: t, kind: 'ui', what: what, why: why, box: [r.l, r.t, r.r, r.b].map(Math.round) }); }
          }
          if (!it.el.closest('[data-fx-face-ok]')) {
            var f = F.face, ix = Math.min(r.r, f[2]) - Math.max(r.l, f[0]), iy = Math.min(r.b, f[3]) - Math.max(r.t, f[1]);
            k = what + 'face';
            var over = ix > 6 && iy > 6, share = over ? ix * iy / (w * h) : 0;
            if (over && (F.layer !== 'behind' || share > 0.35) && !seen[k]) {
              seen[k] = 1; found.push({ id: F.id, t: t, kind: 'face', what: what, share: Math.round(share * 100), box: [r.l, r.t, r.r, r.b].map(Math.round) });
            }
          }
        });
      });
    });
    var pre = document.createElement('pre'); pre.id = 'fxlint'; pre.textContent = JSON.stringify(found);
    document.body.appendChild(pre);
  }
  (document.fonts && document.fonts.ready ? document.fonts.ready : Promise.resolve()).then(function () { setTimeout(run, 300); });
})();
"""


def _browser():
    p = os.environ.get("HYPERFRAMES_BROWSER_PATH")
    if p and os.path.exists(p):
        return p
    pats = [os.path.expanduser("~/.cache/hyperframes/chrome/chrome-headless-shell/*/*/chrome-headless-shell*"),
            os.path.expanduser("~/.cache/hyperframes/chrome/chrome-headless-shell/*/chrome-headless-shell*"),
            os.path.expanduser("~/.cache/hyperframes/chrome/*/*/*/chrome-headless-shell.exe")]
    for pat in pats:
        for f in sorted(glob.glob(pat), reverse=True):
            if os.path.isfile(f) and os.access(f, os.X_OK) and not f.endswith((".dylib", ".pak", ".json", ".dat")):
                return f
    return None


def sample_times(a, b, words):
    ts = [a + 0.03 + 0.12 * k for k in range(int((b - a) / 0.12))]
    ts += [w[0] + 0.12 for w in words if a < w[0] < b] + [w[0] + 0.4 for w in words if a < w[0] < b]
    ts = sorted({round(min(max(t, a + 0.02), b - 0.02), 3) for t in ts})
    return ts[:140]


def runtime(project, E, comp, T, words):
    """[message] from opening the built page in the render browser; None when there is no browser to open it in"""
    browser = _browser()
    if not browser:
        print("fxlint: no render browser found (run setup); the face and interface-zone check was skipped", file=sys.stderr)
        return None
    only = [x for x in os.environ.get("FX_ONLY", "").split(",") if x]
    data = []
    for F in getattr(E, "FX", []):
        fid = F["id"]
        if fid not in comp or (only and fid not in only) or not os.path.exists(os.path.join(project, "fx", fid, "fx.html")):
            continue
        a, b = F["at"], T(E, F["end"])
        data.append(dict(id=fid, layer=F.get("layer", "top"), face=list(comp[fid]["face"]), times=sample_times(a, b, words)))
    pub = os.path.join(project, "public")
    src = open(os.path.join(pub, "index.html"), encoding="utf-8").read()
    lint = os.path.join(pub, "index.lint.html")
    try:
        with open(lint, "w", encoding="utf-8") as fh:
            fh.write(src.replace("<head>", "<head><script>window.__timelines = {};</script>", 1)
                     .replace("</body>", f"<script>{LINT_JS.replace('__DATA__', json.dumps(data))}</script>\n</body>"))
        r = subprocess.run([browser, "--no-sandbox", "--disable-gpu", "--hide-scrollbars", "--allow-file-access-from-files",
                            "--window-size=1080,1920", "--virtual-time-budget=20000", "--dump-dom", "file://" + lint],
                           capture_output=True, text=True, timeout=180)
    except (subprocess.TimeoutExpired, OSError) as e:
        print(f"fxlint: the browser would not run ({e}); the face and interface-zone check was skipped", file=sys.stderr)
        return None
    finally:
        if os.path.exists(lint):
            os.remove(lint)
    m = re.search(r'<pre id="fxlint">(.*?)</pre>', r.stdout, re.S)
    if not m:
        print("fxlint: the page gave no result (a script error?); the face and interface-zone check was skipped", file=sys.stderr)
        return None
    import html
    out = []
    for v in json.loads(html.unescape(m.group(1))):
        c = comp[v["id"]]
        zone = c["zone"]
        if v["kind"] == "hidden":                              # not a failure: the effect left the frame to the footage
            print(f"fxlint: note  {v['id']} drew nothing: there is no room for it on this take (head box {tuple(c['face'])}, "
                  f"clear zone '{zone}'). Frame wider with headroom for it, or choose an effect that sits below the chin", file=sys.stderr)
            continue
        where = f"clear zone '{zone}' {tuple(c['zones'][zone])}" if zone != "none" else "no clear zone on this take: frame wider, or drop this beat"
        if v["kind"] == "ui":
            out.append(f"{v['id']} @{v['t']:.2f}s  {v['what']} sits in {v['why']}, box {v['box']}  ->  keep it inside x 35..960, y 250..1520: place it in the {where}")
        else:
            share = f" ({v['share']}% of it hidden by the head)" if v["share"] < 100 else ""
            out.append(f"{v['id']} @{v['t']:.2f}s  {v['what']} covers the head box {tuple(c['face'])}, box {v['box']}{share}  ->  place it in the {where} (ZONE('{v['id']}') in fx.js); for a full-frame cut-in that replaces the speaker, mark it data-fx-face-ok")
    return out


def run(E, project, T, words):
    mode = os.environ.get("FX_LINT", "fail")
    if mode == "off":
        return
    only = [x for x in os.environ.get("FX_ONLY", "").split(",") if x]
    ids = [F["id"] for F in getattr(E, "FX", []) if not only or F["id"] in only]
    msgs = static(project, ids)
    comp = getattr(E, "COMPOSE", {})
    rt = runtime(project, E, comp, T, words) if comp else None
    msgs += rt or []
    if not msgs:
        print(f"fxlint: {len(ids)} effects clean (type on the scale; nothing on the head or in the interface zone)")
        return
    head = "fxlint: " + str(len(msgs)) + " problem" + ("s" if len(msgs) != 1 else "")
    print(head + (" (FX_LINT=warn: not stopping)" if mode == "warn" else ""), file=sys.stderr)
    for m in msgs:
        print("  " + m, file=sys.stderr)
    if mode != "warn":
        sys.exit("The build stopped: fix the lines above, or set FX_LINT=warn to see them without stopping.")
