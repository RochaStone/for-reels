// icon-strike (layer: top), for "no X, no Y, nothing". App icons sit above the head on their names, a real marker
// stroke (strike.png: a photographed paint-marker line from kit/material) wipes through each one and it loses its
// colour, and on the last word they drop out of frame while one word rises where they were, set hard.
// Supply: nothing for the placeholders: flat labelled tiles from tokens. When the speaker names real apps, fetch
// their icons into this folder with icons.py (PY icons.py <this folder> "App One" "App Two") and set img on each
// icon. Fetched icons belong to their owners: they live in your project's copy of this effect, never in the library.
// Change: ICONS, FALL_ON, WORD and INK below. A key finds the first matching spoken word at or after the previous
// beat (wordAt); when it is missing, the fallback in T (seconds after A) is used. Ask CAMERA for a punch on FALL_ON.
// Sound: a click per icon, a scratch (quiet) per strike, a whoosh-soft on the drop, an impact-low as the word lands.

var ICONS = [                                   // up to three: the word it lands on, its name, an image ('' = placeholder)
  { on: 'timeline', label: 'timeline', img: '' },
  { on: 'presets', label: 'presets', img: '' }
];
var FALL_ON = 'nothing';                        // the icons drop on this word
var WORD = 'nothing.';                          // the word that rises where they were; '' = none
var INK = 'dark';                               // the names and the word: 'light' over dark footage, 'dark' over bright
var T = { pop: 0.40, gap: 0.70, strike: 0.22, fall: 1.46, rise: 0.18, wipe: 0.20 };

var R = '#{{ID}} ';
function word(w, after, fallback) { var t = w ? wordAt(w, after) : null; return t === null || t >= B ? fallback : t; }
function rnd(i) { var x = Math.sin(i * 12.9898) * 43758.5453; return x - Math.floor(x); }

// build the icons once, centred above the head
(function () {
  var box = document.querySelector(R + '.is-apps');
  if (!box || box.childNodes.length) return;
  var n = ICONS.length, x0 = 540 - (n * 240 + (n - 1) * 44) / 2;
  ICONS.forEach(function (ic, i) {
    var a = document.createElement('div');
    a.className = 'is-app';
    a.setAttribute('data-layout-allow-overlap', '');          // they drop through the captions on purpose
    a.setAttribute('data-layout-allow-overflow', '');
    a.style.left = (x0 + i * 284) + 'px';
    a.innerHTML = '<div class="is-tile ' + (ic.img ? '' : 'is-ph') + '">' +
      (ic.img ? '<img src="fx/{{ID}}/' + ic.img + '" alt="">' : '<span data-layout-allow-overlap data-layout-allow-occlusion>placeholder</span>') + '</div>' +
      '<img class="is-strike" src="fx/{{ID}}/strike.png" alt="" data-layout-allow-overlap data-layout-allow-occlusion data-layout-allow-overflow>' +
      '<div class="is-name" data-layout-allow-overlap data-layout-allow-occlusion></div>';
    a.querySelector('.is-name').textContent = ic.label;
    gsap.set(a.querySelector('.is-strike'), { rotation: (i % 2 ? 7 : -8) + (rnd(i) - 0.5) * 4 });
    box.appendChild(a);
  });
  document.querySelector(R + '.is-word span').textContent = WORD;
  box.classList.add(INK === 'light' ? 'is-light' : 'is-dark');
  document.querySelector(R + '.is-word').classList.add(INK === 'light' ? 'is-light' : 'is-dark');
})();

var apps = document.querySelectorAll(R + '.is-app');
gsap.set(apps, { opacity: 0 });
gsap.set(R + '.is-strike', { clipPath: 'inset(-20% 100% -20% 0%)' });
gsap.set(R + '.is-word span', { yPercent: 105 });

// times: each icon lands on its word, the drop comes on FALL_ON, and every strike lands before the drop
var POPS = [], prev = A;
ICONS.forEach(function (ic, i) { var t = word(ic.on, prev, A + T.pop + i * T.gap); POPS.push(t); prev = t + 0.01; });
var FALL = word(FALL_ON, prev, A + T.fall), RISE = FALL + T.rise;

// the icon lands on its name: there at once, settling from a slight push; the name follows
function land(el, t) {
  tl.set(el, { opacity: 1 }, q(t));
  tl.fromTo(el, { scale: 1.06, y: 10 }, { scale: 1, y: 0, duration: 0.26, ease: 'power2.out', immediateRender: false }, q(t));
  tl.fromTo(el.querySelector('.is-name'), { opacity: 0, y: 8 }, { opacity: 1, y: 0, duration: 0.2, ease: 'power2.out', immediateRender: false }, q(t + 0.06));
}
// the strike: the marker line wipes through, left to right, and the icon loses its colour
function strike(el, t) {
  var line = el.querySelector('.is-strike'), tile = el.querySelector('.is-tile');
  tl.fromTo(line, { clipPath: 'inset(-20% 100% -20% 0%)' }, { clipPath: 'inset(-20% 0% -20% 0%)', duration: T.wipe, ease: 'power2.inOut', immediateRender: false }, q(t));
  tl.fromTo(tile, { filter: 'saturate(1) brightness(1)' }, { filter: 'saturate(0.25) brightness(0.9)', duration: 0.24, ease: 'power2.out', immediateRender: false }, q(t + 0.06));
}
// the drop: gravity, each with its own lean, no hop
function fall(el, t, rot, dx) {
  tl.to(el, { y: 1760, x: dx, rotation: rot, duration: 0.42, ease: 'power2.in' }, q(t));
}
for (var i = 0; i < apps.length; i++) {
  land(apps[i], POPS[i]);
  strike(apps[i], Math.max(POPS[i] + 0.08, Math.min(POPS[i] + T.strike, FALL - 0.24)));
  fall(apps[i], FALL + i * 0.04, [-14, 11, -8][i % 3], [-30, 24, -16][i % 3]);
}

// the word rises where they were and holds to B
if (WORD) tl.to(R + '.is-word span', { yPercent: 0, duration: 0.26, ease: 'power3.out' }, q(RISE));
