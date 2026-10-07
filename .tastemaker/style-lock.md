# Socius — style lock

Mobile sports-social app (find people to play with, join local activities, courses,
athlete reputation). Cold start: empty repo, no existing design system, no brand assets.
Direction chosen by the user from four low-fi options: **Clean Athletic (light + photo)**,
re-cut to an orange/blue palette at the user's request.

## Colour contract (verified with check_contrast.py --matrix)

| Role | Hex |
|---|---|
| ink (text) | `#101A2B` |
| ink muted (secondary text) | `#5A6172` |
| paper (page bg) | `#FBF8F3` |
| surface (cards) | `#FFFFFF` |
| primary (action) | `#1350C8` |
| on-primary | `#FFFFFF` |
| primary deep | `#0B2E7A` |
| primary tint | `#E3ECFF` |
| accent (energy/urgency) | `#F0651C` |
| accent deep (accent as text) | `#B8430C` |
| accent tint | `#FFE7D6` |
| illustration yellow (art only, never UI) | `#F7C23B` |
| border / hairline | `#EFEAE1` (on white), `#EDE7DC` (on paper) |
| rail track | `#E6E0D5` |
| control ring (unselected radio, open slot) | `#8F8778` — 3.56:1 on white, 3.36:1 on paper |
| map illustration base (drawn SVG only) | `#EEF3E8` |

**Text-safe (≥4.5:1):** ink/paper 17.2 · ink/surface 18.6 · ink/accent 5.46 · muted/paper 5.85 ·
on-primary/primary 6.98 · primary/surface 6.98 · primary/paper 6.05 · accent-deep/paper 5.15 ·
primary-deep/primary-tint 10.50 · ink/primary-tint 14.70 · muted/primary-tint 5.23
**UI-safe only (3.0–4.5):** accent/surface 3.19, accent/paper — icons, borders, large type only.
Data marks (chart bars, attendance strip) use `#1350C8` at full strength and carry their
value in **height**, not in a lighter tint — a tinted bar (`#A9C2F4`, 1.79:1) fell under the
3:1 UI floor and was removed.

**Never:** white text on `#F0651C` (3.19) · ink text on `#1350C8` (2.84) · accent as small text
on white — use `#B8430C` instead.

Rule: the orange accent is always a **fill carrying ink text**, never a text colour on light
ground and never a fill under white text. Accent footprint stays ≲5% of a screen.

## Type

- Display / numerals: **Bricolage Grotesque** 700, tracking −0.02 to −0.05em.
  Fallback `'Archivo', 'Helvetica Neue', Arial` (PNG/PDF export shows the fallback).
- UI / body: **Instrument Sans** 400/500/600/700. Fallback `system-ui`.
- Section heads: 11px, 700, tracking 0.09em, uppercase, ink-muted.
- Body 13–15px/1.35–1.45 · meta 12–12.5px · micro label 10–11px (floor).
- No italic display type. No mono for body.

## Shape, density, depth

- Radius: cards 20–24px · inner media 14–16px · chips and buttons 999px · level tiles 14px.
- Spacing scale: 4 6 8 10 12 14 16 20 22 26 · screen gutter 20 · card padding 12–16 ·
  card gap 10–12 (internal padding ≤ external gap).
- Depth: one soft elevation only —
  `0 1px 2px rgba(16,26,43,.04), 0 16px 32px -20px rgba(16,26,43,.28)`. No second shadow style.
- Section separation: one mechanism — an 11px uppercase section head over a 10–14px gap.
- Hit targets ≥44px throughout (icon buttons 44, primary actions 52).
- Tab bar: `tabBarHeight` (60) + the safe-area inset, items **centred**. One
  exported constant, because the bar and `useTabBarPad` both need it and two
  hardcoded copies drift. It was 78 with the items top-pinned, which left a
  quarter of the bar empty and came to 112px on a phone once the home indicator
  was under it — iOS's own is 83.
