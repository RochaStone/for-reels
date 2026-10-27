# The Altar

Soft daylight, warm and flirty, identity-led. A moodboard of her photos frames her face (a top band, a left column,
a right column) and swaps with every clause, the tiles popping on one by one. One spoken word at a time in white
brush script on her chest. A "selected text" hook card dragged in by a cursor, and a notes-app card with a pink
highlight, as full-attention moments. Both are real app surfaces; nothing drawn sits on them.

## Type
- Display and captions: Nanum Brush Script 400, lowercase except names.
- Text: Archivo 500: the hook card (Inter Tight in the reference, banned) and labels; the notes card uses Archivo
  800.
- Mono: Space Mono 400.

## Colour
- White #FFFFFF script words. Pink #E85CB0 accent (the notes highlight handles). Hook card: cream #F8F8E0 text on
  selection blue rgba(156,184,252,.72) with #3B6CF5 handles. Notes card: #FDFCFE with yellow #D9B800 header and pink
  #F8BCE4 highlight. Green #7FD18B gains, amber #F2A33A losses. Square corners on tiles.

## Captions
One word at a time (two for a name), 118px, centred on y 1380, about 0.28s a word, hard swaps, no box.

## Motion
Calm. Hard cuts only: tiles cut in 2 frames apart; a new collage every clause (about 2.2s). The hook card is the only thing that
slides. Static camera. Grade: none.

## Sound
Normal: a soft click per tile, a slide under the hook card, a click under the notes card.

## Hi-fi
A one-line hook: the selected-text card. Captions one word at a time. No emphasis devices, nothing behind the head,
cards rarely. Still camera, very short J-lead.

## Lo-fi
One word at a time, brush script. No text boxes. The collage on top often. No backdrops, no zooms.

## Showcase
The emphatic word slams in whole. Hard cuts only. Busy: a new collage every clause. The motif is the moodboard.

## Never
- Tiles in the face window, borders, rounded tiles, rotation, shadows on tiles, photos that are not hers, stickers
  or decoration on the cards, any bounce.

## Template pieces
1. **the-altar-tiles** (top). 4 to 7 of her photos per clause (a clause is up to 8 words, at least 1.2s). Zones:
   top band y 110 to 760 full width (2 to 3 images, max 520 tall), left column x 0 to 310 (y 430 to 1360), right
   column x 660 to 1080 (y 520 to 1500, may bleed). Face window default x 310 to 670, y 760 to 1300 (per reel): no
   tile enters it. Tiles 250 to 550px wide, mixed aspects, 0 to 8px gaps, bleed up to 30px off the edges, no
   border, radius 0, no rotation, no shadow. Swap: the old set goes at once, 1 frame of bare face, then tiles
   hard-cut on 2 frames apart, top left, top right, then sides. Finale mode: one tile per spoken list word,
   accumulating.
2. **the-altar-selected-text-hook** (top). Her hook line. A text box with a dashed blue bounding box and square
   handles slides in from the right edge with a black and white arrow cursor over 16 frames (ease out), lands with
   its top at y 487, then switches in 1 frame to selected: highlight rgba(156,184,252,.72) block x 48 to 1037 (to
   about y 676), 26px #3B6CF5 handle dots top left and bottom right with 3px bars. Text `--font-text` 500 92px,
   cream #F8F8E0, letter-spacing -0.02em. Held 5s, hard out on the first collage.
3. **the-altar-notes-card** (top). Her notes line. A #FDFCFE card, radius 22, x 122 to 917 (795 wide), top y 385,
   padding 26 40 40, faint grey shadow. Header row: "< Notes" with share and more icons in #D9B800. One line in
   Archivo 800 80px, near black #1C1A1F (`--c-ink`), on a #F8BCE4 selection highlight with #E85CB0 handles. A
   No sticker, no pin, no decoration. Hard in, hard out, about 1.8s.
4. **the-altar-text-cascade** (top, not in the source build). 6 white text screenshots, each 650 to 750px wide,
   zig-zagging x 0 and x 330 down y 80 to 780, popping on one at a time 3 to 6 frames apart, all cut together at
   the next collage.
