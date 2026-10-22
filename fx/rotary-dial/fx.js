// rotary-dial (layer: behind): her pink and gold rotary as a halo behind her head, dialling the CTA keyword.
//   A          the dial scales up into place behind her head (back ease)
//   "111"      the finger-hole ring dials 1-1-1: three pulls from the 1 hole to the finger stop, each held a beat and
//              unwound back (the slower return); the 1 hole lights pale gold on each pull and stays lit after the third
//   after      the dial rings: two small shakes
//   to B       holds, the sunburst turning very slowly; fades out at B
// The ring (holes + digits) rotates as one group above the static base; the pivot is the dial centre. Change the
// constants below, nothing else.

var DIGITS = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '0'];  // counter-clockwise from the upper right
var DIAL = '111';                                  // the number dialled; each digit's travel comes from its hole
var CUE = '111';                                   // the word the dialling starts on
var CX = 540, CY = 640;                            // dial centre on the frame (on her head)
var R = 470, HOLE_R = 360, STOP_R = 440;           // dial radius, hole ring radius, finger stop radius
var HOLE0 = -60, HOLE_STEP = -27, STOP = -40;      // degrees (screen, clockwise positive): hole 1, spacing, finger stop
var T = {
  cue: 0.34,                                       // fallback for the cue word, after A
  inDur: 0.40, inScale: 0.85,                      // the entrance
  pull: 0.10, hold: 0.05, back: 0.19, gap: 0.02,   // one pull: out to the stop, held, unwound back (all three < 1.2 s)
  shake: 0.045, shakeDeg: 2.4,                     // the ring: four quarter-swings (two shakes)
  ringGap: 0.0,                                    // pause between the last unwind and the ring
  spin: 8,                                         // sunburst rotation over the whole window (degrees)
  out: 0.30                                        // fade-out length, ending at B
};

var ID = '{{ID}}', $ = function (s) { return document.getElementById(ID + '-' + s); };
var d = $('d'), ring = $('ring'), sun = $('sun'), stop = $('stop');

// ---- build the holes (digits upright at rest) and place the stop
var h = '';
DIGITS.forEach(function (n, i) {
  var a = (HOLE0 + HOLE_STEP * i) * Math.PI / 180;
  var x = R + HOLE_R * Math.cos(a) - 62, y = R + HOLE_R * Math.sin(a) - 62;
  h += '<div class="' + ID + '-h" style="left:' + x.toFixed(1) + 'px;top:' + y.toFixed(1) + 'px">' +
    '<i class="' + ID + '-lit ' + ID + '-lit' + n + '"></i>' +
    '<span class="' + ID + '-n" data-layout-allow-overlap data-layout-allow-occlusion>' + n + '</span></div>';
});
ring.innerHTML = h;
var sa = STOP * Math.PI / 180;
stop.style.left = (R + STOP_R * Math.cos(sa) - 30).toFixed(1) + 'px';
stop.style.top = (R + STOP_R * Math.sin(sa) - 70).toFixed(1) + 'px';
gsap.set(stop, { rotation: STOP + 90 });
gsap.set(d, { x: CX - R, y: CY - R, transformOrigin: '50% 50%', scale: T.inScale, opacity: 0 });
gsap.set([ring, sun], { transformOrigin: R + 'px ' + R + 'px', rotation: 0 });
gsap.set('#' + ID + ' .' + ID + '-lit', { opacity: 0 });

// ---- entrance
tl.fromTo(d, { scale: T.inScale }, { scale: 1, duration: T.inDur, ease: 'back.out(1.6)', immediateRender: false }, q(A));
tl.fromTo(d, { opacity: 0 }, { opacity: 1, duration: 0.14, ease: 'none', immediateRender: false }, q(A));
tl.fromTo(sun, { rotation: 0 }, { rotation: T.spin, duration: B - A, ease: 'none', immediateRender: false }, q(A));

// ---- dial the number: each pull carries that digit's hole clockwise to the finger stop and unwinds it back
var w = wordAt(CUE, A), t = (w !== null && w < B) ? w : A + T.cue;
DIAL.split('').forEach(function (n, k) {
  var i = DIGITS.indexOf(n), travel = STOP - (HOLE0 + HOLE_STEP * i);
  if (travel <= 0) travel += 360;
  var lit = '#' + ID + ' .' + ID + '-lit' + n, last = k === DIAL.length - 1;
  tl.fromTo(ring, { rotation: 0 }, { rotation: travel, duration: T.pull, ease: 'power2.out', immediateRender: false }, q(t));
  tl.fromTo(lit, { opacity: 0 }, { opacity: 1, duration: 0.06, ease: 'none', immediateRender: false }, q(t));
  tl.fromTo(ring, { rotation: travel }, { rotation: 0, duration: T.back, ease: 'sine.inOut', immediateRender: false },
    q(t + T.pull + T.hold));
  if (!last) tl.fromTo(lit, { opacity: 1 }, { opacity: 0, duration: 0.08, ease: 'none', immediateRender: false },
    q(t + T.pull + T.hold + T.back - 0.08));
  t += T.pull + T.hold + T.back + (last ? 0 : T.gap);
});

// ---- the ring: two small shakes of the whole dial
var tRing = t + T.ringGap, sw = [-1, 1, -0.8, 0.6, 0];
sw.forEach(function (s, k) {
  tl.fromTo(d, { rotation: k ? sw[k - 1] * T.shakeDeg : 0 }, { rotation: s * T.shakeDeg, duration: T.shake,
    ease: 'sine.inOut', immediateRender: false }, q(tRing + T.shake * k));
});

// ---- out
tl.fromTo(d, { opacity: 1 }, { opacity: 0, duration: T.out, ease: 'power1.in', immediateRender: false }, q(B - T.out));
