#!/usr/bin/env bash
#
# Rebuild public/audio/voiceover.mp3 from the raw ElevenLabs read.
#
# The delivered read (raw/voiceover-elevenlabs-raw.mp3, 25.81s) is the right
# performance at the wrong pace: a handful of phrases are rushed and most of the
# pauses the previous read had are gone, including the beat that turns the hook
# and the one before the brand tag. This script cuts the read into its fourteen
# phrases, slows only the rushed ones (Rubber Band, pitch preserved), and lays
# them back down with deliberate pauses so the whole thing lands on exactly
# 30.000s — 900 frames at 30fps.
#
# Cut points are the deepest sample of each silence in the raw file, so every
# splice happens under -40 dBFS and is covered by an 8 ms fade.
#
# Columns: in  out  tempo  gap-after  fade-out-ms
#   in/out  seconds into the raw file
#   tempo   playback rate; <1 stretches the phrase longer. 1.00 = untouched.
#   gap     silence inserted after this phrase, in seconds
#   fade    fade-out length. 8 ms everywhere the cut lands in real silence,
#           which is all but two of them. Phrase 1 ends at -34 dB — the tail of
#           "istiyorsun", where this read leaves no gap at all before "ama" —
#           so it gets 30 ms to decay into the pause being inserted after it
#           rather than being gated off. Phrase 14 gets 120 ms because the
#           delivery truncates the brand tag mid-decay.
#
# Re-running this is safe and idempotent. After changing anything here, re-run
# tools/measure-voiceover.sh and copy its numbers into src/timing.ts.

set -euo pipefail
cd "$(dirname "$0")/.."

SRC=raw/voiceover-elevenlabs-raw.mp3
OUT=public/audio/voiceover.mp3
WORK=$(mktemp -d)
trap 'rm -rf "$WORK"' EXIT

SR=48000
HEAD=0.30   # silence before the first word
TAIL=1.522  # silence after the last, so the end card can hold

# phrase                                    in      out     tempo  gap   fade
PHRASES=(
  "Halı saha yapmak istiyorsun,            0.040   1.658   1.00   0.12   30"
  "ama yine iki kişi eksik,                1.662   3.300   0.95   0.16    8"
  "değil mi?                               3.335   3.880   1.00   0.70    8"
  "Socius'ta                               4.390   5.520   0.95   0.20    8"
  "yakınındaki halı saha maçlarını bul.    5.830   9.100   0.88   0.45    8"
  "Katılmadan önce kimlerin geleceğini,    9.310  12.250   1.00   0.36    8"
  "gerçekten gelip                        12.480  13.775   0.96   0.06    8"
  "gelmediğini görüyorsun.                13.785  17.320   0.94   0.50    8"
  "Sana uyan maça                         17.570  19.110   1.00   0.06    8"
  "tek dokunuşla katılıyorsun.            19.160  21.150   0.97   0.50    8"
  "Grubun tamamlanmasını bekleme.         21.520  23.360   0.98   0.06    8"
  "Maçını bul,                            23.410  24.315   1.00   0.06    8"
  "sahaya çık.                            24.325  24.990   0.94   0.14    8"
  "Socius.                                25.030  25.808   0.88   0.00  120"
)

# Whole read decoded once, so every trim below is sample-accurate.
ffmpeg -v error -y -i "$SRC" -ac 1 -ar $SR -c:a pcm_f32le -f f32le "$WORK/src.raw"

silence () { # seconds -> raw f32 zeros
  python3 -c "import sys;sys.stdout.buffer.write(b'\0'*(4*round($SR*$1)))"
}

: > "$WORK/body.raw"
silence "$HEAD" >> "$WORK/body.raw"

i=0
for row in "${PHRASES[@]}"; do
  i=$((i+1))
  read -r IN OUT_T TEMPO GAP FADE <<<"$(awk '{print $(NF-4), $(NF-3), $(NF-2), $(NF-1), $NF}' <<<"$row")"
  DUR=$(python3 -c "print(f'{$OUT_T-$IN:.6f}')")
  FO=$(python3 -c "print(f'{$FADE/1000:.4f}')")
  FOST=$(python3 -c "print(f'{$DUR-$FO:.6f}')")

  FILTER="afade=t=in:st=0:d=0.008,afade=t=out:st=$FOST:d=$FO"
  if [ "$TEMPO" != "1.00" ]; then
    FILTER="$FILTER,rubberband=tempo=$TEMPO:transients=crisp:detector=compound:pitchq=quality"
  fi

  # -ss/-t before -i: the trim is an *input* option, so the filter timeline
  # starts at zero for this phrase. After -i they would be output options and
  # afade's st= would be read against the whole file instead.
  ffmpeg -v error -y -f f32le -ar $SR -ac 1 -ss "$IN" -t "$DUR" -i "$WORK/src.raw" \
    -af "$FILTER" -c:a pcm_f32le -f f32le "$WORK/p$i.raw"

  cat "$WORK/p$i.raw" >> "$WORK/body.raw"
  [ "$GAP" != "0.00" ] && silence "$GAP" >> "$WORK/body.raw"
done

silence "$TAIL" >> "$WORK/body.raw"

# Trim/pad to exactly 30.000s.
ffmpeg -v error -y -f f32le -ar $SR -ac 1 -i "$WORK/body.raw" \
  -af "highpass=f=80,apad,atrim=0:30,asetpts=N/SR/TB" \
  -c:a pcm_f32le "$WORK/flat.wav"

# One linear gain to -15 LUFS, then a ceiling. loudnorm's dynamic mode is the
# wrong tool on a voice stem this clean — it reshapes the read phrase by phrase,
# and measured LRA went from 1.7 to 3.5 LU when it did.
#
# -15 rather than the -14 the previous read sat at, because this read carries
# about 1.2 dB more crest: its loudest syllables are spread right through the
# take (0.94s, 5.5s, 12.5s, 21.0s, 24.3s, 26.8s), not one stray plosive, so
# reaching -14 would mean limiting a third of a second of real speech. -15 costs
# a level difference nobody can hear, keeps 1 dB of true-peak headroom for the
# mp3 encode, and leaves the performance alone. The limiter below only catches
# what the gain pushes past the ceiling, a few tenths of a dB.
MEASURED=$(ffmpeg -hide_banner -nostats -i "$WORK/flat.wav" \
  -af loudnorm=print_format=json -f null - 2>&1 | sed -n '/^{/,/^}/p')
get () { sed -n "s/.*\"$1\"[ :]*\"\([^\"]*\)\".*/\1/p" <<<"$MEASURED"; }
GAIN=$(python3 -c "print(f'{-15.0-($(get input_i)):.2f}')")
echo "  gain ${GAIN} dB  (from $(get input_i) LUFS / $(get input_tp) dBTP)"

ffmpeg -v error -y -i "$WORK/flat.wav" \
  -af "volume=${GAIN}dB,alimiter=limit=0.841:attack=5:release=50:level=disabled" \
  -c:a pcm_s24le "$WORK/final.wav"

cp "$WORK/final.wav" raw/voiceover-30s.wav
ffmpeg -v error -y -i "$WORK/final.wav" -c:a libmp3lame -b:a 192k -ar 44100 "$OUT"

printf 'built %s  %s s\n' "$OUT" \
  "$(ffprobe -v error -show_entries format=duration -of csv=p=0 "$OUT")"
