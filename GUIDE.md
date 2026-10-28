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
4. When it says READY, tell me "Installed", show me where my For Reels folder is, and ask me to drop a clip in its Inbox folder.
```

**The first setup takes 15 to 30 minutes and downloads about 3 GB. Leave it running.**
It prints "Step 3 of 7" style lines so you can see it working, and it never goes quiet for long.
Later runs take seconds.

It runs on Mac and Linux (both tested) and on Windows (setup supports it, less tested).
If setup gets stuck, it keeps a copy of everything it printed in `.kit/setup.log` inside your For Reels folder: paste that to your Claude.

What it installs, all inside your For Reels folder (in a hidden `.kit` folder), with no Homebrew and no password:

- ffmpeg and Node 22, if your Mac doesn't have them (about 130 MB)
- the kit's own Python packages
- the render engine and a headless Chrome (about 300 MB)
- the speech model that reads your voice (about 1.5 GB)

The one thing it can't install for you is Python 3.10 or newer.
If you don't have it, setup prints the python.org download link and stops. Install it (two clicks) and run setup again.

**Stuck?** Tell your Claude: "run setup.py --check and show me the STATUS lines".
Each line says OK or MISSING, and a MISSING line ends with the fix.

**Best results:** use the strongest model on its highest effort.
In Claude Code, start it with `claude --model opus --effort max`.

---

## Part 2. Using it

### Your folder

Everything lives in one folder called **For Reels** (on a Mac: `~/For Reels`; in the Claude desktop app, the folder you gave it).
Drop your clip and any photos in **Inbox**. Your finished reels and phone copies appear in **Reels**.

### Your first reel asks you nothing

Say **"make my reel"**. It takes the newest video in Inbox and builds a lo-fi reel in a neutral look.
You get the storyboard, say go, and the reel lands in Reels.
Photos in Inbox are used where the storyboard needs them.
Then it offers: want it in your own fonts and colours? Say **"set up my style"**.

### Setting up your style

When you ask, it builds your style pack. It asks for one of these:

1. **A brand file**: brand guide, PDF or your website. It reads your fonts and colours.
2. **No brand file?** Send 2 or 3 links to reels whose style you love. It studies their pace, captions, colour and motion.
3. **Neither?** It asks you four quick questions.

Then it shows you a **style board**: your type, your colours, a frame of your footage in each mode.
Tell it what to change until it looks like you.
You do this once. Change it any time by saying **"update my style"**.

### Make a reel

Say what it's about. Add the mode and the clip if you want to choose; otherwise it uses lo-fi and the newest video in Inbox.

> Make a lo-fi reel from ~/Movies/take-3.mov. It's about why I stopped posting daily.

Add a template if you want a specific look:

> Make a showcase reel from take-3.mov in the view-master template.

### The three modes

| Mode | Best for | What you get |
|---|---|---|
| **Hi-fi** | A sit-down take on a camera | A produced edit: two framings from one camera, full-screen data cards, words behind your head |
| **Lo-fi** | A phone selfie | You stay in frame; screenshots and clips land on top of you or behind your head; captions light up word by word; text boxes for the hook and call to action |
| **Showcase** | Any footage, when you want to impress | Two or three motion graphics the words call for, one recurring (13 in the library, named by the line that calls for them), a transition on every cut, rich sound |

Your first reel is lo-fi. After you have a style, if you don't say a mode, it asks: "Hi-fi, lo-fi or showcase?"

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

Two files in your **Reels** folder (next to your clip, if you pointed it at one outside Inbox):

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
- **Frame it:** phone at eye level, chest-up, and a hand's width of space above your head. The effects that go behind your head (and the photos and words that sit round your face) need that room; a take with your head touching the top of the frame leaves them nowhere to go.
- **Name anything unusual** (your brand, a person, a product) when you ask for the video, so the captions spell it right.

---

## If something goes wrong

| What you see | What to do |
|---|---|
| Setup doesn't say READY | Ask your AI to run `setup.py --check`, show you the STATUS lines, and follow the fix on any MISSING one |
| `CERTIFICATE_VERIFY_FAILED` on a Mac | Open Applications > Python 3.x and double-click **Install Certificates.command**, then run setup again |
| Codex or ChatGPT says it can't render | Turn on Full access for that task |
| Claude desktop (Cowork) can't run it | Settings > Capabilities: turn on code execution and file creation, and give the task access to your video folder |
| A name is spelled wrong in the captions | Tell it the right spelling in a storyboard note |
| The video looks off | Leave a note on the storyboard and say what you want instead. Nothing is final until you say go |

---

## Where things live

- **Your clips:** `~/For Reels/Inbox` (or the folder you gave the desktop app).
- **Your finished videos:** `~/For Reels/Reels`.
- **Your style, projects and tools:** `~/For Reels/.kit`. Updates never touch it.
- **Each video keeps a copy of the style it was made with**, so changing your style later never changes old videos.

## Credits and licences

Built on open-source software: HyperFrames (Apache-2.0) renders the video, GSAP (free standard licence, downloaded at
setup) animates it, faster-whisper (MIT) transcribes it, fonts come from Google Fonts (SIL Open Font Licence) and
the sound effects are made from scratch (CC0). The optional smoother cutout downloads Robust Video Matting (GPL-3.0)
only if you ask for it. See `LICENSE`.
