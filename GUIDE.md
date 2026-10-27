# For Reels
### Rocha's Editor Kit (is lit AF)

You film one take of yourself talking.
Your AI editor cuts it, captions it, puts words behind your head, adds motion graphics and sound,
and shows you a storyboard before anything is made.
You leave notes, say go, and the finished reel lands next to your clip.

It runs on your own computer, on your own footage.
Nothing is uploaded anywhere.

---

## Part 1. Install it (give this to your Claude)

You don't install this by hand.
Open Claude Code (or Codex, or the Claude or ChatGPT desktop app) and paste the block below.
Your AI does the rest and tells you if it needs anything from you.

```text
Please install the For Reels video editing skill for me.

1. Get the kit from https://github.com/RochaStone/for-reels.
   - Claude Code: put the folder at ~/.claude/skills/for-reels
   - Codex: put the folder at ~/.agents/skills/for-reels
   - Claude desktop (Cowork) or ChatGPT Work: I will upload the zip as a skill myself. Tell me where to click.
2. Run: python3 <kit folder>/setup/setup.py
   Repeat until it prints READY. If something is missing it prints the exact fix: do it for me,
   or tell me in one plain sentence what I need to do.
3. If you run commands in a sandbox (Codex, ChatGPT Work), ask me to turn on Full access: rendering needs a browser.
4. When it says READY, tell me "Installed" and ask me for my first clip. Don't start my style setup until I send one.
```

What it needs on your computer: a Mac or Linux machine with ffmpeg, Node 22 or newer and Python 3.10 or newer.
If any are missing, your AI will install them or tell you exactly how.
The first setup downloads a few GB (a render browser and the speech model). Once only.

**Best results:** use the strongest model on its highest effort.
In Claude Code, start it with `claude --model opus --effort max`.

---

## Part 2. Using it

### Your first video sets up your style

The first time, before any video, it builds your style pack. It asks for one of these:

1. **A brand file**: brand guide, PDF or your website. It reads your fonts and colours.
2. **No brand file?** Send 2 or 3 links to reels whose style you love. It studies their pace, captions, colour and motion.
3. **Neither?** It asks you four quick questions.

Then it shows you a **style board**: your type, your colours, a frame of your footage in each mode.
Tell it what to change until it looks like you.
You do this once. Change it any time by saying **"update my style"**.

### Make a reel

Say three things: the mode, the clip, and what it's about.

> Make a lo-fi reel from ~/Movies/take-3.mov. It's about why I stopped posting daily.

Add a template if you want a specific look:

> Make a showcase reel from take-3.mov in the view-master template.

### The three modes

| Mode | Best for | What you get |
|---|---|---|
| **Hi-fi** | A sit-down take on a camera | A produced edit: two framings from one camera, full-screen data cards, words behind your head |
| **Lo-fi** | A phone selfie | You stay in frame; screenshots and clips land on top of you or behind your head; captions light up word by word; text boxes for the hook and call to action |
| **Showcase** | Any footage, when you want to impress | A different motion graphic on every line (13 effects), a different transition on every cut, rich sound |

If you don't say a mode, it asks: "Hi-fi, lo-fi or showcase?"

### The templates

Every template works in all three modes.

the-altar · view-master · lit-af · merwitch-bubbles · one-word-oracle · tarot-spread

No template named: it uses your own style pack.

### The storyboard (nothing renders until you say go)

Before it makes anything, you get a storyboard: every moment of the reel with real frames, the line you say,
what moves and what you hear.

At the top it tells you what it needs from you, for example "a 10-second screen recording of your dashboard",
or "nothing needed from you".

- Leave a note on any moment: "bigger word here", "cut this line", "swap this screenshot".
- Send anything it asked for.
- When you're happy, say **go** (or press "Looks good: render it").

You can go round as many times as you like. Each round is a new version; nothing is lost.

### What you get back

Two files next to your original clip:

- `<Title> v1.mp4`: the full-quality reel
- `<Title> v1 (phone).mp4`: a smaller copy for AirDrop

Before it hands them over, it checks every cut for flashes or doubled frames, checks your lips match your voice
to within 2 frames, and sets the sound to streaming loudness.

Music is off by default. Add a trending sound when you post in Instagram, Edits or TikTok.

---

## Things to say

| You say | It does |
|---|---|
| "Make a hi-fi / lo-fi / showcase reel from <clip>" | Starts a new video |
| "…in the <template> template" | Uses that look |
| "It's about <topic or link>" | Reads the source and pulls real screenshots for the reel |
| "Update my style" | Opens your style board to change fonts, colours or pace |
| "Cut line 4" / "Open with the line about…" | Changes the edit on the next storyboard |
| "Go" | Renders the final video |
| "Make another version" | Re-renders with your new notes as v2, v3… |

---

## Filming tips

- **Say each line until it lands.** Repeat it as many times as you need. It keeps your last clean take.
- **Leave a breath between lines.** It cuts in the pauses.
- **Hi-fi:** film on a camera or phone in 4K if you can, sitting, framed a little wide. It makes two framings from one shot.
- **Lo-fi:** hold your phone, vertical, arm's length. Done.
- **Words behind your head** work best with some space between you and the wall behind you.
- **Name anything unusual** (your brand, a person, a product) when you ask for the video, so the captions spell it right.

---

## If something goes wrong

| What you see | What to do |
|---|---|
| Setup doesn't say READY | Ask your AI to run setup again and follow the fix it prints |
| `CERTIFICATE_VERIFY_FAILED` on a Mac | Open Applications > Python 3.x and double-click **Install Certificates.command**, then run setup again |
| Codex or ChatGPT says it can't render | Turn on Full access for that task |
| Claude desktop (Cowork) can't run it | Settings > Capabilities: turn on code execution and file creation, and give the task access to your video folder |
| A name is spelled wrong in the captions | Tell it the right spelling in a storyboard note |
| The video looks off | Leave a note on the storyboard and say what you want instead. Nothing is final until you say go |

---

## Where things live

- **Your style, projects and tools:** `~/reel-kit/` (or the folder you gave the desktop app). Updates never touch it.
- **Your finished videos:** next to the clip you started from.
- **Each video keeps a copy of the style it was made with**, so changing your style later never changes old videos.

## Credits and licences

Built on open-source software: HyperFrames (Apache-2.0) renders the video, GSAP (free standard licence, downloaded at
setup) animates it, faster-whisper (MIT) transcribes it, fonts come from Google Fonts (SIL Open Font Licence) and
the sound effects are made from scratch (CC0). The optional smoother cutout downloads Robust Video Matting (GPL-3.0)
only if you ask for it. See `LICENSE`.
