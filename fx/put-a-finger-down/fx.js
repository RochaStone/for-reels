// put-a-finger-down (layer: top). The "put a finger down" count: on each spoken point a real photo or screenshot
//   cuts in at the top of the frame (hard-edged, graded and grained like the footage, settling from a slight push,
//   the previous one gone), and the count ticks on a real guest-check pad (pad.jpg, photographed) sitting lower
//   left: the number in the display face and the point's word beside it, set hard, landing on the word with a
//   six-frame ease. Nothing is drawn. Ask CAMERA for a punch per point. A hard cut takes it all away at B.
// Supply: one photo or screenshot per point in this folder (POINTS). The kit's are labelled placeholders. The pad
// is the kit's material (kit/material/guest-check.jpg); swap in your own pad or notebook page as pad.jpg (any size,
// PAD_RATIO = its height / width).
// Change: POINTS, PAD (where the pad sits and how wide; rows and step place the count on its lines, as fractions
// of the pad's height), SHOT (the photo's box), PAD_RATIO, GRAIN, T.
// Reach for it on a counted list: "put a finger down if", "three things", "gifts, treats and".
// Sound: a shutter on each photo cut, a tick on each number.

var POINTS = [                                  // [photo, the point's word, cue, fallback]
  ['photo1.jpg', 'one', 'lots', 0.30],
  ['photo2.jpg', 'two', 'people', 0.80],
  ['photo3.jpg', 'three', 'this', 1.30],
];
var PAD = { x: 60, y: 610, w: 420, rows: 0.215, step: 0.092 };   // rows: the first count line; step: per count
var PAD_RATIO = 1144 / 720;                    // pad.jpg: height / width
var SHOT = { x: 520, y: 240, w: 525, h: 400 };  // the photo's box on screen (clear of the caption band)
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

// ---- build once
var pad = $('.pf-pad'), padH = Math.round(PAD.w * PAD_RATIO);
pad.style.cssText = 'left:' + PAD.x + 'px;top:' + PAD.y + 'px;width:' + PAD.w + 'px;height:' + padH + 'px';
var rowH = Math.round(padH * PAD.step);
var shots = [], rows = [];
POINTS.forEach(function (p, i) {
  var sh = $('.pf-shot[data-i="' + i + '"]');
  if (!sh) {
    sh = document.createElement('div');
    sh.className = 'pf-shot';
    sh.setAttribute('data-i', i);
    sh.innerHTML = '<img class="g" alt=""><i class="pf-grain"></i>';
    sh.querySelector('img').setAttribute('src', 'fx/{{ID}}/' + p[0]);
    $('.pf-shots').appendChild(sh);
  }
  sh.style.cssText = 'left:' + SHOT.x + 'px;top:' + SHOT.y + 'px;width:' + SHOT.w + 'px;height:' + SHOT.h + 'px';
  var row = $('.pf-row[data-i="' + i + '"]');
  if (!row) {
    row = document.createElement('div');
    row.className = 'pf-row';
    row.setAttribute('data-i', i);
    row.setAttribute('data-layout-allow-overlap', '');
    row.setAttribute('data-layout-allow-occlusion', '');
    row.innerHTML = '<b class="pf-n"></b><span class="pf-w"></span>';
    row.querySelector('.pf-n').textContent = (i + 1) + '.';
    row.querySelector('.pf-w').textContent = p[1];
    $('.pf-rows').appendChild(row);
  }
  row.style.cssText = 'top:' + Math.round(padH * PAD.rows + i * rowH - rowH * 0.82) + 'px;height:' + rowH + 'px';
  row.querySelector('.pf-n').style.fontSize = Math.round(rowH * 0.9) + 'px';
  row.querySelector('.pf-w').style.fontSize = Math.round(rowH * 0.56) + 'px';
  shots.push(sh); rows.push(row);
});
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
