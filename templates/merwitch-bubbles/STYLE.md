# Merwitch Bubbles

Talking head in a warm room. Every 1.5s or so one spoken word blows up huge in its own type voice, above her head
or on her chest, while a small heavy caption builds word by word lower down. Her face is never covered. Cuts punch
in. Soft and premium, never a cartoon pop. Three looks: bold (default), cool girl, cool dude.

## Type
- Display: Archivo Black 400, lowercase, letter-spacing -0.04em: the yellow and white punch words.
- Text and captions: Archivo 800, letter-spacing -0.02em (the reference face is Inter Tight, banned; Archivo is
  the closest free grotesque and on her loved list).
- Mono: Space Mono 400.
- Punch voices beyond the tokens (loaded by the punch piece): DM Serif Display 400 (serif), Cormorant Garamond 500
  italic (script).

## Colour
- White #FFFFFF words, butter yellow #FAE67A punch words and sparkles (accent). Green #7EE08A gains, red #FF5A4E
  losses. Grounds #FFFFFF and #0D0D0D, 20px corners on cards.

## Captions
76px, centred on y 1330, max 4 words a line, 2 lines at most, no box, shadow 0 3px 18px rgba(0,0,0,.45). Each word
fades in as it is spoken. When a card takes the chest band the caption moves to the top band (y 150 to 500).

## Motion
Punchy. Pops blur in 7 frames and out 6, held about 0.9s. Every other cut pushed in 1.07x. One zoom-blur transition
at a look change. Grade: none (bold).

## Sound
Light: a soft whoosh or pop under punch words, always under the voice (the reference's own rule).

## Looks
- **bold** (default): grade none, punch-in 1.07. Caption Archivo 800 76px white. Punch default yellow.
- **cool girl**: grade faded, `contrast(0.88) brightness(1.04) saturate(0.86) sepia(0.1)` (warm, lifted blacks),
  punch-in 1.05. Caption Archivo 300 58px lowercase cream #FFF8EC on y 1340, 5 words. Punch default script
  (Cormorant Garamond italic yellow with sparkles), serif in cream #FFF8EC.
- **cool dude**: grade moody, `brightness(0.9) contrast(1.12) saturate(0.9)` (darker, deeper shadows), punch-in
  1.08. Caption Archivo 500 30px caps, letter-spacing 0.45em, #F4EEE3 on y 1380. Punch default serif (DM Serif
  Display cream #F4EEE3) on the chest with a spaced-caps subline. No yellow.
To use a look, set `grade` to its filter and the caption values above.

## Hi-fi
A one-line hook: the first punch word lands by 1.4s over the opening sentence. Captions in short phrases, `big` for
the punch. Words behind the head often: every top-band punch goes behind her head. Cards rarely. Hard zooms
(the punch-ins), very short J-lead.

## Lo-fi
Word by word, 4 words or 22 characters, no box. No text boxes. Screenshots and clips on top often (tilted cards,
scatters). No backdrops. Zooms on every key line.

## Showcase
The emphatic word scales in with a blur (the punch). Zooms and pushes on the cuts. Busy: a punch every 1.5s. The
motif is the punch word.

## Never
- Covering her face, bounce or overshoot, more than one punch on screen, words she did not say, anything below
  y 1600.

## Template pieces
1. **merwitch-bubbles-punch** (behind for the top band, top for the chest band). One spoken word or two, landing on
   its frame. Bands: top centred on y 390 (behind the head), chest centred on y 1180 (in front). In over 7 frames:
   blur 16px to 0, scale 0.9 to 1 (reads as 1.08 to 1 settle), opacity 0 to 1, origin x 540 on the band; out over
   6 frames: blur to 12px, scale +0.04, opacity to 0. Hold about 0.9s. Line-height 0.95, max width 960, shadow
   0 3px 18px rgba(0,0,0,.45). Voices (size fits between min and max to the width):
   - yellow: `--font-display` lowercase `--c-accent`, 140 to 270px, -0.04em, chest band.
   - white: `--font-display` lowercase `--c-light`, 130 to 250px, -0.04em, top band.
   - serif: DM Serif Display 400 lowercase `--c-light`, 120 to 230px, -0.01em, top band; optional subline of the
     next spoken words in `--font-text` 500 32px caps, letter-spacing 0.5em, word by word.
   - script: Cormorant Garamond 500 italic lowercase `--c-accent`, 130 to 230px, -0.01em, top band, with two
     4-point sparkles in `--c-accent` (radius 0.12 x size at x -0.18 x size, y 0.25 x size; radius 0.07 x size at
     x +0.2 x size, y 0.85 x size), each scaling 0 to 1 over 6 frames.
2. **merwitch-bubbles-tilted-cards** (top). 9:16 clips or screenshots with a 4 to 6px white border, radius 20, soft
   shadow, a 26px white label under each. Left card x 0 to 300, y 470 to 990, rotate -7 deg; right card x 770 to
   1060, y 430 to 950, rotate +7 deg. In: fade, blur and scale up over 8 frames, right card 0.25s after the left.
   Out: fade on the cut.
3. **merwitch-bubbles-screenshot-scatter** (top). 5 to 6 screenshots 150 to 260px wide, radius 12, thin white edge,
   tilts within 5 deg, scattered x 20 to 1060, y 1000 to 1500. Each pops scale 0.8 to 1 over 5 frames, 0.15s apart;
   all fade out together.
