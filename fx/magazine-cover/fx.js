// magazine-cover (layer: behind): a real magazine cover set behind the speaker, built on the words.
//   A            the photographed cover cuts in full-bleed; the masthead eases in letter by letter (the head breaks it)
//   A + date     the dateline wipes on
//   "like"       the left coverlines rise out of their line masks, then the right ones on "magazine"
//   "cover"      a real marker circle is drawn round the key coverline (RING)
//   B - out      everything holds (T.out = 0) or clears before the hard out
// Paper, ink and type only. The cover is cover.jpg in this folder (a photographed blank cover, gloss and spine); the
// circle is circle.png (a photograph of marker ink). Every colour and face is a token.
//
// Supply: MAST, DATELINE and LINES (true words: the video's own claims), then LAYOUT, measured on a still of the shot
// (ffmpeg -ss <t> -i public/clean.mp4 -frames:v 1 still.jpg): set mastBase about 60 px below the top of the head so
// the head breaks the masthead, keep the coverline blocks beside the head, and put RING over the key coverline. The
// window needs a CUT_WINDOWS entry (layer behind). Change the constants below, nothing else.

var MAST = 'THE EDIT';                                         // the masthead, fitted to LAYOUT.mastWidth
var DATELINE = 'No. 01 · October 2026 · One sentence, one edit';
var LINES = [['One sentence', 'Whole video,', 'edited.'],      // left block: kicker, then its lines
             ['Zero editing', 'No timeline.', 'No presets.']];  // right block
var LAYOUT = {
  mastBase: 560, mastWidth: 880, mastMax: 230, // masthead baseline (y), the width it fits to, its largest size
  date: 340,                                   // dateline top
  left: [92, 640], right: [988, 640],          // coverline blocks: left block's left edge / right block's right edge, top
  ring: [640, 586, 400]                        // the marker circle: left, top, width (over the key coverline)
};
// each beat lands on a word (plus an offset in seconds); with no such word in the window, at A + its fallback in T
var WK = { left: ['like', 0.26], right: ['magazine', 0], ring: ['cover', 0] };
var T = { step: 0.05, date: 0.20, left: 0.73, right: 0.99, ring: 1.24, draw: 0.34, out: 0 };

