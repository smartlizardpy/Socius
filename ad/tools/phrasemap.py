"""Phrase and line map of a raw 8 kHz mono s16 file, in seconds.

A *phrase* is a run above -42 dBFS-of-peak with at least 40 ms of silence either
side. A *line* is a group of phrases separated from the next group by a pause of
at least LINE_GAP.

That threshold is 0.60s because of where the read actually breathes: the four
pauses between the spoken lines run 0.65–0.85s, and the longest pause inside a
line — the comma in "Katılmadan önce kimlerin geleceğini, / gerçekten gelip" —
is 0.52s. Anything between 0.53 and 0.64 separates them. Check the printed
grouping after a new build rather than trusting the number; the line count is
reported so a bad split is obvious.

Used by tools/measure-voiceover.sh to produce the numbers in src/timing.ts.
"""
import array, math, sys

SR, HOP, FLOOR, MIN_GAP, LINE_GAP = 8000, 0.010, -42.0, 0.04, 0.60
NAMES = ["intro", "nearby", "reliability", "join", "outro"]

a = array.array("h")
a.frombytes(open(sys.argv[1], "rb").read())
n = int(SR * HOP)
env = [math.sqrt(sum(v * v for v in a[i:i + n]) / n) for i in range(0, len(a) - n, n)]
peak = max(env)
db = [-120.0 if v <= 0 else 20 * math.log10(v / peak) for v in env]

runs, i = [], 0
while i < len(db):
    if db[i] > FLOOR:
        j = i
        while j < len(db) and db[j] > FLOOR:
            j += 1
        runs.append([i, j])
        i = j
    else:
        i += 1
merged = []
for r in runs:
    if merged and (r[0] - merged[-1][1]) * HOP < MIN_GAP:
        merged[-1][1] = r[1]
    else:
        merged.append(r[:])
phrases = [(r[0] * HOP, r[1] * HOP) for r in merged if (r[1] - r[0]) * HOP >= 0.05]

lines = [[phrases[0]]]
for prev, cur in zip(phrases, phrases[1:]):
    (lines.append([cur]) if cur[0] - prev[1] >= LINE_GAP else lines[-1].append(cur))

total = len(a) / SR
print(f"file {total:.3f}s   {len(phrases)} phrases in {len(lines)} lines")
if len(lines) != len(NAMES):
    print(f"  !! expected {len(NAMES)} lines — check LINE_GAP ({LINE_GAP}s)")

for k, group in enumerate(lines):
    name = NAMES[k] if k < len(NAMES) else f"line{k + 1}"
    st, en = group[0][0], group[-1][1]
    before = st if k == 0 else st - lines[k - 1][-1][1]
    print(f"\n  {name:<12} {st:6.3f} – {en:6.3f}    pause before {before:.3f}")
    for p_st, p_en in group:
        print(f"      {p_st:6.3f} – {p_en:6.3f}  ({p_en - p_st:5.3f}s)"
              f"   +{p_st - st:5.3f} from line start")
print(f"\n  tail {total - lines[-1][-1][1]:.3f}s")
print(f"  peak (loudest 10ms frame) at {db.index(max(db)) * HOP:.2f}s")

print("\n  measured line windows — src/timing.ts keeps the previous read's own"
      "\n  convention instead (see tools/remap-cues.py), which sits a little"
      "\n  inside these at the soft onsets and decays:")
for k, group in enumerate(lines[:len(NAMES)]):
    print(f"    {NAMES[k]}Start: {group[0][0]:.2f},  {NAMES[k]}End: {group[-1][1]:.2f},")
