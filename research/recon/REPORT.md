# Avenza — competitive reconnaissance
**Run date:** 1 September 2026 · **Budget:** 2h (workflow tier) · **Subject:** `/home/ozi/Projects/avenza`

Method: 6 research dimensions fanned out in parallel, each adversarially refuted by an independent
agent instructed to default to *refuted* when uncertain, plus a completeness critic. 14 agents,
722k + 599k tokens, 531 tool calls. Alongside that, a measured App Store pass run directly:
302 apps surveyed, 148 classified, 161 screenshots downloaded and colour-extracted.

Raw material on disk: `raw_tr.json` · `core_tr.json` · `findings.json` · `palette.json` ·
`MEASUREMENTS.md` · `territory.md` · `shots/` · contact sheets in `/tmp/recon-sheets/`.

---

## 1. The headline

**The trust layer is misdirected, not wrong. It cannot be an acquisition story, because it does
not exist at install — and Avenza already ships the mechanism that does work.**

`design/briefs/expo-app.md` stakes the product on one sentence:

> *"The trust layer is the differentiator. Nobody else knows whether the stranger you matched
> with will actually turn up, or is really the level they claim."*

Three independent lines of evidence say this is the wrong thing to lead with.

**a. Four of the largest operators in the category considered a reliability score and chose money
instead.** GoodRec answers no-shows with mandatory prepayment. Plei with a $5 fee, forfeited
payment inside three hours, and account deactivation. Playtomic with a pre-authorisation hold
released two hours after the match and a no-show debt that blocks the account — and it
*deliberately voids the match result* "so it doesn't affect any player's level", keeping
attendance **out** of reputation on purpose. The reason is structural: **a deposit works on a
user's very first game; a reputation score is worth nothing until they have played five.**

**b. Avenza already collects at join.** 180 ₺ share + 18 ₺ fee, charged before the game. The
deposit *is* the trust layer. The reliability percentage is a second-order refinement of a
mechanism that is already in the product and already stronger.

**c. The score is free to discard, by Avenza's own design.** `mobile/HANDOFF.md` commits to
Google/Apple only, *"no password field anywhere"*, no phone. A host who no-shows and burns a 62%
score re-registers with a second Google account in under a minute. Playtomic moved the other way
and now requires a verified phone at signup. Two of your own decisions are in direct conflict.

**The restatement that survives:** reliability is a defensible **retention** mechanic — the thing
that stops a dense district decaying in month six — in a market where nobody has demonstrably
shipped a working one. It is not the wedge. The wedge is density in Kadıköy.

---

## 2. Corrections — including to things I told you earlier in this session

**(i) My own traction measurement was wrong, and I led with it.** I measured 148 Turkish
matchmaking apps holding **16,244 App Store ratings between them** and was about to conclude the
category has no players. That is an iOS-only artefact in a market that is roughly four-fifths
Android. I then said exact Play install counts were unavailable — **also wrong.** They are in the
served HTML. Verified directly:

| app | Play installs | note |
|---|---|---|
| Halısahavar | **18,477** | Android build abandoned since Dec 2021 |
| Adam Eksik | **16,243** | live since 2019, last shipped Oct 2024 |
| Altıpas | **10,047** | launched **April 2026** — five months |
| HalıSaha+ | **1,579** | the app staking Avenza's exact claim |

This reverses the ranking. **The app that markets Avenza's differentiator is the smallest of the
four.** The app with real momentum, Altıpas, wins on WhatsApp import and an OVR-style progression
card — not on trust.

**(ii) My "6× fee spread" example used the wrong tariff row.** I cited a 2,000 ₺ tennis court from
a facility-specific schedule. The authoritative rows are İBB sections 22–23. Corrected below; the
spread is **16×**, not 6×, and the direction is unchanged.

**(iii) I called bilingual TR/EN racquet in Istanbul "open opportunity". It is contested.**
**PFM — Play for More** (id 1659862462, PFM Spor Teknolojileri A.Ş.) has been live since March
2023, is `['EN','TR']`, does level-based match organisation with partner clubs in Istanbul, has
**84 TR ratings**, and monetises by **subscription, not commission**. Padeon and Raqet House ship
Turkish level-matching too. That seam is narrower than I said.

**(iv) The adversaries split on the central finding, and I am reporting the split rather than
picking a winner.** One refuter marked "HalıSaha+ ships Avenza's differentiator" **refuted**;
another marked it **confirmed**. Both re-fetched the same source. See §4.

---

## 3. Territory map

