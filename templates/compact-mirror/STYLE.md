# Compact Mirror

Moody, still and slow. A two-line serif title for the opening seven seconds, letters gathering in and drifting
apart. One centred line of her words at chest height filling in word by word, and a rounded 5:3 image card under it
that changes with each idea, about every six seconds. The calm comes from the stillness: only the words and the
cards change. Film it dark: one warm side light, a dark wall.

## Type
- Display, text and captions: Cormorant Garamond 500, sentence case (Title Case for the title).
- Mono: Space Mono 400.
- Label: Libre Baskerville 700 caps (a fifth face, loaded by the label piece).

## Colour
- Warm white #FBFAF6 title, near white #FBFBFD words. A warm gold #D9B26A accent, used rarely. Sage #8FB8A8 gains,
  clay #D9655A losses. Grounds #FBFAF6 and #120A0A, 18px corners.

## Captions
One line, 82px, centred on y 960, max 4 words (5 at the most), no box, no shadow. The phrase is laid out centred
first; each word appears in its final place as it is spoken (unspoken words are transparent), then the line clears.

## Motion
Calm. Title in over 9 frames, out over 36 frames. Words and cards hard-cut. Static camera with jump cuts that may
coincide with a card change. Grade: none; for footage lit too bright, use the low-key look
`brightness(0.82) contrast(1.15) saturate(0.95) sepia(0.05)` plus a vignette (CSS cannot vignette in `grade`).

## Sound
Light: nothing on the words; a soft whoosh under the title out.

## Hi-fi
A two-line hook: the title, line two smaller and right aligned, behind her head, 7s. Captions in short phrases,
filling in word by word. No emphasis devices. Behind the head sometimes (the title). Cards rarely: the image card is
the visual. Still camera, long J-lead.

## Lo-fi
Word by word in the pre-laid line, 4 words or 26 characters. Text boxes for the closing label. The image card on
top often. No backdrops, no zooms.

## Showcase
The emphatic word scales up from small, slowly. Reveals only. An effect on most beats, all of them quiet. The motif
is the image card.

## Never
- Ken Burns moves on the cards, fades on the words, bright footage, anything that bounces.

## Template pieces
1. **compact-mirror-title** (behind, needs CUT_WINDOWS). Her two lines. `--font-display` (Cormorant Garamond 500),
   `--c-light`, line one 200px with cap top at y 282 (baseline about 410), x 206 to 883; line two at 0.68x
   (136px), right aligned to x 883, baseline about 520. Soft glow 0 0 16px rgba(255,255,255,.4). In: letters
   reveal right to left with tracking collapsing from wide and blur 10px to 0 over 9 frames; line two 0.4s later,
   same move. Held 7s from 0.2s. Out over 36 frames: tracking expands (+0.25em drift) and each letter blurs (to
   12px) and fades, left to right, line one first.
2. **compact-mirror-card** (top). Her photos, art she chose or her b-roll clips. 600x362 (5:3), radius 18
   (`--radius`), centred x 240 to 840, top y 1040, no border, no shadow, full opacity. Hard cut; each new card
   replaces the last in one frame, never an empty gap after the first. First card on her second phrase (about
   0.7s). One card per idea, about 6s (2.3 to 10s), cut at the start of a sentence, often a beat before the noun.
3. **compact-mirror-label** (top). Her closing words on the last card for its last 3s: a box a little wider than
   the card (about 625x71) sitting on the card's bottom edge, `--c-tb-bg` #FEFEFD, `--c-tb-ink` #000000,
   Libre Baskerville 700 caps 46 to 52px, slight tracking, square corners, with a 20x17 speech tail centred under
   it. In: a mask reveal upward from its bottom edge over 6 frames, then static.
