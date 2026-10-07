"""Old-read time -> new-read time, through the fourteen phrases they share.

Both reads are the same script from the same voice, so their phrases correspond
one to one; only the pace inside them, the pauses between them, and the brand
word — the whole point of the re-record — differ. Anchor
each phrase's measured start and end in both files, interpolate linearly in
between, and every beat the ad was cut to can be carried across to the rebuilt
read without being re-judged by ear.

Left column measured off raw/voiceover-previous-27s.mp3, right off the rebuilt
public/audio/voiceover.mp3, both by tools/phrasemap.py at -42 dBFS-of-peak.
"""

ANCHORS = [  # (old_start, old_end, new_start, new_end)
    (0.03, 1.63, 0.360, 1.920),    # Halı saha yapmak istiyorsun,
    (1.77, 3.47, 2.060, 3.710),    # ama yine iki kişi eksik,
    (3.64, 4.06, 3.940, 4.360),    # değil mi?
    (4.73, 5.72, 5.210, 6.180),    # the brand word — "Avenza'da" then, "Socius'ta" now
    (5.98, 9.47, 6.610, 10.120),   # yakınındaki halı saha maçlarını buluyorsun.
    (9.82, 12.61, 10.770, 13.560), # Katılmadan önce kimlerin geleceğini,
    (13.22, 14.48, 14.070, 15.320),# gerçekten gelip
    (14.60, 18.21, 15.480, 19.070),# gelmediğini görüyorsun.
    (18.78, 20.22, 19.750, 21.170),# Sana uyan maça
    (20.37, 22.21, 21.340, 23.190),# tek dokunuşla katılıyorsun.
    (22.65, 24.39, 23.890, 25.640),# Grubun tamamlanmasını bekleme.
    (24.64, 25.40, 25.820, 26.680),# Maçını bul,
    (25.50, 26.16, 26.760, 27.410),# sahaya çık.
    (26.31, 27.15, 27.600, 28.460),# the brand tag  — "Avenza."    then, "Socius."    now
]

KNOTS = sorted({(o, n) for a in ANCHORS for o, n in ((a[0], a[2]), (a[1], a[3]))})


def remap(t):
    if t <= KNOTS[0][0]:
        return KNOTS[0][1] + (t - KNOTS[0][0])
    if t >= KNOTS[-1][0]:
        return KNOTS[-1][1] + (t - KNOTS[-1][0])
    for (o0, n0), (o1, n1) in zip(KNOTS, KNOTS[1:]):
        if o0 <= t <= o1:
            return n0 + (t - o0) * (n1 - n0) / (o1 - o0)


OLD_LINE = {"hook": 0.35, "nearby": 4.95, "reliability": 10.10,
            "join": 18.80, "outro": 22.65}

TIMING = [("introStart", 0.35), ("introEnd", 4.05),
          ("nearbyStart", 4.95), ("nearbyEnd", 9.15),
          ("reliabilityStart", 10.10), ("reliabilityEnd", 17.95),
          ("joinStart", 18.80), ("joinEnd", 21.95),
          ("outroStart", 22.65), ("outroEnd", 27.10)]

CUES = [
    ("Hook.tsx",        "hook",        [("IRIS_FROM", 3.85)]),
    ("HookChat.tsx",    "hook",        [("HERO_AT", 2.13), ("SEATS_AT", 2.45),
                                        ("IRIS_FROM", 3.85)]),
    ("Nearby.tsx",      "nearby",      [("IRIS_OUT", 0.25), ("HOLD_WIDE", 0.55),
                                        ("CHIP_AT", 0.9), ("SWAP_AT", 1.12),
                                        ("PUSH_AT", 1.75), ("ARRIVE_AT", 2.7),
                                        ("LIFT_AT", 3.15), ("LEVEL_AT", 3.6)]),
    ("Reliability.tsx", "reliability", [("FAN_AT", -0.25), ("FIT_AT", -0.1),
                                        ("WHO_AT", 1.45), ("FIT_OUT", 2.45),
                                        ("TAP_AT", 3.2), ("CARD_AT", 3.45),
                                        ("COUNT_FROM", 3.65), ("COUNT_TO", 4.75),
                                        ("MISS_AT", 5.5), ("OTHERS_AT", 6.2),
                                        ("OUT_AT", 7.8)]),
    ("Join.tsx",        "join",        [("BUILD_AT", -0.4), ("HOLD_AT", 0.5),
                                        ("TAP_AT", 1.15), ("COMMIT_AT", 1.4),
                                        ("SEE_IT_AT", 1.4), ("FLOOD_AT", 1.85),
                                        ("SEAL_AT", 2.13), ("COPY_AT", 2.27),
                                        ("MATCH_CUT_AT", 3.05)]),
    ("Outro.tsx",       "outro",       [("IRIS_OUT", 0.15), ("CARD_AT", 2.15),
                                        ("CTA_AT", 2.9)]),
    ("OutroBrand.tsx",  "outro",       [("IRIS_OUT", 0.07), ("SEATS_AT", 0.05),
                                        ("SWAP_AT", 0.62), ("COUNT_AT", 1.24),
                                        ("LIFT_AT", 1.8), ("LINE_A_AT", 1.95),
                                        ("LINE_B_AT", 2.83), ("LOCK_AT", 3.57)]),
]

NEW_LINE = {k: round(remap(v), 2) for k, v in OLD_LINE.items()}

print("TIMING")
for name, old in TIMING:
    print(f"  {name:<17} {old:6.2f}  ->  {remap(old):6.2f}")

print("\nCUES   (offset from the scene's own lineStart)")
for f, scene, cues in CUES:
    print(f"\n  {f}   lineStart {OLD_LINE[scene]:.2f} -> {NEW_LINE[scene]:.2f}")
    for name, off in cues:
        new = remap(OLD_LINE[scene] + off) - NEW_LINE[scene]
        print(f"    {name:<13} {off:6.2f}  ->  {new:6.2f}     "
              f"(abs {OLD_LINE[scene]+off:6.2f} -> {remap(OLD_LINE[scene]+off):6.2f})")
