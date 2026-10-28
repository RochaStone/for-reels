// word-stamp (layer: behind, under the speaker's cutout). One emphatic word gets the stamp:
//   word      the sheet (GROUND) cuts in full-bleed behind the speaker and WORD stamps in letter by letter, one
//             letter every 2 frames, the first on its word, huge, in the display face, the speaker's head breaking
//             it; set hard, then it holds
//   line      optional: SMALL sets above it word group by word group on its words
//   under     a real marker underline (underline.png, a photograph of ink) eases in under the word on its beat
//   out       everything holds to the hard out at the window end
// Reach for it on never, huge, always, zero. Needs a CUT_WINDOWS entry over its window.
// GROUND = '' puts the word straight over the room instead: light type, with an ink copy through mask.png wherever
// the picture is light (PY fx/<id>/mkmask.py <project> [<id>] rebuilds mask.png from your footage; SPLIT = false
// keeps it light everywhere).
// Placement: in the clear space above the head the build measured (ZONE.top), at the largest step of the type scale
// (xl, l) where the word fits, its foot tucked TUCK behind the head. Where there is no room above the head (a tight
// take) the effect draws nothing (the lint says so) instead of burying the word behind the speaker.
// Change only these constants:
var WORD = 'never';                         // the stamped word (set in the pack's case; the hook alone is in caps)
var SMALL = [['open an', 'open'], ['editing', 'editing'], ['app', 'app']];   // [text, the word it lands on]; [] = no line
var KEY = 'never';                          // the spoken word the stamp lands on
var UNDER = ['app', 0.95];                  // the underline: [spoken word, fallback s after A]; ['', 0] = none
var AT = { word: 0.22, small: [0.50, 1.00, 1.25] };   // fallbacks (s after A) when a word isn't found
var LEAD = 0.03;                            // the stamp starts this far ahead of its word
var TUCK = 0.18;                            // the word's foot goes this far (of its height) behind the head
var GROUND = 'newsprint.jpg';               // a photographed sheet in this folder, or '' for the footage
var GRAIN = 0.08;                           // the footage's grain over the sheet (6 to 10%)
var COLOR = '--c-ink';                      // the type on the sheet ('--c-light' on a dark sheet)
var SPLIT = true;                           // GROUND = '' only: an ink copy through mask.png (false: light everywhere)
var LETTER = 2 / 30;                        // one letter every two frames
var T = { under: 0.30 };                    // the underline's reveal

function $$(s) { return Array.prototype.slice.call(document.querySelectorAll(s)); }
function tok(n) { return getComputedStyle(document.documentElement).getPropertyValue(n).trim(); }
var dk = document.getElementById('{{ID}}-dk');
if (GROUND || !SPLIT) dk.parentNode.removeChild(dk);
var copies = (GROUND || !SPLIT) ? ['#{{ID}}-lt'] : ['#{{ID}}-lt', '#{{ID}}-dk'];
var under = document.querySelector('#{{ID}} .{{ID}}-under');
if (!UNDER[0] && !UNDER[1]) under.parentNode.removeChild(under);

// ---- the sheet and the type's colour
if (GROUND) {
  var pimg = document.querySelector('#{{ID}} .{{ID}}-pimg');
  if (!pimg.getAttribute('src')) pimg.setAttribute('src', 'fx/{{ID}}/' + GROUND);
  gsap.set('#{{ID}}-paper', { display: 'block', opacity: 0 });
  gsap.set('#{{ID}} .{{ID}}-grain', { opacity: GRAIN });
  gsap.set(['#{{ID}}-lt .{{ID}}-w', '#{{ID}}-lt .{{ID}}-s'], { color: tok(COLOR) });
}

// ---- the words into every copy
$$('#{{ID}} .{{ID}}-t').forEach(function (host) {
  host.textContent = '';
  Array.from(WORD).forEach(function (c) {
    var s = document.createElement('span');
    s.className = '{{ID}}-ch';
    s.textContent = c === ' ' ? ' ' : c;
    host.appendChild(s);
  });
});
$$('#{{ID}} .{{ID}}-sw').forEach(function (host) {
  host.textContent = '';
  SMALL.forEach(function (g, i) {
    if (i) host.appendChild(document.createTextNode(' '));
    var s = document.createElement('span');
    s.className = '{{ID}}-g {{ID}}-g' + i;
    s.textContent = g[0];
    host.appendChild(s);
  });
});
if (!SMALL.length) $$('#{{ID}} .{{ID}}-srow').forEach(function (e) { e.style.display = 'none'; });
// the copies overlap and sit behind the head on purpose: tell the layout audit (it reads the text elements)
$$('#{{ID}} *').forEach(function (e) {
  if (Array.prototype.some.call(e.childNodes, function (n) { return n.nodeType === 3 && n.nodeValue.trim(); })) {
    e.setAttribute('data-layout-allow-overlap', '');
    e.setAttribute('data-layout-allow-occlusion', '');
  }
});

