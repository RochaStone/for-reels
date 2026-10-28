// photo-collage (layer: top). The creator's real photos build a collage in the clear space round the face, one print per
// key word:
//   each is a photo on real handmade paper (card.png, a photographed deckled card whose edges a border-image keeps:
//   the torn edge is the paper's own), the footage's grain over it, and its word set hard in the paper's margin. Each print cuts in on its word and
//   settles from a slight push (no throw, no wobble, no develop); the hero lands biggest (ask CAMERA for a punch there).
//   Nothing is drawn. A hard cut takes them all away at B.
// Placement: the build measures the head and the Instagram zones (ZONE): the prints are laid out in the clear rectangles
// round the head, never on it and never under the interface (top 250, bottom 400, right 120 px). The hero takes the
// largest clear rectangle, the others share the rest; a print is only as big as its rectangle allows, so a tight take
// gives a row of small prints under the chin and a roomy one gives big prints either side.
// Supply: the photos in this folder, named in PHOTOS (any size: cropped to fill). The kit's are labelled
// placeholders. Change the words and cues; a cue finds the first matching spoken word at or after the previous one
// (wordAt), else its fallback (seconds after A). '\n' breaks a caption onto two lines; a caption too wide for its print
// at the size of a line (--fx-s) is left off and the spoken word carries it.
// Per photo: a = the photo's height / width (default 1.2; 0.667 for a landscape group shot so every face stays whole),
// pos = object-position inside the photo (default '50% 50%'), hero = true on the one that lands biggest, r = its tilt in
// degrees (default alternates, small).
// Options: GROUND (an image in this folder laid full-frame under the prints at GROUND_OPACITY: the creator's own
// plain paper; '' = none, the footage shows), DRIFT (a slow drift per print, px; 0 = none).
// Reach for it on a list of people, places or things there are photos of: "my goddesses", "the team", "the trip".

