# Avenza — overnight pass

The mockup is now a working app. Every screen exists, every control does something,
and the state survives a reload.

```bash
cd mobile
npx expo start          # then i / a / w, or scan the QR with Expo Go
npx expo start --web    # http://localhost:8081
```

Reset the demo any time from **Profile → Reset the demo**.

---

## What you can actually do now

A full lap, all on hard-coded data:

1. **Welcome → Get started.** Language dropdown works (US / Türkçe) and the whole app
   follows it.
2. **Sports.** Pick any number. The button counts them.
3. **Level.** Now walks **every sport you picked**, one at a time, with a chip row you
   can jump around in. You set it by **tapping stars** — the same control the Rate
   screen uses, in blue — and the tier name and description follow the count. Padel,
   tennis, football, basketball and volleyball have five tiers each; running and
   cycling use the same stars but show a pace or a distance; gym is skipped, because
   nothing about a gym session is matched by level. "Not sure? Answer 4 quick
   questions" opens a real sheet that lands you on a tier.
4. **Ready.** Counts the games that actually match what you set, rather than always
   saying three.
5. **Discover.** Sport filter chips filter. The neighbourhood chip opens a picker. The
   bell goes to Notifications and its dot clears. Faces and the host go to profiles.
   The bookmark saves. Join a paid game and you land on **Confirm and pay**.
6. **Activity.** Share, bookmark and the overflow menu all work — directions, calendar,
   message, report, and **Leave this game**, which frees your spot again everywhere.
7. **Pay.** Card picker, and the breakdown shows the **court total**, your share, the
   10% Avenza fee and the real total — that was your `toplam maliyet de görünsün` note.
8. **Games.** Upcoming / Played. Anything you joined appears here with a real date tile
   and live spot counts. Empty states for both tabs.
9. **Rate.** Three players, then a **finish screen** — the mockup just closed itself.
10. **Search.** Live text search across titles, venues, hosts and keywords, chip facets,
    and a filter sheet with distance, level, free-only and host reliability. Games you
    are not eligible for are absent, with a line saying how many. Real empty state,
    real counts, recent searches.
11. **Create.** Sport, when, where and format pickers; a **draggable** level range; the
    opt-in for players outside it; a spots stepper that redraws the roster; a court-cost
    split. Publishing puts it in Discover and Games, badged HOSTING, and it opens.
12. **Profile.** Your reliability, rating, week chart, reviews, settings, language,
    neighbourhood, saved games.
13. **Course.** Apply, and the places-left count moves.

---

## Second pass — your phone screenshots and notes

| What you said | What happened |
|---|---|
| celebrate art and the Pay thumbnail missing | **Not a bug.** Your screenshots are 05:05–05:11; the splash preload landed 05:11. Those images had not loaded yet — the same late-loading you had already reported. The preload covers both. |
| "Padel seviyene uygun" while you were ★★ and the game wanted ★★★+ | The pill was a fixed string on the activity. It is computed now. |
| "Aralığının dışında" next to a full-strength Join | Superseded by your next note — see **Eligibility** below. |
| "where is the event I created?" | Publishing wrote to the store and appeared nowhere tappable. Published activities are now first-class: they list in Games badged HOSTING, show in Discover, and open their own detail screen. |
| spots roster spilling out of the card at 8 | Seven fixed-width tiles in a box that fits five. Capped at six (You + 4 + "+N"), and the overflow tile is no longer labelled "Boş". |
| the bare "16" next to ₺960 | My internal `cost ÷ 60` multiplier leaking into the UI. A new `PriceStepper` steps the money itself. |
| "Kaydet" wrapping and clipping | The slot was a fixed 44px — fine for "Save". Sized to content. |
| "GÜVENİLİRLİK" colliding with "%94" | 54px display type at `lineHeight 0.9` climbing into the head above it. |
| the underline under the reliability card | The gap below it, and the ragged bottoms between RATING and PLAYS ON. Both squared up. |
| Mo Tu We, "Tonight · 19:30", "8 min by bike" | Translated — **and** `check-strings.py` now scans the seed data, not just literal `t()` calls. That blind spot is why they shipped English; it caught 16 more the moment it could see them. |

## Eligibility

