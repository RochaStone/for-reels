// put-a-finger-down (layer: top). The "put a finger down" count: on each spoken point a real photo or screenshot
//   cuts in at the top of the frame (hard-edged, graded and grained like the footage, settling from a slight push,
//   the previous one gone), and the count ticks on a real guest-check pad (pad.jpg, photographed) sitting lower
//   left: the number in the display face and the point's word beside it, set hard, landing on the word with a
//   six-frame ease. Nothing is drawn. Ask CAMERA for a punch per point. A hard cut takes it all away at B.
// Supply: one photo or screenshot per point in this folder (POINTS). The kit's are labelled placeholders. The pad
// is the kit's material (kit/material/guest-check.jpg); swap in your own pad or notebook page as pad.jpg (any size,
// PAD_RATIO = its height / width).
// Placement: the build measures the head and the Instagram zones (ZONE). The photo takes the largest clear rectangle,
// the pad the next one that holds it (the count is set at --fx-s, so the pad is at most 440 px wide and as tall as its
// rows need); where no second rectangle holds a pad, the count is set as plain light type beside the photo. A take with
// no clear rectangle that holds a photo leaves the effect out (the lint says so).
// Change: POINTS, PAD (rows and step place the count on the pad's lines, as fractions of its height), PAD_RATIO,
// SHOT_RATIO, GRAIN, T.
// Reach for it on a counted list: "put a finger down if", "three things", "gifts, treats and".
// Sound: a shutter on each photo cut, a tick on each number.

var POINTS = [                                  // [photo, the point's word, cue, fallback]
  ['photo1.jpg', 'one', 'lots', 0.30],
  ['photo2.jpg', 'two', 'people', 0.80],
  ['photo3.jpg', 'three', 'this', 1.30],
];
var PAD = { rows: 0.215, step: 0.092 };       // rows: the first count line; step: per count (fractions of the pad's height)
var PAD_RATIO = 1144 / 720;                    // pad.jpg: height / width
var SHOT_RATIO = 0.76;                         // the photo's height / width
var GRAIN = 0.08;                              // the footage's grain over the photo and the pad (6 to 10%)
var T = { in: 0.28, settle: 0.26, word: 0.20 }; // the pad's landing, the photo's settle, the count's ease

var R = '#{{ID}} ';
function $(s) { return document.querySelector(R + s); }
var prev = A;
function beat(cue, fallback) {
  var w = cue ? wordAt(cue, prev) : null;
  var t = (w === null || w >= B - 0.1) ? A + fallback : w;
  prev = Math.max(prev, t);
  return t;
}

