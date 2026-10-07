#!/usr/bin/env python3
"""Capture each Avenza app screen from the built Turkish preview as a 2x PNG.

Source:  design/preview/index.html  (build with: python3 design/build-artboards.py --tr)
Output:  design/landing/shots/<Name>.png at 780x1688 (390x844 @2x)

The preview is one flex row of 390x844 screen divs, each preceded by a .cap label.
Each screen is re-wrapped alone in a zero-margin page and shot with headless Chrome.
"""
import re, shutil, subprocess, sys
from pathlib import Path

from PIL import Image

ROOT = Path(__file__).resolve().parents[2]
PREVIEW = ROOT / "design/preview/index.html"
OUT = ROOT / "design/landing/shots"
WRAP = ROOT / "design/landing/.wrap"
CHROME = "google-chrome-stable"
W, H, SCALE = 390, 844, 2
# --window-size counts browser chrome, so the viewport comes out ~87px short of the
# value passed. Ask for extra height and crop back to the phone box from the top-left.
CHROME_PAD = 96

html = PREVIEW.read_text()
head = html.split("<body>")[0]
# preview css sets a padded mauve page; the shot wants the screen alone on nothing
head = head.replace("body { background: #DED8CD; padding: 40px; }",
                    "body { background: transparent; padding: 0; margin: 0; }")
# preview image paths are relative to design/preview/ — make them absolute for the wrapper
head_body_fix = lambda s: re.sub(r'src="\.\./assets/', f'src="{(ROOT / "design/assets").as_uri()}/', s)

cards = re.split(r'<div><div class="cap">', html.split("<body>")[1])[1:]
OUT.mkdir(parents=True, exist_ok=True)
WRAP.mkdir(parents=True, exist_ok=True)

want = sys.argv[1:] or None
shot = []
for card in cards:
    name, rest = card.split("</div>", 1)
    if want and name not in want:
        continue
    screen = rest.rsplit("</div>", 1)[0]  # drop the card's own closing div
    page = f"{head}<body>{head_body_fix(screen)}</body></html>"
    wrap = WRAP / f"{name}.html"
    wrap.write_text(page)
    png = OUT / f"{name}.png"
    subprocess.run([
        CHROME, "--headless", "--disable-gpu", "--hide-scrollbars",
        f"--window-size={W},{H + CHROME_PAD}", f"--force-device-scale-factor={SCALE}",
        "--virtual-time-budget=10000", "--default-background-color=00000000",
        f"--screenshot={png}", wrap.as_uri(),
    ], check=True, capture_output=True)
    Image.open(png).crop((0, 0, W * SCALE, H * SCALE)).save(png)
    shot.append(f"{name}.png {png.stat().st_size // 1024} KB")

shutil.rmtree(WRAP)
print("\n".join(shot))
print(f"{len(shot)} screens -> {OUT}")
