/**
 * Design tokens — transcribed verbatim from .tastemaker/style-lock.md.
 * Nothing here is a judgement call. If a value is missing, it belongs in the
 * style lock first and here second.
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

export const font = {
  /** Bricolage Grotesque 700 — display and numerals only */
  display: 'BricolageGrotesque_700Bold',
  regular: 'InstrumentSans_400Regular',
  medium: 'InstrumentSans_500Medium',
  semibold: 'InstrumentSans_600SemiBold',
  bold: 'InstrumentSans_700Bold',
} as const;

/**
 * The source CSS states letter-spacing in em; React Native wants absolute points.
 * tracking(fontSize, em) does that conversion so the ported value stays traceable
 * to the number in the .body.html.
 */
export const tracking = (fontSize: number, em: number) => fontSize * em;

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
 * The tab bar's content box, above the safe-area inset.
 *
 * One constant because it was two: the bar set its own height and
 * `useTabBarPad` set the matching bottom padding on every screen, both
 * hardcoded to the same number and free to drift apart.
 *
 * It was 78 with the items pinned to flex-start, which left 11px of air above
 * them and 19 below — a quarter of the bar empty, and on a phone the 34px home
 * indicator sits under all of it, so the real thing came to 112px. The items
 * are centred now and the box is sized to them.
 */
export const tabBarHeight = 60;

/** The one soft elevation. No second shadow style anywhere. */
export const elevation = {
  shadowColor: '#101A2B',
  shadowOffset: { width: 0, height: 12 },
  shadowOpacity: 0.1,
  shadowRadius: 20,
  elevation: 4,
} as const;

/** Blue action buttons carry their own glow in the source (rgba(19,80,200,.85)). */
export const blueGlow = {
  shadowColor: color.blue,
  shadowOffset: { width: 0, height: 10 },
  shadowOpacity: 0.35,
  shadowRadius: 16,
  elevation: 6,
} as const;

/** Floating circular controls over the hero photo. */
export const floatShadow = {
  shadowColor: '#101A2B',
  shadowOffset: { width: 0, height: 4 },
  shadowOpacity: 0.22,
  shadowRadius: 8,
  elevation: 4,
} as const;

/** Motion durations, per the brief: 150–250ms feedback, 300–400ms spatial. */
export const motion = {
  feedback: 180,
  chip: 150,
  spatial: 340,
  /** reduced-motion fallback: a crossfade, never nothing */
  reduced: 150,
  /** list entrance stagger, capped at the first 6 items */
  stagger: 45,
  staggerCap: 6,
} as const;
