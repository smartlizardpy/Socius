#!/usr/bin/env python3
"""Put the Socius mark on the splash screen, the app icon and the favicon.

All four shipped as Expo's stock artwork — the grey concentric circles — which is
what Expo Go was still showing on launch.

The mark ships at 144px and there is no larger source, so a plain resize to 1024
would be a 7x upscale of antialiased edges: mush. The art is flat and holds four
colours, so this rebuilds it instead of stretching it — quantise to those
colours, upscale each colour's own mask, threshold it back to a hard edge, and
recomposite. Edges come out clean at any size because they are re-cut rather
than interpolated.

    python3 scripts/gen-app-icons.py
"""
import pathlib
from PIL import Image, ImageChops, ImageFilter

ROOT = pathlib.Path(__file__).resolve().parent.parent
SRC = ROOT / "assets/img/mark-socius.png"
OUT = ROOT / "assets"

PAPER = (251, 248, 243)
SUPER = 8        # mask working resolution, as a multiple of the source
COLOURS = 5      # the mark holds four, plus room for one blend


def palette(px, n=6, apart=70):
    """The mark's own colours, picked off the artwork rather than quantised.

    Pillow's quantiser is no use here: the frame is two thirds paper, so a
    six-colour median cut spends five of them on shades of cream and folds
    orange, cyan and ink into one olive. This takes the most common colour, then
    the most common colour far enough away from it, and so on.
    """
    counts = {}
    for c in px:
        counts[c] = counts.get(c, 0) + 1
    picked = []
    for c, _ in sorted(counts.items(), key=lambda kv: -kv[1]):
        if all(sum((a - b) ** 2 for a, b in zip(c, p)) > apart * apart for p in picked):
            picked.append(c)
        if len(picked) == n:
            break
    return picked


def redraw(size: int) -> Image.Image:
    """The mark at `size`, RGBA, edges re-cut rather than interpolated."""
    src = Image.open(SRC).convert("RGBA")
    box = src.split()[3].point(lambda v: 255 if v > 8 else 0).getbbox()
    src = src.crop(box)

    data = list(src.convert("RGBA").getdata())
    solid = [p[:3] for p in data if p[3] > 200]
    inks = palette(solid, COLOURS)

    def nearest(c):
        return min(range(len(inks)), key=lambda i: sum((a - b) ** 2 for a, b in zip(c, inks[i])))

    # every artwork pixel takes the nearest of the mark's own colours
    assigned = [nearest(p[:3]) if p[3] > 128 else -1 for p in data]

    big = (src.width * SUPER, src.height * SUPER)

    # Upscale each colour's mask, then round off the staircase the 144px source
    # pixels leave in it. Thresholding straight after the resize keeps the
    # outline crisp but keeps every jag too; blurring first at the working
    # resolution is what turns those back into curves.
    #
    # The shapes are then decided together rather than painted one over another.
    # Blurring five masks independently and thresholding each leaves them no
    # longer tiling: seams open between neighbours and whatever was painted first
    # shows through as a fringe — an orange hairline around the dark figure, in
    # this mark. Taking the strongest mask per pixel keeps the boundary shared.
    masks = []
    for i in range(len(inks)):
        m = Image.new("L", src.size, 0)
        m.putdata([255 if a == i else 0 for a in assigned])
        masks.append(m.resize(big, Image.BICUBIC).filter(ImageFilter.GaussianBlur(SUPER * 0.75)))

    best = masks[0]
    for m in masks[1:]:
        best = ImageChops.lighter(best, m)
    ink_only = best.point(lambda v: 255 if v >= 64 else 0)

    canvas = Image.new("RGBA", big, (0, 0, 0, 0))
    # broadest shape first, so a tie on the boundary falls to the larger area
    for i in sorted(range(len(inks)), key=lambda i: -assigned.count(i)):
        owns = ImageChops.difference(masks[i], best).point(lambda v: 255 if v == 0 else 0)
        canvas.paste(
            Image.new("RGBA", big, inks[i] + (255,)),
            mask=ImageChops.multiply(owns, ink_only),
        )

    return canvas.resize((size, size), Image.LANCZOS)


def place(mark: Image.Image, canvas: int, share: float, ground=None) -> Image.Image:
    """Centre the mark on a square canvas at `share` of its width."""
    w = int(round(canvas * share))
    art = mark.resize((w, w), Image.LANCZOS)
    if ground:
        out = Image.new("RGB", (canvas, canvas), ground)
        out.paste(art, ((canvas - w) // 2, (canvas - w) // 2), art)
        return out
    out = Image.new("RGBA", (canvas, canvas), (0, 0, 0, 0))
    out.paste(art, ((canvas - w) // 2, (canvas - w) // 2), art)
    return out


def main():
    mark = redraw(1024)

    # splash: expo-splash-screen sizes this itself from `imageWidth` in app.json,
    # so the file is the mark at full bleed and the padding is not baked in here
    place(mark, 1024, 0.94).save(OUT / "splash-icon.png", optimize=True)
    # iOS will not take an alpha channel, and it masks the corners itself
    place(mark, 1024, 0.64, ground=PAPER).save(OUT / "icon.png", optimize=True)
    # Android crops the foreground to a shape: everything must sit inside the
    # middle 66%, so the mark goes smaller than it does on iOS
    place(mark, 1024, 0.52).save(OUT / "adaptive-icon.png", optimize=True)
    place(mark, 48, 0.86, ground=PAPER).save(OUT / "favicon.png", optimize=True)

    for n in ("splash-icon", "icon", "adaptive-icon", "favicon"):
        f = OUT / f"{n}.png"
        im = Image.open(f)
        print(f"{n:14} {im.size[0]}x{im.size[1]} {im.mode:4} {f.stat().st_size // 1024} KB")


if __name__ == "__main__":
    main()
