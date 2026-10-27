// photo-collage (layer: top). The creator's real photos build a collage round the face, one print per key word:
//   each is a photo on real handmade paper (card.png, a photographed deckled card whose edges a border-image keeps:
//   the torn edge is the paper's own), the footage's grain over it, and its word set hard in the paper's margin. Each print cuts in on its word and
//   settles from a slight push (no throw, no wobble, no develop); the hero lands big (ask CAMERA for a punch there).
//   Nothing is drawn. A hard cut takes them all away at B.
// Supply: the photos in this folder, named in PHOTOS (any size: cropped to fill). The kit's are labelled
// placeholders. Change the words and cues; a cue finds the first matching spoken word at or after the previous one
// (wordAt), else its fallback (seconds after A). '\n' breaks a caption onto two lines.
// Layout: x, y = the print's centre, w = its width, r = its tilt (static), a = the photo's height / width (default
// 1.2; 0.667 for a landscape group shot so every face stays whole), pos = object-position inside the photo
// (default '50% 50%'), hero = true on the one that lands big. The default frames a close talking head: the upper
// sides and the chin band keep eyes and mouth clear, then the hero lands big over the mouth.
// Options: GROUND (an image in this folder laid full-frame under the prints at GROUND_OPACITY: the creator's own
// plain paper; '' = none, the footage shows), DRIFT (a slow drift per print, px; 0 = none).
// Reach for it on a list of people, places or things there are photos of: "my goddesses", "the team", "the trip".

var PHOTOS = [                 // [photo, caption, cue, fallback, layout]
  ['photo1.jpg', 'one', 'drop', 0.30, { x: 185, y: 470, w: 340, r: -6 }],
  ['photo2.jpg', 'two', 'in', 0.70, { x: 905, y: 520, w: 330, r: 5 }],
  ['photo3.jpg', 'three', 'raw', 1.10, { x: 250, y: 1040, w: 360, r: -3 }],
  ['photo4.jpg', 'four', 'file', 1.50, { x: 600, y: 905, w: 560, r: 2, hero: true }],
];
var GROUND = '';
var GROUND_OPACITY = 0.35;
var DRIFT = 16;
var GRAIN = 0.08;                                  // the footage's grain over each print (6 to 10%)
var T = { settle: 0.28, hero: 0.34, word: 0.20 };  // the settle, the hero's landing, the word's ease (six frames)

var R = '#{{ID}} ';
function $(s) { return document.querySelector(R + s); }
function rnd(i) { var x = Math.sin(i * 12.9898) * 43758.5453; return x - Math.floor(x); }
var prev = A;
function beat(cue, fallback) {
  var w = cue ? wordAt(cue, prev) : null;
  var t = (w === null || w >= B - 0.1) ? A + fallback : w;
  prev = Math.max(prev, t);
  return t;
}

// ---- build once
var ground = $('.pc-ground');
if (GROUND && !ground.getAttribute('src')) { ground.setAttribute('src', 'fx/{{ID}}/' + GROUND); ground.style.display = 'block'; }
if (GROUND) gsap.set(ground, { opacity: GROUND_OPACITY });
var prints = [];
PHOTOS.forEach(function (p, i) {
  var L = p[4], bw = Math.round(L.w * 0.07), m = Math.round(L.w * 0.045), ww = L.w - 2 * bw - 2 * m;
  var wh = Math.round(ww * (L.a || 1.2)), strip = p[1] ? Math.round(L.w * 0.24) : m, H = 2 * bw + m + wh + strip;
  var el = $('.pc-print[data-i="' + i + '"]');
  if (!el) {
    el = document.createElement('div');
    el.className = 'pc-print';
    el.setAttribute('data-i', i);
    el.setAttribute('data-layout-allow-overflow', '');
    el.innerHTML = '<div class="pc-win"><img class="pc-img g" alt=""></div><i class="pc-grain"></i>' +
      '<b class="pc-cap" data-layout-allow-overlap data-layout-allow-occlusion></b>';
    el.querySelector('.pc-img').setAttribute('src', 'fx/{{ID}}/' + p[0]);
    if (L.pos) el.querySelector('.pc-img').style.objectPosition = L.pos;
    p[1].split('\n').forEach(function (line) {
      var s = document.createElement('span'); s.textContent = line;
      s.setAttribute('data-layout-allow-overlap', ''); s.setAttribute('data-layout-allow-occlusion', '');   // the hero lands over earlier words on purpose
      el.querySelector('.pc-cap').appendChild(s);
    });
    $('.pc-wrap').appendChild(el);
  }
  el.style.cssText = 'left:' + (L.x - L.w / 2) + 'px;top:' + (L.y - H / 2) + 'px;width:' + L.w + 'px;height:' + H + 'px;z-index:' + (i + 1) +
    ';border-width:' + bw + 'px;border-image-width:' + bw + 'px';
  el.querySelector('.pc-win').style.cssText = 'left:' + m + 'px;top:' + m + 'px;width:' + ww + 'px;height:' + wh + 'px';
  var cap = el.querySelector('.pc-cap'), lines = p[1].split('\n').length;
  cap.style.top = (m + wh) + 'px';
  cap.style.height = strip + 'px';
  cap.style.fontSize = Math.round(strip * (lines > 1 ? 0.48 : 0.7)) + 'px';
  gsap.set(el, { rotation: L.r, transformOrigin: '50% 50%', opacity: 0 });
  gsap.set(el.querySelector('.pc-grain'), { opacity: GRAIN * 3 });
  gsap.set(cap, { opacity: 0, y: 14 });
  prints.push({ el: el, L: L, cap: cap });
});

// a caption keeps its size as a maximum and only shrinks to its strip
function fit() {
  prints.forEach(function (o) {
    o.cap.querySelectorAll('span').forEach(function (s) {
      var w = s.scrollWidth, inner = o.cap.clientWidth - 16;
      if (w > inner) o.cap.style.fontSize = (parseFloat(o.cap.style.fontSize) * inner / w).toFixed(2) + 'px';
    });
  });
}
fit();
if (document.fonts && document.fonts.ready) document.fonts.ready.then(fit);

// ---- times, in spoken order
var tIn = PHOTOS.map(function (p) { return beat(p[2], p[3]); });

prints.forEach(function (o, i) {
  var t = tIn[i], hero = !!o.L.hero;
  // the cut in: the print is there at once, settling from a slight push (the hero from a bigger one)
  tl.set(o.el, { opacity: 1 }, q(t));
  tl.fromTo(o.el, { scale: hero ? 1.16 : 1.05 }, { scale: 1, duration: hero ? T.hero : T.settle, ease: hero ? 'power3.out' : 'power2.out', immediateRender: false }, q(t));
  // the word: six frames up into place, then it holds
  tl.fromTo(o.cap, { opacity: 0, y: 14 }, { opacity: 1, y: 0, duration: T.word, ease: 'power2.out', immediateRender: false }, q(t + 0.06));
  // a slow drift after it settles: the prints sit at different depths
  if (DRIFT) {
    var t0 = t + T.settle, len = Math.max(0.2, B - t0);
    tl.fromTo(o.el, { y: 0 }, { y: -DRIFT * (0.4 + rnd(i + 5)), duration: len, ease: 'none', immediateRender: false }, q(t0));
  }
});
