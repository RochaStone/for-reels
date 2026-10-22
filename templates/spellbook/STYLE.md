# Spellbook

Quiet and editorial. A bold lowercase serif headline holds at the top for the whole reel with a tiny mono line
under it, one small mono word at a time sits beside her face, and handwritten butter asides write themselves on
with an arrow. The captions stay small; the headline and the asides carry the design. Her brand palette: ink,
bone, hot pink.

## Type
- Display: Fraunces 900, upright, lowercase: the headline, thesis words, big figures.
- Text and captions: Space Mono 400, lowercase: the small word caption, labels.
- Mono: Space Mono 400: numbers, kickers, the subline.
- Hand-note: Caveat 600 (a fifth face, loaded by the hand-note piece only).

## Colour
- Bone #F5F0E8 for all type on footage. Hot pink #FF4FA3 is the accent (emphasis only). Butter #F5E6A3 is the
  hand-note colour. Lime #C9F24D means gains, orange #FF7A3D means losses.
- Grounds: bone light, ink #0D0D0D dark. Flat, square corners, no graph paper.

## Captions
One small lowercase mono word at a time, no box, soft shadow. Two to four words share the slot only when she
speaks faster than 0.2s a word. It sits beside her face (the side-word piece); the engine caption is the fallback.

## Motion
Calm. Headline fades and rises 16px over 8 frames; subline follows from frame 6 to 14. Nothing else moves the
camera. Grade: none.

## Sound
Light: a soft pop under each hand-note, nothing under the words.

## Hi-fi
A one-line hook: the headline (her opening words) lands at the top and stays, the mono subline under it. Captions
one word at a time beside her face. No emphasis devices, nothing behind the head, a card only when a number needs
one. The camera stays still; straight cuts with a short J-lead. No black and white.

## Lo-fi
One word on screen at a time, small, lowercase, no box. No text boxes: the headline piece is the hook. Her
screenshots land on top of her sometimes (receipts). No backdrops, no zooms.

## Showcase
The emphatic word scales up from small in Fraunces. Pushes and reveals only, never a whip. An effect on most beats.
The motif is the hand-note: same two slots, same write-on, every time.

## Never
- Big captions, boxes, all caps, neon, whips, words over her mouth or eyes.

## Template pieces
1. **spellbook-title-anchor** (top). Her spoken words, verbatim. Fraunces 900 (`--font-display`), lowercase,
   `--c-light`, letter-spacing -0.02em, line-height 0.98, fitted to the safe width on at most 2 lines, max 150px,
   block top at y 290, centred between x 80 and x 940. Subline: Space Mono (`--font-mono`) 30px, lowercase,
   `--c-light`, letter-spacing 0.04em, 22px under the headline. In: headline opacity 0 to 1 and y +16 to 0 over
   frames 0 to 8; subline opacity over frames 6 to 14. Held to the end of the reel. Shadow 0 6px 28px
   rgba(13,13,13,.55).
2. **spellbook-side-word** (top, carries the words: `KARAOKE["hide"]` over the whole reel). One word at a time,
   Space Mono 400 (`--font-caption`), 42px, lowercase, `--c-light`, left aligned at x 80, vertically centred on
   y 760. Hard swap on each spoken word, no entrance. When words come faster than 0.2s each, group the fewest words
   (max 4) that keep every word on screen at least 0.2s; a group shorter than 6 frames merges into the next.
3. **spellbook-hand-note** (top). Her spoken aside, verbatim. Caveat 600, 68px, butter #F5E6A3 (closest token:
   `--c-s3`), line-height 1, max width 600, shadow 0 3px 14px rgba(13,13,13,.45). Two slots, alternating: left
   (x 80, top y 1150, rotate -5 deg, text then arrow) and right (right margin 140, top y 1010, rotate +4 deg,
   arrow then text, right aligned). Write-on: a clip-path inset opening left to right (right slot: right to left)
   over 18 frames. Arrow: SVG path `M8 92 C 40 88, 86 70, 108 22 M 108 22 L 84 32 M 108 22 L 116 48` in a 130x110
   box, stroke 5, round caps, drawn by dash offset from frame 14 to frame 28, mirrored on the right slot. Whole note
   settles from scale 0.96 to 1. Hold 1.8s, hard out.
