#!/usr/bin/env python3
"""Rebuild the app's image assets from the highest-resolution sources in the repo.

design/assets/img/* was optimised for the 1x web mockups (390pt frame). A phone
renders at @3x, so those files upscale and go soft. The generated art in
design/assets/gen/* is 2-8x larger; this re-cuts the app's copies from those,
reproducing the shipped framing exactly (the crop boxes below were solved by
matching candidate crops against the shipped file, not chosen by eye).

Photographs are not rebuilt: design/assets/photos/* tops out around 600px, which
is what design/assets/img already ships, so there is no detail to recover.
"""
import pathlib
from PIL import Image, ImageChops, ImageStat

ROOT = pathlib.Path(__file__).resolve().parent.parent.parent
GEN = ROOT / "design/assets/gen"
IMG = ROOT / "design/assets/img"
OUT = ROOT / "mobile/assets/img"

PAPER = (251, 248, 243)


def flatten(path: pathlib.Path) -> Image.Image:
    """Generated art has a transparent ground; the mockups flatten it onto paper."""
    im = Image.open(path)
    if im.mode != "RGBA":
        return im.convert("RGB")
    flat = Image.new("RGB", im.size, PAPER)
    flat.paste(im, mask=im.split()[3])
    return flat


def solve_crop(src: Image.Image, target: Image.Image, coarse=32, fine=6):
    """Find the crop of `src` that, resized, best reproduces `target`."""
    tw, th = target.size
    ta = tw / th
    ref = target.resize((120, 90), Image.LANCZOS)
    W, H = src.size

    def score(box):
        c = src.crop(box).resize((120, 90), Image.LANCZOS)
        return sum(ImageStat.Stat(ImageChops.difference(c, ref)).mean) / 3

    best = None
    for cw in range(int(W * 0.5), W + 1, coarse):
        ch = int(round(cw / ta))
        if ch > H:
            continue
        for x in range(0, W - cw + 1, coarse):
            for y in range(0, H - ch + 1, coarse):
                d = score((x, y, x + cw, y + ch))
                if best is None or d < best[0]:
                    best = (d, x, y, cw, ch)

    d0, x0, y0, cw0, _ = best
    span = coarse + fine
    for cw in range(max(8, cw0 - span), min(W, cw0 + span + 1), fine):
        ch = int(round(cw / ta))
        if ch > H:
            continue
        for x in range(max(0, x0 - span), min(W - cw, x0 + span + 1), fine):
            for y in range(max(0, y0 - span), min(H - ch, y0 + span + 1), fine):
                d = score((x, y, x + cw, y + ch))
                if d < best[0]:
                    best = (d, x, y, cw, ch)
    return best


# source, shipped reference, output name, output width, keep alpha
JOBS = [
    ("hero-a.png", "hero-people.jpg", "hero-people.jpg", 1338, False),
    ("celebrate.png", "celebrate.jpg", "celebrate.jpg", 1200, False),
    ("face-deniz.png", "face-deniz.jpg", "face-deniz.jpg", 480, False),
    ("face-selin.png", "face-selin.jpg", "face-selin.jpg", 480, False),
    ("face-mert.png", "face-mert.jpg", "face-mert.jpg", 480, False),
    ("face-ayca.png", "face-ayca.jpg", "face-ayca.jpg", 480, False),
]


def main():
    OUT.mkdir(parents=True, exist_ok=True)
    for src_name, ref_name, out_name, out_w, keep_alpha in JOBS:
        src_path = GEN / src_name
        ref_path = IMG / ref_name
        if not src_path.exists() or not ref_path.exists():
            print(f"skip {out_name}: missing source")
            continue

        ref = Image.open(ref_path).convert("RGB")
        rw, rh = ref.size

        if keep_alpha:
            src_raw = Image.open(src_path)
            src = Image.new("RGB", src_raw.size, PAPER)
            src.paste(src_raw, mask=src_raw.split()[3])
        else:
            src = flatten(src_path)

        # square sources that match the shipped aspect need no search
        if abs(src.size[0] / src.size[1] - rw / rh) < 0.005:
            box = (0, 0, src.size[0], src.size[1])
            d = 0.0
        else:
            d, x, y, cw, ch = solve_crop(src, ref)
            box = (x, y, x + cw, y + ch)

        out_h = int(round(out_w * rh / rw))
        if keep_alpha:
            raw = Image.open(src_path).convert("RGBA")
            cut = raw.crop(box).resize((out_w, out_h), Image.LANCZOS)
            cut.save(OUT / out_name, optimize=True)
        else:
            cut = src.crop(box).resize((out_w, out_h), Image.LANCZOS)
            cut.save(OUT / out_name, quality=92, subsampling=0, optimize=True)

        scale = out_w / rw
        print(f"{out_name:18} {out_w}x{out_h}  ({scale:.1f}x the mockup asset, match diff {d:.1f})")

    # mark.png and medal.png are deliberately not rebuilt: neither matches any
    # source in gen/ (they were post-processed), and at 84px/113px they are still
    # 2.6x their largest on-screen size, so they hold up without a rebuild.


if __name__ == "__main__":
    main()
