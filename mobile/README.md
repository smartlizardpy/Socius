# Socius app

Expo SDK 54 / React Native 0.81 / expo-router 6, TypeScript strict. All data is sample data and the state is kept on the device; there is no backend yet. `HANDOFF.md` walks through what each screen does.

Read the [Expo SDK 54 docs](https://docs.expo.dev/versions/v54.0.0/) before touching Expo APIs (see `AGENTS.md`).

```bash
npm ci
npm start             # then i / a / w, or scan the QR with Expo Go
npm run web           # http://localhost:8081
npm run typecheck
```

Reset the demo any time from **Profile → Reset the demo**.

## Layout

```
app/                      expo-router routes: one file per screen
  (tabs)/                 Discover, Search, Create, Games, Profile
  onboarding/             welcome flow
  activity/ course/ pay/ player/ rate/ venue/ bulletin/   detail screens
src/
  components/
    ui/                   shared building blocks, one file per family
                          (layout, buttons, card, avatars, rails, chips,
                          controls, rows, sheet, toast, stats); import from
                          'components/ui' (index.ts re-exports all of it)
    cards.tsx             list cards (activity, venue, player)
    Icon.tsx  Txt.tsx  motion.tsx  Flag.tsx  VenueMap.tsx  ...
  data/
    seed/                 sample data by domain (people, activities, levels,
                          reviews, courses, notifications, fee, create,
                          matching); import from 'data/seed'
    activities.ts venues.ts bulletin.ts   hooks that combine the store with the seed
    semts.ts              neighbourhoods and the coverage area
    *.json                bulletin feed and ads
  generated/              written by scripts/, do not edit by hand
  lib/location.ts         device location
  store.ts                global store (useSyncExternalStore + AsyncStorage)
  i18n.tsx                t() / tf(); Turkish strings come from generated/strings.gen.ts
  theme.ts                design tokens (copy of .tastemaker/style-lock.md)
scripts/                  Python generators and checks, run from the repo root
assets/                   images, icons, splash
```

## Generated files

`src/generated/*.gen.ts` are produced from `../design`. After changing `design/strings.json`, the icons, or the news photos:

```bash
python3 mobile/scripts/gen-strings.py
python3 mobile/scripts/gen-icons.py
python3 mobile/scripts/gen-news-images.py
python3 mobile/scripts/check-strings.py   # every t() string has a Turkish entry
```

Run these from the repo root, with `pip install -r requirements.txt` done once.

The product was renamed from Avenza to Socius; `app.json` (`name`, `slug`, `scheme`) and the `avenza-demo` storage key in `src/store.ts` still use the old name on purpose. See the root README.
