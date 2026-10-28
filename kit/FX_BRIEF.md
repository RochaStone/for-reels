# FX brief: hand-built motion graphics inside a video (showcase mode)

You build one or more motion-graphic beats (`edit.FX`) for a talking-head video. Start from the closest effect in
`KIT/fx/LIBRARY.md`: copy its folder to `<project>/fx/<id>/` (no renaming needed: `{{ID}}` becomes your id) and
change the words, the beat times and the assets. Each effect lives in its own folder and is composited into the
video's single HyperFrames/GSAP timeline by `pipeline/build.py`. You never touch the footage timing, the cut or
another agent's folder.

Read first: `<project>/style/STYLE.md` (the creator's style, including its Showcase section) and `KIT/kit/TOKENS.md`.

## The elite bar (every effect passes all eight, or it goes back)
Cute is a fail. Judge the moving version, never only stills, and start from "not elite yet".
1. **Presence.** It owns the frame for its moment: big, often full frame for a beat, then it gives the frame back.
   Never a small sticker parked in a corner.
2. **Real material.** A real photo full-bleed, a real screenshot, a real scan. Never a drawn prop: no vector tape,
   polaroid frame, sprocket, receipt, bezel, sticker or sparkle. If there is no real thing to show, type alone
   carries the beat. Texture images (shot or generated paper and objects, never generated people) live in the
   effect folder and are photographic, not illustrated.
3. **Craft motion.** A cut, a push, a settle, a hold. Eases, never bounces: no hop, overshoot or wobble. Secondary
   motion comes from the camera and the footage, not from the graphic jiggling.
4. **Depth.** It sits behind the speaker (cutout), in front, or both at once; parallax between layers.
5. **The camera answers.** A punch-in, push, whip or zoom-through lands with the hit (report it for CAMERA).
6. **On the word.** It hits the spoken syllable, and the sound hits on the same frame.
7. **Thumbnail test.** Its best frame, as a still, would stop a scroll. **Phone test.** Readable at phone size in
   under a second.
8. **Spliced, not only drawn.** Where the line names a thing, the real thing is in it: the creator's b-roll, photo or
   screenshot cut in, collaged or framed, before any drawn graphic.
Trending formats beat evergreen ones: when the creator names a date window, use only formats from that window.

### Material and type (the sticker test)
If a frame could have been made in a template app, it fails. Before any still ships, check:
- **One device per frame.** A word behind the head, or a photo, or a caption. Never a word plus a kicker plus a
  strike plus decoration. Cut the second device.
- **Type set hard.** One face per effect, tight tracking, in `--c-light` or `--c-ink`. No outline, no coloured
  offset shadow, no fill behind it. The pill belongs to captions only (`captions.lofi.look`), never to effect type.
- **In the scene, not on the glass.** Every overlay takes the footage's grain (`grain.png` at 6 to 10%), is colour
  matched to the shot (`grade` token), and its shadow falls the way the light in the room falls. Nothing sits on top
  like a sticker.
- **Decoration is off by default.** Sparkles, moons, bows, hearts and confetti render only when the creator's
  style pack asks for them. A kit effect never draws them on its own.

## Composition and type (the build checks both)

### Where things go: the face and Instagram's interface
`pipeline/compose.py` measures the head on the first, middle and last frame of each effect window (from the cutout's
alpha; `edit.FACE_BOX = (l, t, r, b)` overrides it) and writes tokens onto the effect's wrapper, in px at 1080 x 1920:
`--face-top`, `--face-bottom`, `--face-left`, `--face-right`; `--safe-top 250`, `--safe-bottom 400`, `--safe-right 120`;
`--clear-zone` (`top`, `left`, `right` or `below`: the one with the most room) with `--clear-x/y/w/h`; and
`--zone-top`, `--zone-left`, `--zone-right`, `--zone-below` as "x y w h" (0 0 0 0 when a zone holds no type). While the
captions are on, the bottom of a zone is the line above them; inside a `KARAOKE["hide"]` window it is y 1520.
In fx.js, `ZONE('{{ID}}')` returns all of it as numbers (`Z.face`, `Z.safe`, `Z.clear`, `Z.rect`, `Z.zone.top`...).
- Type and prints near the head go in a clear zone and are sized to it. Marker strokes never cross the face box.
- A `behind` effect sits under the cutout, so it may tuck its foot behind the head (about 0.2 to 0.3 of its height) but
  its words live in `Z.zone.top`. No room above the head (a tight chest-up take): `gsap.set('#{{ID}}', { display: 'none' })`
  and say so; never bury the word behind the speaker. The build prints a note when an effect drew nothing.
- Tell the creator once: frame chest-up with some headroom, and the effects have room to work.

### One type scale
Every effect sets its type from the pack's tokens, never its own size: `--fx-xl` 400 px, `--fx-l` 200 px, `--fx-s` 56 px
(at 1080 wide), one tracking per size (`--fx-ls-xl`, `--fx-ls-l`, `--fx-ls-s`), the hook in caps (`--fx-case-hook`
uppercase), everything else `--fx-case` (none, so lowercase as typed). In css: `font-size:var(--fx-l)`. In fx.js:
`fitStep(el, maxW, maxH, from)` sets the largest step (xl, l, s, from `from`) at which a shrink-to-fit element fits, and
returns its name; `STEP.xl` / `STEP.l` / `STEP.s` and `STEPS` are the same tokens for your own loops. A word is one of
three sizes, so a long word falls to the next step instead of shrinking to a size of its own.

### The lint (`pipeline/fxlint.py`, run by build.py before `hyperframes check`)
- Static: a `font-size`, a `font` shorthand or a `fontSize =` in any fx.html or fx.js that is not a scale token fails,
  with the line and the fix.
- Runtime: the built page is opened in the render browser and each effect's window is sampled. Any text or print whose
  box overlaps the head box, or sits inside the top 250, bottom 400 or right 120 px, fails with the element, the time and
  the zone to use. Mark a print `data-fx-print`. `data-fx-face-ok` on text or a print that may cover the head (a full-frame
  cut-in has replaced the speaker, or the effect is about the face); `data-fx-ui-ok` for the interface zone. A `behind`
  effect fails only when the head hides more than 35 percent of a word.
- `FX_LINT=warn` prints the findings and goes on (the sandbox and the lab use it); `FX_LINT=off` skips the lint.

### Real surfaces, not templates
Comment UI is the platform's flat surface in the pack's paper and ink (square, a hairline, no fill colour of its own, no
shadow). Photos are hard-edged prints with no rounded tiles and no box shadow. App icons are flat squares with a soft
contact shadow. A pill, a bubble or a rounded tile on an effect is a template look and fails the sticker test.

## The contract
Folder: `<project>/fx/<id>/`
- `fx.html`: markup plus one `<style>` block. Scope every selector under `#{{ID}}` or prefix ids and classes with
  `{{ID}}-`. The build wraps it in `<div id="<id>" class="layer fx">` (1080x1920, absolute, top-left 0,0) and shows
  that wrapper from A to B. Don't use `class="layer"` / `full` inside unless you mean full-frame.
- `fx.js`: plain JS appended inside the video's timeline code, wrapped as `(function (A, B) { ... })(start, end)`.
  In scope: `tl` (the paused master timeline), `gsap`, `q(t)` (snaps a time onto its frame: ALWAYS position tweens
  with `q(...)`), `on(sel, t)`, `off(sel, t)`, `A`, `B` (start and end in seconds on the output timeline), `CUTS`
  (the picture cuts), `WORDS` (`[start, end, text]` per word), `wordAt(text, after)` (the start of the first word
  matching `text` at or after `after`, or null), `wordSpan(text, after)` (its `[start, end]`, or null), `FXS` (every
  effect's `{id, layer, at, end}`) and `LOOKS` (the named grades: name -> CSS filter).
- Key beats to words where you can (`var tSend = wordAt('sentence', A)`), with a relative fallback, and keep every
  other beat time relative to `A` as a named constant at the top of fx.js (`var T = { type: 0.40, send: 1.10 }`,
  used as `q(A + T.send)`). Put every word or label in a constant at the top too. Copying the effect to a new video
  should mean changing those constants, nothing else.
- `{{ID}}` in fx.html and fx.js becomes the entry's id. `{{T0}}`..`{{T9}}` in fx.html become unique
  `data-track-index` values: use them for every `<video>`.
- Assets (png/jpg/svg/mp4/webm) go in the same folder and are published at `fx/<id>/<file>`: reference them as
  `fx/{{ID}}/<file>`.
- Layers (edit.FX `layer`): `behind` = under the speaker's cutout, inside the camera (type behind the head; needs a
  CUT_WINDOWS entry over its window, which never crosses a picture cut); `cam` = on the camera above the cutout
  (extra copies of the footage, wipes, grids); `top` = above the speaker, under the captions; `over` = above
  everything (full-frame transitions, effects that carry the words).

## Look: the creator's, through tokens
- Every colour and font is a token (`var(--c-accent)`, `var(--font-display)`; in JS
  `getComputedStyle(document.documentElement).getPropertyValue('--c-accent')`). No hex, rgb or font names in an effect.
  The same meanings as everywhere: accent = emphasis, negative = losses or "no", positive = gains or "yes".
- The creator's STYLE.md Showcase section sets the treatment for an emphatic word, the transition set, the motif and
  how dense the edit gets. Follow it over anything in the library.
- Never: gradients, glows, neon, glassmorphism, orbs, lens flares, light leaks, bokeh, drop-shadow halos, emoji
  confetti, stock "tech HUD". Shadows only soft and functional (a card lifting off the footage). No outline on type
  over footage: split it light/dark against the picture instead (see `kinetic-hook`).
- Real artifacts over invented ones: the creator's own files, screenshots, clips, headshot. Text on screen is their
  words or plain true labels. No made-up stats, no imitation of a real brand's UI: build generic, well-made
  components. Library placeholders are labelled as placeholders.
- Motion: purposeful and fast. power3 / expo / back(1.4-1.8) eases, 0.15-0.45s moves, staggered reveals, masks
  (clip-path / overflow hidden) for type, overshoot sparingly. Every move lands ON its word (words.json times).
- Safe zones on 1080x1920: see "Composition and type" below. The caption band (y 1300-1470) belongs to the captions:
  keep `top` and `behind` graphics out of it unless the effect carries the words (then the edit hides the captions
  there with `KARAOKE["hide"]`, and the build lets the effect use the band).
- One idea per beat, legible in 1-2 seconds. Covering the face for a beat is fine when the graphic is the point.

## Determinism (it renders frame by frame by seeking)
- Everything is a tween or set on `tl` at an absolute time `q(t)`. No CSS animations or transitions, no timers, no
  `Math.random()` (seed your own: `function rnd(i){ var x = Math.sin(i * 12.9898) * 43758.5453; return x - Math.floor(x); }`).
- Hide what starts later with `gsap.set(sel, {opacity: 0})` at build time, then `tl.set` / `fromTo` it in.
- `fromTo` after time 0 always carries `immediateRender: false`.
- Tween `clip-path` with `fromTo` only: a `.to` reads the current value back from the browser, which reports a full
  inset in short form, and the tween jumps.
- Typewriters: `tl.set` the text (or a width / clip) per character at `q(t0 + i * dt)`; never `onUpdate` slicing.
- Counters: `tl.set` per frame, or tween an object and render through a per-frame `tl.set` loop.
- `hyperframes check` gates the render. Every `<video>` needs its own `id` (without one it renders frozen); never
  tween layout props (left, top, letterSpacing): use x / y / scale; never give an element a CSS `transform` that
  GSAP also tweens (set it with `gsap.set`); mark intentional overlaps with `data-layout-allow-overlap` (and
  `data-layout-allow-occlusion`) on the text elements themselves: the layout audit doesn't read them off the
  build's wrapper div.

## Media timing (clips, footage copies)
The renderer reads media timing from the static HTML, so write it with template variables relative to where the
effect sits (the build fills them in; never hard-code absolute times):
- `{{START}}`, `{{START+0.77}}`: `data-start` for a clip that starts at A (or 0.77 s after A), frame-snapped.
- `{{SYNC}}`, `{{SYNC+0.77}}`: `data-media-start` for a copy of `clean.mp4` starting there, so it shows the same
  frame as the main picture (lips in sync).
- Hide a footage copy with opacity 0 or `display:none`, never `visibility:hidden`: the renderer still draws a video
  under a hidden ancestor.
- `{{DUR}}`, `{{DUR-0.133}}`: the effect's length (frames / 30), or less, for a clip that starts late and should
  end with the effect. A clip with its own length gives its own `data-duration`.

A second copy of the video's own footage: `<video id="{{ID}}-v0" class="{{ID}}-x g" src="clean.mp4" muted playsinline
data-start="{{START}}" data-media-start="{{SYNC}}" data-duration="{{DUR}}" data-track-index="{{T0}}">` shows the same
frame as the main picture. `class="g"` inherits the live grade. Two copies with identical start and
duration trip a duplicate-media lint: stagger one by a frame. Scale or translate the copy or its wrapper with GSAP;
never re-time it. Prove sync on a snapshot (no ghosting where it overlaps the main picture).

## Your loop (phase 1: stills, no render)
1. Read `<project>/edit.py` (FX entries, times), `<project>/words.json` (word times on the output timeline), and
   look at the footage under your window: `ffmpeg -ss <t> -i <project>/public/clean.mp4 -frames:v 1 -vf scale=540:-1 x.jpg`.
2. Build `fx/<id>/fx.html` + `fx.js` (+ assets).
3. Preview in your own sandbox: `PY KIT/pipeline/fxsandbox.py <project> <your-name> --only <ids> --at t1 t2 ...`
   (edit `work/sandbox/<your-name>/edit.py` to try GRADES / CUT_WINDOWS / CAMERA changes there). Read every
   snapshot at full size: key frames AND the in and out frames (no pop, no flash, nothing clipped, no ghosting).
   Run `npx -y hyperframes@0.8.139 check` in `<sandbox>/public` before you report.
4. Report back (short): per id, what it does beat by beat; 2-3 absolute times that sell it (`frames=[...]`); SFX
   as `(time, name, dB, what)` with the time of the visual event (mix.py lines up each sound's loudest moment);
   any edit.py change it needs (CUT_WINDOWS, GRADES, CAMERA, KARAOKE hide, FX at / end); the paths of your best stills.

SFX names (`KIT/audio/SFX.md` has what each sounds like and a starting level): whoosh, whoosh-soft, whoosh-deep,
whoosh-long, pop, click, tick, clicks-run, typing, key, ding, shutter, stamp, impact-low, boom-low, riser,
riser-long, drum-hit, scratch, switch-off.
