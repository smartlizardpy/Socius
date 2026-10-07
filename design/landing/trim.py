#!/usr/bin/env python3
"""Trim generated spot art to its ink and re-pad, the way the app's own art pipeline does.

The generator leaves a lot of #FBF8F3 ground around small compositions, which makes the
figures render tiny in a fixed box. Crop to the drawn content, then add a even margin
back so the art still breathes.
"""
import sys
from pathlib import Path

from PIL import Image, ImageChops

GROUND = (251, 248, 243)
MARGIN = 0.05  # of the cropped long edge

for name in sys.argv[1:]:
    p = Path(name)
    im = Image.open(p).convert("RGB")
    bg = Image.new("RGB", im.size, GROUND)
    # tolerate the generator's slight ground noise before calling a pixel "drawn"
    diff = ImageChops.difference(im, bg).convert("L").point(lambda v: 255 if v > 12 else 0)
    box = diff.getbbox()
    if not box:
        print(f"{p.name}: nothing drawn, left alone")
        continue
    pad = int(max(box[2] - box[0], box[3] - box[1]) * MARGIN)
    box = (max(box[0] - pad, 0), max(box[1] - pad, 0),
           min(box[2] + pad, im.width), min(box[3] + pad, im.height))
    out = Image.new("RGB", (box[2] - box[0], box[3] - box[1]), GROUND)
    out.paste(im.crop(box), (0, 0))
    out.save(p)
    print(f"{p.name}: {im.size} -> {out.size}")
