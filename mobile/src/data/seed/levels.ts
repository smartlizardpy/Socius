import type { IconName } from '../../Icon';

/* ------------------------------------------------------------- onboarding -- */

export type SportOption = { key: string; label: string; icon: IconName };

/** Sports grid, in mockup order and with the mockup's icons. */
export const sportOptions: SportOption[] = [
  { key: 'padel', label: 'Padel', icon: 'racquet' },
  { key: 'football', label: 'Football', icon: 'soccer-ball' },
  { key: 'tennis', label: 'Tennis', icon: 'tennis-ball' },
  { key: 'running', label: 'Running', icon: 'person-simple-run' },
  { key: 'basketball', label: 'Basketball', icon: 'basketball' },
  { key: 'cycling', label: 'Cycling', icon: 'person-simple-bike' },
  { key: 'gym', label: 'Gym', icon: 'barbell' },
  { key: 'volleyball', label: 'Volleyball', icon: 'volleyball' },
];

export const sportLabel = (key: string) =>
  sportOptions.find((s) => s.key === key)?.label ?? key;

export const sportIcon = (key: string): IconName =>
  sportOptions.find((s) => s.key === key)?.icon ?? 'tennis-ball';

/**
 * A level for each sport, as the onboarding promises.
 *
 * Every rated sport sits on one shared 1.0–7.0 Avenza scale — that is the number
 * the app matches on, and it is why a tier carries a `rail` position as well as a
 * label. Pace sports are not rated, so they answer a different question and their
 * rail runs fastest-to-slowest instead. Gym has no scale at all: nothing about a
 * gym session is matched by level, so asking would be a dead step.
 */
export type LevelTier = {
  /** stored value — a decimal for rated sports, a pace or distance for paced ones */
  value: string;
  label: string;
  blurb: string;
  /**
   * Position on the shared 1–7 rail. The five tiers sit at 2/3/4/5/6, which is
   * exactly one star each under starsOf() — so tapping the nth star picks the
   * nth tier, with no lookup table in between.
   */
  rail: number;
};

export type LevelScale = {
  kind: 'rating' | 'pace';
  /** the display headline for this step */
  question: string;
  /** the section head above the ladder */
  head: string;
  /** the caption under the ladder, with {v} standing in for the chosen value */
  matchNote: string;
  /**
   * The four yes/no questions behind "Not sure?".
   *
   * They live here rather than in the screen because they are the same kind of
   * thing as the tiers and have to ladder onto them: every yes moves you up one
   * rung from the bottom, so question n has to describe roughly what tier n+1
   * can do. One shared set of racket questions used to be asked of every sport,
   * which meant a footballer was asked whether they could keep a rally going
   * and whether they served where they meant to.
   */
  quiz: [string, string, string, string];
  tiers: LevelTier[];
};

/** Rated sports match on stars now, so the caption reads in stars, not decimals. */
const RATED_NOTE = 'matched within one star of yours';

