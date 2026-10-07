# Illustration commission — Avenza (sports social app)

Write flat vector SVG illustrations to `design/assets/illustrations/`. Do not modify any other
file. Do not install anything. Do not run any network commands.

## Hard style contract (every file obeys all of it)

- Flat geometric vector art. Bold, confident shapes. Think Sydney-2000-Olympic-pictogram energy
  crossed with modern editorial spot illustration — dynamic, sporty, colourful, optimistic.
- ONLY these colours, exact hex, nothing else:
  ink `#101A2B`, deep blue `#0B2E7A`, blue `#1350C8`, blue tint `#E3ECFF`,
  orange `#F0651C`, deep orange `#B8430C`, orange tint `#FFE7D6`, white `#FFFFFF`.
- NO gradients. NO drop shadows or filters. NO blur. NO text or letters anywhere.
  NO emoji. NO CSS `<style>` blocks, classes, or external references — inline presentation
  attributes only (`fill=`, `stroke=`, `stroke-width=`, `stroke-linecap="round"`).
- Transparent background: never paint a full-bleed background rect. The art must sit happily
  on both a white card and a warm paper `#FBF8F3` page.
- Human figures are abstract: solid silhouette bodies with simple round heads, NO facial
  features, NO hands with fingers. Vary body proportions between figures so it reads as
  different people. Strong, dynamic athletic poses — mid-stride, mid-swing, mid-jump — never
  static standing.
- Composition: fills its viewBox edge to edge, asymmetric, with one clear focal point. Leave
  no large dead corners.
- Each file: one `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 400">` (unless a
  different viewBox is specified below), well-formed, self-contained, under 20 KB. No `--`
  sequences inside comments; ideally no comments at all.
- Every file must parse: run `python3 -c "import xml.dom.minidom,sys;xml.dom.minidom.parse(p)"`
  over each one when done, and fix anything that fails.

## Files to produce

1. `illo-rally.svg` — Padel/tennis: two figures rallying across a net, one lunging low with a
   racket, one recovering. Court lines in blue tint, net in ink, ball in orange with a dashed
   or dotted orange arc showing its flight. Blue-dominant with orange accents.
2. `illo-pitch.svg` — Five-a-side football at night: three figures contesting a ball, goal frame,
   pitch markings. Deep blue dominant, orange ball and one orange kit.
3. `illo-run.svg` — Three runners on a curving track, seen from a raised three-quarter angle,
   long track lanes sweeping out of frame. Orange track, blue and ink figures.
4. `illo-match.svg` — Abstract concept art for "matched by level": two arcs/dials of stacked
   segments swinging toward each other until their segment counts line up, a small orange
   spark/burst where they meet. No human figures. Geometric, diagrammatic, confident.
5. `illo-empty.svg` — Quiet empty state: a single ball at rest on an empty court, long flat
   shadow, a few sweeping court lines and one distant net post. Calm and roomy, not sad. Mostly
   blue tint and white with one orange ball.
6. `illo-trust.svg` — Reputation and reliability: a rosette/medal built from overlapping
   geometric discs with a bold check mark cut into it, and three or four small star shapes
   arranged in an arc around it. Orange-dominant with blue and ink.
7. `illo-city.svg` — viewBox `0 0 480 300`. A wide, low, stylised city sportscape band: rooftop
   basketball court, a floodlit pitch, a running path threading between simple buildings, a few
   tiny figures in motion. Reads well at 480×300 and shrunk to 240×150. Blue-dominant, orange
   highlights.

## Also: three logo-mark options

`mark-a.svg`, `mark-b.svg`, `mark-c.svg` — viewBox `0 0 64 64` each, a single geometric symbol
(not a letter in a box, not a letterform, no text). Ideas to explore, one per file, your pick of
three: a chevron/arrow formed from two court halves meeting; a rotated stadium/track oval with a
segment removed; two interlocking arcs implying a rally between two people; a compass/pin shape
built from a ball's seam lines. Must stay recognisable at 16 px — so no strokes thinner than 3
units at this viewBox, and no detail smaller than 4 units. Two colours maximum per mark, drawn
from ink / blue / orange.

Work until all ten files exist, parse, and obey the palette. Then print a one-line summary.
