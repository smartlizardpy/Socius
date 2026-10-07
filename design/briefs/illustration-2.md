# Illustration commission 2 — Socius onboarding

Write flat vector SVG illustrations into `design/assets/illustrations/`. Do not modify any
other file. No network commands, no installs.

These are the HERO illustrations for the app's first screens, so they must be much richer and
more populated than the earlier spot illustrations — this is the one place the app gets to be
loud and joyful.

## Palette (exact hex, nothing else)

ink `#101A2B`, deep blue `#0B2E7A`, blue `#1350C8`, sky `#7FA6F0`, blue tint `#E3ECFF`,
orange `#F0651C`, deep orange `#B8430C`, apricot `#FFB27A`, orange tint `#FFE7D6`,
**yellow `#F7C23B`**, deep yellow `#D89A12`, white `#FFFFFF`.

Yellow is new and should be genuinely present — roughly a third of the colour weight, alongside
blue and orange. Blue and orange lead; yellow is the third voice, not a garnish.

## Hard style contract

- Flat geometric vector. Bold confident shapes. Sports-pictogram energy meets modern editorial
  spot illustration: joyful, kinetic, generous.
- NO gradients, filters, blurs, shadows, text, letters, emoji, `<style>` blocks or classes.
  Inline presentation attributes only (`fill=`, `stroke=`, `stroke-width=`,
  `stroke-linecap="round"`, `transform=`).
- Never paint a full-bleed background rect — transparent, so it sits on warm paper `#FBF8F3`.
- Figures are abstract: solid silhouette bodies, simple round heads, NO facial features, no
  fingers. Vary height, build and pose between figures so they read as different people.
  Every figure is mid-motion — swinging, running, jumping, kicking, stretching, celebrating.
- Well-formed, self-contained, under 26 KB each. No comments. Must parse with
  `python3 -c "import xml.dom.minidom,sys; xml.dom.minidom.parse(sys.argv[1])" <file>`.

## Files

**Three candidate heroes** — `illo-welcome-a.svg`, `illo-welcome-b.svg`, `illo-welcome-c.svg`,
each `viewBox="0 0 440 340"`. Same brief, three genuinely different compositions (not three
recolours):

  Brief: **at least six figures playing six different sports, together in one scene** — padel or
  tennis swing, footballer striking a ball, runner mid-stride, basketball jump, cyclist, someone
  stretching. They overlap and interlock as a group; the point is *people, together*, not a
  row of isolated pictograms. Balls, rackets and motion arcs travel between figures to tie the
  composition together. Fill the frame corner to corner. Must still read at 340×260.

  Make the three differ structurally: e.g. (a) a dense overlapping cluster with figures at
  several scales; (b) a wide arc/circle of figures with the action passing between them;
  (c) a layered depth composition — large figures front, smaller ones behind, ground planes.

**One celebration spot** — `illo-ready.svg`, `viewBox="0 0 400 300"`: three or four figures
mid-celebration after a game (high-five, arms up, racket raised), with small geometric confetti
shapes in yellow and orange scattered around them. Warm and earned, not manic.

Produce all four, verify each parses and uses only the listed hex values, then print one line.
