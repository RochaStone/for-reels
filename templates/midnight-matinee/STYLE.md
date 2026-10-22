# Midnight Matinee

Slow and wise. Her footage sits as a 16:9 band across a black frame. The key phrase of each sentence goes huge
across the band in condensed serif caps (or a heavy grotesk, a thin sans, a script, an italic), split either side
of her head and tucked behind it, with a smaller second line under it and deep red on the payoff word. The full
sentence runs in small white type in the black below. Every word hard-cuts in with a one-frame strobe. Film
landscape for the true look.

## Type
- Display: Instrument Serif 400, caps, squeezed to 78% width: the anchor face for the big lines.
- Text and captions: Archivo 600, sentence case: the running sentence (Inter in the reference, banned).
- Mono: Space Mono 400.
- Extra voices for the screens piece: Archivo Black 400 (grotesk), Archivo 100 (thin, stands in for Poppins 100),
  Playfair Display 700 italic, Corinthia 700 (script).

## Colour
- White #FFFFFF words, deep red #BC0319 on the payoff group (accent, one group a screen), black #000000 frame.
  Mint #36FFD9 (the logo colour) for gains, orange #FF8A3D for losses. Square corners.

## Captions
The running sentence: 40px, white, top at y 1310 under the band, 6 to 10 words, changing every 3.5 to 4s. No box,
no shadow in the black.

## Motion
Calm. No fades, slides or scales anywhere: hard cuts with a 1-frame strobe (on, off, on). Locked-off camera.
Grade: none.

## Sound
Light: a soft low hit under the red words only.

## Hi-fi
A one-line hook: the first big line across the band. Whole-sentence captions in the black. `thesis` is the red
payoff group. Behind the head often: every top line of the band goes behind her head. Cards rarely. A still camera.
The longest J-lead.

## Lo-fi
The whole sentence lands at once, 10 words or 44 characters. No text boxes, no overlays, no backdrops, no zooms.

## Showcase
The emphatic word is stamped behind her head across the band. Hard cuts only, no camera transitions. An effect on
most beats. The motif is the letterbox band itself.

## Never
- Outlines, shadows, boxes, rotation (except the script), more than 7 words in the band, more than one red group.

## Template pieces
1. **midnight-matinee-band** (cam). The picture becomes a full-width band y 655 to 1265 (1080x610, 16:9) on
   `--c-dark`, hard edges, no border. 9:16 footage is cropped into the band with its focus at 36% from the top.
   Holds the whole reel except the logo card.
2. **midnight-matinee-screens** (behind, needs CUT_WINDOWS). One screen per sentence, about 1.7s each (0.6s
   minimum), a 0.2s gap between screens, held 1.1s after its last word. Rows: main line top at y 690, sub line at
   y 860, mid row at y 980. Main line fills the band width with 14px margins, or splits around the head (head x and
   width per reel, default x 540, width 300): words left of the head right aligned to its left edge, words right of
   it from its right edge. Voices, rotating serif, grotesk, serif, thin so no two screens in a row match:
   - serif: `--font-display` caps 172px, scaleX 0.78, -0.01em; sub 82px, scaleX 0.8.
   - grotesk: Archivo Black caps 150px, scaleX 0.92, -0.05em.
   - thin: Archivo 100 caps 70px, 0.02em, opacity 0.8.
   - italic: Playfair Display 700 italic lowercase 64px.
   - script: Corinthia 700 lowercase 300px, rotate -12 deg, over her chest on the right.
   Words `--c-light`; the payoff group `--c-accent` (thin uses #9F181B, darker because thin). Line 2 adds onto
   line 1 0.5 to 1.2s later; the whole screen clears on the next sentence. Entry and exit: 1 frame on, 1 frame
   off, then on. Top lines behind the cutout; sub lines and mid row in front.
3. **midnight-matinee-sentence-caption** (over, `KARAOKE["hide"]` over the reel). `--font-caption` 600 40px,
   `--c-light`, left at x 80, top y 1310, max width 860, two lines, 6 to 10 words a segment, hard swaps, the last
   one held through the logo card.
4. **midnight-matinee-logo-card** (over). The last 1.4s: band gone, full `--c-dark`, her logo mark about 220px wide
   centred at (540, 960), hard cut in and out.