- Top status-bar reserve: **44px** on every screen. This is empty on purpose — the device's real
  clock, battery and signal render there. It is the floor, not a spacing choice: below 44px the
  header collides with the status bar on a notched phone.

## Assets

- **Photography**: real, CC0/public-domain via Openverse (`scripts/fetch_photos.py`).
  Seven photographs, covering padel, football, tennis and running — which is why the
  seeded activities cover only those four sports. Basketball, volleyball and cycling
  are pickable in onboarding and have level scales, but no seeded games: inventing a
  card for them would mean an illustration standing in for a photograph, and the deck
  does not mix the two.
  Credits live in `design/assets/photos/*/CREDITS.html.txt` — code-side courtesy, never on screen.
- **Icons**: Phosphor (regular) via the Iconify API, inlined as SVG with `fill="currentColor"`,
  one set throughout. No emoji.
- **Illustrations**: generated raster art (GPT-Image via the Codex CLI's image tool) — flat
  vector style, transparent background, prompted to the locked palette plus one illustration-only
  yellow `#F7C23B`. Sources in `design/assets/gen/`, flattened onto paper and optimised into
  `design/assets/img/`. Used for the welcome hero, the three explainer panels, the
  neighbourhood and sign-in screens, the onboarding finish, and the profile medal.
  Two rules earn their keep in the brief, both learned the hard way: ask for a
  **solid `#FBF8F3` ground** rather than transparency, and cap the composition at
  **six or seven major shapes** — the first map filled the canvas with twenty
  buildings and fifteen figures and turned to mush at the 350px it is drawn at.
  `mobile/scripts/gen-onboarding-art.py` trims each to its ink and letterboxes it
  back to the aspect of the box it is drawn in; the three explainer panels share
  one aspect on purpose, because the panel scales art to fit its height and that
  is what keeps the people the same size as you swipe.
  The earlier hand-coded SVGs in `design/assets/illustrations/` are superseded — kept only as
  the rejected first pass.
- **App icon and splash**: the Socius mark, not Expo's stock grey circles.
  Expo's docs are explicit that **Expo Go renders the app icon** as its launch
  image rather than `splash-icon.png`, so `icon.png` is the file that changes
  what you see on launch in Expo Go; the splash proper is configured through the
  `expo-splash-screen` plugin (SDK 54 does not use the old top-level `splash`
  key). The mark ships at 144px with no larger source, so `scripts/gen-app-icons.py`
  rebuilds rather than stretches it: quantise to the mark's own colours — Pillow's
  own quantiser is no use, the frame is two thirds paper and it folds orange, cyan
  and ink into one olive — upscale each colour's mask, and decide the boundary by
  strongest mask per pixel. Blurring and thresholding the masks independently
  leaves them no longer tiling, which opens seams and shows whatever was painted
  first as a hairline.
- **The checkerboard trap**: the onboarding pair (`onb-place`, `onb-account`) came
  back as RGB with a transparency checkerboard *painted into the pixels*
  (`#FEFEFE` / `#F3F3F3`) rather than an alpha channel. Flooding from the border
  is not enough — a map illustration encloses checker regions inside its roads.
  `mobile/scripts/keyout-checkerboard.py` labels every light achromatic region and
  judges each on its own evidence: a checkerboard carries both tones in quantity,
  a white shirt or building face carries one. Check `Image.open(f).mode` on any
  new generated art before shipping it; `hero.png` is RGBA, those two were not.
- **Yellow rule**: yellow lives inside illustrations only. It is never a UI fill, text colour,
  border or state — the UI stays ink / blue / orange so the accent hierarchy holds.
- **Logo**: `mark.png` — two thick navy arcs facing each other with an orange ball caught
  between them: two players, mid-rally. Generated raster, shipped at 3× (84px) and drawn at
  27px. Verified legible down to 24px. Replaces the earlier hand-coded SVG, which went thin
  and illegible at app-bar size.
- **Avatars**: generated photographs of four **fictional** people (Deniz, Selin, Mert, Ayça),
  shot as **candid phone snapshots** — different locations (padel court, park, sports hall,
  running track), different light, off-centre framing, no retouching. An earlier set used one
  grey studio backdrop and identical centred framing and read as obvious AI stock; the candid
  brief is what fixed it. Square 160px files, rounded by CSS, reused at every size from 26 to
  88px. Real CC0 stock was tried first and rejected: the attribution-free pool has almost no
  modern sporty portraits (it returns archival photographs and clipart). Generated also keeps
  invented reliability scores off a real person's face.

## Level, as stars

Level is **shown** as 1–5 stars and **stored** as the 1.0–7.0 number. The number is
what the app matches on — it is what a level range is expressed in and what a rating
verdict nudges — but nobody reads "4.5" and knows what it means.

| level | stars |
|---|---|
| < 2.5 | ★ |
| < 3.5 | ★★ |
| < 4.5 | ★★★ |
| < 5.5 | ★★★★ |
| ≥ 5.5 | ★★★★★ |

**Level stars are blue `#1350C8`. Rating stars are orange `#F0651C`.** Everywhere, no
exceptions: blue is how well you play, orange is what people thought of playing with
you. Two star systems on one screen only work if the colour separates them, and both
already have a settled meaning in the palette — blue carries the matching mechanic
(the level rail, "You're a match"), orange carries the rating.

Where five drawn stars would swamp a row, the compact form is one star glyph and the
range: `★ 3–5`. Empty stars are `#E6E0D5` (rail track), so the count reads at a glance
without a number beside it.

**The quiz belongs to the scale, not the screen.** "Not sure? Answer 4 quick
questions" ladders onto the tiers — every yes moves you up one rung, so question
n has to describe what tier n+1 can do. That makes the questions the same kind of
thing as the tiers, and they live beside them in `levelScales`. One shared set of
racket questions was asked of all seven sports, so football got "can you keep a
rally going for ten shots?" and cycling got "are you comfortable coming to the
net?".

**Pace sports have no stars.** Running and cycling are not rated, they are paced —
they carry a pace or a distance instead, which is why the profile shows "Running"
with no level beside it. Gym has no level step at all.

## Logo

`mark-socius.png` — two figures, arms up, in the app's own orange and blue. The
teal original is kept as `img.markTeal` and the generated arcs mark as
`img.markArcs`, so either is one line to restore.

This resolves the tension the teal version carried: it read as a third hue
wherever the mark and the UI shared a frame. Verified legible down to 26px, which
is the smallest the app draws it (the profile footer). One thing to watch: the
pale figure sits at low contrast against paper and starts to disappear below 30px.

## The onboarding funnel

Welcome → **How it works** → **Sign in** → Sports (1/3) → Level (2/3) → Place (3/3) → Ready.

Two rules hold the order together:

**Explain before asking.** The funnel used to open on "Which sports do you play?"
— a form field put to someone who had seen one headline. `/onboarding/how` is
four swipeable panels: three make the case — games are near you, the people in
them are at your level, the rating afterwards is what makes the next one happen
— and the fourth asks. That is the same Discover → Join → Play → Rate loop the
deck argues, told in the order a stranger meets it, closing on the invitation.
Skippable from the header.

**The pitch and the mechanism are separate screens.** Panel four is the CTA
("Let's get you started", *Create my account*); the screen after it says "Choose
how to sign in" and does one job, which of the two buttons. A screen that sells
and takes the answer at the same time does neither well, and the provider
buttons compete with any argument put beside them.

**Sign-in opens the process, it does not close it.** The account step used to sit
after Ready, which had already said "You're in." — the funnel congratulated you
and then put a wall in front of you. It now runs straight after the explainer, so
the ask lands on someone who knows what they would be signing into and everything
set afterwards is saved as it is set. `Not now` goes exactly where the buttons
go, and Profile keeps the offer open.

**The location step is about the location.** It led with a section head reading
YOUR NEIGHBOURHOOD over four hard-coded ilçe and put the device last, as a ghost
button under everything else — backwards twice, since the phone knows the answer
and the four names were the wrong grain anyway. One tinted block sits directly
under the heading, the only tinted thing on the page; found, it prints the semt
at display size, because the place name *is* the content. The names survive as a
muted "Or pick one" row — a fallback, not the offer — and it stays visible after
the phone answers, because a device that reads the wrong side of a street would
otherwise be a dead end. The block prints the *chosen* place rather than the
device's word, so picking a name changes it instead of leaving it contradicting
the count underneath.

**The neighbourhood comes off the device, and it is a semt.** `expo-location`
supplies the permission and the fix; the *name* comes from a local table of
İstanbul semts with a centroid each (`src/data/semts.ts`), nearest-match.
`reverseGeocodeAsync` is native-only — it throws on web — and it returns the
ilçe more reliably than the semt, which is the wrong half: nobody in Moda says
they live in Kadıköy. A local table behaves identically on iOS, Android and web,
needs no key or network, and for a product that is one city's neighbourhoods it
is the domain rather than a workaround.

Two sources in order: the device geocoder is right for anywhere on earth, and
the local table is right *inside* İstanbul, where the geocoder answers with the
ilçe and the table knows the semt. There is no "you are not in İstanbul" state —
the geocoder names Çankaya as readily as Moda — so the failures left are a
refusal and an honest "could not work out where you are".

The count still refuses to quote games for a place Socius has none in: the
seeded distances are all measured from the Anatolian shore, and would otherwise
report "6 games within 5 km of Bakırköy" on the one screen that just measured
where you are. One line, no lecture around it.

**Never hardcode the province either.** Profile printed `${city}, İstanbul`,
which was fine while the only names were four İstanbul neighbourhoods and became
"Kumluca, İstanbul" the moment a device answered from Antalya. The il travels
with the neighbourhood on the store (`region`, defaulted to İstanbul so the
quick-picks are right without knowing better). Same shape as the rule below, and
as the stored `gamesTurnedUp`: something fixed welded onto something that varies.

**Never weld a Turkish case ending onto a `{hole}`.** `"{city}'e"` is right for
Kadıköy and wrong for Beşiktaş'**a**, Moda'**ya**, Şişli'**ye** — vowel harmony,
plus a buffer letter after a vowel. Numbers are worse, because the suffix
harmonises with how the number is *read*: `₺130'dan` (otuz) but `₺180'den`
(seksen). Use a postposition — *çevresinde*, *yakınında*, *tarafında*, *ve
üzeri* — which inflects nothing. `check-strings.py` fails the build on the
welded shape.

**Three steps, not four.** The rail counted Ready as a step; Ready is the payoff.
The sign-in screen promises "three questions, about a minute" and the rail has to
count the same three.

**Ready is the payoff, so it shows the product, not a receipt.** Three
check-marked rows repeating Sports / Level / Where two taps after the account
card showed the same answers is a receipt. One muted line confirms; the room goes
to two real matching games. The count and the cards come from one filter shared
with Place and the sign-in screen — a third answer to "how many games are near
me" on consecutive screens is what nobody notices in review and everybody notices
on a phone.

## Reliability, as a record

**One card, in `components/cards.tsx`.** Your profile and every player profile
drew it from their own copy of the markup, and carried the same faults each.

**The strip always draws one tick per game.** A "nothing missed" case used to
swap the ticks for a filled rail with the streak in white inside it, which read
as a progress bar at 100%. The reasoning — identical ticks are a chart shape
carrying no information — is wrong: the ticks are countable, and the *since →
today* axis under them says over what span. The rail threw that away and left the
axis dating nothing.

**Say the fact once.** `100%`, `turned up to 12 of 12 games`, `12 IN A ROW` and
`no missed games` are one sentence four times. The percentage and the counts
stay; the streak is stated only when the percentage does not already imply it
(at 16 of 17, *4 in a row* is the thing a host wants); the colour legend appears
only when there is an orange tick to explain.

**No medal.** It was a raster rosette with gloss and a drop shadow, in nothing
like the flat house style, it was the loudest thing on a card whose point is a
number, and it was handed to every seeded player including the three who have
missed a game.

**`gamesTurnedUp` is derived, never stored** — `turnedUpOf`, beside
`personReliability` and `streakOf`. As a stored field it drifted from
`gamesPlayed` the moment either was edited: Mert reached `gamesPlayed: 17,
gamesTurnedUp: 49` and his profile read "turned up to 49 of 17 games" beside a
94% worked out from a different pair of numbers. The no-show record is the one
fact; the rest is arithmetic on it.

## Eligibility, and the fee

Two product rules the UI is built around, recorded because they change what the
screens are allowed to say:

**A game you cannot join is not shown.** Discover and Search filter by level, per
sport — a tennis game is judged by your tennis level, not your padel one. The one
exception is a host who has opted in (`openToAllLevels`), which is asked once on
the Create form and is **off by default**. That opt-in is the only thing that makes
"ask to join anyway" a real offer rather than a dead end, and it gives the activity
screen its three honest states: in band → Join · opted in → Join anyway · closed →
"Not open at your level", with no button.

**Socius takes 10%.** `FEE_RATE` in the seed, disclosed on the activity's price
line and broken out on Pay, never sprung at checkout. The deck previously said
"free while in beta", which was a promise nobody had made.

There is no Pro tier. The filters it used to gate are simply filters.

## The bulletin

Sports news lives on one pushed screen, reached from a **newspaper button in the
Discover header** beside the bell. Not a sixth tab (five is the ceiling, and a tab
would say reading is one of the five things this app is for) and not merged into
notifications (the bell means *something happened to you*; sharing that dot costs
it its meaning).

**One ranked feed, mixed.** Near-you and world sport are interleaved and ranked
together, not split into two lists or a segmented control. Two sources of truth
feed it:

| | comes from | kicker | tapping it |
|---|---|---|---|
| local | Socius's own data — new venues, host tournaments, court prices, leagues with spots | `MODA · 4H` (neighbourhood) | an internal screen, often a game |
| world | 1–2 licensed news feeds, ranked and summarised by AI | `FOOTBALL · FANATİK · 1H` (publisher) | a summary that links out |

**The publisher name in the kicker is the only thing separating them**, and it is
enough. It also does the attribution the feed deal requires, without importing a
single third-party logo into the palette — which is the reason kickers exist here
at all.

**The lead slot stays local.** This is the guardrail on the mix, not a layout
preference: ranked purely on interest, a Süper Lig headline beats a new court in
Kadıköy every day of the week, and the one thing only Socius can do gets buried by
the thing everyone else already does.

**A publisher story is summarised, credited and linked — never reproduced.** The
story screen is an AI summary labelled as one (`Summarised by Socius`), a
full-width **Read the full story on ‹source›** out-link, and then Socius's own
contribution: the loop-closer, *"4 padel games in Kadıköy · from ₺130"*. Reprinting
the publisher's text would be someone else's copyright, and the summary plus the
local hook is the better product anyway.

**Say why it is in the feed, never a score.** A ranked feed has to be accountable,
and the lock already forbids invented match percentages: the story footer reads
*"In your feed because you play padel"*, under the same `lightning` icon Discover
uses for "Matches your padel level".

Other rules the screen holds to:

- **Three item shapes**: a lead (photo, white display headline over a scrim), a
  brief (kicker + headline), and an actionable row (46px thumb + caret) for items
  that leave the bulletin for a game. A wall of identical cards is the
  generated-UI tell.
- **World briefs carry no image.** The repo's seven photographs cover the four
  local sports; publisher thumbnails are a rights question, not a design one.
- **Orange is rationed to one time-boxed item per screen** (`ENTRIES CLOSE FRI`).
  Every news app wants BREAKING badges; that is how the ≲5% accent budget dies.
- **White type on a photo** is allowed on the lead and nowhere else, and it is
  measured, not eyeballed: against the scrim's worst pixel the 21px headline runs
  6.36:1 and the 11px kicker 4.89:1 (`rgba(16,26,43,0) 22% → .62 58% → .93 100%`,
  kicker at 88% white).

Named **Bulletin / Bülten**, not News/Haberler: "bulletin" promises curated and
short, "news" promises infinite.

## Do not

- No gradients as decoration (scrims over photos only).
- No fake iOS status bar, no fake home indicator, no fake keyboard.
- No emoji as icons. No second accent hue.
- No invented "match %" scores — state the actual reason ("Matches your padel level").


## Bilingual (English / Türkçe)

Each artboard carries a `lang` enum tweak (English | Türkçe). Every translatable text node is a
`{{t.kN}}` hole fed by `renderVals()`; the pair lives in `design/strings.json` as a flat
English → Turkish map, and `design/build-artboards.py` does the substitution at build time.
Text NOT in the map stays literal in both languages: numbers, prices, levels, personal names,
place names, and the wordmark.

Turkish conventions applied, not just word swaps: times use a dot (`19.30`), decimals use a
comma (`1,4 km`), thousands use a dot (`9.412`), and percentages lead (`%98`, not `98%`) — which
is why the reliability figure is one text node rather than a number plus a styled percent sign.

Tweaks do not cross artboards, so there is no single global switch — each artboard is its own
sandboxed frame with its own props. What the build controls instead is the language every
artboard OPENS in: `python3 design/build-artboards.py` ships a Türkçe-default deck, and
`--default-en` flips the whole set back to English. The per-screen tweak still overrides either.

The System sheet stays English whichever way it is built — its labels are design vocabulary
(hex values, px, type names) that developers use in English.


## Presentation board

The canvas is organised as a pitch deck across five named pages, opening on the cover:

1. **Cover** (1440×900) — the product question, the problem, the four pillars, the north star,
   and the loop as five linked steps.
2. **1 · Onboarding** — Welcome, Sports, Level, Ready.
3. **2 · The loop** — Discover → Join → Play → Rate → Reputation, one screen per step, in the
   order the argument runs.
4. **3 · Supply & money** — Create, Course, Search, Pro.
5. **4 · System** (1440×900) — palette with verified contrast ratios, type scale, spacing,
   components, the icon set.

Each page carries one sticky note narrating what the row is arguing, so the board reads without
a presenter. The two wide boards are English-only — they are internal spec and pitch surfaces,
and the design vocabulary on the system sheet is English by convention. Every phone screen is
bilingual.

## The landing page (web surface)

`landing/` — an Astro static site, Türkçe, structurally modelled on fastht.ml at the
user's request: a floating pill nav, sticker-shadowed pill controls, scattered confetti,
and full-bleed colour bands alternating down the scroll. **The palette and the type stay
this lock's.** fastht.ml supplied the shape; nothing of its colour or typography crossed.

Structure (recorded so the next build rotates against it): macrostructure **Long-Scroll
Narrative**; archetypes **N3** floating pill nav · **H5** illustration centrepiece hero ·
**F4** numbered step sequence + **F1** alternating bands · **P4** honest receipt ·
**C2**+**C1** statement and inline form · **Ft4** statement close. Band order: paper hero →
white problem → paper loop → **deep blue** level → paper reliability → white neighbourhood →
paper price → **blue tint** FAQ → **deep blue** close → ink footer.

**Three substitutions carry the inspo without breaking the lock:**

- fastht.ml's Deep Aubergine band becomes **`#0B2E7A`**; its Periwinkle band becomes
  **`#E3ECFF`**. Verified: white/deep-blue 12.46, `#B9CBF2`/deep-blue 7.64, tint/deep-blue
  10.50, ink/tint 14.70, muted/tint 5.23, `#A9B4C6`/ink 8.33, `#FFB27A`/deep-blue 7.06.
- **The CTA is not black.** fastht.ml makes every primary action `#000000`; this lock
  already owns an action colour, so primary stays `#1350C8` and the on-dark variant is a
  white pill with deep-blue text.
- **The confetti carries no yellow.** The yellow rule holds — `#F7C23B` stays inside
  illustrations, so the decorative shapes draw from blue, sky, orange and the two tints,
  with orange rationed to one shape against the ≲5% accent budget.

**A second elevation exists here and only here.** The lock allows one soft shadow; the
sticker emboss (`--sticker`) is the whole point of the fastht.ml control language, so it
is added as a web-only token, recut in ink rather than pure black. It never ships to the app.

**Assets.** Four new illustrations by the same route as the app's (GPT-Image via the Codex
CLI, briefs in `design/landing/brief-*.md`): `land-hero`, `land-map`, `land-level`,
`land-trust`. The map took two passes — the first came back **isometric**, with boxed
buildings and a tilted ground plane, which is the one thing the illustration brief has
always forbidden; the re-brief leads with "flat plan view, every building has ONE face"
and that fixed it. `design/landing/trim.py` crops each spot to its ink, because the
generator leaves half the canvas empty and the figures otherwise render tiny.

