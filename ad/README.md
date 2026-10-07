# Socius — halı saha ad

9:16, exactly 30.000s — 900 frames — 1080×1920 at 30fps, with the ElevenLabs
read on it. `npm run dev` for the studio, `npm run render` for the file.

## The rename

Avenza is Socius. Every string on screen comes from one place — `ui.brand` in
`src/copy.ts` for the wordmark, `outro.cta` for the closing line — so the type
was a three-string change, and `Outro.tsx` now reads the wordmark from `ui.brand`
instead of hardcoding it the way it used to.

The delivered read says it too. That is worth stating plainly because the two
recordings are otherwise the same performance of the same script, and the one
word that differs is the reason there is a new one at all: measured against the
previous read, the new take's brand word carries three voiceless sibilants where
the old carried none — mean energy above 3.5 kHz goes 5.0% → 12.5% on the line-2
opening and 2.5% → 15.4% on the closing tag, with sustained frames at 99%. That
is `Socius'ta` / `Socius.`, not `Avenza'da` / `Avenza.`

**Still outstanding: the symbol.** `public/img/mark-avenza.png` is the Avenza
glyph and no amount of code changes that. It is the only Avenza left in the
render. Drop the Socius symbol in at 144×144 and repoint `mark` in `src/data.ts`.

## Two cuts

| composition | opens / closes with | needs footage |
|---|---|---|
| `SociusHalisaha` | the group chat, and the motion-design close | **no** |
| `SociusHalisahaUgc` | the presenter plates | yes, or it draws the pitch |

`npm run render` builds the first; `npm run render:ugc` the second. They are one
component with a `ugc` flag, sharing one timeline and the same three middle
scenes — Discover, the trust beat, the join — which are the same instances at
the same frames in both.

The joins between the ends and the middle are a contract about a point in the
frame rather than about which scene is mounted: the opening scene closes an ink
disc at (540, 1060), which is where `Nearby` opens one back out, and the closing
scene opens one at (932, 983), which is where `Join` closed one. Both cuts
honour it, so the cut points are identical either way.

The product section is built from the real app: tokens transcribed from
`mobile/src/theme.ts`, Phosphor paths copied out of `mobile/src/icons.gen.ts`,
Turkish lifted from `mobile/src/strings.gen.ts`, and the seeded activity
`five-a-side-moda` with its real roster, prices and reliability records. Nothing
on screen is an invented Socius UI.

## Retiming

`src/timing.ts` is the only file with times in it.

`TIMING` holds the five spoken-line windows, **measured off the delivered
recording** rather than estimated — the five blocks separated by the four
longest pauses in `public/audio/voiceover.mp3`, read off with
`tools/measure-voiceover.sh`:

| line | window | pause before | |
|---|---|---|---|
| 1 | 0.67–4.35 | — | "…ama yine iki kişi eksik, değil mi?" |
| 2 | 5.43–9.80 | 1.08 | "Socius'ta yakınındaki halı saha maçlarını buluyorsun." |
| 3 | 11.05–18.81 | 1.25 | "Katılmadan önce kimlerin geleceğini…" |
| 4 | 19.77–22.93 | 0.96 | "Sana uyan maça tek dokunuşla katılıyorsun." |
| 5 | 23.89–28.41 | 0.96 | "Grubun tamamlanmasını bekleme. Maçını bul, sahaya çık." |

Then `TAIL` holds the last 1.59s for the mark.

`SCENES` derives the picture cuts from those, and every beat in every scene is
written as an offset from its own line through `fromLine()` — "the chip fills
0.9s after this line starts", never "at 5.85 seconds". So a new recording is:
re-measure the five windows, edit `TIMING`, done. No scene file needs touching.

Three beats are cut against phrasing **inside** a line, measured the same way:

| moment | at | why there |
|---|---|---|
| `2 KİŞİ EKSİK` | 2.75 | the voice reaches "iki kişi eksik" at 2.87; the word is on screen a beat before it is spoken |
| the trust beat | 14.15 | line 3 is two sentences with a 0.52s pause at 13.56–14.08 between them; the tap belongs on the far side of it |
| `MAÇINI BUL.` / `SAHAYA ÇIK.` | 25.79 / 26.74 | line 5 breaks into 23.90–25.64, 25.82–26.69, 26.77–27.42, and a brand tag at 27.61 where the mark lands |

## The pause before the trust beat

Line 2 ends at 9.80 and line 3 does not start until 11.05 — the widest pause in
the ad, and wider still than it was in the read before this one — and line 3's
own first half is about the roster rather than about reliability. Two things
fill that stretch, and both are there because the concept doc's script has a
sentence the recorded read dropped —
*"Saatine ve seviyene uyan maçı seçiyorsun."*

* **9.80–10.65** — Discover stops being still: the camera eases back off the
  lifted card, so the shot hands over on a widening frame rather than a frozen
  one.
* **10.95–13.50** — the `SANA UYGUN` card, which is that dropped sentence put
  back as picture. Two rows: the match's time against your usual hours
  (`Per 21.00–22.00` / `Hafta içi akşamları, 19.00–22.00`), and its level policy
  (`Herkes katılabilir` / `Her seviye`). It clears exactly on the comma pause,
  and the reliability card arrives into the space it leaves.

