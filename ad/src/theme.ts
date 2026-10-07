/**
 * Design tokens — transcribed from mobile/src/theme.ts, which is itself
 * transcribed from .tastemaker/style-lock.md.
 *
 * Nothing here is a judgement call. If a value looks wrong, it is wrong in the
 * style lock first and here second. The ad is not allowed a palette of its own.
 */

export const color = {
  ink: '#101A2B',
  inkMuted: '#5A6172',
  paper: '#FBF8F3',
  surface: '#FFFFFF',
  blue: '#1350C8',
  onBlue: '#FFFFFF',
  blueDeep: '#0B2E7A',
  blueTint: '#E3ECFF',
  orange: '#F0651C',
  orangeDeep: '#B8430C',
  orangeTint: '#FFE7D6',
  /** hairline on white */
  lineOnSurface: '#EFEAE1',
  /** hairline on paper */
  lineOnPaper: '#EDE7DC',
  railTrack: '#E6E0D5',
  /** unselected radios, empty slots */
  controlRing: '#8F8778',
  /** drawn map SVG only */
  mapBase: '#EEF3E8',
} as const;

export const radius = {
  card: 20,
  cardLarge: 24,
  media: 14,
  mediaLarge: 16,
  tile: 14,
  pill: 999,
} as const;

/** Spacing scale: 4 6 8 10 12 14 16 20 22 26 */
export const gutter = 20;

/**
 * The app states letter-spacing in em; CSS takes it in px here for the same
 * reason React Native does — so the ported value stays traceable to the number
 * in the .body.html the screen came from.
 */
export const tracking = (fontSize: number, em: number) => `${fontSize * em}px`;

/** The one soft elevation. No second shadow style anywhere. */
export const elevation = '0 12px 20px rgba(16, 26, 43, 0.10)';

/** Blue action buttons carry their own glow in the source. */
export const blueGlow = '0 10px 16px rgba(19, 80, 200, 0.35)';

/** Floating circular controls over the hero photo. */
export const floatShadow = '0 4px 8px rgba(16, 26, 43, 0.22)';

/**
 * The lift the product film adds on top of the app's own elevation, for the
 * moments a card is pulled off the screen plane. This is a *film* value, not an
 * app one — the app never draws it, so it does not belong in the style lock.
 *
 * Stated small on purpose. It is drawn inside the camera's transform, so the
 * frame multiplies it by whatever the shot is scaled to — around 2.7× on the
 * Discover card. Authored at the size a shadow should look, it arrives as a
 * grey slab sitting under the card.
 */
export const lift = '0 14px 30px rgba(16, 26, 43, 0.20), 0 3px 8px rgba(16, 26, 43, 0.10)';