> *"Don't show people stuff they're not eligible for, and ask while the event is
> created whether people outside your limit can come — make it opt-in."*

- A game whose level range excludes you **is not shown at all** — Discover and
  Search both filter it out. Search says how many were hidden, so a shorter list
  is explained rather than mysterious.
- Level is judged **per sport**. Everything used to compare against your padel
  level, so a tennis game was ranked by how well you play padel.
- The Create form asks the host once, in the WHO CAN JOIN card: *"Let others ask
  anyway"*, **off by default**.
- That opt-in gives the activity screen three honest states: in band → **Join** ·
  host opted in → **Join anyway** (with a sheet explaining the host decides) ·
  closed → **"Not open at your level"**, and no button at all.

## The fee

Avenza takes **10%**. One constant (`FEE_RATE`), disclosed on the activity's price
line and broken out on Pay: court total ₺720 → your share ₺180 → fee ₺18 →
**total ₺198**, and the button charges ₺198. The old "free while in beta" line is
gone; it was a promise nobody had made.

## Pro is removed

The screen, the store fields, the plan data, the paywalled filter and the upsell
cards. The filters it used to gate are now just filters.

## Onboarding, rebuilt as a funnel

Six steps: Welcome → Sports → Level → **Neighbourhood** → Ready → **Account**.
Two screens are new, and the shape comes from the research rather than taste:
activation averages 37.5%, 77% of new users leave within three days, deferred
signup lifts activation 10–30%, and social sign-on converts 2–3× over
email+password.

**`/onboarding/place`** asks where you play and how far you would go. It is the
permission prime: it states what the radius buys, shows the count of real matching
games moving as you change it, and only then offers *Use my location*. A prompt
fired cold gets a refusal, and a refusal is permanent.

**`/onboarding/account`** is last on purpose. Signup before value is the biggest
single leak in the funnel; by here you have picked sports, set a level and seen
real games, so the ask is "keep what you built". **Not now** is a first-class path
straight into the app. Google and Apple only — **no password field anywhere and no
real OAuth**: the provider is recorded so Profile → Account can show it and sign out
again, and nothing else is collected.

**Notifications left onboarding entirely.** The ask fires once, on the first tab
screen after you join a game, and asks about *that game* — "want to know if a spot
opens?" — rather than about notifications in the abstract.

Walked end to end by `funnel.js`, which also checks the account step can be skipped
and that no credential field ever appears.

**The art is in.** Both screens carry generated explainers (`design/briefs/image-4.md`
was the brief): a top-down neighbourhood with courts, pins and radius rings on the
place step, and players behind a shield with the things you would be saving on the
account step.

They arrived broken in a way worth knowing about: **RGB with a transparency
checkerboard painted into the pixels** instead of an alpha channel. Flooding from
the border does not fix a map, because its roads enclose checker regions the flood
can never reach. `scripts/keyout-checkerboard.py` labels every light achromatic
region and judges each one separately — a checkerboard carries both tones, a white
shirt carries one — then flattens onto paper. Check `.mode` on any new generated
art before shipping; `hero.png` is RGBA, these two were not.

## Venues

`/venue/[id]`. The venue row on an activity drew a caret and showed a toast about
Maps — the caret promised a screen that did not exist. It exists now, derived
entirely from the activities: the sports played there, the distance, the cheapest
game, and the games themselves, filtered by the same eligibility rule as the rest
of the app so a venue never advertises a game you cannot join.

## Touch targets

A sweep found **67 controls under the lock's 44px floor** — the tab bar at 40, every
chip, the segmented control, steppers, toggles, rating stars, and every "See all"
link at 16px. `hitSlop` was the wrong fix: react-native-web 0.21 does not implement
it, so it would have repaired native and left the web preview untouched. Instead the
drawn box keeps its size and the pressable pads out around it, pulled back by a
negative margin so nothing moved — centralised as `PressScale`'s `drawnHeight`.

**67 → 0 in both languages**, every affected screen re-shot to confirm nothing
shifted. One trap worth knowing: a negative margin is clipped by an ancestor with
`overflow: hidden`, and Search's fixed-height chip rail turned a 36px target into 32
before that was caught.

## The bulletin

`/bulletin` and `/bulletin/[id]`, reached from a newspaper button in the Discover
header. Design artboards for both are in `design/src/`, on **page 3** of the canvas.

