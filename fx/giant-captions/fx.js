// giant-captions (layer: over, above everything). The captions get giant, on the words:
//   big       the caption line, caption-sized in the caption band, grows up into one giant word above the head
//             (expo.out, no swing) and holds
//   line      a second line rises out of a mask under it on its word
//   tiles     optional: one small word per word rises into place across the chest
//   slam      optional: the last word lands big and low: a scale ease from 1.3 to 1, no overshoot, no hit
//   out       a hard cut just before the window ends
// Type set hard: one face (the display face), the creator's light ink, no box, no fill, no outline, no coloured
// shadow. Reach for it on "bigger captions" or any payoff line. Give its window a KARAOKE hide (edit.py:
// KARAOKE = dict(hide=[(start, end)])) so the normal captions step aside. Nothing to supply but the words; each
// word is fitted to the frame.
// Change only these constants:
var BIG = ['BIGGER', 'bigger'];             // [text, the spoken word it lands on]: the giant word
var LINE = ['captions.', 'captions'];       // the line under it; ['', ''] = none
var TILES = [];                             // word tiles, e.g. [['THAT’S', "that's"], ['JUST', 'just'], ['ONE', 'one']]
var SLAM = ['', ''];                        // the last word, big and low, e.g. ['sentence.', 'sentence']; ['', ''] = none
var AT = { big: 0.10, line: 0.75, tiles: 1.10, slam: 1.30 };   // fallbacks (s after A) when a word isn't found
var TILE_GAP = 0.18;                        // fallback spacing between tiles (s)
var OUT = 0.04;                             // the hard cut out, this long before the window ends

function $(s) { return document.querySelector(s); }
function tok(n) { return getComputedStyle(document.documentElement).getPropertyValue(n).trim(); }

// ---- the words in
$('#{{ID}}-big .{{ID}}-t').textContent = BIG[0];
$('#{{ID}}-cap .{{ID}}-t').textContent = LINE[0];
$('#{{ID}}-sen .{{ID}}-t').textContent = SLAM[0];
var tiles = $('#{{ID}}-tiles');
TILES.forEach(function (w, i) {
  var d = document.createElement('div'), s = document.createElement('span');
  d.className = '{{ID}}-tile';
  d.id = '{{ID}}-tile' + i;
  s.className = '{{ID}}-t';
  s.textContent = w[0];
  d.appendChild(s);
  tiles.appendChild(d);
});
// the words overlap each other on purpose: tell the layout audit (it reads the text elements themselves)
Array.prototype.slice.call(document.querySelectorAll('#{{ID}} .{{ID}}-t')).forEach(function (e) {
  e.setAttribute('data-layout-allow-overlap', '');
});

// ---- place: the rows stack in the clear space the build measured (ZONE: above the head, else its clear zone; the
// window hides the captions, so the caption band is free). Each row takes a step of the type scale; while the stack is
// taller than the space the biggest row steps down.
var Z = ZONE('{{ID}}');
var BOX = Z.zone.top.h >= 300 ? Z.zone.top : (Z.rect.w ? Z.rect : { x: 35, y: 250, w: 925, h: 300 });
var ROWS = [['#{{ID}}-big', '#{{ID}}-r1', 'xl'], ['#{{ID}}-cap', '#{{ID}}-r2', 'l'], ['#{{ID}}-tiles', '#{{ID}}-r3', 's'], ['#{{ID}}-sen', '#{{ID}}-r4', 'l']];
function fit() {
  var live = ROWS.filter(function (r) { return $(r[0]).textContent.trim(); });
  live.forEach(function (r) { r.k = r[2]; });
  function size() {
    var total = 0;
    live.forEach(function (r) {
      var box = $(r[0]);
      var k = fitStep(box, BOX.w - 20, 0, r.k);
      r.k = k; r.h = box.offsetHeight; total += r.h * 0.92;
    });
    return total;
  }
  var guard = 6;
  while (size() > BOX.h && guard--) {
    var big = live.filter(function (r) { return r.k !== 's'; }).sort(function (a, b) { return b.h - a.h; })[0];
    if (!big) break;
    big.k = STEPS[Math.min(STEPS.length - 1, STEPS.indexOf(big.k) + 1)];
  }
  size();
  var y = BOX.y;
  live.forEach(function (r, i) {
    var row = $(r[1]), box = $(r[0]);
    row.style.top = Math.round(y) + 'px'; row.style.height = r.h + 'px';
    row.style.left = BOX.x + 'px'; row.style.width = BOX.w + 'px';
    row.style.justifyContent = i === 1 ? 'flex-end' : 'flex-start'; row.style.paddingLeft = '0'; row.style.paddingRight = '0';
    y += r.h * 0.92;
  });
}
fit();
if (document.fonts && document.fonts.load) {
  var all = [BIG[0], LINE[0], SLAM[0]].concat(TILES.map(function (w) { return w[0]; })).join(' ');
  document.fonts.load(tok('--display-style') + ' ' + tok('--display-weight') + ' 100px ' + tok('--font-display'), all)
    .catch(function () {}).then(fit, fit);
  document.fonts.ready.then(fit);
}

