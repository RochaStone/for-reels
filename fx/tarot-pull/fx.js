// tarot-pull (layer: behind, under the speaker's cutout). Two books, two tarot cards pulled off a deck behind the head:
//   A          the deck (two fanned cards under, two face-down cards on top) rises and settles behind the head
//   card 1     on its word it flips face up off the deck (rotationY with a scale overshoot): numeral, title, label
//   card 2     just before its word card 1 slides away to the left; card 2 flips face up on the word
//   B - out    the deck tucks down and fades, gone by B
// The title sits in the card's top band so it reads above the head; a long title shrinks to fit (never grows).
// Needs a CUT_WINDOWS entry over the window. Change only these constants:
var CARDS = [
  { key: 'thriving', at: 1.60, num: 'X',  title: ['THRIVING IN', 'TRANSFORMATIONAL TIMES'], label: 'THE WITNESS' },
  { key: 'brand',    at: 3.92, num: 'XI', title: ['BRAND', 'ALCHEMY'],                      label: 'THE ALCHEMIST' }
];                                   // key: the spoken word the flip lands on; at: fallback (s after A) if it isn't found
var T = { in: 0.45, lead: 0.10, flip: 0.55, awayLead: 0.36, away: 0.28, out: 0.30 };
var TITLE_W = 524;                   // px: the widest a title line may be on the 580px card (inside the hairline)
var TIGHT = 0.03;                    // em: the tracking a title tightens to before it shrinks
var FAN = [-9, 7];                   // degrees: the two cards fanned under the deck