| Bucket | Capability | Basis |
|---|---|---|
| **Conceded** | Halı saha pitch booking | HalıSaha+ ships an operator SaaS panel with sub-merchant payout (*"ödeme doğrudan işletme hesabına iner; ara cüzdan yok"*). İBB sells at published fixed prices with no commission line. Avenza has zero venue contracts. |
| **Conceded** | Player level in padel/tennis *as a concept* | Playtomic: *"The Playtomic levels range from 0 to 7"*, per sport, questionnaire-seeded, match-derived. Sporsepeti has run ELO since 2022. Only move left is the rename. |
| **Contested** | Reliability / no-show score | Claimed in copy by HalıSaha+, Halı Saha Rakip Bul, LinkedUp, PitchPulse; won by nobody. Winnable on execution. |
| **Contested** | Court-cost split + in-app payment | Playtomic and HalıSaha+ both ship it. Avenza's *price* is the exposed flank — the Turkish floor is zero. |
| **Contested** | One level identity across sports | Turkish market is cleanly segregated football-vs-racquet; nobody carries competence across both. But a dozen 2026 multi-sport buddy-finders exist, none above ~300 ratings. |
| **Crowded** | User-hosted game creation | 30+ Turkish halı saha apps, five shipped in the last three months. Avenza's Create is *below* the current bar. |
| **Crowded** | Two-way post-game rating | Every serious competitor ships it. |
| **Crowded** | Venue pages | Google Maps owns the query; HalıSaha+ already publishes a Kadıköy directory. |
| **Open — GRAVEYARD** | Eligibility filtering (hiding games) | Nobody hides. Playtomic, with the most level data, *shows* out-of-range matches and routes to "Request a spot". Unoccupied because walking in empties your feed. |
| **Open — GRAVEYARD** | Editorial bulletin | Attention owned (Mackolik 42,171 ratings). Sourcing hostile. Legally exposed. |
| **Open — GRAVEYARD unless sequenced** | Multi-sport breadth | Eight sports in one district is eight simultaneous cold starts. |
| **Open — OPPORTUNITY** | **Kadıköy / Anatolian-shore density** | Every rival is national and therefore thin everywhere. Playtomic has no `/tr/` locale, no Turkish among 13 languages, 0 of 140 sampled clubs in Turkey. |

**Anti-reference: HalıSaha+.** Not the biggest competitor — the most instructive, because it is
Avenza's brief already shipped: Güven Puanı, AI level placement, iyzico per-person split, four-way
rating, venue pages, tournaments, a "Tribün" social feed, rent-a-goalkeeper, operator panel. All
live, updated 2026-08-31. And after four months: **1,579 Android installs, 18 iOS ratings**, a demo
venue still in its own store screenshot, and a profile card that does not render the trust score
its copy sells. **It built the entire feature list before it had one district's worth of supply,
and the feature list did not generate the supply.** That is Avenza's risk profile exactly.

---

## 4. Findings, with artefacts

### 4.1 The competitor that matters most is contested even among my own verifiers
HalıSaha+ (id 6761794919, v1.1.6, pushed 2026-08-31 — one day before this run) carries verbatim:

> `GÜVEN PUANI — MAÇ İPTALİ DERDİ BİTSİN · Halı Saha+ Güven Puanı, maçı satıp ekibi yarı yolda
> bırakanları filtreler · Her oyuncunun katılım güvenilirliği profilinde görünür`

**Refuter A (refuted):** the vendor's own `/tr/features` "Güven & itibar" section lists five items,
none an attendance metric; all eight store screenshots show stars, XP and rank badges, no
percentage; the Kadıköy page is 28 Google-Maps scrapes with no prices, including a 50,000-seat
stadium; the company is Ankara-registered and its demo pitch is in Yenimahalle.
**Refuter B (confirmed):** every quote is verbatim on both App Store and Google Play.

**Both are right.** The claim is *announced and marketed*, not *demonstrably shipped*.
Treat it as a competitor moving into your space this quarter, not one that has arrived.

### 4.2 Two of Avenza's three headline numbers collide with Playtomic's vocabulary
Verified by me at source, not just by an agent:
- *"The Playtomic levels range from 0 to 7."* Avenza stores 1.0–7.0.
- Playtomic's profile shows a percentage labelled **"Reliability %"** — meaning *"how reliable your
  level is"*, i.e. confidence in the estimate. Avenza's reliability % means attendance.

Same two numbers, same two words, opposite meanings — for padel players, who are 7 of your 19
seeded activities. **Action: rename the percentage to `Katılım` / `Attendance` everywhere.**

### 4.3 Playtomic does not hide out-of-range matches — and neither should Avenza
Verified verbatim: matches outside your band render with an *"Out of range"* message and a
**"Request a spot"** path. The refuter tried to find a counterexample and found the opposite —
Playtomic's friendly/casual open matches carry **no level restriction at all**.

Avenza hides ineligible games from Discover *and* Search, with `let others ask anyway` **off by
default**, launching into one district with an empty feed. This is the clearest unforced error in
the product.

