Use your image_gen tool to generate THREE illustrations into `design/assets/gen/`, overwriting any
existing files at those paths. Do not draw anything programmatically, do not modify any other file,
no network commands, no installs.

These are the hero illustrations for a three-panel "how it works" explainer at the very start of
onboarding in a sports app called Avenza. Avenza is how people in a city neighbourhood find other
people to play sport with. Look at `design/assets/gen/hero.png` and `design/assets/gen/celebrate.png`
FIRST — the three new images must read as obvious siblings of those two, same hand, same weight of
shape, same flat vector language.

The three run left to right as one story, and the story is about PEOPLE, not about an app:
you find players near you, you get matched with people at your level, and you walk away with
friends. There is no phone, no screen, no app UI, no map pin cluster in any of them.

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
image is the right number — not a crowd. Leave real empty background around the edges, at least a
tenth of the canvas on every side. Fewer, larger, bolder.

## The three images

1. `design/assets/gen/onb-how-find.png` — **PLAYERS NEAR YOU.**
   Three stylised players, each mid-motion in a different sport, arranged across the canvas as if
   they are neighbours a few streets apart and about to converge: one bouncing a football, one
   with a tennis or padel racket over the shoulder, one mid-stride running. They are walking
   toward each other, in profile or three-quarter view, cheerful and relaxed — arriving, not
   competing. A couple of very simple orange or blue arcs on the ground suggest the short distance
   between them. Keep any scenery to one or two shapes at most — a single tree, or a low block.
   The feeling is "these people are already close by."

2. `design/assets/gen/onb-how-match.png` — **AT YOUR LEVEL.**
   Two players giving each other a fist bump — dapping up — across a low net, both leaning in,
   grinning, rackets in their other hands. This is the centrepiece of the set, so make the fist
   bump the clear focal point: the two fists meeting near the middle of the canvas, both arms
   reading as one strong diagonal. The two figures are deliberately drawn as equals — same height,
   mirrored posture, one in blue and one in orange — because the point is that they are evenly
   matched. Behind them, nothing but a couple of thin white court lines. No scoreboard, no crowd.

3. `design/assets/gen/onb-how-play.png` — **YOU LEAVE WITH FRIENDS.**
   Three players walking off the court together after a game, seen from behind or three-quarter
   from behind, arms slung over each other's shoulders, one holding a ball under an arm, one with
   a racket. Loose, warm, laughing, kit slightly rumpled — the walk to the car park, not a podium.
   One or two small yellow shapes low in the composition for warmth. This is the emotional payoff
   of the set and must not read as a victory-ceremony pose: no trophy, no medal, no arms thrown up
   in the air, no confetti — `celebrate.png` already does that and this must not duplicate it.

## Before you finish

Confirm all three files exist, then print for each one: its pixel dimensions, its colour mode, and
the RGB value of its four corner pixels. All four corners of all three images must read `#FBF8F3`.