var ID = '{{ID}}';
function $$(s) { return Array.prototype.slice.call(document.querySelectorAll(s)); }
function esc(s) { return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;'); }

// ---- faces: the front's line art (pink stars, rays, a moon with an oxblood crescent) and the back's geometric pattern
function art(i) {
  var s = '', stars = [[70, 120, 3], [440, 90, 2.5], [120, 560, 2], [400, 610, 3], [250, 70, 2], [60, 380, 2.5], [470, 360, 2]];
  stars.forEach(function (p) { s += '<circle cx="' + p[0] + '" cy="' + p[1] + '" r="' + p[2] + '" fill="var(--tp-pink)"/>'; });
  for (var a = 0; a < 360; a += 15) {
    var r = a * Math.PI / 180;
    s += '<line x1="260" y1="330" x2="' + (260 + 200 * Math.cos(r)).toFixed(1) + '" y2="' + (330 + 200 * Math.sin(r)).toFixed(1) +
      '" stroke="var(--tp-pink)" stroke-width="2" opacity=".55"/>';
  }
  s += '<circle cx="260" cy="330" r="120" fill="none" stroke="var(--tp-pink)" stroke-width="3"/>' +
       '<circle cx="260" cy="330" r="92" fill="var(--tp-pink)" opacity=".95"/>';
  // the crescent opens right on card 1, left on card 2
  s += i % 2 ? '<path d="M300 270a80 80 0 1 0 0 120a64 64 0 1 1 0-120z" fill="var(--tp-oxblood)" opacity=".9"/>'
             : '<path d="M220 270a80 80 0 1 1 0 120a64 64 0 1 0 0-120z" fill="var(--tp-oxblood)" opacity=".9"/>';
  return '<svg class="' + ID + '-art" width="520" height="680" viewBox="0 0 520 680">' + s + '</svg>';
}
function pattern() {
  var w = 552, h = 932, cx = w / 2, cy = h / 2, s = '';
  s += '<rect x="22" y="22" width="' + (w - 44) + '" height="' + (h - 44) + '" rx="16" fill="none" stroke="var(--tp-pink-mid)" stroke-width="2"/>';
  s += '<rect x="40" y="40" width="' + (w - 80) + '" height="' + (h - 80) + '" rx="10" fill="none" stroke="var(--tp-pink-mid)" stroke-width="1" opacity=".6"/>';
  for (var k = 1; k <= 3; k++) {                       // nested diamonds
    var dx = 70 * k + 40, dy = 120 * k + 70;
    s += '<path d="M' + cx + ' ' + (cy - dy) + 'L' + (cx + dx) + ' ' + cy + 'L' + cx + ' ' + (cy + dy) + 'L' + (cx - dx) + ' ' + cy +
      'Z" fill="none" stroke="var(--tp-pink)" stroke-width="' + (k === 1 ? 2.5 : 1.5) + '" opacity="' + (1 - k * 0.2).toFixed(2) + '"/>';
  }
  var star = '';                                       // eight-point star in the centre
  for (var j = 0; j < 16; j++) {
    var rr = j % 2 ? 22 : 64, an = j * Math.PI / 8 - Math.PI / 2;
    star += (j ? 'L' : 'M') + (cx + rr * Math.cos(an)).toFixed(1) + ' ' + (cy + rr * Math.sin(an)).toFixed(1);
  }
  s += '<path d="' + star + 'Z" fill="var(--tp-pink)"/>';
  s += '<circle cx="' + cx + '" cy="' + cy + '" r="92" fill="none" stroke="var(--tp-pink-mid)" stroke-width="1.5"/>';
  [[70, 70], [w - 70, 70], [70, h - 70], [w - 70, h - 70], [cx, 70], [cx, h - 70]].forEach(function (p) {
    s += '<circle cx="' + p[0] + '" cy="' + p[1] + '" r="5" fill="var(--tp-pink)"/>';
  });
  return '<svg class="' + ID + '-pat" width="' + w + '" height="' + h + '" viewBox="0 0 ' + w + ' ' + h + '">' + s + '</svg>';
}
CARDS.forEach(function (c, i) {
  document.querySelector('#' + ID + ' .' + ID + '-c' + i + ' .' + ID + '-front').innerHTML =
    '<div class="' + ID + '-line"></div>' + art(i) +
    '<div class="' + ID + '-num">' + esc(c.num) + '</div>' +
    '<div class="' + ID + '-title">' + c.title.map(function (l) { return '<span>' + esc(l) + '</span>'; }).join('') + '</div>' +
    '<div class="' + ID + '-label">' + esc(c.label) + '</div>';
  document.querySelector('#' + ID + ' .' + ID + '-c' + i + ' .' + ID + '-back').innerHTML = pattern();
});
// the cards sit behind the head and over each other on purpose: tell the layout audit (it reads the text elements)
$$('#' + ID + ' *').forEach(function (e) {
  if (Array.prototype.some.call(e.childNodes, function (n) { return n.nodeType === 3 && n.nodeValue.trim(); })) {
    e.setAttribute('data-layout-allow-overlap', '');
    e.setAttribute('data-layout-allow-occlusion', '');
  }
});

// ---- a title keeps its fx.html size unless its widest line is wider than TITLE_W: then it tracks tighter, then shrinks
function fit() {
  $$('#' + ID + ' .' + ID + '-title').forEach(function (box) {
    if (!box.dataset.max) box.dataset.max = parseFloat(getComputedStyle(box).fontSize);
    var max = +box.dataset.max;
    function widest() {
      var w = 0;
      Array.prototype.forEach.call(box.children, function (l) { w = Math.max(w, l.scrollWidth); });
      return w;
    }
    box.style.fontSize = max + 'px';
    box.style.letterSpacing = box.style.fontWeight = '';
    if (widest() <= TITLE_W) return;
    box.style.letterSpacing = TIGHT + 'em';
    box.style.fontWeight = '700';                    // a smaller title holds up better in the heavier cut
    var w = widest();
    if (w > TITLE_W) box.style.fontSize = (max * TITLE_W / w).toFixed(2) + 'px';
  });
}
fit();
if (document.fonts && document.fonts.load) {
  var txt = CARDS.map(function (c) { return c.num + c.title.join('') + c.label; }).join('');
  Promise.all(['600 64px "' + ID + '-cg"', '700 46px "' + ID + '-cg"'].map(function (f) {
    return document.fonts.load(f, txt).catch(function () { return null; });
  })).then(fit, fit);
  document.fonts.ready.then(fit);
}

// ---- beat times: each flip on its word (searched in order from A), else A + its fallback
var tFlip = [], prev = A;
CARDS.forEach(function (c) {
  var w = c.key ? wordAt(c.key, prev) : null;
  var t = (w === null || w >= B) ? A + c.at : w;
  tFlip.push(t); prev = t;
});

// ---- build: the deck below its rest, every card face down
var deck = '#' + ID + ' .' + ID + '-deck';
if (q(A) <= 0) gsap.set('#' + ID, { opacity: 1 });
gsap.set('#' + ID + ' .' + ID + '-ul', { rotation: FAN[0], transformOrigin: '50% 50%' });
gsap.set('#' + ID + ' .' + ID + '-ur', { rotation: FAN[1], transformOrigin: '50% 50%' });
gsap.set(deck, { opacity: 0, y: 140, rotation: -4, transformOrigin: '50% 70%' });
CARDS.forEach(function (c, i) {
  gsap.set('#' + ID + ' .' + ID + '-c' + i, { rotationY: 180, transformPerspective: 2200, transformOrigin: '50% 50%' });
});

// A: the deck rises and settles behind the head
tl.fromTo(deck, { opacity: 0, y: 140, rotation: -4 },
  { opacity: 1, y: 0, rotation: 0, duration: T.in, ease: 'power3.out', immediateRender: false }, q(A));

CARDS.forEach(function (c, i) {
  var card = '#' + ID + ' .' + ID + '-c' + i, t = tFlip[i];
  // the card before slides away to the left just ahead of this one
  if (i > 0) {
    var prevCard = '#' + ID + ' .' + ID + '-c' + (i - 1);
    tl.fromTo(prevCard, { x: 0, y: 0, rotation: 0, opacity: 1 },
      { x: -820, y: 60, rotation: -16, duration: T.away, ease: 'power3.in', immediateRender: false }, q(t - T.awayLead));
    tl.set(prevCard, { opacity: 0 }, q(t - T.awayLead + T.away));
  }
  // the flip: face up on the word, with a scale overshoot
  tl.fromTo(card, { rotationY: 180 }, { rotationY: 0, duration: T.flip, ease: 'back.out(1.4)', immediateRender: false }, q(t - T.lead));
  tl.fromTo(card, { scale: 1 }, { scale: 1.07, duration: T.flip * 0.4, ease: 'power2.out', immediateRender: false }, q(t - T.lead));
  tl.fromTo(card, { scale: 1.07 }, { scale: 1, duration: T.flip * 0.7, ease: 'back.out(2.2)', immediateRender: false }, q(t - T.lead + T.flip * 0.4));
});

// B - out: the deck tucks down and fades
tl.fromTo(deck, { opacity: 1, y: 0, scale: 1 },
  { opacity: 0, y: 120, scale: 0.92, duration: T.out, ease: 'power3.in', immediateRender: false }, q(B - T.out - 0.02));