export const levelScales: Record<string, LevelScale | null> = {
  padel: {
    kind: 'rating',
    question: 'How well do you play padel?',
    head: 'YOUR PADEL LEVEL',
    matchNote: RATED_NOTE,
    quiz: [
      "Can you keep a rally going for ten shots?",
      "Do you serve where you mean to, most of the time?",
      "Can you play the ball off the back wall?",
      "Have you played an organised match or league?",
    ],
    tiers: [
      { value: '2.0', label: 'Just starting', blurb: 'Learning the serve and how the walls play', rail: 2 },
      { value: '3.0', label: 'Improver', blurb: 'Rallies going, serve still coming', rail: 3 },
      { value: '4.0', label: 'Steady', blurb: 'Consistent rallies, happy at the net', rail: 4 },
      { value: '5.0', label: 'Advanced', blurb: 'Controls pace and placement', rail: 5 },
      { value: '6.0', label: 'Competitive', blurb: 'Plays club tournaments', rail: 6 },
    ],
  },
  tennis: {
    kind: 'rating',
    question: 'How well do you play tennis?',
    head: 'YOUR TENNIS LEVEL',
    matchNote: RATED_NOTE,
    quiz: [
      "Can you rally from the baseline for ten shots?",
      "Do you get your first serve in more often than not?",
      "Are you comfortable coming to the net?",
      "Have you played an organised match or league?",
    ],
    tiers: [
      { value: '2.0', label: 'Just starting', blurb: 'Getting the ball back over the net', rail: 2 },
      { value: '3.0', label: 'Rallying', blurb: 'Steady from the baseline', rail: 3 },
      { value: '4.0', label: 'Club player', blurb: 'Serves and volleys with intent', rail: 4 },
      { value: '5.0', label: 'Strong club', blurb: 'Moves you around and finishes points', rail: 5 },
      { value: '6.0', label: 'Competitive', blurb: 'Plays league matches', rail: 6 },
    ],
  },
  football: {
    kind: 'rating',
    question: 'How do you play football?',
    head: 'YOUR FOOTBALL LEVEL',
    matchNote: RATED_NOTE,
    quiz: [
      "Do you play most weeks?",
      "Can you keep the ball with someone closing you down?",
      "Do you hold a position instead of chasing the ball?",
      "Have you played in an organised league?",
    ],
    tiers: [
      { value: '2.0', label: 'Kickabout', blurb: 'In it for the run around', rail: 2 },
      { value: '3.0', label: 'Regular', blurb: 'Weekly five-a-side, decent touch', rail: 3 },
      { value: '4.0', label: 'Strong regular', blurb: 'Keeps the ball under pressure', rail: 4 },
      { value: '5.0', label: 'Club level', blurb: 'Reads the game, holds a position', rail: 5 },
      { value: '6.0', label: 'Competitive', blurb: 'Plays in an organised league', rail: 6 },
    ],
  },
  basketball: {
    kind: 'rating',
    question: 'How do you play basketball?',
    head: 'YOUR BASKETBALL LEVEL',
    matchNote: RATED_NOTE,
    quiz: [
      "Do you play pick-up games regularly?",
      "Can you finish a lay-up with someone on you?",
      "Do you defend your man for a whole game?",
      "Have you played for a club or a league side?",
    ],
    tiers: [
      { value: '2.0', label: 'Shooting around', blurb: 'Happy on the free-throw line', rail: 2 },
      { value: '3.0', label: 'Pick-up regular', blurb: "Holds their own in a 3v3", rail: 3 },
      { value: '4.0', label: 'Solid pick-up', blurb: 'Finishes at the rim, plays defence', rail: 4 },
      { value: '5.0', label: 'League', blurb: 'Runs plays, defends properly', rail: 5 },
      { value: '6.0', label: 'Competitive', blurb: 'Trains with a club side', rail: 6 },
    ],
  },
  volleyball: {
    kind: 'rating',
    question: 'How do you play volleyball?',
    head: 'YOUR VOLLEYBALL LEVEL',
    matchNote: RATED_NOTE,
    quiz: [
      "Can you pass a serve cleanly to the setter?",
      "Do your serves land in more often than not?",
      "Can you set a hittable ball on purpose?",
      "Have you played in an organised league?",
    ],
    tiers: [
      { value: '2.0', label: 'Beach casual', blurb: 'Keeps a rally alive', rail: 2 },
      { value: '3.0', label: 'Regular', blurb: 'Serves in, passes clean', rail: 3 },
      { value: '4.0', label: 'Solid regular', blurb: 'Sets on purpose, covers the court', rail: 4 },
      { value: '5.0', label: 'Club', blurb: 'Sets and spikes on purpose', rail: 5 },
      { value: '6.0', label: 'Competitive', blurb: 'Plays an organised league', rail: 6 },
    ],
  },
  running: {
    kind: 'pace',
    question: 'What pace do you hold?',
    head: 'YOUR EASY PACE',
    matchNote: 'runs held between {lo} and {hi} per km',
    quiz: [
      "Can you run for half an hour without walking?",
      "Do you run more than once a week?",
      "Have you run 10 km in one go?",
      "Do you train to a plan or to race times?",
    ],
    tiers: [
      { value: '7:30', label: 'Out for the air', blurb: 'Chatting the whole way round', rail: 2 },
      { value: '6:30', label: 'Steady', blurb: 'Comfortable for an hour', rail: 3 },
      { value: '5:45', label: 'Brisk', blurb: 'Holds it over 10 km', rail: 4 },
      { value: '5:00', label: 'Quick', blurb: 'Trains with a group', rail: 5 },
      { value: '4:15', label: 'Fast', blurb: 'Trains for race times', rail: 6 },
    ],
  },
  cycling: {
    kind: 'pace',
    question: 'What kind of rides do you do?',
    head: 'YOUR USUAL RIDE',
    matchNote: 'rides between {lo} and {hi}',
    quiz: [
      "Do you ride most weekends?",
      "Have you ridden 40 km in one go?",
      "Are you comfortable with a few climbs?",
      "Do you ride all day, over 100 km?",
    ],
    tiers: [
      { value: '20 km', label: 'Coastal spin', blurb: 'Flat, unhurried, coffee stop', rail: 2 },
      { value: '40 km', label: 'Weekend loop', blurb: 'A couple of hours out', rail: 3 },
      { value: '60 km', label: 'Half day', blurb: 'A few climbs, back for lunch', rail: 4 },
      { value: '80 km', label: 'Long ride', blurb: 'Climbs and a real distance', rail: 5 },
      { value: '120 km', label: 'Endurance', blurb: 'All day in the saddle', rail: 6 },
    ],
  },
  /** Nothing about a gym session is matched by level. */
  gym: null,
};

