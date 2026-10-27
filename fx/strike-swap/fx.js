// strike-swap (layer: top), the stacked-lines hook ("X" struck, "Y" under it). With strike-swap-behind (the giant word
// behind the head) it is one beat. Readable on frame 0 (the thumbnail):
//   frame 0   line one, low in the frame, set hard, holds
//   strike    on the turn word a real marker stroke (stroke.png) wipes across it, left to right
//   swap      on the new word line one dims and line two eases up into place under it over six frames; the camera
//             punch (edit.CAMERA) lands on the same frame and moves only the footage and the word behind: parallax
//   out       both hold to the end; the build cuts the layer at B
// The captions are hidden over the window (KARAOKE hide): this effect carries the words.
// Change only these constants:
var LINES = ['the old way', 'the new way'];
var KEYS = { strike: 'now', swap: 'new' };                      // spoken words
var AT = { strike: 1.00, swap: 1.55 };                          // fallbacks (s after A)
var T = { strike: 0.20, swap: 0.20, dim: 0.20 };                // the stroke's wipe; line two's ease; line one's dim
var Y = { a: 1086, b: 1206 };                                   // px: row tops (keep x < 980 from y 1155 down)
var SIZE = 104;                                                 // px (maximum: a wide line shrinks)
var MAXW = 880;
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

// ---- fit: SIZE, shrunk once the pack's fonts are in if a line is too wide
function fit() {
  $$(R + '.{{ID}}-row').forEach(function (e) {
    e.style.fontSize = SIZE + 'px';
    var w = e.querySelector('.{{ID}}-ln').offsetWidth;
    if (w > MAXW) e.style.fontSize = (SIZE * MAXW / w).toFixed(2) + 'px';
  });
}
fit();
if (document.fonts && document.fonts.load) {
  document.fonts.load(tok('--display-style') + ' ' + tok('--display-weight') + ' ' + SIZE + 'px ' + tok('--font-display'), LINES.join(' '))
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
gsap.set(RA, { y: Y.a });
gsap.set(RB, { y: Y.b, opacity: 0 });
gsap.set(R + '.{{ID}}-stroke', { clipPath: 'inset(0 100% 0 0)' });

// the strike: the real stroke revealed left to right
tl.fromTo(R + '.{{ID}}-stroke', { clipPath: 'inset(0 100% 0 0)' }, { clipPath: 'inset(0 0% 0 0)', duration: T.strike, ease: 'power2.inOut', immediateRender: false }, q(tStrike));

// the swap: line one dims, line two eases up under it and holds
tl.fromTo(RA, { opacity: 1 }, { opacity: DIM, duration: T.dim, ease: 'power1.out', immediateRender: false }, q(tSwap));
tl.fromTo(RB, { opacity: 0, y: Y.b + 24 }, { opacity: 1, y: Y.b, duration: T.swap, ease: 'power2.out', immediateRender: false }, q(tSwap));