var ID = '{{ID}}', root = document.getElementById(ID);
function sel(s) { return s.split(',').map(function (p) { return '#' + ID + ' ' + p.trim().replace(/\$/g, ID); }).join(', '); }
function beat(k) { var w = WK[k] ? wordAt(WK[k][0], A) : null; return (w !== null && w < B) ? w + WK[k][1] : A + T[k]; }
function esc(s) { return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;'); }

// ---- build the cover's type
var h = '', nl = 0, OK = ' data-layout-allow-overlap data-layout-allow-occlusion';   // it sits behind the head by design
h += '<div class="$-dl"' + OK + ' style="top:' + LAYOUT.date + 'px"><span class="$-dlt"' + OK + '>' + esc(DATELINE) + '</span></div>';
h += '<div class="$-mh"' + OK + '><span class="$-mhi"' + OK + '>';
for (var i = 0; i < MAST.length; i++) {
  if (MAST[i] === ' ') { h += '<span class="$-sp">&nbsp;</span>'; continue; }
  h += '<span class="$-c $-c' + nl + '"' + OK + '>' + esc(MAST[i]) + '</span>';
  nl++;
}
h += '<i class="$-bl"></i></span></div>';
LINES.forEach(function (ls, b) {
  var x = b === 0 ? LAYOUT.left[0] : LAYOUT.right[0] - 300, y = b === 0 ? LAYOUT.left[1] : LAYOUT.right[1];
  h += '<div class="$-sky $-l' + b + (b ? ' $-r' : '') + '"' + OK + ' style="left:' + x + 'px;top:' + y + 'px">';
  ls.forEach(function (s, j) {
    h += '<div class="$-m $-m' + j + '"' + OK + ' data-layout-allow-overflow><span class="' + (j ? '$-t' : '$-k') + '"' + OK +
      '>' + esc(s) + '</span></div>';
  });
  h += '</div>';
});
h = h.replace(/\$/g, ID);
document.getElementById(ID + '-lt').innerHTML = h;
var ring = root.querySelector('.' + ID + '-ring');
ring.style.left = LAYOUT.ring[0] + 'px'; ring.style.top = LAYOUT.ring[1] + 'px'; ring.style.width = LAYOUT.ring[2] + 'px';

// ---- masthead: fit it to mastWidth, then sit its baseline on mastBase (again once the display face has loaded)
function fit() {
  var m = root.querySelector('.' + ID + '-mh');
  var f0 = parseFloat(getComputedStyle(m).fontSize), w0 = m.querySelector('.' + ID + '-mhi').offsetWidth;
  var f = Math.min(LAYOUT.mastMax, f0 * LAYOUT.mastWidth / Math.max(1, w0));
  m.style.fontSize = f.toFixed(2) + 'px';
  m.style.top = (LAYOUT.mastBase - m.querySelector('.' + ID + '-bl').offsetTop).toFixed(1) + 'px';
}
fit();
var mcs = getComputedStyle(root.querySelector('.' + ID + '-mh'));
document.fonts.load(mcs.fontStyle + ' ' + mcs.fontWeight + ' 100px ' + mcs.fontFamily).then(fit);

// ---- the beats
var tL = beat('left'), tR = beat('right'), tRing = beat('ring'), tOut = B - T.out;
if (q(A) <= 0) gsap.set('#' + ID, { opacity: 1 });
gsap.set(sel('.$-c'), { yPercent: -50, opacity: 0 });
gsap.set(sel('.$-dlt'), { clipPath: 'inset(0% 100% 0% 0%)' });
gsap.set(sel('.$-sky span'), { yPercent: 110 });
gsap.set(ring, { clipPath: 'inset(0 100% 0 0)' });

// the masthead: each letter eases down into place, no overshoot
for (i = 0; i < nl; i++) {
  tl.to(sel('.$-c' + i), { yPercent: 0, duration: 0.32, ease: 'power3.out' }, q(A + T.step * i));
  tl.to(sel('.$-c' + i), { opacity: 1, duration: 0.1, ease: 'none' }, q(A + T.step * i));
}
var SHUT = 'inset(0% 100% 0% 0%)', OPEN = 'inset(0% 0% 0% 0%)', GONE = 'inset(0% 0% 0% 100%)';   // clip-path: fromTo only
tl.fromTo(sel('.$-dlt'), { clipPath: SHUT }, { clipPath: OPEN, duration: 0.4, ease: 'power3.out', immediateRender: false }, q(A + T.date));
// coverlines rise out of their line masks, one block per word
[tL, tR].forEach(function (t, b) {
  for (var j = 0; j < (LINES[b] || []).length; j++) {
    tl.to(sel('.$-l' + b + ' .$-m' + j + ' span'), { yPercent: 0, duration: 0.34, ease: 'power3.out' }, q(t + 0.06 * j));
  }
});
// the circle: the real ink drawn round the key line, left to right
tl.fromTo(ring, { clipPath: 'inset(0 100% 0 0)' }, { clipPath: 'inset(0 0% 0 0)', duration: T.draw, ease: 'power2.inOut', immediateRender: false }, q(tRing));

// out: the type clears before the hard cut (T.out = 0 holds everything to B)
if (T.out > 0) {
  var d = Math.min(0.14, T.out * 0.75), gap = nl > 1 ? (T.out - d) / (nl - 1) : 0;    // the last letter is gone at B
  for (i = 0; i < nl; i++) {
    tl.to(sel('.$-c' + i), { yPercent: 45, opacity: 0, duration: d, ease: 'power2.in' }, q(tOut + gap * i));
  }
  tl.to(sel('.$-sky span'), { yPercent: -110, duration: d, ease: 'power2.in' }, q(tOut));
  tl.fromTo(sel('.$-dlt'), { clipPath: OPEN }, { clipPath: GONE, duration: d, ease: 'power2.in', immediateRender: false }, q(tOut));
  tl.to(ring, { opacity: 0, duration: d, ease: 'power2.in' }, q(tOut));
}