// ---- build once: the photos, the count's rows; their places come from layout, below
var Z = ZONE('{{ID}}'), ROW = 62;                // a count line at --fx-s
var pad = $('.pf-pad');
var shots = [], rows = [];
POINTS.forEach(function (p, i) {
  var sh = document.createElement('div');
  sh.className = 'pf-shot';
  sh.setAttribute('data-i', i);
  sh.setAttribute('data-fx-print', '');
  sh.innerHTML = '<img class="g" alt=""><i class="pf-grain"></i>';
  sh.querySelector('img').setAttribute('src', 'fx/{{ID}}/' + p[0]);
  $('.pf-shots').appendChild(sh);
  var row = document.createElement('div');
  row.className = 'pf-row';
  row.setAttribute('data-i', i);
  row.setAttribute('data-layout-allow-overlap', '');
  row.setAttribute('data-layout-allow-occlusion', '');
  row.innerHTML = '<b class="pf-n"></b><span class="pf-w"></span>';
  row.querySelector('.pf-n').textContent = (i + 1) + '.';
  row.querySelector('.pf-w').textContent = p[1];
  $('.pf-rows').appendChild(row);
  shots.push(sh); rows.push(row);
});
function layout() {
  var zs = ['top', 'left', 'right', 'below'].map(function (k) { return { k: k, r: Z.zone[k] }; })
    .filter(function (z) { return z.r.w > 160 && z.r.h > 120; }).sort(function (a, b) { return b.r.w * b.r.h - a.r.w * a.r.h; });
  if (!zs.length) { gsap.set('#{{ID}}', { display: 'none' }); return; }
  var S = zs[0].r, g = 16, n = POINTS.length;
  // the pad: as wide as the zone allows (440 at most), as tall as its first line and its rows need
  var pw = 0, ph = 0, P = null;
  var need = function (w) { return Math.round(PAD.rows * w * PAD_RATIO) + n * ROW + 40; };
  for (var z = 1; z < zs.length && !P; z++) {
    var r = zs[z].r, w = Math.min(440, r.w - 2 * g);
    if (w >= 240 && need(w) <= r.h - 2 * g) { pw = w; ph = need(w); P = r; }
  }
  var padOn = !!P;
  // the photo: the biggest 4:3 print that fits its zone (with room beside it for the count when there is no pad)
  var textW = padOn ? 0 : 300;
  var sw = Math.min(560, S.w - 2 * g - textW), sh = Math.round(sw * SHOT_RATIO);
  if (sh > S.h - 2 * g) { sh = S.h - 2 * g; sw = Math.round(sh / SHOT_RATIO); }
  if (sw < 200) { gsap.set('#{{ID}}', { display: 'none' }); return; }
  var sx = padOn ? S.x + (S.w - sw) / 2 : S.x + g + textW, sy = S.y + (S.h - sh) / 2;
  shots.forEach(function (el) {
    var st = el.style; st.left = Math.round(sx) + 'px'; st.top = Math.round(sy) + 'px'; st.width = sw + 'px'; st.height = sh + 'px';
  });
  pad.style.display = padOn ? '' : 'none';
  rows.forEach(function (row, i) {
    var st = row.style;
    if (padOn) {
      st.top = Math.round(PAD.rows * pw * PAD_RATIO + i * ROW - ROW * 0.82) + 'px'; st.height = ROW + 'px';
      st.left = '11%'; st.right = '8%'; st.color = '';
      pad.style.left = Math.round(P.x + (P.w - pw) / 2) + 'px'; pad.style.top = Math.round(P.y + (P.h - ph) / 2) + 'px';
      pad.style.width = pw + 'px'; pad.style.height = ph + 'px';
      if (row.parentNode !== $('.pf-rows')) $('.pf-rows').appendChild(row);
    } else {                                         // no pad: the count is plain light type at the photo's left edge
      st.position = 'absolute'; st.left = Math.round(S.x + g) + 'px'; st.right = 'auto'; st.height = ROW + 'px';
      st.top = Math.round(sy + sh / 2 - n * ROW / 2 + i * ROW) + 'px'; st.color = 'var(--c-light)';
      if (row.parentNode !== $('.pf-shots')) $('.pf-shots').appendChild(row);
    }
  });
}
layout();
if (document.fonts && document.fonts.ready) document.fonts.ready.then(layout);
gsap.set(R + '.pf-grain', { opacity: GRAIN * 3 });
gsap.set(shots, { opacity: 0, transformOrigin: '50% 50%' });
gsap.set(rows, { opacity: 0, y: 10 });
gsap.set(pad, { opacity: 0, y: 40, transformOrigin: '50% 100%' });

// ---- times, in spoken order
var tAt = POINTS.map(function (p) { return beat(p[2], p[3]); });

// A: the pad lands, easing up into place
tl.fromTo(pad, { opacity: 0, y: 40 }, { opacity: 1, y: 0, duration: T.in, ease: 'power2.out', immediateRender: false }, q(A));
// each point: the photo cuts in (the last one gone) and settles; the count ticks on its line; the pad takes the tap
POINTS.forEach(function (p, i) {
  var t = tAt[i];
  if (i) tl.set(shots[i - 1], { opacity: 0 }, q(t));
  tl.set(shots[i], { opacity: 1 }, q(t));
  tl.fromTo(shots[i], { scale: 1.05 }, { scale: 1, duration: T.settle, ease: 'power2.out', immediateRender: false }, q(t));
  tl.fromTo(rows[i], { opacity: 0, y: 10 }, { opacity: 1, y: 0, duration: T.word, ease: 'power2.out', immediateRender: false }, q(t));
  tl.fromTo(pad, { scale: 1.015 }, { scale: 1, duration: 0.16, ease: 'power2.out', immediateRender: false }, q(t));
});
