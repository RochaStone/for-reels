# One Word Oracle

One big word at a time, dead centre. A white neo-grotesque lowercase word cuts in on every spoken word, the key
words switch to a pale-yellow italic serif at about twice the size, the opening line is stacked big in both faces,
and small real handwritten asides (photographed, not a font) with a marker arrow sit in the top corners. An exact replica of the reference:
the fonts and colours are the reference's, not her brand (she asked for exact).

## Type
- Text and captions: Arimo 600, lowercase (stands in for Helvetica Neue, which is not free).
- Display: Instrument Serif italic 400: the emphasis words, the thesis.
- Mono: Space Mono 400: numbers, kickers.
- Hand-note: no font. The creator's own handwriting as a photographed or generated PNG (see the piece).

## Colour
- White #FCFCF8 words, pale yellow #FCE474 for emphasis (accent). Green #7ED957 gains, red #FF6B5E losses.
- Grounds: #FCFCF8 and #121212, square corners.

## Captions
One word at a time, 112px, centred on y 960, no box, shadow 0 2px 18px rgba(0,0,0,.6) plus 0 0 4px
rgba(0,0,0,.35). A phrase shrinks to fit a 380px width. Words appear on their spoken frame only.

## Motion
Normal. Hard swaps, the hook stack rises 14px per word. Grade: none.

## Sound
Normal: a soft click on each emphasis word, a pen scratch under the hand-note.

## Variant: high
Type lifted above her head (never over the mouth): the word centred on y 400; the hook on y 400
and never on screen together with the word caption.

## Variant: brand
The same rhythm in her brand: Anton 400 lowercase in bone #F5F0E8 at 132px on y 1180, emphasis in Fraunces 900
italic in butter #F5E6A3 at 1.08x, hook max 118px on y 1020, hand-notes as real handwriting in the top corners.
To use it, swap fonts to display Fraunces 900 italic, text and caption Anton 400, accent #F5E6A3, light #F5F0E8.

## Hi-fi
A two-line hook: the opening line stacked big, plain words in Arimo and the key words in the yellow italic serif.
Captions one word at a time, centred and big. `thesis` is the yellow italic word, often. Nothing behind the head,
cards rarely, a still camera that cuts between angles on sentences. Short J-lead.

## Lo-fi
One word at a time, big, centred, 12 characters at most, no box. No text boxes. Receipts and UI screenshots land on
top sometimes. No backdrops, no zooms.

## Showcase
The emphatic word scales up from small in the yellow italic. Pushes, drops and reveals. An effect on most beats.
The motif is the white hand-note in the top corner.

## Never
- Boxes, all caps, colour on plain words, type over her mouth in the high variant.

## Template pieces
1. **one-word-oracle-center-word** (over, `KARAOKE["hide"]` over the reel). Arimo 600 (`--font-caption`) 112px,
   lowercase, `--c-light`, letter-spacing -0.01em, centred x 80 to 940 on y 960 (high: 400; brand: 1180).
   Multi-word groups fit to 92% of a 380px width, never larger than 112px. Emphasis words: Instrument Serif italic
   (`--font-display`), `--c-accent`, size x2.05, letter-spacing -0.03em. Each word hard-appears on its frame.
   Shadow as above. Grouping: one word ideal, up to 4 when faster than 0.2s a word.
2. **one-word-oracle-hook-stack** (top). Her opening line, stacked centred x 80 to 940, centre y 420 (high: 400; brand:
   1020), 100px (brand 118), line-height 1.02, Arimo 600 lowercase `--c-light`; emphasis words in Instrument
   Serif italic `--c-accent` at 1.6x, line-height 0.9. Each word: opacity 0 to 1 and y +14 to 0 over 6 frames on
   its spoken frame. Hard out when the line ends.
3. **one-word-oracle-hand-note** (top). A real handwritten aside: the creator's own hand, photographed on paper
   and cut out, or generated from their reference, as a PNG about 600px wide; the kit's placeholder arrow is
   `kit/material/marker-marks.png` (the pink marker arrow, cut out). Slots: right (right margin 140, top y 330,
   rotate +4 deg) and left (x 80, top y 420, rotate -5 deg), the arrow pointing down towards her. Hard cut in on its
   word, the footage's grain over it, hold 1.8s, hard cut out. No write-on animation, no font.
