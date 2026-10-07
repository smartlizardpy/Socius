Use your image_gen tool to generate ONE illustration into `design/assets/gen/`, overwriting any
existing files at those paths. Do not draw anything programmatically, do not modify any other file,
no network commands, no installs.

This is the fourth and final panel of a "how it works" explainer at the start of onboarding in a
sports app called Socius, which is how people in a city neighbourhood find other people to play
sport with. Look at `design/assets/gen/onb-how-find.png`, `design/assets/gen/onb-how-match.png` and
`design/assets/gen/onb-how-play.png` FIRST — the new image must read as an obvious sibling of those
three: same hand, same weight of shape, same flat vector language, same generous empty ground, same
palette balance.

The first three panels say: players are near you, they are at your level, you leave with friends.
This one is the invitation — the moment the viewer is asked to join in. It is about PEOPLE, not
about an app: no phone, no screen, no app UI, no buttons, no arrows.

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
image is the right number — not a crowd. Here four is the ceiling. Leave real empty background around the edges, at least a
tenth of the canvas on every side. Fewer, larger, bolder.

## The image

`design/assets/gen/onb-how-join.png` — **COME AND PLAY.**

Three stylised players standing together in a loose group, turned toward the viewer and waving them
over — warm, relaxed, unmistakably inviting, as though they have arrived early and are one player
short. One of them holds a spare racket out toward the viewer, offered handle-first. The group are
in a mix of kit: one in blue, one in orange, one in apricot. Behind them, at most two very simple
shapes — a suggestion of a court edge, or a low block. Nothing else.

The feeling is "there is a spot for you, come on" — open, warm, a little playful. It must not read
as a team photo, a podium, a line-up, or a celebration: no arms all thrown up together, no trophy,
no confetti, no medals.

### Framing — this is where the first attempt failed

The first attempt cropped the figures at the bottom edge, filled the frame corner to corner, and
made the offered racket enormous in the foreground. It came out heavy and close-up and did not sit
beside the other three panels at all. So:

- **Draw the three figures WHOLE, head to feet.** Nothing may be cut off by any edge of the canvas.
- **Leave real empty cream ground around them** — at least a fifth of the canvas width clear on the
  left and the right, and a fifth of its height clear above and below. The figures occupy the
  middle. Compare `onb-how-play.png`: that is the amount of air this one needs.
- **The offered racket is normal racket size**, held at roughly waist height. It is a detail, not
  the subject. Do not scale it up, do not put it in front of everything, do not let it dominate.
- **No hands over faces**, no obscured faces, and nobody in white or near-white — the background is
  cream and a white kit dissolves into it. Use blue tint `#E3ECFF` or apricot `#FFB27A`.
- The three figures should be roughly the same height as the figures in `onb-how-play.png` when
  both images are the same size. Match that scale.

## Before you finish

Confirm the file exists, then print its pixel dimensions, its colour mode, and the RGB value of its
four corner pixels.

The background must be a flat opaque cream, and near `#FBF8F3` is good enough — a couple of RGB
values off is fine and gets normalised downstream. **Do not spend extra passes chasing an exact
pixel match**; spend them on the framing notes above, which is what actually needs to be right.
