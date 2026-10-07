Use your image_gen tool to generate TWO illustrations into `design/assets/gen/`, overwriting the
existing files. Do not draw anything programmatically, do not modify any other file, no network
commands, no installs.

These are hero illustrations for two onboarding screens in a sports app called Avenza. Look at
`design/assets/gen/hero.png` and `celebrate.png` first — the new pair must read as obvious
siblings of those.

## Background — read this first, the last attempt failed here

Paint a SOLID background in the exact colour `#FBF8F3` across the whole canvas, edge to edge.

- Do NOT produce a transparent background.
- Do NOT draw a grey-and-white checkerboard, or any other pattern that represents
  transparency. The previous attempt painted a `#FEFEFE` / `#F3F3F3` checkerboard into the
  pixels and every one of those images had to be repaired by hand.
- Do NOT add a border, frame, vignette, drop shadow, card, or ground-plane rectangle.

The app draws these on `#FBF8F3` paper, so a solid `#FBF8F3` background is exactly right and
nothing needs keying out afterwards.

## Palette

Lead with these: ink `#101A2B`, deep blue `#0B2E7A`, blue `#1350C8`, sky `#7FA6F0`, blue tint
`#E3ECFF`, orange `#F0651C`, deep orange `#B8430C`, apricot `#FFB27A`, orange tint `#FFE7D6`,
yellow `#F7C23B`, deep yellow `#D89A12`.

Blue and orange dominate. Yellow is the third voice — present but roughly a fifth of the colour
weight. Skin tones may be any natural range.

Two representational exceptions are allowed and only these two: a grass pitch may be green, and
sand may be a warm neutral. Nothing else leaves the palette — in particular no purple, no teal,
no grey UI chrome.

**Avoid large white or near-white fills.** The background is cream, so a white shirt or a white
panel disappears into it. Where you would reach for white, use blue tint `#E3ECFF` or apricot
instead. Thin white lines (court markings, highlights) are fine.

## Style

- Flat geometric vector. Bold confident shapes, generous scale, sports-pictogram energy meeting
  modern editorial illustration. Joyful and kinetic.
- NO gradients, blurs, textures, or 3D rendering. No isometric perspective.
- NO text, letters, numerals, emoji, logos or watermarks anywhere in the image.
- People are simple and stylised — geometric bodies, minimal facial detail. Mixed body types and
  skin tones.
- Landscape, roughly 1400x1050.

## Legibility — the other thing that went wrong

Each image is displayed about 350 pixels wide on a phone. The previous map filled the canvas
edge to edge with roughly twenty buildings and fifteen figures, which turns to mush at that size.

Build each composition from **no more than seven or eight major shapes**, sized so each one is
still identifiable when the whole image is 350px wide. Leave real empty background around the
edges — at least a tenth of the canvas on every side, and more if the composition allows.
Fewer, larger, bolder.

## The two images

1. `design/assets/gen/onb-place.png` — WHERE YOU PLAY.
   A stylised top-down neighbourhood, simplified hard. One large blue court in the centre with
   two concentric orange radius rings around it. Two or three smaller courts or pitches placed
   around it, each marked with a bold orange location pin. A few pale-blue streets connecting
   them, a strip of sea along one edge, and three or four small figures walking or cycling
   between the courts. A handful of simple blocks and trees for context, no more. The feeling is
   "everything is close" — warm and walkable, not a technical map. No street names, no compass.

2. `design/assets/gen/onb-account.png` — KEEPING YOUR PLACE.
   Two stylised players mid-motion — one serving, one running — beside a large simple shield in
   blue holding a bold orange check mark. Two or three small floating cards suggest what is kept
   safe: a level shown as simple stars, a small calendar block, a heart. The feeling is "what you
   set up is kept" — confident and warm, not corporate or security-themed. No padlocks, no keys,
   no fingerprints, no keyholes.

## Before you finish

Confirm both files exist, then print for each one: its pixel dimensions, its colour mode, and the
RGB value of the four corner pixels. All four corners of both images must read `#FBF8F3`.
