# Socius — landing page

Türkçe marketing page for Socius. Astro, mostly static, with one server route for beta
signups.

The product was called **Avenza** until 2026-09-06. The rename was scoped to this page —
the app, the artboard deck, `strings.json` and the Neon project name all still say Avenza.

Design comes from `../.tastemaker/style-lock.md` — the same palette and type as the app.
The page's *shape* (pill nav, sticker-shadowed controls, confetti, alternating full-bleed
bands) is modelled on fastht.ml; its colours and typefaces are not. See the
"landing page (web surface)" section of the lock for what was substituted and why.

## Running it

```sh
pnpm install
pnpm astro dev --background     # stop / status / logs via `pnpm astro dev <cmd>`
pnpm build && pnpm preview
```

`pnpm build` needs `sharp` (already a dependency) to optimise the images.

## Environment

Copy `.env.example` to `.env`. `DATABASE_URL` is the only required variable. It points at
the Neon project **avenza-landing** (`winter-union-03799148`) — named before the rename.

`.env` is gitignored and holds a database password — keep it that way.

## Beta signups

The form in the closing band posts to `src/pages/api/beta.ts`, which writes to
`beta_signups` in Neon:

| column | |
|---|---|
| `email` | lowercased and trimmed, unique |
| `semt` | one of `kadikoy` `moda` `caddebostan` `diger`, else null |
| `source` | `landing` |
| `created_at` | |

Behaviour worth knowing before you change it:

- A repeat signup is **not** an error. It updates the neighbourhood and answers 200 —
  telling someone "you're already on the list" leaks who is on it.
- An unrecognised `semt` is stored as null rather than rejected. A wrong dropdown value
  should never cost you the address.
- There is a hidden honeypot field (`website`). If it is filled the request answers 200
  and stores nothing, so a bot learns nothing.
- With JavaScript the form submits in place. Without it, the endpoint answers `303` to
  `/tesekkurler`, which is why that page exists.
- Astro's CSRF origin check is on, so a POST without a matching `Origin` header is
  refused. Browsers send one; `curl` needs `-H origin:http://localhost:4321`.

Reading the list:

```sh
psql "$DATABASE_URL" -c "select email, semt, created_at from beta_signups order by id desc;"
```

## Regenerating the assets

Both scripts live in `../design/landing/` and write into this project's `src/assets/`.

**App screenshots** (`shots/`) — real captures of the app's own artboards, not mockups:

```sh
cd .. && python3 design/build-artboards.py --tr && python3 design/landing/shoot.py
```

Two things that will bite you: `--tr` is what makes the preview Turkish, and headless
Chrome's `--window-size` counts browser chrome, so the script asks for 96px of extra
height and crops back. Without that the bottom 88px of every screen goes missing.

**Illustrations** (`illo/`) — GPT-Image via the Codex CLI, same route as the app's art:

```sh
cd .. && codex exec --sandbox workspace-write --skip-git-repo-check - < design/briefs/landing-a.md
python3 design/landing/trim.py landing/src/assets/illo/land-*.png
```

The briefs are deliberately long: they carry the hard-won rules (solid `#FBF8F3` ground,
never transparent, never a checkerboard, flat vector, no isometric). `trim.py` crops each
spot to its ink, because the generator leaves half the canvas empty.

## Deploying

Live at **https://sociussports.vercel.app** — Vercel project `sociussports` under
`smartlizardpy-9493s-projects`, built with `@astrojs/vercel`.

```sh
vercel deploy --prod --yes      # production
vercel deploy --yes             # preview
vercel inspect <url>            # deployment detail
```

Every page is prerendered; only `/api/beta` runs as a function. `DATABASE_URL` is set in
the project's **Production** and **Development** environments.

`.vercelignore` excludes `.env` — the database password must never be uploaded. Vercel
reads `DATABASE_URL` from the project environment instead.

Two things to fix when convenient:

- **Preview has no `DATABASE_URL`.** Vercel CLI 52 will only add a preview variable with
  the value in `--value`, which puts the password in the process list. Either upgrade the
  CLI (`pnpm add -g vercel@latest`, currently 7 majors behind) and run
  `vercel env add DATABASE_URL preview --yes`, or add it in the dashboard. Until then a
  preview deploy renders fine but its signup form returns "Kaydedemedik".
- **Local `pnpm build` warns that Node 25 is unsupported** by Vercel Functions. Harmless,
  because deploys build remotely on Vercel's own Node. It would matter if you ever ran
  `vercel deploy --prebuilt`.

## Still open

- `/gizlilik` and `/kosullar` are linked in the footer but not written yet — both 404.
- `PUBLIC_CONTACT_EMAIL` still defaults to `merhaba@socius.app`, which may not exist. It
  is only used for the mailto fallback shown when no database is configured.
- Swap the signup CTA for App Store / Play links once the app ships.
- If a custom domain replaces `sociussports.vercel.app`, update `site` in
  `astro.config.mjs` too — it builds the canonical and OG URLs.
