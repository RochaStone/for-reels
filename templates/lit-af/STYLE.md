# Lit AF

Loud and on the beat. Big Anton capitals in the lower third, every spoken word lighting hot pink on its frame,
one word per line landing big, and her strongest line taking over the whole screen one word at a time. Her brand
palette: ink, bone, hot pink.

## Type
- Display, text and captions: Anton 400, uppercase.
- Mono: Space Mono 400: numbers, kickers.

## Colour
- Bone #F5F0E8 for the words, hot pink #FF4FA3 for the word being spoken and the popped word (accent).
  Lime #C9F24D gains, orange #FF7A3D losses. Grounds: bone and ink #0D0D0D, square corners.

## Captions
Anton caps 96px, letter-spacing 1px, line-height 1.05, centred on y 1330 (line top about 1272), no box, shadow
0 6px 28px rgba(13,13,13,.55). Three words a line, four at most. The spoken word is hot pink; when the next line
starts the old one lifts a row and softens.

## Motion
Calm on the beat. Words enter in 6 frames (scale 0.92 to 1); the keyword eases to 1.12x, no overshoot. Grade: none.

## Sound
Normal density: a soft click under each keyword, a low impact under the takeover.

## Hi-fi
A one-line hook: the takeover opens the reel when her first line is a declaration. Captions in short phrases with
`big` used for the keyword. Words behind the head sometimes, in Anton. Cards rarely. Hard zooms on the phrases
that matter, no settles. Short J-cuts.

## Lo-fi
Word by word, four words or 22 characters a line, uppercase Anton, no box. No text boxes. Screenshots and
backdrops sometimes, hard zooms on every line that lands.

## Showcase
The emphatic word lands whole, hot pink, a scale ease. Zooms and pushes on the cuts. Busy: an effect on every beat.
The motif is the keyword.

## Never
- Small type, serif captions, soft fades, pastel boxes, overshoot or bounce on any word.

## Template pieces
1. **lit-af-rolling-caption** (over, carries the words: `KARAOKE["hide"]` where it runs). Anton
   (`--font-caption`) caps 96px, line-height 1.05, letter-spacing 1px, centred between x 80 and x 940 on y 1330.
   Words keep their space before they appear (no reflow): each enters on its spoken frame, opacity to 1 and scale
   0.92 to 1 over 6 frames (no overshoot). The word being spoken is `--c-accent`, the rest `--c-light`. When the
   next line starts, this one moves up by 1.35 line heights and drops to 55% opacity over 5 frames for the rest of
   its hold. Shadow 0 6px 28px rgba(13,13,13,.55).
2. **lit-af-keyword-pop** (over, inside the caption line). One word per line: scale 0.86 to 1.12 over 8 frames,
   power3.out, no overshoot, origin 50% 60%, stays `--c-accent` while the line holds.
3. **lit-af-takeover** (over). Her strongest declaration, one word per line, each fitted to the safe width
   (x 80 to 940, y 250 to 1440), capped at 45% of the safe height, line-height 0.92, all shrinking together if the
   stack overflows, centred vertically. Footage behind: blur 0 to 14px and a `--c-dark` wash at 62% over 5 frames.
   Each word enters on its spoken frame: opacity 0 to 1, y +24 to 0, scale 0.92 to 1 over 6 frames. Last word
   `--c-accent`, the rest `--c-light`. Hard out at the end of the line.
