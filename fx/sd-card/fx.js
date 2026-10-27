/* sd-card (layer: over). "Lately in my SD card": a run of the creator's real clips, full-bleed, cut hard on the
   words. No card, no bezel: the clips are the object. A mono label (the handle and a count that ticks per cut) sits
   top left, set hard; the line prints on its words along the bottom, set hard (the key word in the display face);
   the footage's grain over everything; a thin cream border at most.
   Beat by beat:
     A          a hard cut to the first clip, which settles from a slight push
     each cut   (the cue words in clips.json) the next clip cuts in hard and settles from a push; the count ticks
     PHRASE     each word prints on its word
     B          a hard cut back to the speaker (the build hides the layer); ask CAMERA for a punch there
   Supply: clips.json (one real clip per segment: the creator's b-roll) and run mksd.py <project> after any change
   to the window, the words or the clips: it cuts reel.mp4 (1080x1920, the cuts baked on the cue words).
   Change: PHRASE, CUTS_AT, TAG, BORDER, GRAIN, T. The edit hides the captions over the window (KARAOKE hide): the
   effect carries the words.
   Sound: a whoosh on A, a click per cut, a soft pop per word, a whoosh-soft at B. */
var PHRASE = [['this'], ['is'], ['the'], ['video.', 'key']];   // the words, printed on their words; 'key' sets one in the display face
var CUTS_AT = ['minutes', 'later', 'this', 'video'];   // the reel's cuts (clips.json "cues")
var TAG = '@handle';                                 // the creator's handle (a plain true label); '' = none
var BORDER = 0;                                      // a thin cream border, px (0 = none, 12 at most)
var GRAIN = 0.08;                                    // the footage's grain over the clips (6 to 10%)
var T = { settle: 0.24, word: 0.20 };                // the settle after each cut, the word's ease (six frames)

var R = '#{{ID}} ';
function $(s) { return document.querySelector(R + s); }
function two(n) { return (n < 10 ? '0' : '') + n; }

// ---- build once
if (!$('.sc-phrase').childNodes.length) {
  $('.sc-handle').textContent = TAG;
  PHRASE.forEach(function (p, i) {
    var w = document.createElement('span'); w.className = 'sc-w';
    var t = document.createElement('span'); t.className = 'sc-wi' + (p[1] === 'key' ? ' sc-key' : ''); t.textContent = p[0];
    t.setAttribute('data-layout-allow-overlap', ''); t.setAttribute('data-layout-allow-occlusion', '');
    w.appendChild(t); $('.sc-phrase').appendChild(w);
  });
}
if (!TAG) $('.sc-handle').style.display = 'none';
// the line keeps 72px as a maximum and only shrinks to one line
function fit() {
  var ph = $('.sc-phrase'); ph.style.fontSize = '72px';
  var w = 0; ph.querySelectorAll('.sc-w').forEach(function (el) { w += el.scrollWidth; }); w += 22 * (PHRASE.length - 1);
  if (w > 1010) ph.style.fontSize = (72 * 1010 / w).toFixed(1) + 'px';
}
fit();
if (document.fonts && document.fonts.ready) document.fonts.ready.then(fit);
gsap.set(R + '.sc-grain', { opacity: GRAIN * 3 });
if (BORDER) gsap.set(R + '.sc-edge', { boxShadow: 'inset 0 0 0 ' + BORDER + 'px ' + getComputedStyle(document.documentElement).getPropertyValue('--c-light').trim() });

// ---- times
var tOut = B - 1 / 30;
var cuts = [], prevCut = A;
CUTS_AT.forEach(function (w) { var t = wordAt(w, prevCut); if (t !== null && t < tOut) { cuts.push(t); prevCut = t + 0.01; } });
var tw = [], pw = A;
PHRASE.forEach(function (p, i) { var t = wordAt(p[0], pw); tw[i] = (t === null || t >= tOut) ? A + 0.5 + 0.25 * i : t; pw = tw[i] + 0.01; });

// A and each cut: a hard cut (baked in the reel), then a settle from a slight push; the count ticks
gsap.set('#{{ID}}-reel', { transformOrigin: '50% 50%' });
tl.set(R + '.sc-count', { textContent: two(1) + '/' + two(cuts.length + 1) }, q(A));
tl.fromTo('#{{ID}}-reel', { scale: 1.06 }, { scale: 1, duration: T.settle, ease: 'power3.out', immediateRender: false }, q(A));
cuts.forEach(function (t, i) {
  tl.set(R + '.sc-count', { textContent: two(i + 2) + '/' + two(cuts.length + 1) }, q(t));
  tl.fromTo('#{{ID}}-reel', { scale: 1.06 }, { scale: 1, duration: T.settle, ease: 'power3.out', immediateRender: false }, q(t));
});

// the line prints word by word, each six frames up into place
var words = document.querySelectorAll(R + '.sc-wi');
gsap.set(words, { yPercent: 110 });
PHRASE.forEach(function (p, i) {
  tl.fromTo(words[i], { yPercent: 110 }, { yPercent: 0, duration: T.word, ease: 'power2.out', immediateRender: false }, q(tw[i]));
});
