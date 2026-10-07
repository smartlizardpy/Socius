"""The generated onboarding art came back RGB with a transparency checkerboard
painted into the pixels instead of a real alpha channel.

Flooding from the border is not enough: the map illustration encloses checker
regions inside roads, which the border flood can never reach. So label every
light-achromatic region and decide each one on its own evidence — a checkerboard
carries BOTH tones in quantity, a white shirt or building face carries one.
"""
import sys, pathlib
from collections import deque
from PIL import Image

PAPER = (251, 248, 243)
LIGHT = 250   # the pale checker tone sits at/above this
MID_LO, MID_HI = 238, 249  # the darker checker tone

def bgish(px):
    r, g, b = px
    return min(r, g, b) >= MID_LO and (max(r, g, b) - min(r, g, b)) < 7

def key_out(path_in, path_out, draw_w, margin=10):
    im = Image.open(path_in).convert('RGB')
    w, h = im.size
    px = im.load()
    label = bytearray(w * h)      # 0 unvisited, 1 keep, 2 clear
    comps = cleared_comps = 0

    for sy in range(h):
        for sx in range(w):
            i0 = sy * w + sx
            if label[i0] or not bgish(px[sx, sy]):
                continue
            comps += 1
            pixels, light, mid = [], 0, 0
            q = deque([(sx, sy)])
            label[i0] = 1
            while q:
                x, y = q.popleft()
                pixels.append(y * w + x)
                v = min(px[x, y])
                if v >= LIGHT: light += 1
                elif MID_LO <= v <= MID_HI: mid += 1
                for nx, ny in ((x-1, y), (x+1, y), (x, y-1), (x, y+1)):
                    if 0 <= nx < w and 0 <= ny < h:
                        j = ny * w + nx
                        if not label[j] and bgish(px[nx, ny]):
                            label[j] = 1
                            q.append((nx, ny))
            total = light + mid
            checker = total > 400 and min(light, mid) / total > 0.15
            if checker:
                cleared_comps += 1
                for j in pixels:
                    label[j] = 2

    out = Image.new('RGBA', (w, h))
    op = out.load()
    minx, miny, maxx, maxy = w, h, -1, -1
    cleared = 0
    for y in range(h):
        row = y * w
        for x in range(w):
            if label[row + x] == 2:
                op[x, y] = (0, 0, 0, 0)
                cleared += 1
            else:
                op[x, y] = px[x, y] + (255,)
                if x < minx: minx = x
                if x > maxx: maxx = x
                if y < miny: miny = y
                if y > maxy: maxy = y

    box = (max(0, minx - margin), max(0, miny - margin),
           min(w, maxx + 1 + margin), min(h, maxy + 1 + margin))
    out = out.crop(box)

    # flatten onto paper — the app has no transparent surfaces
    flat = Image.new('RGB', out.size, PAPER)
    flat.paste(out, (0, 0), out)
    cw, ch = flat.size
    target = (draw_w * 3, round(draw_w * 3 * ch / cw))
    flat = flat.resize(target, Image.LANCZOS)
    flat.save(path_out, optimize=True)
    print(f"{pathlib.Path(path_out).name}: {comps} light regions, {cleared_comps} were checkerboard "
          f"({cleared*100//(w*h)}% of the canvas) | {cw}x{ch} -> {target[0]}x{target[1]}")

# What was actually shipped, so this is repeatable:
#   python3 scripts/keyout-checkerboard.py \
#     ../design/assets/gen/onb-place.png   ../mobile/assets/img/onb-place.png   350
#   python3 scripts/keyout-checkerboard.py \
#     ../design/assets/gen/onb-account.png ../mobile/assets/img/onb-account.png 240
# The deck copies in design/assets/img are those two files at 1x.
if __name__ == '__main__':
    key_out(sys.argv[1], sys.argv[2], int(sys.argv[3]))
