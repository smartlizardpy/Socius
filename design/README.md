# Design

Source of truth for the screens, copy and artwork. The app, the landing page and the ad take their strings, icons and images from here. The palette and type rules live in `../.tastemaker/style-lock.md`.

```
src/*.body.html        screen markup, one file per artboard (edit these)
strings.json           English -> Turkish copy, used by the artboards and the app
assets/                icons (Phosphor SVGs), illustrations, img, gen (AI art), photos, news
briefs/                prompts and briefs for generated art and for the landing page
screenshots-raw/       raw phone screenshots, kept for reference
canvas/                GENERATED: *.dc.html artboards, canvas.json (layout), the published bundle
preview/index.html     GENERATED: every screen in one page, for a browser look
landing/               shoot.py + trim.py: capture the preview into 2x PNGs for the landing page
build-artboards.py     src/*.body.html + strings.json -> canvas/*.dc.html and preview/index.html
build-canvas.py        canvas/*.dc.html + canvas.json -> canvas/socius-mobile-app.html
```

## Rebuilding

From the repo root, with `pip install -r requirements.txt` done once:

```bash
python3 design/build-artboards.py --default-en     # artboards and preview
python3 design/build-canvas.py                     # the bundle (uses the existing bundle as its shell)
```

Notes:

- `build-artboards.py` sets the artboards' default language: Turkish without `--default-en`, English with it. The committed `*.dc.html` files and the committed bundle and preview were not all built with the same setting, so a rebuild changes the default language in some of them. Check `git diff` before committing generated files.
- Every `*.dc.html` references `./support.js`, which is not in the repo. The artboards render inside the published canvas bundle, not on their own.
- `landing/shots/` holds a 2x PNG of every screen. The landing page uses a few of them, copied by hand into `../landing/src/assets/shots`.
