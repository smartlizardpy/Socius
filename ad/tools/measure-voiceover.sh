#!/usr/bin/env bash
# Read the phrase map straight off public/audio/voiceover.mp3, so src/timing.ts
# is never an estimate. Prints the five line windows and every phrase boundary.
set -euo pipefail
cd "$(dirname "$0")/.."
W=$(mktemp -d); trap 'rm -rf "$W"' EXIT
ffmpeg -v error -y -i public/audio/voiceover.mp3 -ac 1 -ar 8000 -f s16le "$W/a.raw"
python3 tools/phrasemap.py "$W/a.raw"