### 4.4 The money is mispriced in three separate ways
**(a) Roughly half the fee goes to the card rails.** iyzico, verbatim: *"%4,29 ve 0,25 TL işlem
ücreti"* and — critically — *"iyzico komisyon ücreti, toplam işlem ücreti üzerinden hesaplanarak
… pazar yerinin payından kesilmektedir"*. On your own 198 ₺ example: 4.29% × 198 + 0.25 = **8.74 ₺
out of an 18 ₺ fee**, before KDV. A ~10% headline is a ~3.5–5% business.

**(b) The flat rate produces a 16× spread across Avenza's own sports.** İBB 2026 tariff, KDV dahil:

| facility | ₺/hr | split | share ₺ | Avenza 10% |
|---|---:|---:|---:|---:|
| Açık basketbol sahası (aydınlatmalı) | 250 | 10 | 25.00 | **2.50** |
| Açık halı saha (aydınlatmasız) | 1,500 | 14 | 107.14 | 10.71 |
| Açık halı saha (aydınlatmalı) | 2,250 | 14 | 160.71 | 16.07 |
| Kapalı halı saha | 2,800 | 14 | 200.00 | 20.00 |
| Padel kort (aydınlatmalı, ≤4 kişi) | 1,000 | 4 | 250.00 | 25.00 |
| Kapalı tenis kortu (aydınlatmalı) | 800 | 2 | 400.00 | **40.00** |

A tennis player pays **16× the fee** a basketball player pays, for the same app doing the same job.
Playtomic price-discriminates on exactly this axis (open matches 10–20%, plain bookings 0–4%) and
caps the fee in most markets. Avenza caps nothing.

**(c) Your seeded prices are 7–47% below the municipal rate.**

| `seed.ts` row | Avenza ₺ | İBB ₺ | gap |
|---|---:|---:|---:|
| padel, court split 4 ways | 180 | 250 | −28% |
| tennis, court split 2 ways | 140 | 250 | −44% |
| pitch split 10 ways | 120 | 225 | −47% |
| pitch split 14 ways | 150 | 161 | −7% |

*Note: the Turkish market floor for player-side commission is **zero** — Altıpas is "ücretsiz",
Adam Eksik states "Ödeme/komisyon yok", SmashMate routes booking to the club. The credible
alternatives are subscription (Kort, Sporsepeti, PFM) or organiser-side (OpenSports, 3%).*

### 4.5 The cheapest liquidity mechanism you don't have
Altıpas ships **WhatsApp roster paste** (*"WhatsApp kadronu yapıştır"*) and **install-free link
join** (*"arkadaşların uygulamayı indirmeden linke tıklayıp kadrodaki yerini alsın"*). Santra opens
its listing with *"Halı saha maçı ayarlamak, WhatsApp grubunda 'kim var, kim yok' mesajlarında
kaybolmasın."* — which is your ad concept's hook, already taken.

Avenza's Create has neither. A host who fills 6 of 10 spots from an existing group must still make
four friends install the app. **This is a far cheaper liquidity mechanism than any reputation
system**, and it is the single most actionable item in the run.

### 4.6 Your onboarding is a verified advantage — over the exact competitor that worries you
HalıSaha+'s first screen is a hard login wall: `Telefon Numarası / E-posta`, a password field with
a show/hide eye, `Şifremi Unuttum`, `Giriş Yap`. No Google, no Apple, no guest path. Avenza's
deferred signup, no-password, Google/Apple-only design is genuinely better than the incumbent's.
*(Caveat: it is also what makes the reliability score free to discard — §1c.)*

**But stop citing the four onboarding numbers** in the brief (37.5% activation, 77% three-day
churn, 10–30% deferred-signup lift, 2–3× social sign-on). Three of four do not trace to a primary
source; one leads to a 2015 Android panel, one to a vendor survey with a disputed *n*. The
decisions are right; the citations will discredit the rest of the brief if anyone checks them.

### 4.7 Design: you are differentiated, and it is the ground doing the work
28 apps, 161 screenshots, dominant-accent extraction and hue clustering.

- **17 of 28 cluster in one green band — 11 of the 14 football apps.** Your blue is genuinely rare
  in halı saha.
- **21 of 28 sit on neutral `#F8F8F8`.** Your `#FBF8F3` warm paper has exactly one analogue in the
  whole set: **Altıpas `#F8E8D8`** — which is also the competitor with real momentum in Kadıköy and
  the closest feature set. Warm paper is a real decision, but it is not uncontested.
- Avenza blue `#1350C8` vs the blues, CIE76 ΔE: Altıpas 13.6 · Matchabit 17.4 · PFM 21.6 ·
  **Playtomic 23.3** · Footy Addicts 33.5 · CeleBreak 44.2.

