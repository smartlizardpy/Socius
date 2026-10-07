# Re-syncing the UGC hook

`hook-line1.wav` is the exact audio the opening clip has to match: **0.00–4.60s
of the ElevenLabs read**, 16kHz mono, which is the ad's whole hook window
(line 1 is spoken 0.35–4.05 inside it). Feed the lip-sync model *this*, not the
full 27s file — driving it with the whole read will land the mouth on the wrong
words.

The clip you feed in should be trimmed to the same 4.6s. Then the output drops
straight into `ad/public/ugc/intro.mp4` and lines up 1:1 with the timeline.

## The tool

**LatentSync 1.6** (ByteDance) — <https://github.com/bytedance/LatentSync>, weights
on Hugging Face. It is video-to-video: it re-syncs footage you already have,
which is the case here. 1.6 is trained at 512×512 specifically to fix the
blurred-mouth problem earlier models have, and that matters at 1080×1920 with a
push-in on her face.

**MuseTalk** (<https://huggingface.co/TMElyralab/MuseTalk>) is the fast
alternative — single-pass, near real-time, 256×256 face region. Use it to
iterate quickly, then do the final pass in LatentSync.

Do **not** use Wav2Lip: it works on a 96×96 mouth crop and turns to mush at this
resolution. Do not use SadTalker: it animates a still photo, which is not the
problem you have.

## The Turkish caveat

These models are driven by audio features rather than by a phoneme dictionary, so
they mostly transfer across languages, and LatentSync is trained multilingual.
Turkish is not on its stated language list though, and the sounds most likely to
look wrong are the rounded front vowels — **ö, ü** — and **ı**, which need mouth
shapes English training data is thin on.

So test the phrase **"iki kişi eksik"** first, on its own. If those three words
read as natural, the rest of the line will.

## If it still is not convincing

The concept brief already calls this: the ad does not need clean visible speech
for the whole 4.6s, it needs a convincing first second and a voice-led exit.
Two things can be done in the edit instead, both quick:

1. Push in past her mouth, or cut to the pitch, for the back half of the line —
   the voice carries on and the lip sync is simply not on screen for it.
2. Shorten the on-camera line and let the ink iris start earlier.

Either is a change to `src/scenes/Hook.tsx` and `TIMING` and nothing else.
