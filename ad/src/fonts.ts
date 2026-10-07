import { loadFont as loadBricolage } from '@remotion/google-fonts/BricolageGrotesque';
import { loadFont as loadInstrument } from '@remotion/google-fonts/InstrumentSans';

/**
 * The app's two faces.
 *
 * `latin-ext` is not optional: it is the subset carrying ı, İ, ş, ğ and the
 * rest of the Turkish alphabet. On `latin` alone every "halı saha" in the ad
 * renders with the wrong glyphs or none at all.
 */

/** Bricolage Grotesque 700 — display and numerals only, exactly as the app uses it. */
const bricolage = loadBricolage('normal', {
  weights: ['700'],
  subsets: ['latin', 'latin-ext'],
});

/** Instrument Sans — everything else. */
const instrument = loadInstrument('normal', {
  weights: ['400', '500', '600', '700'],
  subsets: ['latin', 'latin-ext'],
});

export const font = {
  display: bricolage.fontFamily,
  body: instrument.fontFamily,
} as const;

/** The app's font keys, mapped to a (family, weight) pair for CSS. */
export const face = {
  display: { fontFamily: font.display, fontWeight: 700 },
  regular: { fontFamily: font.body, fontWeight: 400 },
  medium: { fontFamily: font.body, fontWeight: 500 },
  semibold: { fontFamily: font.body, fontWeight: 600 },
  bold: { fontFamily: font.body, fontWeight: 700 },
} as const;

export type FaceKey = keyof typeof face;

export const waitForFonts = () =>
  Promise.all([bricolage.waitUntilDone(), instrument.waitUntilDone()]);