## The voiceover is built, not dropped in

`public/audio/voiceover.mp3` is not the raw ElevenLabs render. The delivered
read is the right performance at the wrong pace: 25.81s, a few phrases rushed,
and most of the pauses of the read before it gone — including the beat that
turns the hook and the one that lets the brand tag land.

`tools/build-voiceover.sh` rebuilds it from `raw/voiceover-elevenlabs-raw.mp3`:
cut into its fourteen phrases at the deepest sample of each silence, each phrase
time-stretched on its own (Rubber Band, pitch preserved), then laid back down
with pauses chosen one by one. It lands on exactly 30.000s. Its phrase table is
the whole edit — in, out, tempo, and the gap after — and re-running it is safe.

Only four phrases were actually rushed enough to slow. Nothing was stretched
past 12%, and seven phrases were not touched at all:

| phrase | tempo | why |
|---|---|---|
| "yakınındaki halı saha maçlarını buluyorsun." | 0.88 | 12% quicker than the previous read; the most rushed stretch in the file |
| "Socius." (brand tag) | 0.88 | 13% quicker, and clipped by the delivery — it now carries a 120ms fade instead of a hard edge |
| "gelmediğini görüyorsun." | 0.94 | 7% quicker |
| "ama yine iki kişi eksik," / "sahaya çık." | 0.95 / 0.94 | 5–6% quicker |

The rest of the 4.2 seconds is air, not slower talking: about a second comes
from the phrases, the other three from the pauses, the 0.3s of lead at the top
and the 1.5s the mark holds at the end. The four gaps between the spoken lines
all grew — most of all the one before the trust beat, which went from 0.35 to
0.65 measured silence.

Level is one linear gain to -15 LUFS with a ceiling at -1 dBTP, and no dynamics.
`loudnorm`'s dynamic mode reshapes a read this clean phrase by phrase — measured
LRA went 1.7 → 3.5 LU when it was tried — and this read carries about 1.2 dB
more crest than the previous one, so -14 would have meant limiting real speech
rather than one stray plosive. In the stereo render that comes out at -12.5
LUFS, still hotter than the -14 the platforms normalise to.

`tools/measure-voiceover.sh` prints the phrase and line map of whatever is
currently in `public/audio/`, and `tools/remap-cues.py` is what carried the
scene beats across from the previous read: both files' phrases anchored to each
other, everything in between interpolated. That is where the numbers now in
`timing.ts` and the scenes came from — none of them were re-judged by ear.

## The media slots

All are props on the `Ad` composition and the ad renders complete without any of
them. Wire one by putting the file in `public/` and setting its `staticFile()`
path in `adDefaults` (`src/Ad.tsx`). The voiceover is in; the two UGC plates and
the music are not.

| prop | goes in | until then |
|---|---|---|
| `voiceover` | `public/audio/` | **wired** — `voiceover.mp3`, built by `tools/build-voiceover.sh` |
| `ugcIntro` | `public/ugc/` | the treated pitch photograph |
| `ugcOutro` | `public/ugc/` | the same |
| `music` | `public/audio/` | silence |

`UgcSlot` takes a video **or** a still — a good photograph of the pitch gets the
same handheld drift and push as a clip.

## Three places the ad and the product disagree

All deliberate, all the brief's call rather than the code's:

1. **One tap to join.** `useJoinFlow` routes any priced game to `/pay/:id`, and
   this match is ₺120 — the real app shows Confirm-and-pay between the tap and
   the join. The ad shows one tap because line 4 says "tek dokunuşla".
2. **The match does not fill.** Joining takes it from 8/10 to 9/10; one seat is
   still open. The brief sketched the roster completing, which `spotsLeft` does
   not do on a single join. The close therefore resolves by *leaving* the hook's
   group rather than by filling it — which is also what line 5 says out loud:
   "grubun tamamlanmasını bekleme".
3. **The two ticks on the `SANA UYGUN` card.** The overlap each one marks is
   real — Thursday 21.00–22.00 sits inside weekday evenings 19.00–22.00, and
   `eligible()` returns true for a game open to all levels — but the app draws
   no such badge. They are the ad reading two of the product's own numbers
   against each other.

## What the level beat can and cannot say

Not a style choice — a data one, and worth knowing before anyone asks for the
level rail back:

* `you` in the seed carries a **`padelLevel` and no football level**. The app's
  `levelForSport()` falls back to the padel number for every other sport, so
  "your halı saha level" is 5.0 by fallback, not by anything you ever set.
* `matchReasonFor()` returns **null** for a game with no level band — "says
  nothing at all rather than something untrue", in its own comment. The Moda
  match is open to all levels, so the app would never draw a
  "Futbol seviyene uygun" pill on it, and neither does the ad.
* The one halı saha game in the seed that *does* state a band is
  `football-atasehir` (3.0–5.5), the row under YAKININDA AYRICA. A full
  rail-with-your-marker beat is available for that match if it is wanted — but
  it would be leaning on the padel fallback to claim a football level, which is
  a product call.