**One ranked feed, mixed.** Near-you and world sport interleave in a single list.
Local items come from Avenza's own data (new venues, host tournaments, court prices,
a league with spots) and can end in a game. World items come from real news sites,
summarised and credited. The publisher name in the kicker is the only thing
separating them — `TENNIS · NTV SPOR · 15H` against `MODA · 4H` — and it does the
attribution a feed deal requires without importing a single logo into the palette.

**The lead slot stays local.** Ranked purely on interest a Süper Lig headline beats
a new court in Kadıköy every day, and the one thing only Avenza can do gets buried.

**Feed stories are summarised, credited and linked out — never reproduced.** The
story screen is a labelled AI summary, a *Read the full story on ‹source›* out-link,
then Avenza's own contribution: *2 football games near you · cheapest ₺120*, which
respects the same eligibility rule as the rest of the app. Its footer says why it
ranked. No invented score — the lock forbids those.

### The data

| file | who writes it |
|---|---|
| `src/data/bulletin.json` | us — curated local items, the dateline, the lead |
| `src/data/bulletin.world.json` | the feed job — replace this file wholesale to refresh |
| `src/data/bulletin.ts` | merges them, ranks, resolves images, exposes the hooks |

News copy carries its own `{en, tr}` inline rather than going through
`strings.json`: the feed writes both languages, and a translation checker cannot
audit a feed. UI chrome still goes through `t()`.

The five world stories currently in there are **real**, researched on 28 August 2026
and verified — Milliyet (Champions League draw), NTV Spor (Sönmez–Gauff, Turkey–
Lithuania), Hürriyet (Turkey–Germany volleyball), Padel FIP (Mediterranean Games).
All five `sourceUrl`s resolve.

`rank()` is a documented stand-in for the real ranker: lead pinned, then freshest
first with your sports lifted six hours. **Its visible consequence is that
timestamps run out of order** — a 6H story can sit above a 4H one. That is what
ranking means, but in a ten-item list it can read as a bug. Chronological is one
line in `rank()`.

## The first night

### Why the level screen was ugly, and what I did

Four identical fat white rows, a summary card that repeated the header, two chips that
promised a step that did not exist, three redundant selection signals on the chosen row
(2px border **and** a blue glow **and** a check dot), and a lot of dead air underneath.

