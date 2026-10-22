# The Offering

An offer told plainly. A small white italic running caption, a bold centred statement with its key words in a
giant copperplate script under it held for the opening, receipts (screenshots) cut in below her face, and a big
two-line comment call to action. Her face and mouth always clear: type sits above her head or low on her body.

## Type
- Text and captions: Arimo 400 italic, sentence case (stands in for Helvetica Neue, which is not free).
- Display: Pinyon Script 400: the giant script words, the thesis.
- Mono: Space Mono 400. The CTA uses Arimo 700.

## Colour
- White #FFFFFF everywhere; emphasis is carried by the script face, not a colour (accent is white on dark, ink on
  light). Green #7ED957 gains, red #FF6B5E losses. Grounds #FFFFFF and #111111, square corners.

## Captions
A few words at a time, 44px italic, left at x 80, low on her body (centre y 1010), no box, shadow 0 2px 14px
rgba(0,0,0,.55) plus 0 0 3px rgba(0,0,0,.35). Words appear as spoken.

## Motion
Normal. Statement words rise 14px in 6 frames. Grade: none.

## Sound
Normal: a shutter under each receipt, a pop under the CTA.

## Variant: bright
Bone #F5F0E8 statement and caption, the script word in Great Vibes in hot pink #FF4FA3. Her words build up small
and italic top left above her head (a 250px-wide block at y 470, 4 words a phrase, 46px); the statement sits on her
chest (centre y 1080); receipts cascade below (top 1000) and can spring onto a halo arc. The CTA is the loudest
thing in the reel: lime #C9F24D Anton 280px with a 6px ink stroke and a lime glow, pulsing, with a pink Great
Vibes lead line. A lime thought bubble may float in. The glow and stroke are her approved choice; they break the
kit's no-glow, no-outline rule, so the FX build must allow them for this piece only. To use it, swap fonts to
display Great Vibes 400, light #F5F0E8, accent #FF4FA3.

## Hi-fi
A two-line hook: her statement in plain italic over the giant script line, held 7s alongside the caption. Captions
in short phrases. `thesis` is the script word. Nothing behind the head, cards rarely. Still camera, short J-lead.

## Lo-fi
Word by word, 4 words or 24 characters, no box. No text boxes: the CTA piece carries it. Receipts often (CV cards,
her profile, the application form), below her face. No backdrops, no zooms.

## Showcase
The emphatic word scales up from small in the script. Pushes, drops and reveals. An effect on most beats. The
motif is the receipt under her face.

## Never
- Type over her face or mouth, invented CTA words (her written words only), Inter.

## Template pieces
1. **the-offering-running-caption** (top, `KARAOKE["hide"]` over the reel). `--font-caption` (Arimo italic 400) 44px,
   `--c-light`, left aligned at x 80, centred on y 1010, line-height 1, up to 4 words, each word appearing on its
   frame. Bright variant: 46px, bone, a 250px-wide block anchored at top y 470, wrapping, line-height 1.08, building
   4 words a phrase.
2. **the-offering-statement** (top). Her opening statement centred x 80 to 940 on y 400 (bright: 1080), Arimo italic
   max 60px, line-height 1.02, `--c-light`; key words in `--font-display` at 3x (180px), line-height 0.9, on their
   own line under it (bright: Great Vibes, hot pink). Each word: opacity and y +14 to 0 over 6 frames on its
   spoken frame. Held 7s, coexisting with the running caption.
3. **the-offering-cta** (top). Her written CTA, two lines: lead line at 0.45x (63px) with 8px gap over Arimo 700 140px,
   `--c-light`, centred on y 400, opacity and y +12 to 0 over 8 frames, the last 2.5s. Bright variant: centre
   y 1080; main line Anton 280px lime #C9F24D, 6px #0D0D0D stroke (paint order stroke then fill), glow 0 0 28px and
   0 0 60px rgba(201,242,77,.7); lead line Great Vibes in hot pink at 0.42x, rotated -4 deg, margin-bottom -18px.
   Springs on with an overshoot over 12 frames (damping 8, stiffness 180), pulses scale 1 + 0.07 sin(4 pi t) and
   tilts 2.5 sin(2 pi t) deg, scales to 0 over its last 6 frames.
4. **the-offering-thought-bubble** (top, Bright variant). A cloud: fill lime #C9F24D, 4px ink border, radius
   48% 52% 46% 54% / 58% 50% 50% 42%, padding 18 34 22, shadow 0 12px 30px rgba(0,0,0,.4), Caveat 700 62px ink,
   line-height 0.95. Tail of two circles (30px and 18px, 3px ink border) towards her head (left, right or down).
   Springs on over 14 frames (damping 7, stiffness 160), wobbles 3 sin(1.6 pi t) deg and bobs 6 sin(1.2 pi t) px.
5. **the-offering-halo-receipts** (top, Bright variant). Receipts (max 860x440) spring out of a deck above her head into
   slots on an arc centred (540, 840), radius 500, spread 52 deg between slots, each card 330x165, rotating to
   follow the curve. The running caption pauses while a card flies.
