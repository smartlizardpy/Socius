Use your image_gen tool to generate TWO illustrations into `design/assets/gen/`, overwriting any
existing files at those paths. Do not draw anything programmatically, do not modify any other file,
no network commands, no installs.

These replace two existing onboarding illustrations in a sports app called Avenza. Avenza is how people in a city neighbourhood find other
people to play sport with. Look at `design/assets/gen/onb-how-find.png`,
`design/assets/gen/onb-how-match.png` and `design/assets/gen/onb-how-play.png` FIRST — those three
are the standard the whole set is now held to, and the two new images must read as obvious siblings
of them: same hand, same weight of shape, same flat vector language, same generous empty ground.

The two files you are replacing are the weakest in the set. `onb-place.png` is a top-down map with
roughly twenty buildings and fifteen figures, which turns to mush at phone size. `onb-account.png`
is a shield-and-checkmark badge surrounded by scattered floating cards, which reads as corporate
security clip-art rather than as sport. Both need to be rebuilt much simpler and much bolder.

## Background — read this first, previous attempts failed here

Paint a SOLID background in the exact colour `#FBF8F3` across the whole canvas, edge to edge.

- Do NOT produce a transparent background.
- Do NOT draw a grey-and-white checkerboard or any other pattern that represents transparency.
  An earlier run painted a `#FEFEFE` / `#F3F3F3` checkerboard into the pixels and every image
  had to be repaired by hand afterwards.
- Do NOT add a border, frame, vignette, drop shadow, card, or ground-plane rectangle.

The app draws these on `#FBF8F3` paper, so a solid `#FBF8F3` background is exactly right.

## Palette — these values, nothing else

ink `#101A2B`, deep blue `#0B2E7A`, blue `#1350C8`, sky `#7FA6F0`, blue tint `#E3ECFF`,
orange `#F0651C`, deep orange `#B8430C`, apricot `#FFB27A`, orange tint `#FFE7D6`,
yellow `#F7C23B`, deep yellow `#D89A12`.

Blue and orange lead. Yellow is the third voice — genuinely present, about a fifth of the colour
weight, never dominant. Skin tones may be any natural range. A grass pitch may be green; that is
the only representational exception. No purple, no teal, no grey UI chrome.

**Avoid large white or near-white fills.** The background is cream, so a white shirt or a white
panel dissolves into it. Where you would reach for white, use blue tint `#E3ECFF` or apricot
`#FFB27A`. Thin white lines — court markings, a net, a highlight — are fine.

## Style

- Flat geometric vector. Bold confident shapes, generous scale, sports-pictogram energy meeting
  modern editorial illustration. Joyful and kinetic.
- NO gradients, blurs, textures, 3D rendering, or isometric perspective.
- NO text, letters, numerals, emoji, logos, watermarks or UI elements anywhere in the image.
- People are simple and stylised — geometric bodies, minimal facial detail, expressive through
  posture rather than faces. Mixed body types, ages, skin tones, and a mix of men and women.
- Landscape, roughly 1400x1050.

## Legibility

Each image is shown about 350 pixels wide on a phone. Build each composition from **no more than
six or seven major shapes**, sized so each one still reads at that size. Two or three figures per
image is the right number — not a crowd. This is the single most important instruction here: the
images you are replacing failed because they were too busy. Leave real empty background around the edges, at least a
tenth of the canvas on every side. Fewer, larger, bolder.

## The two images

1. `design/assets/gen/onb-place.png` — **WHERE YOU PLAY.**
   Not a map. One large blue court seen from a low three-quarter angle, with two concentric orange
   arcs sweeping around it to suggest a short radius, and two small figures walking in from the
   edge of the frame with kit bags. Beyond the court, no more than three simple shapes for the
   neighbourhood — one low building block, one tree, one strip of sea along the bottom edge. That
   is the whole picture. The feeling is "the place you play is a five minute walk away", warm and
   walkable. No pins, no street grid, no buildings crowd, no compass, no labels.

2. `design/assets/gen/onb-account.png` — **LET'S GET YOU STARTED.**
   Not a badge and not a shield. Two stylised players standing side by side, relaxed and ready —
   one with a racket held down at their side, the other with a ball on their hip and a kit bag over
   the shoulder — both facing out of frame in the same direction, as though looking at the court
   they are about to walk onto. Behind and between them, one large soft blue rounded shape: a plain
   arch or dome, no outline and nothing inside it, so the pair read as welcomed rather than
   guarded. Two or three small yellow marks low down for warmth. The feeling is "come in, this
   takes a minute" — confident and friendly, never corporate. No padlocks, no keys, no
   fingerprints, no shields, no check marks, no floating cards, no calendars, no doorways.

## Before you finish

Confirm both files exist, then print for each one: its pixel dimensions, its colour mode, and the
RGB value of its four corner pixels. All four corners of both images must read `#FBF8F3`.
