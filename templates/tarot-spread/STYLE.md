# Tarot Spread

Teaching to camera in numbered points. A white serif series title top left for the opening, one spoken word at a
time on her chest in a Didone set hard, and square cards on real paper (a quote, a headline, a note on the pink
notebook page, a black paragraph, a translucent box, a wide line) that hard-cut into the top third above her head. Images
cut in beside her head or across her chest. Everything is a hard cut.

## Type
- Display: Instrument Serif 400, title case: the series title.
- Text: Cormorant Garamond 500: quote, black and wide cards (stands in for EB Garamond and Libre Caslon).
- Caption: Bodoni Moda 400, lowercase: the one-word caption, headline and greige cards.
- Mono: Space Mono 400.

## Colour
- Warm white #FCF8F6 ground with ink #1A1A1A, black #000000 dark ground. Greige #E4D6D3 is the accent (a deeper
  #8A6A63 on light). Sage #8CC09A gains, red #E0645C losses. Grey #777777 sublines, #BDBDBD rules. Square corners,
  no shadows, no borders.

## Captions
One word at a time, white, 104px, centred on y 1340, hard swaps, about 0.4s a word. No box; the hard 3px black
offset shadow: a soft dark shadow only so it reads (the word piece). No drawn fill where paper can carry a card.

## Motion
Calm. Zero frames of animation: every card, image and word hard-cuts in and out. Static camera, a few jump cuts.
Grade: none.

## Sound
Light: a soft click on each card.

## Hi-fi
A one-line hook: the series title, 3.4s, never again. Captions one word at a time. Cards often: a card for each
beat of each point, then a 13s stretch without. Nothing behind the head. Still camera, short J-lead.

## Lo-fi
One word at a time. Text boxes on: the translucent card is the native text box. Cards and images land on top
often. No backdrops, no zooms.

## Showcase
The emphatic word slams in whole. Hard cuts only. An effect on most beats. The motif is the quote card.

## Never
- Rounded corners, borders, offset shadows, rotation, fades, card text she did not say or write, drawn fills where
  real paper can carry the card.

## Template pieces
1. **tarot-spread-title** (top). Her series title. `--font-display` 118px, `--c-light`, left aligned at x 120, top
   y 250, max width 720, line-height 1.0, no box. Hard in at 0, hard out at 3.4s.
2. **tarot-spread-card** (top). Square-cornered card, bottom edge 40px above her hairline (default y 640). The white,
   headline and wide kinds sit on a real cream card print (`kit/material/card-cream.jpg`, cropped to the card, its
   own paper grain and edge); the greige kind sits on the pink notebook page (`kit/material/notebook-pink.jpg`);
   black and translucent stay flat grounds. Hold:
   max(2.5s, 0.25s a word + 1.5s), at most 10s. Positions: left x 110 w 600; centre x 240 w 600; right x 460 w 560;
   wide x 65 w 950. Kinds:
   - white: bg #FCF8F6, ink #1A1A1A, Cormorant Garamond 500 64px, line-height 1.15, centred, padding 56, key words
     italic.
   - headline: bg #FCFCFC, ink #1A1A1A, Bodoni Moda 400 caps 80px, line-height 0.95, centred, padding 56; a
     #BDBDBD hairline with a small diamond, then an italic Bodoni subline 28px #777777.
   - greige: bg #E4D6D3, ink #1A1A1A, Bodoni Moda 400 60px, line-height 1.5, left, padding 60, underlined words.
   - black: bg #000000, white, Cormorant Garamond 500 44px, line-height 1.5, left, padding 64.
   - translucent: bg rgba(0,0,0,.7), white, `--font-text` 44px (Archivo 500 in the source, Inter in the
     reference), line-height 1.3, left, padding 40, bold key phrases.
   - wide: bg #FCFCFC, ink #222222, Cormorant Garamond 500 48px, line-height 1.25, left, padding 70.
   Colours map to tokens where they can (`--c-light`, `--c-ink`, `--c-dark`, `--c-accent` for greige, `--c-box`
   for translucent); #FCFCFC and #222222 are the only extras. Cards can butt straight into the next.
3. **tarot-spread-image-inlay** (top). Her real images, square corners, no frame: beside her head on the right
   (x 661 to 1080, y 600 to 1200, bleeding off the edge) or a wide strip over her chest (x 68 to 1067, y 1269 to
   about 1440). Diagrams may cover her face for 3 to 4s. Hard cut.
4. **tarot-spread-didone-word** (over, `KARAOKE["hide"]` over the reel). `--font-caption` 104px lowercase,
   `--c-light`, centred on y 1340, line-height 1, text-shadow 0 3px 22px color-mix(in srgb, var(--c-dark) 55%,
   transparent) (no offset shadow, no outline), one word, hard swap.
