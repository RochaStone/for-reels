// photo-dive (layer: top). The creator's real photo is the beat: it cuts in hard and the camera pushes into it.
//   IN    on the cue word the photo cuts in full-bleed (no slide, no fade), graded like the footage (class g) under
//         the footage's grain.
//   DIVE  on the second cue word a slow push into FOCUS, eased, until the effect ends. No wobble, no overshoot.
//   WORD  one word in the display face lands on its syllable: a six-frame ease up into place, then it holds.
//   OUT   a hard cut back to the speaker at B (the build hides the layer); ask CAMERA for a punch on the frame after.
// Supply: the photo (photo.jpg in this folder, any size, PHOTO_RATIO = height / width), FOCUS = the point the push
// goes into as fractions of the photo. Change the constants below; a cue finds the first matching spoken word at or
// after the previous beat (wordAt), else its fallback (seconds after A).
// Reach for it on "I just ordered", "look at this", any line that names a thing there is a photo of.

var PHOTO = 'photo.jpg';
var PHOTO_RATIO = 16 / 9;                          // the photo's height / width
var FOCUS = { x: 0.50, y: 0.50 };                  // where the push goes, as fractions of the photo
var CUE = { in: ['', 0.30], dive: ['', 0.80] };    // [cue word, fallback seconds after A]: the cut in, the push starts
var WORD = ['placeholder', '', 1.60];              // [the word ('' = none), cue, fallback]
var INK = 'ink';                                   // 'ink' on a light photo, 'light' on a dark one
var DIVE = { from: 1.00, to: 1.18 };               // the push: frame scale at the cut in, and at the end
var GRAIN = 0.08;                                  // the footage's grain over the print (6 to 10%)
var T = { word: 0.20 };                            // the word's ease, seconds (six frames)

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
var img = $('.pv-img');
if (!img.getAttribute('src')) {
  img.setAttribute('src', 'fx/{{ID}}/' + PHOTO);
  $('.pv-word').textContent = WORD[0];
}
if (!WORD[0]) $('.pv-word').style.display = 'none';
var tok = getComputedStyle(document.documentElement).getPropertyValue(INK === 'light' ? '--c-light' : '--c-ink');
gsap.set(R + '.pv-word', { color: tok.trim() });
gsap.set(R + '.pv-grain', { opacity: GRAIN });

// ---- the photo covers the frame; FOCUS sits as central as the photo's edges allow
var FW = 1080, FH = 1920;
var IW = Math.max(FW, FH / PHOTO_RATIO), IH = IW * PHOTO_RATIO;
var IL = Math.min(0, Math.max(FW - IW, FW / 2 - FOCUS.x * IW)), IT = Math.min(0, Math.max(FH - IH, FH / 2 - FOCUS.y * IH));
img.style.width = IW + 'px';
img.style.height = IH + 'px';
gsap.set(img, { x: IL, y: IT, scale: DIVE.from, transformOrigin: (FOCUS.x * IW) + 'px ' + (FOCUS.y * IH) + 'px' });

// ---- beat times, in spoken order
var tIn = beat(CUE.in[0], CUE.in[1]);
var tDive = beat(CUE.dive[0], CUE.dive[1]);
var tWord = beat(WORD[1], WORD[2]);

// ---- start states: nothing shows until the cut
gsap.set(R + '.pv-wrap', { opacity: 0 });
gsap.set(R + '.pv-word', { opacity: 0, y: 26 });

// IN: a hard cut, the whole frame at once
tl.set(R + '.pv-wrap', { opacity: 1 }, q(tIn));
// DIVE: one slow push into the focus point, carried to the end of the beat
tl.fromTo(img, { scale: DIVE.from }, { scale: DIVE.to, duration: Math.max(0.2, B - tDive), ease: 'power1.inOut', immediateRender: false }, q(tDive));
// WORD: six frames up into place, then it holds
if (WORD[0]) tl.fromTo(R + '.pv-word', { opacity: 0, y: 26 }, { opacity: 1, y: 0, duration: T.word, ease: 'power2.out', immediateRender: false }, q(tWord));
