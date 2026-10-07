# Avenza recon — measurements taken 2026-09-01

Source: Apple App Store public search/lookup API, storefront **tr**, 19 search terms drawn from
Avenza's own vocabulary ("halısaha", "halı saha maç", "kadro tamamlama", "saha rezervasyon",
"padel", "spor arkadaşı", "amatör futbol", ...). Raw: `raw_tr.json` (302 apps).
Filtered to Sports/Health/Lifestyle/Social genres AND category terms: 168.
Removed lineup-builders, scoreboards, trackers, news apps: **148 real matchmaking-or-booking apps**
(`core_tr.json`).

## Market shape
| measure | value |
|---|---|
| real matchmaking/booking apps in TR store | 148 |
| football-named | 52 · racket-named 45 · generic/multi 51 |
| first released in **2026** | **81 / 148 (55%)** |
| first released 2025 | 20 · 2024 14 · all pre-2024 33 |
| userRatingCount == 0 | 36 |
| userRatingCount 1–9 | 75 |
| **fewer than 10 ratings** | **111 / 148 (75%)** |
| 200+ ratings | 7 |
| **total ratings across all 148 apps** | **16,244** |

## Claimed mechanics (store description text)
| mechanic | loose keyword | strict, hand-checked |
|---|---|---|
| level / skill tier | 53 / 148 | — |
| post-game rating | 36 / 148 | — |
| reliability / no-show | 21 / 148 | **9 / 148** |
| ...of which *player-facing* reliability score (rest are facility blacklists / class registers) | | **5 / 148** |

The 5: HalıSaha+ (18r), Padel4 Club (2r), Sahaya Gel (1r), SahaMate (0r), PlayMatchr (0r).
**Combined ratings of every app shipping Avenza's differentiator: 21.**

## Multi-sport breadth
13 / 148 name ≥4 of Avenza's 7 sports; 3 name all 7 (Join do 21r, Spordium 7r, Revos 5r).
Largest multi-sport app in the whole set: **21 ratings**.
8 apps pair football with padel — Avenza's own pairing.

## Design language — 28 apps, 161 screenshots (`shots/`, `palette.json`)
Dominant-accent extraction + hue clustering (`palette.py`).

| band | n | note |
|---|---|---|
| green | 17 / 28 | **11 of 14 football apps are green** |
| blue | 9 / 28 | incl. Playtomic, Altıpas, CeleBreak, Footy Addicts |
| violet | 2 | Sporsepeti, Smashmate |
| orange | 1 | Timpik |

Grounds: **21 / 28 sit on neutral #F8F8F8**. Only 3 have any warmth (R−B ≥ +6), and 2 of those
are lime-green grounds. Avenza's `#FBF8F3` (+8) has exactly one true analogue: **Altıpas #F8E8D8**.

Avenza blue `#1350C8` vs the other blues (CIE76 ΔE):
Altıpas 13.6 · Matchabit 17.4 · PFM 21.6 · **Playtomic 23.3** · Footy Addicts 33.5 · CeleBreak 44.2

## Screenshots read by eye (contact sheets in /tmp/recon-sheets/)
- **HalıSaha+**: dark pitch-green + lime. Ships "Herkes Kendi Öder — her oyuncu kendi payını öder,
  toplam tutar kişi sayısına bölünür" (₺250 share shown), a 4-tier level picker
  (Başlangıç/Orta/İleri/Profesyonel), and "TRİBÜN" social feed. Login screen has a **password field**.
- **Altıpas**: warm cream ground, teal/blue/yellow 3D illustration. Communities named
  "İstanbul **Kadıköy** — Altıpas, 385 üye". Post-game peer star-rating across HIZ/ŞUT/PAS/DRB/DEF/FİZ
  feeding a FIFA-style **OVR card (73)** with Bronz/Gümüş/Altın/Elmas tiers.
- **Playtomic**: blue + lime. Decimal level shown *publicly on the avatar* (1.2, 1.8, 1.4);
  progress chart to 4.12. Level-filtered "Matches — For your level" with Available slots. Social feed.
