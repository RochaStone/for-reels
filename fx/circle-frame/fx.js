/* circle-frame (layer: cam). An intimate aside that cuts to the real thing, seen through a torn hole in real paper.
   Beat by beat:
     A          a hard cut: a sheet of handmade paper (card-hole.png, the photographed deckled card with a torn
                round hole, cut by mkhole.py) covers the frame on the dark ground, the face whole inside the hole (a
                synced copy of the footage placed so FACE sits in the hole); the sheet settles from a slight push
     CUE word   a hard cut inside the hole to the photo (still.jpg), then a slow push into it; the word lands below
                the hole, set hard on the paper; ask CAMERA for a punch here
     CUE2 word  a hard cut inside the hole to the clip (broll.mp4), settling from a push (no photo: the clip from CUE)
     OPEN       (T.open before B) a hard cut back to the full picture
   Supply: the creator's photo as still.jpg (optional) and a clip of the thing, cut square by mkhole.py --clip (it
   holds its first frame until its cue); mkhole.py also cuts the hole in the paper: rerun it after changing CIRCLE.
   Change: WORD, CUE, CUE2, STILL_POS, FACE (the face's centre and the radius to keep whole, px on the picture),
   CIRCLE (the hole's centre and radius on screen; keep it inside the paper: x 100..980, y 120..1800), PUSH, GRAIN, T.
   If A sits on a picture cut, give that cut no camera transition (the paper already lands on it).
   Sound: a whoosh-soft on A, an impact-low on CUE, a click on CUE2, a whoosh-soft on OPEN. */
var WORD = 'just between us';      // the word under the hole; '' = none
var CUE = 'nothing';                // the cut to the photo (fallback: A + T.cue)
var CUE2 = 'about';                 // the cut from the photo to the clip (null: no photo, the clip from CUE)
var STILL_POS = '50% 42%';          // which part of the photo the hole shows
var FACE = [550, 720, 400];         // the face's centre and the radius to keep whole (px on the 1080x1920 picture)
var CIRCLE = [540, 760, 300];       // the hole's centre and radius on screen (px)
var PUSH = { from: 1.0, to: 1.12 }; // the slow push into the photo
var GRAIN = 0.08;                   // the footage's grain inside the hole (6 to 10%)
var T = { settle: 0.30, cue: 0.58, open: 0.20, word: 0.20 };   // seconds

var CX = CIRCLE[0], CY = CIRCLE[1], R = CIRCLE[2], F = 1 / 30;
var BS = Math.round(2 * R * 1.12); BS += BS % 2;   // the photo and the clip: a square a little bigger than the hole
function place(id, r) {
  var el = document.getElementById(id);
  el.style.left = (CX - r) + 'px'; el.style.top = (CY - r) + 'px';
  el.style.width = el.style.height = (2 * r) + 'px';
}
place('{{ID}}-s', BS / 2);
place('{{ID}}-b', BS / 2);
document.getElementById('{{ID}}-s').style.objectPosition = STILL_POS;
document.getElementById('{{ID}}-clip').style.clipPath = 'circle(' + (R + 6) + 'px at ' + CX + 'px ' + CY + 'px)';
var word = document.getElementById('{{ID}}-word');
word.textContent = WORD;
word.style.top = (CY + R + 70) + 'px';
if (!WORD) word.style.display = 'none';
gsap.set('#{{ID}}-grain', { opacity: GRAIN * 3 });

// the face in the hole: the synced copy scaled about the face, never less than it takes to fill the hole
var s = R / FACE[2];
var L = CX - R, Rt = CX + R, Tp = CY - R, Bt = CY + R;
s = Math.max(s, (CX - L) / FACE[0], (Rt - CX) / (1080 - FACE[0]), (CY - Tp) / FACE[1], (Bt - CY) / (1920 - FACE[1]));
gsap.set('#{{ID}}-v', { transformOrigin: '0 0', x: CX - s * FACE[0], y: CY - s * FACE[1], scale: s });

var tCue = wordAt(CUE, A); if (tCue === null || tCue >= B - T.open - 0.2) tCue = A + T.cue;
var tClip = CUE2 ? wordAt(CUE2, tCue + 0.05) : null;
if (tClip === null || tClip >= B - T.open - 0.1) tClip = CUE2 ? (tCue + B - T.open) / 2 : tCue;
var tOpen = B - F - T.open;

// ---- start states
gsap.set(['#{{ID}}-s', '#{{ID}}-b'], { opacity: 0, transformOrigin: '50% 50%' });
gsap.set('#{{ID}}-rig', { transformOrigin: CX + 'px ' + CY + 'px' });
gsap.set(word, { opacity: 0, y: 22 });

// A: the paper lands on the picture, settling from a slight push
tl.fromTo('#{{ID}}-rig', { scale: 1.03 }, { scale: 1, duration: T.settle, ease: 'power2.out', immediateRender: false }, q(A));
// CUE: a hard cut inside the hole to the photo, a slow push; the word lands
tl.set('#{{ID}}-v', { opacity: 0 }, q(tCue));
if (CUE2) {
  tl.set('#{{ID}}-s', { opacity: 1 }, q(tCue));
  tl.fromTo('#{{ID}}-s', { scale: PUSH.from }, { scale: PUSH.to, duration: Math.max(0.2, tClip - tCue), ease: 'power1.inOut', immediateRender: false }, q(tCue));
  tl.set('#{{ID}}-s', { opacity: 0 }, q(tClip));
}
if (WORD) tl.fromTo(word, { opacity: 0, y: 22 }, { opacity: 1, y: 0, duration: T.word, ease: 'power2.out', immediateRender: false }, q(tCue));
// CUE2: a hard cut to the clip, settling from a push
tl.set('#{{ID}}-b', { opacity: 1 }, q(tClip));
tl.fromTo('#{{ID}}-b', { scale: 1.08 }, { scale: 1, duration: 0.3, ease: 'power3.out', immediateRender: false }, q(tClip));
// OPEN: a hard cut back to the full picture
off('#{{ID}}-rig', tOpen);
off('#{{ID}}-bg', tOpen);
