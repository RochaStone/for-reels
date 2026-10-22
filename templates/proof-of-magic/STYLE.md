# Proof of Magic

Quiet proof. A tall caps serif hook at the top for the opening seconds only, a tiny lowercase mono word beside her
face, real screenshots cut in hard as receipts while she talks about them, and one plain end line with her call to
action. No handwriting. Her brand palette.

## Type
- Display: Fraunces 900, upright, caps: the hook headline, thesis words, big figures.
- Text and captions: Space Mono 400, lowercase: the small word caption.
- Mono: Space Mono 700: the end line, numbers, kickers.

## Colour
- Bone #F5F0E8 for every word on footage. Hot pink #FF4FA3 accent, used sparingly. Lime #C9F24D gains, orange
  #FF7A3D losses. Grounds bone and ink #0D0D0D, square corners.

## Captions
One small lowercase mono word at a time (38px), no box, beside her face at about a third of the height. Up to four
words share the slot only when she speaks faster than 0.2s a word.

## Motion
Calm. Receipts hard-cut in and out, no fades. Grade: none.

## Sound
Light: a shutter under each receipt.

## Variant: high
For takes where the word would sit over her mouth (never over the mouth). The word caption moves
low to y 1010, and the end line moves above her head: 64px on y 430. Everything else is the same.

## Hi-fi
A one-line hook: the caps headline at the top for 4s, then gone. Captions one word at a time beside her face. No
emphasis devices, nothing behind the head, cards rarely. Still camera, short J-lead, no black and white.

## Lo-fi
One word at a time, small, lowercase. No text boxes: the end line piece carries the CTA. Receipts often: her real
screenshots (profile, comments, an older reel, view counts) cut in hard on the word. No backdrops, no zooms.

## Showcase
The emphatic word scales up from small. Pushes and reveals only. An effect on most beats. The motif is the
receipt.

## Never
- Handwriting, big captions, invented CTA text (the CTA is her written words, or nothing).

## Template pieces
1. **proof-of-magic-hook-title** (top). Her words. Fraunces 900 (`--font-display`), uppercase, `--c-light`, fitted on at
   most 2 lines, max 118px, line-height 0.98, letter-spacing -0.02em, block top y 290, centred x 80 to 940. Subline
   (optional): Space Mono 28px lowercase, letter-spacing 0.04em, 20px under. In: opacity and y +16 to 0 over
   8 frames; subline frames 6 to 14. Held 4.0s, hard out.
2. **proof-of-magic-side-word** (top, `KARAOKE["hide"]` over the reel). Space Mono 400 (`--font-caption`) 38px,
   lowercase, `--c-light`, left aligned at x 80, centred on y 700 (high: y 1010). Hard swap per word; merge rule
   as in spellbook (min 0.2s a word, max 4 words, groups under 6 frames merge forward). Shadow 0 6px 28px
   rgba(13,13,13,.55).
3. **proof-of-magic-end-line** (top). Her written CTA only. Space Mono 700 (`--font-mono`) 40px, `--c-light`,
   line-height 1.2, centred x 80 to 940 on y 1330 (high: 64px on y 430). In: opacity 0 to 1 and y +12 to 0 over
   8 frames. The last 2.5s of the reel. Two lines: the first at 0.45x as a lead-in, 8px gap.
