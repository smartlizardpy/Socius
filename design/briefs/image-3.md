Use your image_gen tool to regenerate FOUR profile photos into `design/assets/gen/`, overwriting
the existing files. Do not draw anything programmatically.

These are avatars a real person would upload to a sports app. The previous set failed because it
looked like AI stock headshots: identical grey studio backdrop, dead-centre framing, glossy
retouched skin, everyone posed the same. Fix exactly that.

Include this treatment block verbatim in every prompt:

  Candid smartphone snapshot, not a studio portrait. Natural available daylight, real skin
  texture with visible pores and slight imperfections, no retouching, no beauty filter, no
  studio lighting, no grey seamless backdrop. Shallow phone-camera depth of field. Slightly
  imperfect casual framing — the head is not perfectly centred. The person looks like they were
  photographed by a friend just before or after playing sport, relaxed and unposed. Ordinary
  everyday appearance, not a model. Photorealistic. No text, no logos, no watermarks.

Vary these deliberately between the four so they do not look like one shoot — different
locations, different times of day, different crops, different expressions:

1. `design/assets/gen/face-deniz.png` — man, mid-thirties, short dark hair, light stubble,
   navy t-shirt. Shot outdoors at a padel court in late afternoon sun, chain-link fencing and
   blue court blurred behind him. Half-smiling, looking slightly off to the side of the camera.

2. `design/assets/gen/face-selin.png` — woman, late twenties, dark hair tied back in a ponytail
   with a few loose strands, white sports top. Shot in a park in flat overcast light, green
   trees blurred behind her. Mid-laugh, head slightly tilted.

3. `design/assets/gen/face-mert.png` — man, early twenties, curly dark hair, orange t-shirt.
   Shot indoors in a sports hall under plain ceiling lighting, pale wall and a blurred net
   behind him. Slightly sweaty from playing, calm neutral expression, looking straight at the
   phone.

4. `design/assets/gen/face-ayca.png` — woman, mid-forties, shoulder-length brown hair with a few
   greys, grey zip-up training top. Shot outdoors on a running track at golden hour with warm
   low sun from the side, blurred red track behind her. Warm genuine smile, slightly squinting
   into the light.

Each image should be roughly square and framed head-and-shoulders so it still reads when cropped
to a small circle. Confirm all four files exist at those paths, then print their pixel sizes.