// ---- beat times, each on its word (searched in order from A; a word missing from words.json falls back to AT)
var prev = A;
function find(word, fallback) {
  var w = word ? wordAt(word, prev) : null;
  var t = (w === null || w >= B) ? A + fallback : w;
  prev = Math.max(prev, t);
  return t;
}
var tBig = find(BIG[1], AT.big);
var tLine = LINE[0] ? find(LINE[1], AT.line) : null;
var tTiles = TILES.map(function (w, i) { return find(w[1], AT.tiles + i * TILE_GAP); });
var tSlam = SLAM[0] ? find(SLAM[1], AT.slam) : null;
var tOut = B - OUT;

// ---- where the captions sit (the pack sets them), so the giant word starts as one
var kc = $('#caps .kc:not(.huge)'), kw = $('#caps .kw');
var capSize = kc ? parseFloat(getComputedStyle(kc).fontSize) : 66;
var capTop = kw ? parseFloat(getComputedStyle(kw).top) : 1318;
var capH = capSize * 1.08 + 13;                       // the caption line: its height plus its padding
function s0() { return capH / parseFloat(getComputedStyle($('#{{ID}}-big')).fontSize); }
function dy() { var r = $('#{{ID}}-r1'); return capTop + capH / 2 - (parseFloat(r.style.top) + r.offsetHeight / 2); }

// ---- build
if (q(A) <= 0) gsap.set('#{{ID}}', { opacity: 1 });
gsap.set('#{{ID}} .{{ID}}-b', { opacity: 0 });
if (TILES.length) gsap.set('#{{ID}} .{{ID}}-tile', { opacity: 0 });
gsap.set('#{{ID}}-big', { transformOrigin: '0% 50%' });               // grows from its left edge
gsap.set('#{{ID}}-cap .{{ID}}-t', { yPercent: 100 });
gsap.set('#{{ID}}-sen', { transformOrigin: '30% 60%' });

// big: a caption-sized word in the caption band grows up into the giant word and holds
tl.set('#{{ID}}-big', { opacity: 1 }, q(tBig));
tl.fromTo('#{{ID}}-big', { scale: s0, y: dy }, { scale: 1, y: 0, duration: 0.34, ease: 'expo.out', immediateRender: false }, q(tBig));

// line: the word rises out of its mask on its word
if (tLine !== null) {
  tl.set('#{{ID}}-cap', { opacity: 1 }, q(tLine));
  tl.fromTo('#{{ID}}-cap .{{ID}}-t', { yPercent: 100 }, { yPercent: 0, duration: 0.34, ease: 'power4.out', immediateRender: false }, q(tLine));
}

// tiles: one per word, rising into place
tTiles.forEach(function (t, i) {
  tl.set('#{{ID}}-tile' + i, { opacity: 1 }, q(t));
  tl.fromTo('#{{ID}}-tile' + i, { y: 18, opacity: 0 }, { y: 0, opacity: 1, duration: 0.24, ease: 'power3.out', immediateRender: false }, q(t));
});

// slam: the last word lands big and low, a scale ease, then it holds
if (tSlam !== null) {
  tl.set('#{{ID}}-sen', { opacity: 1 }, q(tSlam));
  tl.fromTo('#{{ID}}-sen', { scale: 1.3 }, { scale: 1, duration: 0.28, ease: 'power3.out', immediateRender: false }, q(tSlam));
}

// out: a hard cut, the whole stack at once, just before the window ends
tl.set('#{{ID}}-all', { opacity: 0 }, q(tOut));
