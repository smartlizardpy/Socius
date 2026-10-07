# Socius

Find and join local sports games (padel, football, tennis, running) in Istanbul. This repo holds the app, the marketing site, the launch ad, and the design and research that feed them.

The sub-projects are independent: there is no root `package.json`, and each has its own dependencies.

| Folder | What it is | Stack | Package manager |
|---|---|---|---|
| [`mobile/`](mobile) | The app | Expo SDK 54, React Native, expo-router | npm |
| [`landing/`](landing) | Marketing site and beta sign-up (Turkish) | Astro, Vercel, Neon Postgres | pnpm |
| [`ad/`](ad) | The 30 s vertical launch ad | Remotion | npm |
| [`design/`](design) | Screen designs, strings, icons and illustrations, plus the Python that builds them | HTML, Python | — |
| [`research/`](research) | Competitor research and the lip-sync notes. Not code | Python, screenshots | — |
| [`.tastemaker/`](.tastemaker) | `style-lock.md`, the design-system source of truth (palette, type, rules) | — | — |

## Running things

```bash
# app
cd mobile && npm ci && npm start          # i / a / w, or scan the QR with Expo Go
cd mobile && npm run typecheck

# landing page
cd landing && pnpm install && pnpm dev    # needs Node 22.12+ and landing/.env (see .env.example)

# ad
cd ad && npm ci && npm run dev            # Remotion Studio
cd ad && npm run render                   # out/socius-halisaha.mp4

# Python tooling (design builds, asset and string generators)
python3 -m pip install -r requirements.txt
```

## How the pieces connect

The app's strings, icons and images are generated from `design/`. Run the generators from the repo root after changing a source file, and commit the output.

```
design/strings.json          --mobile/scripts/gen-strings.py-->      mobile/src/generated/strings.gen.ts
design/assets/icons/*.svg    --mobile/scripts/gen-icons.py-->        mobile/src/generated/icons.gen.ts
design/assets/news/*         --mobile/scripts/gen-news-images.py-->  mobile/src/generated/news-images.gen.ts
design/assets/gen/*          --mobile/scripts/build-assets.py, gen-onboarding-art.py-->  mobile/assets/img

design/src/*.body.html       --design/build-artboards.py-->          design/canvas/*.dc.html, design/preview/index.html
design/canvas/*.dc.html      --design/build-canvas.py-->             design/canvas/socius-mobile-app.html
```

`mobile/scripts/check-strings.py` checks that every `t()` string in the app has a Turkish entry.

The design tokens (palette, type, spacing) are written down in `.tastemaker/style-lock.md` and copied by hand into three places. Change all three together:

- `mobile/src/theme.ts`
- `ad/src/theme.ts`
- `landing/src/styles/tokens.css`

## Naming

The product was called Avenza until 2026-09-06 and is now **Socius**. Three things still say Avenza on purpose, because changing them touches deployments, deep links or saved state: the Expo `name`, `slug` and `scheme` in `mobile/app.json`, the `avenza-demo` AsyncStorage key in `mobile/src/store.ts`, and the Neon project `avenza-landing`.

"Halı saha" in file and composition names is the Turkish word for a five-a-side pitch, not the old name.
