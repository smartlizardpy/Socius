# Flux prompt — the closing plate, as a still

The ad's closing shot is **non-speaking** by design (the concept doc specifies
it, to avoid a second lip-sync risk). So it does not need to be video. One good
still, dropped into `ad/public/ugc/` and set as `ugcOutro`, gets the handheld
drift and the push-in from `UgcSlot` for free — the same motion the drawn plate
has now.

Generate at **832×1472** (9:16, Flux-friendly) or larger, then let Remotion crop.

## Prompt

> Authentic amateur smartphone photo, vertical portrait orientation. A
> strikingly beautiful blonde woman in her mid twenties with an Aegean Turkish
> appearance, warm olive-fair skin and long blonde hair, standing beside an
> outdoor artificial-turf football pitch at blue hour. Sporty casual outfit,
> subtle natural makeup, holding a football at her side. She is turned slightly
> toward the illuminated pitch with a small knowing smile, not looking at the
> camera. Behind her: green artificial turf, wire fencing, bright floodlights on
> tall masts, a few football players softly out of focus. Shot on a phone, warm
> practical lighting against a deep blue dusk sky, shallow depth of field, mild
> sensor noise, natural skin texture with visible pores, candid social-media
> snapshot. Not a studio portrait, not a fashion shoot, no retouching.

## Negative / avoid

> text, watermark, logo, caption, studio lighting, glamour retouching, plastic
> skin, oversaturated, HDR, extra fingers, deformed hands, distorted ball

## Notes

- **Keep her identity consistent with the opening clip.** If the Higgsfield
  opening is already generated, feed a frame of it in as an IP-Adapter or
  PuLID reference rather than relying on the prompt alone — the two shots are
  four seconds apart in the cut and a different face is the one thing a viewer
  will catch.
- **Blue hour, not night.** The plate is graded toward `#0A1B33` in the film and
  the floodlights read warm against it. A fully black sky loses that contrast.
- **Leave headroom and space on one side.** The end card puts the Avenza mark and
  the CTA over the middle of the frame, lifted 150px above centre.
- Hands on a football are where Flux most often fails. Generate a batch and pick,
  or crop below the ball.

## Wiring it in

```ts
// src/Ad.tsx → adDefaults
ugcOutro: staticFile('ugc/outro.jpg'),
```

`UgcSlot` detects stills by extension and gives them the same handheld drift and
push as a clip. Nothing else changes.
