# Love Letter

A letter read aloud over one slow, dimmed shot. Each whole phrase appears in small white serif, centred, as it is
spoken, holds a breath after the last word, then fades; the silence between phrases stays empty. Built for voice
recordings over her own footage or calm b-roll, and works on talking footage too.

## Type
- Display, text and captions: Source Serif 4, 400, sentence case.
- Mono: Space Mono 400 (rarely needed).

## Colour
- White #F8F8FC words. A soft wheat #E9D8A6 accent, used almost never. Sage #9CC9A8 gains, clay #E8857A losses.
- Grounds: #F8F8FC and #0E0E10, square corners.

## Captions
The whole phrase at once, 68px, line-height 1.18, wrapped near 600px (balanced lines), centred on y 960, no box,
shadow 0 2px 12px rgba(0,0,0,.35). Up to 7 words.

## Motion
Calm. 6-frame fades, about 9s a shot. Grade: the footage at half brightness (`brightness(0.5)`), which is the
template's dim.

## Sound
Light: nothing under the words; a soft room tone or nothing at all.

## Hi-fi
No hook device. Whole lines, no emphasis devices, nothing behind the head, cards rarely. A still camera. The
longest J-lead.

## Lo-fi
The whole phrase lands at once, 7 words or 40 characters. No text boxes, no overlays. Calm footage swapped in
behind her often. No zooms, no black and white.

## Showcase
The emphatic word scales up from small, slowly. Reveals and pushes only. An effect on most beats, every one of them
quiet. The motif is the breath: the empty screen between phrases.

## Never
- People on camera in the backdrop shots, boxes, colour on words, anything fast.

## Template pieces
1. **love-letter-quiet-line** (over, `KARAOKE["hide"]` over the reel). The whole phrase (max 7 words) in
   `--font-caption` 68px, `--c-light`, line-height 1.18, text-wrap balance, a 600px-wide block centred on x 540 and
   y 960. In on its first word: opacity 0 to 1 over 6 frames. Held until 0.45s after its last word, then opacity
   1 to 0 over 6 frames. Nothing between phrases. Minimum on screen 0.3s a word.
2. **love-letter-calm-backdrop** (cam). For voice-only reels: one calm clip (scenery, objects, animals, no people,
   at least 4s long, quality 3 or more) for about 9s at a time, hard cut between shots, under the pack grade
   (half brightness).
