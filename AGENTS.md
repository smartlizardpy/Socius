# Guide for AI agents

Read this before changing anything. It applies to every agent (Claude Code, Codex, Cursor and so on) in every sub-project. The sub-project `AGENTS.md` files add rules for their own folder and do not override these.

## How changes get in

1. **Never commit to `main` and never push to it.** Work on a branch (`feat/…`, `fix/…`, `chore/…`, `docs/…`).
2. **Every change goes through a pull request.** No exceptions, including docs and one-line fixes.
3. **A maintainer must review and approve each PR before it is merged.** The maintainer is Ozan Kaygusuz (GitHub: `@smartlizardpy`). Agents never approve or merge their own PRs, and never merge on the maintainer's behalf unless they tell you to in that session.
4. **Merges are squash merges.** The PR title becomes the commit message on `main`, so write it as the final commit message: imperative, specific, under about 70 characters.
5. **One concern per PR.** Don't mix a refactor with a behaviour change or a rename. Large moves go in their own PR, with moves and edits kept apart so the diff can be read.
6. **Never force-push or rewrite history on `main`.** Force-pushing your own PR branch is fine.

### Pull request description

- What changed and why, in a few lines.
- How you checked it: the commands you ran and what they showed. If something wasn't run, say so.
- Anything the maintainer must decide or double-check.

Don't add `Co-Authored-By` lines or "Generated with …" footers to commits or PR descriptions. The code is the maintainer's.

### Commits

Commits are authored as the maintainer (`smartlizardpy@duck.com`). That is already set in the global git config, so don't override `user.email` or `user.name`. Write plain commit messages, with no trailers.

## Before you open a PR

Run what applies to the folders you touched:

| Folder | Check |
|---|---|
| `mobile/` | `npm run typecheck` |
| `ad/` | `npm run typecheck` |
| `landing/` | `pnpm build` |
| `design/`, generators | re-run the generator and read `git diff` (see below) |

## Project map

See `README.md` for what lives where and how to run it. In short: `mobile/` is the app, `landing/` the marketing site, `ad/` the video, `design/` the design source, `research/` one-off research (don't edit it as code).

## Rules that are easy to get wrong

- **Package managers:** `mobile/` and `ad/` use **npm** (keep `package-lock.json`). `landing/` uses **pnpm**. Don't create a second lockfile in any of them.
- **Generated files are never edited by hand:** `mobile/src/generated/*`, `design/canvas/*.dc.html`, `design/canvas/socius-mobile-app.html`, `design/preview/index.html`. Change the source (`design/strings.json`, `design/src/*.body.html`, `design/assets/…`), re-run the generator, and commit both. Read the diff first: rebuilding the design files can flip the default language (see `design/README.md`).
- **User-facing strings** go through `t()` / `tf()`. Add the English and Turkish entries to `design/strings.json`, run `gen-strings.py`, then `check-strings.py`.
- **Design tokens** (colours, type, spacing) exist in three places: `mobile/src/theme.ts`, `ad/src/theme.ts`, `landing/src/styles/tokens.css`. If you change one, change all three and update `.tastemaker/style-lock.md`.
- **Name:** the product is **Socius**. Don't rename the things that still say Avenza (`name`, `slug` and `scheme` in `mobile/app.json`, the `avenza-demo` key in `mobile/src/store.ts`, the Neon project) without asking: they affect deployments, deep links and saved state.
- **Expo:** read the [SDK 54 docs](https://docs.expo.dev/versions/v54.0.0/) before using Expo APIs (see `mobile/AGENTS.md`).
- **Secrets:** never commit `.env` files or credentials. `landing/` reads `DATABASE_URL` from the environment.
- **Don't run destructive operations on shared services** (Neon branches or databases, Vercel deployments) without asking the maintainer first.
