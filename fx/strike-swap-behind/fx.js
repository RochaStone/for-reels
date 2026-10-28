// strike-swap-behind (layer: behind, under the speaker's cutout; needs a CUT_WINDOWS entry over its window). The
// masthead half of the strike-swap hook; strike-swap (top) carries the readable stacked lines.
//   frame 0   OLD hangs huge above the head, complete (the thumbnail), set hard, and holds
//   strike    on the turn word a real marker stroke (stroke.png, a photograph of ink) wipes across it, left to right
//   swap      on the new word OLD cuts out and NEW eases up into place over six frames, then holds; the camera punch
//             (edit.CAMERA) lands on the same frame and carries it, the lines on top stay put: parallax
//   out       it holds to the end; the build cuts the layer at B
// GROUND: '' for the footage, or a photographed sheet in this folder (newsprint.jpg, notebook.jpg) full-bleed behind
// the speaker under the footage's grain. On a light sheet set COLOR to '--c-ink'.
// Placement: in the clear space above the head the build measured (ZONE.top): the largest step of the type scale where
// the word fits between the top of the interface and the head, its foot tucked TUCK behind the head. Where there is no
// room above the head (a tight take) the effect leaves the frame to strike-swap's lines and draws nothing.
// Change only these constants:
var OLD = 'before';                          // the word on screen from frame 0
var NEW = 'after';                           // the word that replaces it
var KEYS = { strike: 'now', swap: 'new' };   // spoken words
var AT = { strike: 1.00, swap: 1.55 };       // fallbacks (s after A)
var T = { strike: 0.24, swap: 0.20 };        // the stroke's wipe; the new word's ease (six frames)
var TUCK = 0.18;                             // the word's foot goes this far (of its height) behind the head
var COLOR = { old: '--c-light', new: '--c-light' };   // on a light GROUND use '--c-ink'
var GROUND = '';                             // '' or a file in this folder, e.g. 'newsprint.jpg'
var GRAIN = 0.08;                            // the footage's grain over the sheet (6 to 10%)

function $$(s) { return Array.prototype.slice.call(document.querySelectorAll(s)); }
function tok(n) { return getComputedStyle(document.documentElement).getPropertyValue(n).trim(); }
var R = '#{{ID}} ';

function letters(sel, word) {
  var host = document.querySelector(R + sel + ' .{{ID}}-w');
  host.textContent = word;
}
letters('.{{ID}}-old', OLD);
letters('.{{ID}}-new', NEW);
gsap.set(R + '.{{ID}}-old', { color: tok(COLOR.old) });
gsap.set(R + '.{{ID}}-new', { color: tok(COLOR.new) });
if (GROUND) {
  var g = document.querySelector(R + '.{{ID}}-gimg');
  if (!g.getAttribute('src')) g.setAttribute('src', 'fx/{{ID}}/' + GROUND);
  gsap.set(R + '.{{ID}}-ground', { display: 'block' });
  gsap.set(R + '.{{ID}}-grain', { opacity: GRAIN });
}
$$(R + '*').forEach(function (e) {
  if (Array.prototype.some.call(e.childNodes, function (n) { return n.nodeType === 3 && n.nodeValue.trim(); })) {
    e.setAttribute('data-layout-allow-overlap', '');
    e.setAttribute('data-layout-allow-occlusion', '');
  }
});

// ---- place: the largest step that fits above the head; hidden when none does
var Z = ZONE('{{ID}}'), TOPBOX = Z.zone.top;
var TOP = 0;
function fit() {
  var els = $$(R + '.{{ID}}-m'), words = els.map(function (e) { return e.querySelector('.{{ID}}-w'); });
  if (!TOPBOX.w) { gsap.set('#{{ID}}', { display: 'none' }); return; }
  var room = (Z.face.t - Z.safe.top) / (1 - TUCK), step = 'xl';
  words.forEach(function (w) {
    w.style.display = 'inline-block';
    var k = fitStep(w, TOPBOX.w, room, step);
    if (STEPS.indexOf(k) > STEPS.indexOf(step)) step = k;
  });
  els.forEach(function (e, i) { e.style.fontSize = STEP[step]; words[i].style.fontSize = STEP[step]; words[i].style.letterSpacing = 'var(--fx-ls-' + step + ')'; });
  var h = words[0].offsetHeight;
  if (step === 's' || h > room) { gsap.set('#{{ID}}', { display: 'none' }); return; }   // a giant word is xl or l: smaller is just a line
  TOP = Math.max(Z.safe.top, Math.round(Z.face.t + TUCK * h - h));
  els.forEach(function (e) { e.style.top = TOP + 'px'; e.style.left = TOPBOX.x + 'px'; e.style.width = TOPBOX.w + 'px'; });
}
fit();
if (document.fonts && document.fonts.load) {
  document.fonts.load(tok('--display-style') + ' ' + tok('--display-weight') + ' 100px ' + tok('--font-display'), OLD + NEW)
    .catch(function () {}).then(fit, fit);
  document.fonts.ready.then(fit);
}

function find(word, after, fallback) {
  var w = word ? wordAt(word, after) : null;
  return (w === null || w >= B) ? A + fallback : w;
}
var tStrike = find(KEYS.strike, A, AT.strike);
var tSwap = Math.max(find(KEYS.swap, tStrike, AT.swap), tStrike + T.strike + 0.1);

// ---- build: frame 0 is OLD complete, NEW hidden, the stroke unrevealed
if (q(A) <= 0) gsap.set('#{{ID}}', { opacity: 1 });
gsap.set(R + '.{{ID}}-new', { opacity: 0 });
gsap.set(R + '.{{ID}}-stroke', { clipPath: 'inset(0 100% 0 0)' });

// the strike: the real stroke revealed left to right, eased, no flinch
tl.fromTo(R + '.{{ID}}-stroke', { clipPath: 'inset(0 100% 0 0)' }, { clipPath: 'inset(0 0% 0 0)', duration: T.strike, ease: 'power2.inOut', immediateRender: false }, q(tStrike));

// the swap: OLD cuts out, NEW eases up six frames into place and holds
tl.set(R + '.{{ID}}-old', { opacity: 0 }, q(tSwap));
tl.fromTo(R + '.{{ID}}-new', { opacity: 0, y: 28 }, { opacity: 1, y: 0, duration: T.swap, ease: 'power2.out', immediateRender: false }, q(tSwap));
