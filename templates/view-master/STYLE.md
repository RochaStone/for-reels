# View-Master

Her voice over her own b-roll. A new shot every phrase (0.6 to 1.5s), her face back every few phrases, flash-cut
bursts on the hero words, and phrase captions that build word by word: small white narration inline, big white key
words on their own line, giant blue condensed hero words with an oversized first letter. A flat blue end card.

## Type
- Caption (narration): Arimo 500, 66px, letter-spacing -0.04em (stands in for Helvetica Neue).
- Text (big words): Arimo 600, 132px, letter-spacing -0.05em.
- Display (hero words): Anton 400, 190px, caps, letter-spacing -0.02em, first letter at 1.35x.
- Mono: Space Mono 400.

## Colour
- White #FFFFFF words. Hero blue #1038F8 (`accent_on_light`, also the end card and the text box); the accent on
  dark grounds is nudged lighter to #2F55FF so it reads on black. Green #3DDC84 gains, red #FF5A4E losses.
- Grounds: white and #0A0A0A, square corners.

## Captions
The phrase builds around y 900, words hidden until spoken, max 5 words, no box, shadow 0 2px 16px rgba(0,0,0,.45).
A break when the gap between words is over 12 frames. At most 2 emphasis words a phrase.

## Motion
Calm. Cuts every phrase, bursts of 8 cuts x 2 frames on hero words. Grade: none (her b-roll keeps its own look).

## Sound
Normal: a whoosh on the burst, a low hit on hero words, nothing on ordinary cuts.

## Hi-fi
No hook device: the first phrase carries it. Captions in phrases, `big` for her key words, `thesis` for the 1 to 3
hero words a reel. Nothing behind the head, cards rarely (the end card only). Pushes instead of settles. Very
short J-lead.

## Lo-fi
Word by word, 5 words or 28 characters, no box. Her b-roll swaps in behind her head often (backdrops) since lo-fi
keeps her in frame; screenshots on top sometimes; pushes.

## Showcase
The emphatic word lands whole in blue Anton, a scale ease, no overshoot. Pushes and zooms on the cuts, never a
whip or spin. Busy. The motif is the flash
burst.

## Never
- Her face for more than four phrases in a row, b-roll of proof-of-work screens, invented end card text (her
  words or the series name only).

## Template pieces
1. **view-master-yap-phrase** (over, `KARAOKE["hide"]` where it runs). A centred flex row between x 80 and 940,
   centred on y 900, column gap 0.28em, baseline aligned. Narration words: `--font-caption` 66px, lowercase,
   `--c-light`, line-height 1.1, inline. Big words: `--font-text` 132px lowercase, own line, line-height 0.92.
   Hero words: `--font-display` 190px caps, `--c-accent-light` (#1038F8 over footage), own line, first letter
   1.35em at line-height 0.8. Each word hard-appears on its spoken frame. Shadow 0 2px 16px rgba(0,0,0,.45).
2. **view-master-broll-cuts** (cam). Her b-roll clips (quality 3 or more, no proof-of-work, max 5s from any
   source) replace the picture, a new shot each phrase, 1.5s max a shot, her live face back every 4th phrase.
   Clips start at their best moment and play at 1x.
3. **view-master-flash-burst** (cam). On a hero word: 8 cuts of 2 frames each through different b-roll clips,
   landing on the next shot.
4. **view-master-end-card** (over). Flat `--c-accent-light` (#1038F8) for 1.2s. Her words or the series name in
   `--font-display` 96px, `--c-light`, letter-spacing 0.02em, centred, line-height 1, opacity 0 to 1 over frames
   3 to 10. Clean stop, no fade out.
