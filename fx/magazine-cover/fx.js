// magazine-cover (layer: behind): a real magazine cover set behind the speaker, built on the words.
//   A            the photographed cover cuts in full-bleed; the masthead eases in letter by letter (the head breaks it)
//   A + date     the dateline wipes on
//   "like"       the left coverlines rise out of their line masks, then the right ones on "magazine"
//   "cover"      a real marker circle is drawn round the key coverline (RING)
//   B - out      everything holds (T.out = 0) or clears before the hard out
// Paper, ink and type only. The cover is cover.jpg in this folder (a photographed blank cover, gloss and spine); the
// circle is circle.png (a photograph of marker ink). Every colour and face is a token.
//
// Supply: MAST, DATELINE and LINES (true words: the video's own claims). Nothing is measured by hand: the build measures
// the head (ZONE), the masthead takes the largest step of the type scale (xl, l) that fits above it with its baseline
// BASE px under the top of the head so the head breaks it, the coverline blocks (--fx-s) sit in the clear space either
// side of the head, and the ring finds the key coverline. A take with no room above the head, or beside it, leaves the
// cover out (the lint says so). The window needs a CUT_WINDOWS entry (layer behind). Change the constants below.

var MAST = 'the edit';                                         // the masthead, fitted to the space above the head
var DATELINE = 'no. 01 · october 2026';                        // left off if it is wider than the space above the head
var LINES = [['One sentence', 'Whole video,', 'edited.'],      // left block: kicker, then its lines
             ['Zero editing', 'No timeline.', 'No presets.']];  // right block
var BASE = 24;                                  // the masthead's baseline, px under the top of the head
var RING_KEY = [1, 1];                         // the coverline the marker circle goes round: [block, line] (0 left, 1 right; line 0 is the kicker)
// each beat lands on a word (plus an offset in seconds); with no such word in the window, at A + its fallback in T
var WK = { left: ['like', 0.26], right: ['magazine', 0], ring: ['cover', 0] };
var T = { step: 0.05, date: 0.20, left: 0.73, right: 0.99, ring: 1.24, draw: 0.34, out: 0 };

var ID = '{{ID}}', root = document.getElementById(ID);
function sel(s) { return s.split(',').map(function (p) { return '#' + ID + ' ' + p.trim().replace(/\$/g, ID); }).join(', '); }
function beat(k) { var w = WK[k] ? wordAt(WK[k][0], A) : null; return (w !== null && w < B) ? w + WK[k][1] : A + T[k]; }
function esc(s) { return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;'); }

// ---- build the cover's type
var Z = ZONE(ID), TOPBOX = Z.zone.top;
var h = '', nl = 0, OK = ' data-layout-allow-overlap data-layout-allow-occlusion';   // it sits behind the head by design
h += '<div class="$-dl"' + OK + '><span class="$-dlt"' + OK + '>' + esc(DATELINE) + '</span></div>';
h += '<div class="$-mh"' + OK + '><span class="$-mhi"' + OK + '>';
for (var i = 0; i < MAST.length; i++) {
  if (MAST[i] === ' ') { h += '<span class="$-sp">&nbsp;</span>'; continue; }
  h += '<span class="$-c $-c' + nl + '"' + OK + '>' + esc(MAST[i]) + '</span>';
  nl++;
}
h += '<i class="$-bl"></i></span></div>';
LINES.forEach(function (ls, b) {
  h += '<div class="$-sky $-l' + b + (b ? ' $-r' : '') + '"' + OK + '>';
  ls.forEach(function (s, j) {
    h += '<div class="$-m $-m' + j + '"' + OK + ' data-layout-allow-overflow><span class="' + (j ? '$-t' : '$-k') + '"' + OK +
      '>' + esc(s) + '</span></div>';
  });
  h += '</div>';
});
h = h.replace(/\$/g, ID);
document.getElementById(ID + '-lt').innerHTML = h;
var ring = root.querySelector('.' + ID + '-ring');

// ---- layout: masthead at the largest step above the head, coverline blocks in the side zones, the ring on its line
function layout() {
  var m = root.querySelector('.' + ID + '-mh'), mi = m.querySelector('.' + ID + '-mhi'), dl = root.querySelector('.' + ID + '-dl');
  var base = Z.face.t + BASE, room = (base - Z.safe.top) / 0.8 + 0, skies = root.querySelectorAll('.' + ID + '-sky');
  var step = TOPBOX.w ? fitStep(mi, TOPBOX.w, room, 'xl') : 's';
  var side = [Z.zone.left, Z.zone.right];
  if (step === 's' || !(side[0].w || side[1].w)) { gsap.set('#' + ID, { display: 'none' }); return; }   // no room: leave the cover out
  m.style.fontSize = STEP[step]; m.style.left = TOPBOX.x + 'px'; m.style.width = TOPBOX.w + 'px';
  m.style.top = (base - m.querySelector('.' + ID + '-bl').offsetTop).toFixed(1) + 'px';
  var mTop = base - 0.72 * parseFloat(getComputedStyle(m).fontSize);
  var dlt = dl.querySelector('.' + ID + '-dlt'); fitStep(dlt, 99999, 0, 's');
  var dateOk = dlt.offsetWidth <= TOPBOX.w && mTop - 80 >= Z.safe.top;
  dl.style.display = dateOk ? '' : 'none'; dl.style.left = TOPBOX.x + 'px'; dl.style.width = TOPBOX.w + 'px'; dl.style.top = Math.round(mTop - 80) + 'px';
  var y0 = Math.max(base + 60, Z.safe.top + 20);
  Array.prototype.forEach.call(skies, function (el, b) {
    var zz = side[b], ok = zz.w > 0 && Math.max.apply(null, Array.prototype.map.call(el.querySelectorAll('span'), function (t) { fitStep(t, 99999, 0, 's'); return t.offsetWidth; })) <= zz.w;
    el.style.display = ok ? '' : 'none';
    if (!ok) return;
    el.style.width = zz.w + 'px'; el.style.left = zz.x + 'px'; el.style.top = Math.max(y0, zz.y) + 'px';
  });
  var key = skies[RING_KEY[0]] && skies[RING_KEY[0]].querySelectorAll('.' + ID + '-m')[RING_KEY[1]];
  if (key && skies[RING_KEY[0]].style.display !== 'none') {
    var r = key.getBoundingClientRect(), pad = 26;
    ring.style.display = ''; ring.style.left = Math.round(r.left - pad) + 'px'; ring.style.top = Math.round(r.top - r.height * 0.45) + 'px';
    ring.style.width = Math.round(r.width + 2 * pad) + 'px';
  } else ring.style.display = 'none';
}
layout();
if (document.fonts && document.fonts.load) {
  Promise.all([getComputedStyle(root.querySelector('.' + ID + '-mh')), getComputedStyle(root.querySelector('.' + ID + '-dlt')), getComputedStyle(root.querySelector('.' + ID + '-t'))]
    .map(function (c) { return document.fonts.load(c.fontStyle + ' ' + c.fontWeight + ' 56px ' + c.fontFamily, MAST + DATELINE + LINES.join(' ')).catch(function () {}); })).then(layout, layout);
}
document.fonts.ready.then(layout);

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
