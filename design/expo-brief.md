# Build a high-fidelity Expo demo of Avenza

Run this from `/home/ozi/Projects/avenza`. A complete, finished design already exists in this
repo. **You are porting it, not redesigning it.** Every visual decision is settled and recorded —
if you find yourself choosing a colour, a size or a spacing value, stop and go read the source
instead.

## What Avenza is

A mobile social app for finding people to play sport with in Istanbul. You set the sports you
play and your level; the app shows activities near you ranked by level and distance; you join,
you play, then both sides rate each other. Attendance and ratings build a reliability score, and
that score makes the next recommendation better. The loop is:

**Discover → Join → Play → Rate → Reputation → better matches → play again**

The trust layer is the differentiator. Nobody else knows whether the stranger you matched with
will actually turn up, or is really the level they claim.

## Read these first, in this order

1. `.tastemaker/style-lock.md` — the colour contract, type scale, spacing, shape and asset
   rules. This is the source of truth. Obey it exactly.
2. `design/src/*.body.html` — one file per screen. Each is a single 390×844 root div built from
   flex rows and columns with `gap`, inline styles only. This is your layout reference; read the
   screen you are porting before you write it.
3. `design/strings.json` — a flat English → Turkish map. This becomes your i18n dictionary
   verbatim.
4. `design/assets/img/` — every photo, avatar and illustration, already cropped and optimised.
   Copy them into the Expo app's assets folder and `require()` them.
5. `design/assets/icons/*.svg` — Phosphor icons. Each contains one or more
   `<path fill="currentColor" d="…"/>` on a `0 0 256 256` viewBox. Extract the `d` strings and
   render them with `react-native-svg`; do not add an icon library and do not swap icon sets.

## Design tokens — use these exact values, never approximations

    ink            #101A2B   all primary text
    ink muted      #5A6172   secondary text
    paper          #FBF8F3   page background
    surface        #FFFFFF   cards
    blue           #1350C8   ACTION only — join, continue, publish, pay
    deep blue      #0B2E7A
    blue tint      #E3ECFF
    orange         #F0651C   energy and urgency only
    deep orange    #B8430C   orange used as text on a light ground
    orange tint    #FFE7D6
    hairline       #EFEAE1 on white · #EDE7DC on paper
    rail track     #E6E0D5
    control ring   #8F8778   unselected radios, empty slots

Two hard contrast rules, both verified: **white text on orange is banned** (3.19:1) — orange
fills always carry ink text. **Ink text on blue is banned** (2.84:1) — blue fills carry white.
Orange as small text on a light ground must be `#B8430C`.

Type: `Bricolage Grotesque` 700 for headings and numerals, `Instrument Sans` 400/500/600/700 for
everything else. Install `@expo-google-fonts/bricolage-grotesque` and
`@expo-google-fonts/instrument-sans`, load with `useFonts` in the root layout and hold the splash
screen until they resolve.

Shape: cards 20–24 radius, inner media 14–16, buttons and chips fully round, one soft elevation
only, 44px minimum for anything tappable, 20px screen gutter.

## Stack

- Expo (latest SDK) with **expo-router** for file-based routing.
- **react-native-reanimated** v4 for all motion. **expo-haptics** for touch feedback.
- **react-native-svg** for icons and the drawn map/flags. **expo-linear-gradient** for the scrims
  over photos.
- **react-native-safe-area-context** — every screen's top spacing comes from `useSafeAreaInsets`,
  not a hardcoded number.
- No backend, no auth, no network. All state is local: a seed JSON plus React context or a small
  Zustand store. Persist joins with AsyncStorage so they survive a reload — that detail makes the
  demo feel real.

## Scope — build this path first, and build it properly

Welcome → Sports → Level → Ready → Discover → Activity detail → Join → Rate

That is the argument the product makes, end to end. Get those seven screens genuinely excellent
before touching Games, Profile, Create, Course, Search, Pro or Pay. A polished short path beats
thirteen rough screens.

## What must actually work

