#!/usr/bin/env python3
"""Cut the three explainer illustrations down to what the phone actually draws.

The generated art arrives 1448x1086 with the subject floating in a lot of paper,
and each of the three sits in a different amount of it — 1.65, 1.91 and 1.01
aspect once the paper is trimmed off. Dropped into a paged carousel as-is, the
figures would change size from panel to panel and the headline under them would
shift.

So: trim each to its ink, then letterbox all three back to one aspect. Because
the panel scales art to fit its HEIGHT, normalising this way makes the people
the same size on all three pages, which is the thing the eye actually tracks.

Unlike the earlier onboarding pair these come back as opaque RGB on the paper
colour, exactly as briefed, so there is no checkerboard to key out — but this
still checks, because that failure was silent last time.

    python3 scripts/gen-onboarding-art.py
"""
import pathlib, sys
from PIL import Image, ImageChops

ROOT = pathlib.Path(__file__).resolve().parent.parent.parent
GEN = ROOT / "design/assets/gen"
OUT = ROOT / "mobile/assets/img"

PAPER = (251, 248, 243)
GROUND_TOL = 12       # how far off the paper colour still counts as ground
# name -> the aspect its slot on screen is drawn at.
#
# The three explainer panels share one aspect on purpose: they sit in a carousel,
# and because the panel scales art to fit its HEIGHT, a shared aspect makes the
# people the same size on all three pages — the thing the eye actually tracks as
# you swipe. `place` and `account` have a screen each, so they simply take the
# shape of the box they are drawn in.
JOBS = {
    "onb-how-find": 1.5,      # 3:2, near the mean of the three trimmed shapes
    "onb-how-match": 1.5,
    "onb-how-play": 1.5,
    "onb-how-join": 1.5,
    "onb-place": 350 / 263,
    "onb-account": 260 / 185,
}
MARGIN = 0.035        # breathing room around the ink, as a share of the long side
WIDE = 1200           # 400pt at 3x


def normalise_ground(im: Image.Image) -> Image.Image:
    """Snap a near-paper background to exactly the paper colour.

    The generator lands within a couple of RGB values of `#FBF8F3` and not always
    the same couple, which does not matter until the letterbox pads the frame out
    with the exact colour — then the pasted crop shows as a faint rectangle
    against its own padding. Asking the model for pixel-exact corners cost it
    three extra passes and it still missed; doing it here costs nothing.
    """
    bg = Image.new("RGB", im.size, PAPER)
    ground = ImageChops.difference(im, bg).convert("L").point(
        lambda v: 255 if v <= GROUND_TOL else 0
    )
    out = im.copy()
    out.paste(bg, mask=ground)
    return out


def ink_box(im: Image.Image):
    """Bounding box of everything that is not the paper colour."""
    bg = Image.new("RGB", im.size, PAPER)
    mask = ImageChops.difference(im, bg).convert("L").point(lambda v: 255 if v > 10 else 0)
    return mask.getbbox()


def is_checkerboard(im: Image.Image) -> bool:
    """The trap from the last batch: a transparency checkerboard painted into
    the pixels rather than carried in an alpha channel. It shows up as two light
    achromatic tones each holding a large share of the frame."""
    small = im.resize((240, 180), Image.NEAREST)
    counts = {}
    for px in small.getdata():
        r, g, b = px
        if min(r, g, b) > 235 and max(r, g, b) - min(r, g, b) < 6 and px != PAPER:
            counts[px] = counts.get(px, 0) + 1
    top = sorted(counts.values(), reverse=True)[:2]
    return len(top) == 2 and sum(top) > 240 * 180 * 0.15


def main():
    OUT.mkdir(parents=True, exist_ok=True)
    for name, aspect in JOBS.items():
        src = GEN / f"{name}.png"
        if not src.exists():
            sys.exit(f"missing {src.relative_to(ROOT)} — run the image brief first")

        raw = Image.open(src)
        if raw.mode == "RGBA":
            flat = Image.new("RGB", raw.size, PAPER)
            flat.paste(raw, mask=raw.split()[3])
            raw = flat
        else:
            raw = raw.convert("RGB")

        raw = normalise_ground(raw)

        if is_checkerboard(raw):
            sys.exit(f"{name}: transparency checkerboard painted into the pixels — "
                     f"run scripts/keyout-checkerboard.py on it first")

        box = ink_box(raw)
        if box is None:
            sys.exit(f"{name}: nothing but paper")
        cut = raw.crop(box)
        w, h = cut.size

        pad = int(round(max(w, h) * MARGIN))
        w, h = w + pad * 2, h + pad * 2

        # letterbox to the shared aspect, whichever axis is short
        if w / h < aspect:
            w = int(round(h * aspect))
        else:
            h = int(round(w / aspect))

        canvas = Image.new("RGB", (w, h), PAPER)
        canvas.paste(cut, ((w - cut.width) // 2, (h - cut.height) // 2))

        out_h = int(round(WIDE / aspect))
        canvas = canvas.resize((WIDE, out_h), Image.LANCZOS)
        # flat vector art has few colours; an adaptive palette is near-lossless
        # here and a third the size of truecolour PNG
        canvas.convert("P", palette=Image.ADAPTIVE, colors=128).save(
            OUT / f"{name}.png", optimize=True
        )
        print(f"{name:16} {box[2]-box[0]}x{box[3]-box[1]} ink -> {WIDE}x{out_h}  "
              f"{(OUT / f'{name}.png').stat().st_size // 1024} KB")


if __name__ == "__main__":
    main()