// ---- place: the largest step that fits above the head; the effect is hidden when none does
var Z = ZONE('{{ID}}'), TOPBOX = Z.zone.top, stack = document.querySelector('#{{ID}} .{{ID}}-stack');
function fit() {
  if (!TOPBOX.w) { gsap.set('#{{ID}}', { display: 'none' }); return; }
  var small = SMALL.length ? $$('#{{ID}} .{{ID}}-s')[0].offsetHeight : 0;
  var room = (Z.face.t - Z.safe.top) / (1 - TUCK) - small, step = 'xl', h = 0;
  $$('#{{ID}} .{{ID}}-w').forEach(function (box) {
    var t = box.querySelector('.{{ID}}-t');
    var k = fitStep(t, TOPBOX.w, room, 'xl');
    box.style.fontSize = STEP[k]; step = k; h = t.offsetHeight;
    var u = box.parentNode.querySelector('.{{ID}}-under');
    if (u) u.style.width = Math.round(t.offsetWidth * 0.94) + 'px';
  });
  if (step === 's' || h > room) { gsap.set('#{{ID}}', { display: 'none' }); return; }   // a stamped word is xl or l
  $$('#{{ID}} .{{ID}}-stack').forEach(function (st) {
    st.style.left = TOPBOX.x + 'px'; st.style.width = TOPBOX.w + 'px'; st.style.bottom = 'auto';
    st.style.top = Math.max(Z.safe.top, Math.round(Z.face.t + TUCK * h - h - small)) + 'px';
  });
}
fit();
if (document.fonts && document.fonts.load) {
  Promise.all([tok('--display-style') + ' ' + tok('--display-weight') + ' 100px ' + tok('--font-display'),
    tok('--text-weight') + ' 56px ' + tok('--font-text')].map(function (f) {
    return document.fonts.load(f, WORD + ' ' + SMALL.map(function (g) { return g[0]; }).join(' ')).catch(function () {});
  })).then(fit, fit);
  document.fonts.ready.then(fit);
}

// ---- beat times, each on its word (searched in order from A; a word missing from words.json falls back to AT)
function find(word, after, fallback) {
  var w = word ? wordAt(word, after) : null;
  return (w === null || w >= B) ? A + fallback : w;
}
var tWord = find(KEY, A, AT.word);
var tStamp = Math.max(A, tWord - LEAD);
var tSmall = [], prev = tWord;
SMALL.forEach(function (g, i) {
  prev = find(g[1], prev, AT.small[i] !== undefined ? AT.small[i] : AT.word + 0.3 * (i + 1));
  tSmall.push(prev);
});
var tUnder = Math.max(find(UNDER[0], tWord + 0.05, UNDER[1]), tStamp + (Array.from(WORD).length - 1) * LETTER + 0.1);

// ---- build: hidden until their beats; centred on the head
if (q(A) <= 0) gsap.set('#{{ID}}', { opacity: 1 });
gsap.set('#{{ID}} .{{ID}}-ch', { opacity: 0 });
gsap.set('#{{ID}} .{{ID}}-g', { opacity: 0 });
gsap.set('#{{ID}} .{{ID}}-under', { clipPath: 'inset(0 100% 0 0)' });

// the sheet cuts in with the first letter
if (GROUND) tl.set('#{{ID}}-paper', { opacity: 1 }, q(tStamp));
// the stamp: one tween per copy so each staggers its own letters; a settle from 1.38x, no overshoot
copies.forEach(function (c) {
  tl.fromTo(c + ' .{{ID}}-ch', { opacity: 0, scale: 1.38, yPercent: -6 },
    { opacity: 1, scale: 1, yPercent: 0, duration: 0.2, ease: 'power4.out', stagger: LETTER, immediateRender: false }, q(tStamp));
});
// the small line: each group eases in on its word
SMALL.forEach(function (g, i) {
  tl.fromTo('#{{ID}} .{{ID}}-g' + i, { opacity: 0, y: 14 }, { opacity: 1, y: 0, duration: 0.16, ease: 'power3.out', immediateRender: false }, q(tSmall[i]));
});
// the underline: the real stroke revealed left to right under the word
if (UNDER[0] || UNDER[1]) {
  tl.fromTo('#{{ID}} .{{ID}}-under', { clipPath: 'inset(0 100% 0 0)' }, { clipPath: 'inset(0 0% 0 0)', duration: T.under, ease: 'power2.inOut', immediateRender: false }, q(tUnder));
}