- Tab navigation (Discover, Search, Create, Games, Profile) with the orange centre button.
- Push navigation from a feed card into the activity detail, and from a player into their profile.
- Sport filter chips on Discover really filtering the list.
- **Join**: pressing it decrements spots left, slots your avatar into the participant row, and
  flips the button to a joined state. This is the money interaction of the demo — make it feel
  good.
- The level picker selecting, and the level rail reflecting the choice.
- Rating: tapping stars, toggling the tags, choosing below/spot-on/above, advancing to the next
  player.
- Language: one **app-wide** English/Türkçe switch driven by `strings.json`. In the mockups this
  had to be per-screen because of a canvas limitation; in a real app it should be global, so do
  it properly here.

## Motion — specific, not decorative

Restraint is the brief. Every animation below carries information; nothing loops, nothing
floats, nothing is ambient. If removing an animation loses the user nothing, remove it.

- **Screen transitions**: native stack defaults, 300–350ms. Do not hand-roll page transitions.
- **List entrance**: cards fade and rise 12px, staggered 45ms, capped at the first 6 items.
  Entrance only — never re-run on re-render.
- **Join**: press scales the button to 0.97 with a spring. On success, the spots counter counts
  down, the empty dashed slot fills with the new avatar on a spring, and a light haptic fires.
- **Level rail**: the orange "you" marker springs into its position on mount, once.
- **Reliability strip** (profile): the 41 bars grow in a 12ms stagger, the single orange missed
  bar landing last so the eye ends on it.
- **Rating stars**: each star pops as it is filled, with a light haptic per star.
- **Chips and tabs**: 150ms colour and background transitions, no movement.
- Durations: 150–250ms for UI feedback, 300–400ms for anything spatial. Use spring only for
  things that should feel physical (the avatar landing, the button press); use timing with a
  standard ease for everything else. No overshoot or bounce on buttons, modals or tooltips.
- Honour `useReducedMotion()` from Reanimated: spatial motion collapses to a ≤150ms opacity
  crossfade, never to nothing.

## Port pitfalls found while analysing the design — you will hit all of these

- Every string must sit inside `<Text>` or the app crashes. The HTML has bare text nodes.
- `letter-spacing` is in `em` in the source. React Native takes absolute numbers: multiply by the
  font size. The display type runs −0.02 to −0.045em and it matters at large sizes.
- `box-shadow` does not exist. Use `shadowColor`/`shadowOffset`/`shadowOpacity`/`shadowRadius` on
  iOS plus `elevation` on Android, and re-tune by eye — the shadows will not match automatically.
- The photo scrims are CSS gradients. Replace with `expo-linear-gradient` absolutely positioned
  over the image.
- `overflow: hidden` with rounded corners on images is unreliable on Android — set `borderRadius`
  on the `Image` itself.
- The mockups use a fixed 390×844 frame with a **44px top reserve** for the status bar. On device
  that becomes `insets.top`. Do not hardcode 44.
- Fixed heights that exist to make content fit an 844px artboard should become flex or a
  `ScrollView`. Bottom action bars stay pinned, with `insets.bottom` added to their padding.
- Turkish strings run longer than English. Check every screen in **both** languages before you
  call it done — this has already caused one overflow in the mockups.

## Non-negotiables

- No emoji anywhere, in UI or as icons.
- No fake status bar, no fake home indicator, no drawn keyboard — the OS draws those.
- Do not invent colours, screens, features or copy. Sample data (names, venues, prices, levels,
  ratings) comes from the mockups; keep it consistent across screens — Deniz Yılmaz hosts,
  Selin A., Mert K. and Ayça D. play, games are in Kadıköy and Caddebostan, prices in ₺.
- Do not add a payment step. It is a deliberate open question, not an oversight.

## Definition of done

`npx expo start` runs clean, and on a real phone through Expo Go you can: open the app, pick
sports, set a level, land on Discover, filter by sport, open an activity, join it and see the
spot count change, then rate a player — in both English and Turkish, with the motion above, and
with no visual drift from `design/src/*.body.html`.

Work screen by screen. After each one, run it on a device and compare it side by side against
its `.body.html` reference before moving on. Report what you finished, what you deliberately
skipped, and anything in the design that did not survive the port.
