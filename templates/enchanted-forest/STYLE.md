# Enchanted Forest

The showcase look in deep forest green. A huge cream serif in caps behind her head on a flat green ground for the
hook, a boxed serif caption on her chest where the word being spoken turns gold, and a motion graphic on nearly
every beat: a prompt bar typing her instructions, icons struck through, a magazine cover, a timeline, a file drop,
an odometer, a grid, a page scroll, a comment thread, giant captions, a video card and a comment CTA. A sound under
every visual moment. First-pass look from key moments; a frame-by-frame spec is still to do.

## Type
- Display: Instrument Serif 400, caps: the hook words behind the head, thesis words, big figures.
- Caption: Fraunces 600, sentence case: the boxed caption.
- Text: Archivo 700: labels, the prompt bar, text boxes.
- Mono: Space Mono 400: numbers, timecodes, kickers.

## Colour
- Forest green #1B3A2D ground and caption box, cream #F3ECDB type, gold #D4A53C on the payoff word and the spoken
  word (accent). Red #E5604F for strikes and losses, soft green #9FD49A for gains. 10px corners.

## Captions
One serif line in a green box at her chest, 66px, words lighting as she speaks them, the current one gold, the
spoken ones cream, the rest waiting dim.

## Motion
Punchy. Something new every 2 to 4s, hard zooms on key phrases. Grade: `contrast(1.05) saturate(0.95)`.

## Sound
Dense: a sound under every visual moment.

## Hi-fi
A one-line hook: one huge cream serif line behind her head. Captions in phrases; thesis, big and strike all in use.
Behind the head often. Cards sometimes. Hard zooms. Short J-cuts.

## Lo-fi
Word by word in the green box, 4 words or 24 characters. Cream text boxes for the hook and the comment CTA.
Overlays often, backdrops sometimes, zooms on the lines that land.

## Showcase
The emphatic word (never, single, every) stamped letter by letter behind her head on the green ground. Every
transition in the set. Busy: an effect on every beat. The motif is the prompt bar.
Library effects that carry this look: `kinetic-hook` (+ front) for the green hook, `word-stamp`, `prompt-bar`,
`icon-strike`, `magazine-cover`, `nle-timeline`, `file-drop`, `odometer-recursion`, `grid-collapse`,
`page-scroll`, `comment-thread`, `giant-captions`, `video-card`, `comment-cta`, `mood-curtain` ("the colours go
dark"), `camera-transitions`.

## Never
- Gradients, glows, neon, invented stats, other creators' posts without their permission.

## Template pieces
1. **enchanted-forest-current-word** (over, `KARAOKE["hide"]` over the reel; or an extension of the lo-fi captions).
   The lo-fi caption line as the engine draws it (`--font-caption` 66px, `--c-box` box, `--radius` corners, top
   y 1300, max 4 words or 24 characters), with one change: the word being spoken is `--c-accent` from its start to
   the next word's start, then settles to `--c-box-ink`; words not yet spoken stay `--c-box-dim`. The colour
   switches are `tl.set` on word times, no tween.