**The product shots are real.** `design/landing/shoot.py` builds the Türkçe artboard
preview (`build-artboards.py --tr`) and screenshots each of the 23 screens at 390×844 @2x
with headless Chrome. Nothing on the page is a redrawn mockup. Note for whoever runs it:
`--window-size` counts browser chrome, so the script asks for 96px more height than it
wants and crops back — without that the bottom 88px of every screen is missing. The same
clamp bites when checking mobile: headless will not go below ~485px wide, so a narrow
window silently screenshots a slice of a wider layout. Measure 390px in an iframe instead.

**Numbers on the page are the app's own or nothing.** The reliability screen is captioned
`ÖRNEK PROFİL` rather than quoted as traction, and the price band uses the exact figures
from the Pay screen (₺180 + %10 = ₺198). No player count is claimed anywhere; the seeded
"9.412 oyuncu" string was deliberately left off.

**Motion**: `motion` (the Framer Motion team's vanilla package) — a staggered hero
entrance, `inView` reveals, and scroll-linked confetti drift. The pre-animation state
lives in exactly one CSS rule gated on a `.js` class, and an inline head script removes
that class after 2.5s if the bundle never arrives — so a failed script shows a finished
page rather than a blank one. Reduced motion gets the finished page immediately. Confetti
rotation lives in the `rotate:` property, not `transform`, so Motion's `y` can compose
with it instead of wiping it.

### Renamed to Socius (2026-09-06)

The landing page shipped as **Socius** first. The rest of the repo — the app, the
artboard deck, `strings.json` and the `mark-socius.png` filename (formerly
`mark-avenza.png`) — followed on 2026-10-07. What still says Avenza on purpose: the
Neon project `avenza-landing`, the Expo `name`, `slug` and `scheme` in `mobile/app.json`,
and the `avenza-demo` AsyncStorage key, because changing them affects deployments,
deep links and saved demo state.

The mark itself carries over unchanged: it is two figures, not a wordmark, so it says
nothing about the name.

**Turkish suffix note.** "Avenza" ends in a back unrounded vowel and took `-nın`
(*Avenza'nın*). "Socius" ends in a back **rounded** vowel, so the genitive is `-un`:
**Socius'un**. Straight apostrophe, matching `strings.json` (*İstanbul'da*,
*Caddebostan'da*), not the typographic one.
