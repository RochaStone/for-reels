// cosmic-hotline, the hook (layer: top). An incoming-call card is up and readable on frame 0. It rings: every RING
// seconds a short shake of the card and a ring pulsing out of ANSWER (the button bumps with it). On the cue word
// ANSWER presses, its label rolls to "connected", and the card folds down toward the hook text box (FOLD_Y) and is
// gone by B, handing over to the box the edit shows from the cue word.
// Supply: nothing, it is all type and the fixed palette in fx.html (an approved signature-effect deviation).
// Change: the constants below. ANSWER_ON finds the first matching spoken word at or after A (wordAt); when it is
// missing, T.ans (seconds after A) is used.

// ---- constants ----
var TOP = "Incoming call";        // small spaced caps over the disc
var HUB = "R";                    // the script initial on the disc
var TITLE = "Cosmic Hotline";     // the caller, in script
var SUB = "calling you…";    // italic line under it
var LABELS = ["Later", "Answer", "connected"];   // left button, right button, right button once answered
var ANSWER_ON = "111";            // ANSWER presses on this word
var FOLD_Y = 1150, FOLD_H = 74;   // top and height of the hook text box the card folds into
var T = { ans: 1.12, ring: 0.35, press: 0.07, fold: 0.06, foldDur: 0.26 };   // fallbacks and moves, seconds
// ---- end of constants ----

var R = '#{{ID}} ', H = R + '.hl', CARD = R + '.hl-card', YES = R + '.hl-yes', PULSE = R + '.hl-pulse';

(function () {
  function put(sel, txt) { var el = document.querySelector(R + sel); if (el) el.textContent = txt; }
  put('.hl-top', TOP.toUpperCase()); put('.hl-hub', HUB); put('.hl-title', TITLE); put('.hl-sub', SUB);
  put('.hl-lab-no', LABELS[0].toUpperCase()); put('.hl-l0', LABELS[1].toUpperCase()); put('.hl-l1', LABELS[2].toUpperCase());
})();

// times
var ANS = wordAt(ANSWER_ON, A);
if (ANS === null || ANS >= B) ANS = A + T.ans;
var FOLD = ANS + T.fold, GONE = Math.min(B - 0.02, FOLD + T.foldDur);

// the card's centre (230 + 250) lands on the hook box's centre
var DY = FOLD_Y + FOLD_H / 2 - 480;

gsap.set(H, { transformOrigin: '50% 50%', opacity: 1 });
gsap.set([YES, PULSE], { transformOrigin: '50% 50%' });
gsap.set(PULSE, { opacity: 0, scale: 1 });
gsap.set(R + '.hl-l1', { y: 26 });

// ringing: one burst per RING until shortly before the answer (a wiggle that settles, a ring out of ANSWER, a bump)
var WIG = [2.2, -2.0, 1.4, -0.7, 0];
for (var r = A; r < ANS - 0.22; r += T.ring) {
  for (var k = 0; k < WIG.length; k++) {
    tl.to(H, { rotation: WIG[k], x: WIG[k] * 3, duration: 0.04, ease: k === WIG.length - 1 ? 'power2.out' : 'sine.inOut' }, q(r + k * 0.04));
  }
  tl.fromTo(PULSE, { opacity: 1, scale: 1 }, { opacity: 0, scale: 1.75, duration: 0.33, ease: 'power2.out', immediateRender: r === A }, q(r));
  tl.to(YES, { scale: 1.08, duration: 0.07, ease: 'power2.out' }, q(r));
  tl.to(YES, { scale: 1, duration: 0.16, ease: 'power2.inOut' }, q(r + 0.07));
}

// answer: the press bottoms out on the word, the label rolls to "connected"
tl.set(PULSE, { opacity: 0 }, q(ANS - T.press));
tl.to(YES, { scale: 0.84, duration: T.press, ease: 'power2.in' }, q(ANS - T.press));
tl.to(YES, { scale: 1, duration: 0.18, ease: 'back.out(1.8)' }, q(ANS));
tl.to(R + '.hl-l0', { y: -26, duration: 0.14, ease: 'power3.out' }, q(ANS - 0.02));
tl.to(R + '.hl-l1', { y: 0, duration: 0.14, ease: 'power3.out' }, q(ANS - 0.02));

// fold: the card shrinks away first (so it never crosses the face as a big bar), then drops onto the hook box,
// fading as it lands, gone by B
var FD = GONE - FOLD;
tl.to(H, { scale: 0.3, scaleY: 0.22, rotation: 0, x: 0, duration: FD * 0.7, ease: 'power3.out' }, q(FOLD));
tl.to(H, { y: DY, duration: FD, ease: 'power2.in' }, q(FOLD));
tl.to(H, { opacity: 0, duration: FD * 0.45, ease: 'power1.in' }, q(GONE - FD * 0.45));
