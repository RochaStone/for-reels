// strike-swap (layer: top), the stacked-lines hook ("X" struck, "Y" under it). With strike-swap-behind (the giant word
// behind the head) it is one beat. Readable on frame 0 (the thumbnail):
//   frame 0   line one, low in the frame, set hard, holds
//   strike    on the turn word a real marker stroke (stroke.png) wipes across it, left to right
//   swap      on the new word line one dims and line two eases up into place under it over six frames; the camera
//             punch (edit.CAMERA) lands on the same frame and moves only the footage and the word behind: parallax
//   out       both hold to the end; the build cuts the layer at B
// The captions are hidden over the window (KARAOKE hide): this effect carries the words.
// Placement: the two lines sit in the clear space the build measured (ZONE: under the chin, else the clear zone), both
// at the largest step of the type scale where the wider one fits; the hook is in caps (--fx-case-hook).
// Change only these constants:
var LINES = ['the old way', 'the new way'];
var KEYS = { strike: 'now', swap: 'new' };                      // spoken words
var AT = { strike: 1.00, swap: 1.55 };                          // fallbacks (s after A)
var T = { strike: 0.20, swap: 0.20, dim: 0.20 };                // the stroke's wipe; line two's ease; line one's dim
var GAP = 1.04;                                                 // row pitch, in line heights
var COLOR = '--c-light';                                        // '--c-ink' over a light sheet
var DIM = 0.45;                                                 // line one's opacity once struck

function $$(s) { return Array.prototype.slice.call(document.querySelectorAll(s)); }
function tok(n) { return getComputedStyle(document.documentElement).getPropertyValue(n).trim(); }
var R = '#{{ID}} ', RA = R + '.{{ID}}-ra', RB = R + '.{{ID}}-rb';

[RA, RB].forEach(function (r, i) { document.querySelector(r + ' .{{ID}}-ln').textContent = LINES[i]; });
gsap.set(R + '.{{ID}}-row', { color: tok(COLOR) });
$$(R + '*').forEach(function (e) {
  if (Array.prototype.some.call(e.childNodes, function (n) { return n.nodeType === 3 && n.nodeValue.trim(); })) {
    e.setAttribute('data-layout-allow-overlap', '');
    e.setAttribute('data-layout-allow-occlusion', '');
  }
});

// ---- place: the clear zone under the chin (else the pack's clear zone); one step of the scale for both lines
var Z = ZONE('{{ID}}');
var BOX = Z.zone.below.w ? Z.zone.below : (Z.rect.w ? Z.rect : { x: Z.safe.left, y: 1250, w: 1080 - Z.safe.left - Z.safe.right, h: 270 });
var rows = $$(R + '.{{ID}}-row'), ys = { a: 0, b: 0 };   // rows[0] is line one
function fit() {
  var step = 'xl';
  rows.forEach(function (e) {
    e.style.left = BOX.x + 'px'; e.style.width = BOX.w + 'px';
    var ln = e.querySelector('.{{ID}}-ln');
    ln.style.display = 'inline-block';
    var k = fitStep(ln, BOX.w, BOX.h / (2 * GAP), step);   // shrink-to-fit: the line's own width and line height
    if (STEPS.indexOf(k) > STEPS.indexOf(step)) step = k;
  });
  rows.forEach(function (e) { var ln = e.querySelector('.{{ID}}-ln'); ln.style.fontSize = STEP[step]; ln.style.letterSpacing = 'var(--fx-ls-' + step + ')'; e.style.fontSize = STEP[step]; });
  var lh = rows[0].querySelector('.{{ID}}-ln').offsetHeight || 1, total = lh * GAP * 2;
  ys.a = Math.round(BOX.y + Math.max(0, (BOX.h - total) * 0.35));
  ys.b = Math.round(ys.a + lh * GAP);
  rows[0].style.top = ys.a + 'px'; rows[1].style.top = ys.b + 'px';
}
fit();
if (document.fonts && document.fonts.load) {
  document.fonts.load(tok('--display-style') + ' ' + tok('--display-weight') + ' 100px ' + tok('--font-display'), LINES.join(' '))
    .catch(function () {}).then(fit, fit);
  document.fonts.ready.then(fit);
}

// ---- beat times, each on its word (searched in order from A; a word missing falls back to AT)
function find(word, after, fallback) {
  var w = word ? wordAt(word, after) : null;
  return (w === null || w >= B) ? A + fallback : w;
}
var tStrike = find(KEYS.strike, A, AT.strike);
var tSwap = Math.max(find(KEYS.swap, tStrike, AT.swap), tStrike + T.strike + 0.1);

// ---- build: frame 0 is line one complete; line two hidden
if (q(A) <= 0) gsap.set('#{{ID}}', { opacity: 1 });
gsap.set(RB, { opacity: 0 });
gsap.set(R + '.{{ID}}-stroke', { clipPath: 'inset(0 100% 0 0)' });

// the strike: the real stroke revealed left to right
tl.fromTo(R + '.{{ID}}-stroke', { clipPath: 'inset(0 100% 0 0)' }, { clipPath: 'inset(0 0% 0 0)', duration: T.strike, ease: 'power2.inOut', immediateRender: false }, q(tStrike));

// the swap: line one dims, line two eases up under it and holds
tl.fromTo(RA, { opacity: 1 }, { opacity: DIM, duration: T.dim, ease: 'power1.out', immediateRender: false }, q(tSwap));
tl.fromTo(RB, { opacity: 0, y: 24 }, { opacity: 1, y: 0, duration: T.swap, ease: 'power2.out', immediateRender: false }, q(tSwap));