### 4.8 The Bulletin is legally exposed and strategically weak
Hürriyet's terms carry an express derivative-works ban (*"bu içerikten türev eserler
yaratmayacaklarını"*) and its robots.txt blocks ClaudeBot, anthropic-ai and GPTBot. NTV requires
prior written permission. FSEK m.36/II's press-summary exception covers social/political/economic
**newspaper** articles — excluding sport, and excluding broadcaster NTV Spor entirely. A TBMM bill
(Esas No 2/3519, 10 Feb 2026) names *"otomatik özet"* and *"haber kartı/paneli"* as a paid act,
gated above 100m ₺ / 1m MAU — directional only, unenacted and single-MP, but it prices the upside.

**Keep the local strand only** — new venues, court prices, leagues with spots. That half is content
nobody else has and costs nothing legally.

### 4.9 Market shape (my measurement, iOS-only — see limits)
148 real matchmaking/booking apps in the TR store matching Avenza's own vocabulary.
**81 of 148 (55%) first released in 2026.** 111 of 148 (75%) have fewer than 10 iOS ratings.
Strict hand-check: **9 of 148** claim a genuine reliability mechanic (21 on loose keywords), of
which only **5 are player-facing**. 13 apps claim ≥4 of Avenza's 7 sports; the largest has 21
ratings. **Every winner in this market is single-sport.**

---

## 5. The one action

**Flip eligibility, then ship WhatsApp import — in that order, this week.**

1. Default `let others ask anyway` to **ON**.
2. Replace the silent hard filter with Playtomic's pattern: render the game, badge it
   `Seviye dışı / Out of range`, route to a request. Do **not** copy Playtomic's unanimous-approval
   rule — it is sized for a 4-player padel roster and would strangle a 14-player halı saha game.
3. Add WhatsApp roster paste + an install-free web link join to Create.

You cannot afford to hide inventory in a one-district launch, and the money you already take at
join does the no-show work the reliability score was supposed to do.

---

## 6. Method, limits, and what to do next

**What was sampled.** Apple App Store, `country=tr`, 19 Turkish-vocabulary search terms, 1 Sep 2026.
302 apps → 168 in-genre → 148 after removing lineup-builders, scoreboards, trackers and news apps.
28 apps' screenshots downloaded (161 images) for colour extraction; three read by eye as contact
sheets. Competitor screenshots are copyrighted marketing material — they stay in `shots/` and are
not reproduced.

**Known weaknesses, ranked:**

1. **Zero demand-side evidence.** Every Apple review RSS feed returned empty; Ekşi Sözlük rendered
   two entries. Not one user voice in the entire run. **The central bet is validated by nothing
   except the brief asserting it** — no no-show rate, no Turkish player complaining about one.
   *Play review bodies sit in the same HTML blob as the install counts I extracted. That is the
   first thing to do next.*
2. **The venue-side booking rail was never examined.** No venue-management SaaS was opened. Avenza's
   MONEY and VENUES mechanics both assume a venue will let a third party split its money; nobody
   asked whether the venue's incumbent panel already forbids it. One datum picked up in passing:
   Lumo's Istanbul padel page reads *"23 tesis bulundu — 0 rezervasyona açık"*. **Online-bookable
   padel supply in Istanbul may be near zero**, which would make supply, not trust, the binding
   constraint. *Fix this before spending another hour on copy and defaults.*
3. **KVKK was never opened.** A public per-person attendance percentage that gates who may join a
   game is scoring and profiling of a natural person by a Turkish data controller. Aydınlatma,
   VERBİS, explicit-consent basis and the automated-decision question are all live for the single
   mechanic the brief calls the differentiator. This bites on day one at any scale.
4. **Five of eight sports were never researched.** Basketball, volleyball, running, cycling, gym.
   Three of them have **no court cost**, so there is no share to split and no 10% to take — the run
   never answered what the business model is for them.
5. **Nobody installed a competitor.** Every behavioural claim is inference from help-centre prose,
   store copy and store screenshots. An Android emulator and a Turkish SIM would settle all of them.
6. **Whether Playtomic has bookable Istanbul clubs** rests on two 404s and a 140-club sample. If it
   does, the padel side is dead on arrival; if not, padel is the cleanest wedge.
7. **No non-Western analogue examined.** Malaeb (MENA pickup football, per-player prepayment) is the
   closest existing proof or disproof of Avenza's exact model and was never opened.
8. **The scan is Apple-TR-only** in a ~80% Android market. An Android-only Kadıköy app would not
   have been caught.

**Confidence.** §4.2, §4.3, §4.4(a)(b)(c), §2(i) and §4.7 are verified by me at primary source.
§4.1 is genuinely contested between two adversaries and reported as such. §4.5, §4.6, §4.8 survived
one adversarial pass. Everything about the Turkish payments licence was **refuted** on reasoning and
is deliberately excluded from this report — do not act on it without a Turkish adviser.