It went through two shapes. First a ladder — a rail down the card with your marker on
it. Then you asked for the rating control instead, which is better: it is now **five
stars you tap**, with the tier name and its description following the count, and a line
underneath that moves as you choose (*"31 players near you · matched within one star of
yours"*). One control, one sentence, no dead air.

---

## Stars — please sanity-check this one

Level is now **shown** as 1–5 stars and still **stored** as the 1.0–7.0 number, which is
what matching runs on. So this is a presentation change, not a data migration — if you
meant something else by `yıldız ranking sistemine geçelim`, it is cheap to pull back.

The thing to check is that the app already had stars, for **rating** a player. Two star
systems on one screen only work if something separates them, so:

- **Level stars are blue.** Blue already carries the matching mechanic everywhere — the
  level rail, "You're a match".
- **Rating stars stay orange.** Orange already carried the rating.

Look at the Rate screen: the big orange stars are your rating of Selin, the small blue
ones in "WAS THIS THE RIGHT LEVEL?" are her level. If that reads as confusing to you
rather than obvious, tell me and I will separate them by shape instead of colour.

Mapping: `<2.5 → ★`, `<3.5 → ★★`, `<4.5 → ★★★`, `<5.5 → ★★★★`, `≥5.5 → ★★★★★`.
Where five drawn stars would swamp a row the compact form is `★ 3–5`.

Running and cycling get no stars — they are paced, not rated, which is why the profile
already showed "Running" with no number beside it.

---

## Logo

**Current:** `mark-avenza.png` — your two-figure mark in the app's orange and blue,
cropped and keyed transparent at 144px. This resolved the palette problem the teal
version had. Legible to 26px; the pale figure gets faint below 30px on paper.
`img.markTeal` and `img.markArcs` are still there if you want either back.

*Earlier in the night:* the teal original. It is cropped, keyed transparent and shipped
at 96px as `assets/img/mark-original.png`. The generated arcs mark is still there as
`img.markArcs`, so reverting is one line in `src/data/seed.ts`.

One thing worth your eye: the teal is outside the orange/blue colour contract, so the
mark reads as a third hue wherever it shares a frame with the UI — most visibly in the
Discover app bar. Either the palette gets re-cut around teal or the mark gets redrawn in
the palette. That is your call, not a bug, and it is recorded in the style lock.

---

## Bugs found and fixed

- **44px top reserve missing on every screen** (above).
- **Four of five tabs were blank `<View/>`s** — Search, Create, Games, Profile.
- **Nested pressables.** The Discover featured card was one big button containing three
  more (bookmark, host, Join). Invalid on web, and on native the outer touchable
  swallows the inner press. Same in the bottom sheet, where the body sat inside the
  pressable scrim. Both restructured into siblings.
- **`StatCard` collapsed to zero height.** It set `flexBasis: 0` for its width, but it
  sits inside an animated wrapper whose axis is vertical, so the basis landed on height
  and the Pro card overlapped the rating card. Sizing is the caller's job now.
- **Tab-bar padding counted twice.** A tab screen's content box already ends above the
  tab bar; adding 78px again pushed the Create publish bar into the middle of the screen.
- **Horizontal chip rail collapsed to a sliver** on Search — a horizontal `ScrollView` in
  a column parent has no intrinsic height on web.
- **`toLocaleUpperCase('tr')` on English strings.** Turkish has a dotted capital İ, so
  English copy uppercased through the Turkish locale is wrong. Counts are templated now.
- **Spot counts were per-count translation keys** (`"2 spots left"`), so the new seed data
  fell back to English at any count the mockups had not drawn.
- **Rating queue had no ending** — it called `router.back()` on the last player.
- **No way to leave a game** once joined.
- **Dead controls**: bell, neighbourhood chip, See all, Filters, share, more, the venue
  row, roster faces, "Not sure?", Edit, the Games Rate button. All wired.

## Screens added

`search` · `create` · `games` · `profile` · `player/[id]` · `pay/[id]` · `pro` ·
`course/[id]` · `notifications` · `saved` · `players`

## Groundwork

- `src/components/ui.tsx` — the component vocabulary: `ScreenHeader`, `Segmented`,
  `Toggle`, `Stepper`, `RangeRail`, `Sheet`, `Toast`, `EmptyState`, `Chip`, `ListRow`,
  `LevelStars`, `StarRange`, `ReliabilityStrip`, `WeekBars`, `useTopPad`.
- `src/components/cards.tsx` — the cards more than one screen needs, plus `useJoinFlow()`
  so every Join button in the app behaves the same way (paid → Pay, free → straight in).
- `src/store.ts` — saved, following, created, courses, Pro, filters, city, recent
  searches, rated games. All persisted.
- `src/data/seed.ts` — 8 activities, 2 courses, 6 notifications, reviews, past games,
  per-sport level scales.
- 40 more Phosphor icons, pulled through the existing `scripts/gen-icons.py`.
- 310 new Turkish strings. `scripts/check-strings.py` reports **all t() strings resolve**.
  Sentences that used to be glued together from translated words now go through a new
  `tf()` helper with `{holes}`, because Turkish word order and suffixes make
  fragment-concatenation produce nonsense.

## How this was checked

Two Puppeteer suites against the web build, both green:

- `flow.js` — walks onboarding with three sports, joins through Pay, checks the game
  lands in Games, finishes the rating queue, filters Search by chip and by text,
  publishes an activity, switches to Turkish.
- `tr.js` — loads all 15 screens in Turkish and fails on leaked English.

Plus `npx tsc --noEmit` clean, and every screen screenshotted at 402×874 and reviewed.

## Deliberately not done

- **Basketball, volleyball and cycling have no seeded games.** They are pickable and have
  level scales, but the repo has seven photographs and they cover padel, football, tennis
  and running. Adding cards for the others meant an illustration standing in for a
  photograph, which the deck does not do. Openverse is behind Cloudflare now, so I could
  not fetch more CC0 photos.
- **No messaging, no real map, no auth.** Each is a system, not a screen.
- **Host payouts.** Same reasoning as the artifact thread — that needs a payments
  provider and probably a licence.