/* ----------------------------------------------------------------- stars -- */

/**
 * Level is shown as stars, not as a decimal.
 *
 * The 1.0–7.0 number is still what the app matches on — it is what a level range
 * is expressed in and what a rating verdict nudges — but nobody reads "4.5" and
 * knows what it means. Five stars is the unit players already understand, so the
 * number stays in the data and the stars do the talking.
 *
 * Level stars are drawn in blue and rating stars in orange, everywhere, so the
 * two never read as the same measurement: blue is how well you play, orange is
 * what people thought of playing with you.
 */
export function starsOf(level: number) {
  if (level < 2.5) return 1;
  if (level < 3.5) return 2;
  if (level < 4.5) return 3;
  if (level < 5.5) return 4;
  return 5;
}

/** "3 to 5 stars" for a range, or a single count when the band is one star wide. */
export function starBand(min: number | null, max: number | null) {
  if (min == null || max == null) return null;
  const lo = starsOf(min);
  const hi = starsOf(max);
  return { lo, hi, single: lo === hi };
}

/** The sports that actually need a level step, in the order they were picked. */
export const sportsNeedingLevel = (sports: string[]) =>
  sports.filter((s) => levelScales[s] != null);

/** The band a chosen tier opens up, used for the live caption under the ladder. */
export function matchBand(scale: LevelScale, tier: LevelTier) {
  if (scale.kind === 'pace') {
    const i = scale.tiers.indexOf(tier);
    const lo = scale.tiers[Math.max(0, i - 1)];
    const hi = scale.tiers[Math.min(scale.tiers.length - 1, i + 1)];
    return { lo: hi.value, hi: lo.value };
  }
  return {
    lo: (tier.rail - 1).toFixed(1),
    hi: (tier.rail + 1).toFixed(1),
  };
}

/** How many players near you sit in that band — a demo figure, scaled off the rail. */
export function playersInBand(tier: LevelTier) {
  const spread = [46, 78, 63, 31, 22];
  return spread[Math.min(spread.length - 1, Math.max(0, Math.round(tier.rail) - 2))];
}