var PHOTOS = [                 // [photo, caption, cue, fallback, options]
  ['photo1.jpg', 'one', 'drop', 0.30, {}],
  ['photo2.jpg', 'two', 'in', 0.70, {}],
  ['photo3.jpg', 'three', 'raw', 1.10, {}],
  ['photo4.jpg', 'four', 'file', 1.50, { hero: true }],
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

// ---- build once: the prints (their size and place come from layout, below)
var Z = ZONE('{{ID}}'), TILTS = [-4, 3, -2, 4, -3, 2];
var ground = $('.pc-ground');
if (GROUND && !ground.getAttribute('src')) { ground.setAttribute('src', 'fx/{{ID}}/' + GROUND); ground.style.display = 'block'; }
if (GROUND) gsap.set(ground, { opacity: GROUND_OPACITY });
var prints = [];
PHOTOS.forEach(function (p, i) {
  var O = p[4] || {};
  var el = document.createElement('div');
  el.className = 'pc-print';
  el.setAttribute('data-i', i);
  el.setAttribute('data-fx-print', '');
  el.setAttribute('data-layout-allow-overflow', '');
  el.innerHTML = '<div class="pc-win"><img class="pc-img g" alt=""></div><i class="pc-grain"></i>' +
    '<b class="pc-cap" data-layout-allow-overlap data-layout-allow-occlusion></b>';
  el.querySelector('.pc-img').setAttribute('src', 'fx/{{ID}}/' + p[0]);
  if (O.pos) el.querySelector('.pc-img').style.objectPosition = O.pos;
  p[1].split('\n').forEach(function (line) {
    var s = document.createElement('span'); s.textContent = line;
    s.setAttribute('data-layout-allow-overlap', ''); s.setAttribute('data-layout-allow-occlusion', '');   // the hero lands over earlier words on purpose
    el.querySelector('.pc-cap').appendChild(s);
  });
  $('.pc-wrap').appendChild(el);
  var cap = el.querySelector('.pc-cap');
  gsap.set(el, { opacity: 0, transformOrigin: '50% 50%' });
  gsap.set(el.querySelector('.pc-grain'), { opacity: GRAIN * 3 });
  gsap.set(cap, { opacity: 0, y: 14 });
  prints.push({ el: el, O: O, cap: cap, lines: p[1].split('\n').length, has: !!p[1], i: i });
});

// ---- layout: print geometry from its width, then the prints into the clear rectangles
var HERO = null, LINE = 58;                                      // a caption line: --fx-s at line-height .95, plus air
function dims(o, pw) {
  var a = o.O.a || 1.2, bw = Math.round(pw * 0.07), m = Math.round(pw * 0.045), ww = pw - 2 * bw - 2 * m, wh = Math.round(ww * a);
  var strip = o.show ? o.lines * LINE + 6 : m;
  return { w: pw, bw: bw, m: m, ww: ww, wh: wh, strip: strip, h: 2 * bw + m + wh + strip };
}
function widthFor(o, maxH) {                        // the widest print that is no taller than maxH
  var a = o.O.a || 1.2;
  return o.show ? (maxH - o.lines * LINE - 6) / (0.185 + 0.77 * a) : maxH / (0.23 + 0.77 * a);
}
function layout() {
  var INSET = DRIFT + 14;                           // room for the drift and the tilt
  var zs = ['top', 'left', 'right', 'below'].map(function (k) { return { k: k, r: Z.zone[k] }; })
    .filter(function (z) { return z.r.w > 2 * INSET + 60 && z.r.h > 2 * INSET + 60; })
    .map(function (z) { return { k: z.k, x: z.r.x + INSET, y: z.r.y + INSET, w: z.r.w - 2 * INSET, h: z.r.h - 2 * INSET, items: [], units: 0 }; })
    .sort(function (a, b) { return b.w * b.h - a.w * a.h; });
  if (!zs.length) { gsap.set('#{{ID}}', { display: 'none' }); return; }
  prints.forEach(function (o) {                     // a caption stays only if its widest line fits the print's paper at --fx-s
    o.show = false; o.cap.style.display = '';
    if (o.has) { var w = Math.max.apply(null, Array.prototype.map.call(o.cap.querySelectorAll('span'), function (s) { return s.scrollWidth; })); o.cw = w; o.show = true; }
  });
  var hero = HERO = prints.filter(function (o) { return o.O.hero; })[0] || prints[prints.length - 1];
  zs.forEach(function (z) { z.items = []; z.units = 0; });
  var order = [hero].concat(prints.filter(function (o) { return o !== hero; }));
  order.forEach(function (o) {
    var w = o === hero ? 1.6 : 1;
    var z = zs.reduce(function (best, c) { return (c.w * c.h) / (c.units + w) > (best.w * best.h) / (best.units + w) ? c : best; }, zs[0]);
    z.items.push(o); z.units += w; o.w = w;
  });
  zs.forEach(function (z) {
    var horiz = z.w >= z.h, pos = 0, total = z.units;
    z.items.sort(function (a, b) { return a.i - b.i; });
    z.items.forEach(function (o) {
      var slot = (horiz ? z.w : z.h) * o.w / total, cross = horiz ? z.h : z.w;
      // the print as large as its slot and the zone's cross size allow (the tilt costs 8%); caption dropped if it can't fit the paper
      var pw = Math.min(o === hero ? 620 : 420, horiz ? slot / 1.08 : cross / 1.08);
      o.show = o.has && o.cw <= pw * 0.77 - 8;
      var hmax = (horiz ? cross : slot) / 1.08;
      pw = Math.min(pw, widthFor(o, hmax));
      o.show = o.has && o.cw <= pw * 0.77 - 8;
      var d = dims(o, Math.max(80, Math.round(pw)));
      var cx = horiz ? z.x + pos + slot / 2 : z.x + z.w / 2, cy = horiz ? z.y + z.h / 2 : z.y + pos + slot / 2;
      pos += slot;
      var el = o.el, cap = o.cap, r = o.O.r !== undefined ? o.O.r : TILTS[o.i % TILTS.length];
      var st = el.style;                              // property by property: gsap holds the opacity in this style
      st.left = Math.round(cx - d.w / 2) + 'px'; st.top = Math.round(cy - d.h / 2) + 'px'; st.width = d.w + 'px'; st.height = d.h + 'px';
      st.zIndex = o.i + 1; st.borderWidth = d.bw + 'px'; st.borderImageWidth = d.bw + 'px';
      el.querySelector('.pc-win').style.cssText = 'left:' + d.m + 'px;top:' + d.m + 'px;width:' + d.ww + 'px;height:' + d.wh + 'px';
      cap.style.display = o.show ? '' : 'none';
      cap.style.top = (d.m + d.wh) + 'px'; cap.style.height = d.strip + 'px';
      gsap.set(el, { rotation: r });
    });
  });
}
layout();
if (document.fonts && document.fonts.ready) document.fonts.ready.then(layout);

// ---- times, in spoken order
var tIn = PHOTOS.map(function (p) { return beat(p[2], p[3]); });

prints.forEach(function (o, i) {
  var t = tIn[i], hero = o === HERO;
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
