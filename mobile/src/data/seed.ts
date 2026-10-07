/**
 * Sample data. The seven screens the mockups drew keep their exact values — names,
 * venues, prices, levels, distances and ratings are the mockups' own. Everything
 * added since (extra games, courses, notifications, reviews) follows the same
 * rules: the same four fictional people, the same neighbourhood, and only the four
 * sports the app actually has photography for.
 */

import type { ImageSourcePropType } from 'react-native';
import type { IconName } from '../Icon';

export const img = {
  /**
   * The mark: the two-figure original, recut into the app's own orange and blue.
   * This is the one that resolves the palette tension — the teal version read as a
   * third hue wherever the mark and the UI shared a frame.
   */
  mark: require('../../assets/img/mark-avenza.png'),
  /** the teal original, and the generated arcs mark before it — both reversible */
  markTeal: require('../../assets/img/mark-original.png'),
  markArcs: require('../../assets/img/mark.png'),
  /** onboarding explainers — GPT-Image via the Codex CLI, keyed off the painted
   *  checkerboard they came back with and flattened onto paper */
  onbPlace: require('../../assets/img/onb-place.png'),
  onbAccount: require('../../assets/img/onb-account.png'),
  /** the three explainer panels — the loop, told before the first question */
  howFind: require('../../assets/img/onb-how-find.png'),
  howMatch: require('../../assets/img/onb-how-match.png'),
  howPlay: require('../../assets/img/onb-how-play.png'),
  howJoin: require('../../assets/img/onb-how-join.png'),
  heroPeople: require('../../assets/img/hero-people.jpg'),
  heroPadel: require('../../assets/img/hero-padel.jpg'),
  celebrate: require('../../assets/img/celebrate.jpg'),
  cardPadel: require('../../assets/img/card-padel.jpg'),
  cardPitch: require('../../assets/img/card-pitch.jpg'),
  cardTennis: require('../../assets/img/card-tennis.jpg'),
  thumbCourt: require('../../assets/img/thumb-court.jpg'),
  thumbRun: require('../../assets/img/thumb-run.jpg'),
  thumbTrack: require('../../assets/img/thumb-track.jpg'),
  faceDeniz: require('../../assets/img/face-deniz.jpg'),
  faceSelin: require('../../assets/img/face-selin.jpg'),
  faceMert: require('../../assets/img/face-mert.jpg'),
  faceAyca: require('../../assets/img/face-ayca.jpg'),
} as const;

/* ---------------------------------------------------------------- people --- */

export type PersonId = 'deniz' | 'selin' | 'mert' | 'ayca';

export type Person = {
  id: PersonId;
  /** full name, Profile.body.html */
  name: string;
  /** short form used on cards, Main.body.html */
  short: string;
  /** given name only, used in the participant row */
  first: string;
  handle: string;
  area: string;
  face: ImageSourcePropType;
  verified: boolean;
  /** how far away they are, for the Discover rail and the players list */
  distanceKm: number;
  /** padel level as a number, for the rating question */
  level: number;
  /** the levels shown as chips on their profile */
  sports: { sport: string; level: string | null }[];
  gamesPlayed: number;
  rating: number;
  ratingCount: number;
  followers: number;
  hosted: number;
  /** bar heights for the "plays on" week chart, Mon-first */
  playsOn: number[];
  playsWhen: string;
  /** which game of the 41 was the no-show, for the reliability strip */
  noShowAt: number;
};

export const people: Record<PersonId, Person> = {
  deniz: {
    id: 'deniz',
    name: 'Deniz Yılmaz',
    short: 'Deniz Y.',
    first: 'Deniz',
    handle: '@denizy',
    area: 'Kadıköy, İstanbul',
    face: img.faceDeniz,
    verified: true,
    distanceKm: 1.4,
    level: 5.0,
    sports: [
      { sport: 'padel', level: '5.0' },
      { sport: 'tennis', level: '4.0' },
      { sport: 'running', level: null },
    ],
    gamesPlayed: 41,
    rating: 4.9,
    ratingCount: 27,
    followers: 312,
    hosted: 23,
    playsOn: [6, 22, 12, 30, 18, 9, 4],
    playsWhen: 'Evenings, 19:00–22:00',
    noShowAt: 26,
  },
  selin: {
    id: 'selin',
    name: 'Selin Aydın',
    short: 'Selin A.',
    first: 'Selin',
    handle: '@selina',
    area: 'Kadıköy, İstanbul',
    face: img.faceSelin,
    verified: true,
    distanceKm: 1.2,
    level: 5.0,
    sports: [
      { sport: 'padel', level: '5.0' },
      { sport: 'running', level: null },
    ],
    gamesPlayed: 34,
    rating: 5.0,
    ratingCount: 19,
    followers: 208,
    hosted: 11,
    playsOn: [10, 8, 26, 14, 6, 30, 20],
    playsWhen: 'Mornings and weekends',
    noShowAt: -1,
  },
  mert: {
    id: 'mert',
    name: 'Mert Kaya',
    short: 'Mert K.',
    first: 'Mert',
    handle: '@mertk',
    area: 'Kadıköy, İstanbul',
    face: img.faceMert,
    verified: true,
    distanceKm: 2.0,
    level: 4.5,
    sports: [
      { sport: 'padel', level: '4.5' },
      { sport: 'football', level: '5.0' },
    ],
    gamesPlayed: 17,
    rating: 4.7,
    ratingCount: 38,
    followers: 431,
    hosted: 29,
    playsOn: [14, 6, 18, 24, 30, 12, 8],
    playsWhen: 'Weeknights, 20:00–23:00',
    noShowAt: 12,
  },
  ayca: {
    id: 'ayca',
    name: 'Ayça Demir',
    short: 'Ayça D.',
    first: 'Ayça',
    handle: '@aycad',
    area: 'Kadıköy, İstanbul',
    face: img.faceAyca,
    verified: true,
    distanceKm: 3.1,
    level: 4.5,
    sports: [
      { sport: 'tennis', level: '4.5' },
      { sport: 'padel', level: '3.5' },
    ],
    gamesPlayed: 29,
    rating: 4.8,
    ratingCount: 22,
    followers: 176,
    hosted: 8,
    playsOn: [8, 20, 10, 28, 16, 22, 6],
    playsWhen: 'Weekday evenings',
    noShowAt: 19,
  },
};

/** The Discover people rail, in mockup order. */
export const playersAtYourLevel: PersonId[] = ['selin', 'mert', 'ayca'];

/* ------------------------------------------------------------------- you --- */

export const you = {
  name: 'You',
  handle: '@you',
  area: 'Kadıköy, İstanbul',
  padelLevel: 5.0,
  city: 'Kadıköy',
  radiusKm: 5,
  /** the Discover subhead counts everything within 5 km, not just the seeded rows */
  activitiesNearby: 11,
  gamesPlayed: 12,
  /** the same shape a Person carries, so one card reads either of them */
  noShowAt: -1,
  rating: 4.8,
  ratingCount: 9,
  followers: 47,
  hosted: 2,
  playsOn: [4, 18, 8, 26, 14, 20, 10],
  playsWhen: 'Weekday evenings, 19:00–22:00',
  memberSince: 'March',
};

/**
 * Reliability is DERIVED, never stored.
 *
 * The profile showed "%96" beside "turned up to 12 of 12 games" — a stored
 * percentage and the counts printed next to it had drifted apart, and nothing
 * could catch it. One number, computed from the two that are shown.
 */
/**
 * Games turned up to, derived — never stored.
 *
 * It used to be a field beside gamesPlayed, and the two drifted the moment one
 * of them was edited: Mert ended up with `gamesPlayed: 17, gamesTurnedUp: 49`,
 * and his profile read "turned up to 49 of 17 games" beside a 94% worked out
 * from a different pair of numbers entirely. The no-show record is the one fact
 * here; everything else is arithmetic on it.
 */
export const turnedUpOf = (p: { gamesPlayed: number; noShowAt: number }) =>
  p.gamesPlayed - (p.noShowAt >= 0 ? 1 : 0);

/**
 * Games in the current clean run — how many since the last no-show.
 *
 * Index 0 of the strip is the oldest game and the last is today, which is what
 * the "March … today" axis under it is dating.
 */
export const streakOf = (p: { gamesPlayed: number; noShowAt: number }) =>
  p.noShowAt >= 0 ? p.gamesPlayed - 1 - p.noShowAt : p.gamesPlayed;

export const reliabilityOf = (turnedUp: number, played: number) =>
  played <= 0 ? 100 : Math.round((turnedUp / played) * 100);

/** The same figure for a seeded person, whose misses are marked on the strip. */
export const personReliability = (p: { gamesPlayed: number; noShowAt: number }) =>
  reliabilityOf(turnedUpOf(p), p.gamesPlayed);

/** The neighbourhoods the Discover location chip offers. */
export const cities = ['Kadıköy', 'Beşiktaş', 'Şişli', 'Üsküdar'];

/* ------------------------------------------------------------ activities --- */

export type SportKey = 'padel' | 'football' | 'tennis' | 'run';

export type Activity = {
  id: string;
  sport: SportKey;
  /** "Padel · Doubles" */
  title: string;
  /** detail-screen headline, "Padel doubles at Caddebostan" */
  headline: string;
  /** clock only, so Turkish can render 19.30 */
  time: string;
  whenPrefix: string;
  /** 0 = today, 1 = tomorrow, … used by the "Tonight / This week" filters */
  daysAway: number;
  /** the Games date tile */
  dayShort: string;
  dayNum: string;
  venue: string;
  venueFull: string;
  venueAddress: string;
  dateLine: string;
  timeRange: string;
  /** the detail header line, translated whole */
  dateTimeLine: string;
  /** the feed line, translated whole — Turkish uses its own day abbreviations */
  feedLine: string;
  distanceKm: number;
  /** "8 min by bike" */
  travel: string;
  price: number | null;
  priceNote: string;
  levelLabel: string;
  levelMin: number | null;
  levelMax: number | null;
  /**
   * The host has opted to let players outside the range ask to join. Off by
   * default: a level range that anyone can walk through is not a range, and
   * showing someone a game they cannot get into wastes their time.
   */
  openToAllLevels: boolean;
  capacity: number;
  /** who is already in, host first */
  joined: PersonId[];
  hostId: PersonId;
  card: ImageSourcePropType;
  hero: ImageSourcePropType;
  thumb: ImageSourcePropType;
  /** shown as a white pill over the feed hero */
  matchReason: string | null;
  /** free-text the search box matches against, beyond title and venue */
  keywords: string;
};

export const activities: Activity[] = [
  {
    id: 'padel-caddebostan',
    sport: 'padel',
    title: 'Padel · Doubles',
    headline: 'Padel doubles at Caddebostan',
    time: '19:30',
    whenPrefix: 'Tonight',
    daysAway: 0,
    dayShort: 'WED',
    dayNum: '27',
    venue: 'Caddebostan',
    venueFull: 'Caddebostan Tenis Kulübü',
    venueAddress: 'Plaj Yolu Sk. 12, Kadıköy',
    dateLine: 'Wed 27 Aug',
    timeRange: '19:30–21:00',
    dateTimeLine: 'Wed 27 Aug · 19:30–21:00',
    feedLine: 'Tonight 19:30 · Caddebostan',
    distanceKm: 1.4,
    travel: '8 min by bike',
    price: 180,
    priceNote: 'court split 4 ways',
    levelLabel: 'Levels 4.0–6.0',
    levelMin: 4.0,
    levelMax: 6.0,
    openToAllLevels: false,
    capacity: 4,
    joined: ['deniz', 'selin', 'mert'],
    hostId: 'deniz',
    card: img.cardPadel,
    hero: img.heroPadel,
    thumb: img.thumbCourt,
    matchReason: null,
    keywords: 'evening indoor doubles court',
  },
  {
    id: 'five-a-side-moda',
    sport: 'football',
    title: '5-a-side · Friendly match',
    headline: '5-a-side at Moda Halı Saha',
    time: '21:00',
    whenPrefix: 'Thu',
    daysAway: 1,
    dayShort: 'THU',
    dayNum: '28',
    venue: 'Moda Halı Saha',
    venueFull: 'Moda Halı Saha',
    venueAddress: 'Moda Cd. 44, Kadıköy',
    dateLine: 'Thu 28 Aug',
    timeRange: '21:00–22:00',
    dateTimeLine: 'Thu 28 Aug · 21:00–22:00',
    feedLine: 'Thu 21:00 · Moda Halı Saha',
    distanceKm: 2.4,
    travel: '12 min by bike',
    price: 120,
    priceNote: 'pitch split 10 ways',
    levelLabel: 'All levels',
    levelMin: null,
    levelMax: null,
    openToAllLevels: true,
    capacity: 10,
    joined: ['mert', 'ayca', 'deniz', 'selin', 'mert', 'ayca', 'deniz', 'selin'],
    hostId: 'mert',
    card: img.cardPitch,
    hero: img.cardPitch,
    thumb: img.cardPitch,
    matchReason: null,
    keywords: 'evening astro floodlit friendly',
  },
  {
    id: 'run-moda-sahili',
    sport: 'run',
    title: 'Running · 8 km easy',
    headline: '8 km easy along Moda Sahili',
    time: '08:00',
    whenPrefix: 'Sat',
    daysAway: 3,
    dayShort: 'SAT',
    dayNum: '30',
    venue: 'Moda Sahili',
    venueFull: 'Moda Sahili',
    venueAddress: 'Moda Sahil Yolu, Kadıköy',
    dateLine: 'Sat 30 Aug',
    timeRange: '08:00–09:00',
    dateTimeLine: 'Sat 30 Aug · 08:00–09:00',
    feedLine: 'Sat 08:00 · Moda Sahili',
    distanceKm: 0.9,
    travel: '5 min on foot',
    price: null,
    priceNote: '',
    levelLabel: 'All paces',
    levelMin: null,
    levelMax: null,
    openToAllLevels: true,
    capacity: 9,
    joined: ['selin', 'ayca', 'deniz'],
    hostId: 'selin',
    card: img.thumbRun,
    hero: img.thumbRun,
    thumb: img.thumbRun,
    matchReason: null,
    keywords: 'morning seaside easy social free',
  },
  {
    id: 'tennis-fenerbahce',
    sport: 'tennis',
    title: 'Tennis · Singles',
    headline: 'Tennis singles at Fenerbahçe Parkı',
    time: '18:00',
    whenPrefix: 'Fri',
    daysAway: 2,
    dayShort: 'FRI',
    dayNum: '29',
    venue: 'Fenerbahçe Parkı',
    venueFull: 'Fenerbahçe Parkı Tenis Kortları',
    venueAddress: 'Fenerbahçe Mah., Kadıköy',
    dateLine: 'Fri 29 Aug',
    timeRange: '18:00–19:30',
    dateTimeLine: 'Fri 29 Aug · 18:00–19:30',
    feedLine: 'Fri 18:00 · Fenerbahçe Parkı',
    distanceKm: 3.1,
    travel: '14 min by bike',
    price: 140,
    priceNote: 'court split 2 ways',
    levelLabel: 'Levels 3.5–5.0',
    levelMin: 3.5,
    levelMax: 5.0,
    openToAllLevels: false,
    capacity: 2,
    joined: ['ayca'],
    hostId: 'ayca',
    card: img.cardTennis,
    hero: img.cardTennis,
    thumb: img.cardTennis,
    matchReason: null,
    keywords: 'evening clay outdoor singles hitting',
  },
  {
    id: 'padel-bostanci',
    sport: 'padel',
    title: 'Padel · Doubles',
    headline: 'Padel doubles at Bostancı',
    time: '11:00',
    whenPrefix: 'Sat',
    daysAway: 3,
    dayShort: 'SAT',
    dayNum: '30',
    venue: 'Bostancı Padel',
    venueFull: 'Bostancı Padel Kulübü',
    venueAddress: 'Bostancı Mah., Kadıköy',
    dateLine: 'Sat 30 Aug',
    timeRange: '11:00–12:30',
    dateTimeLine: 'Sat 30 Aug · 11:00–12:30',
    feedLine: 'Sat 11:00 · Bostancı Padel',
    distanceKm: 4.2,
    travel: '18 min by bike',
    price: 160,
    priceNote: 'court split 4 ways',
    levelLabel: 'Levels 3.0–4.5',
    levelMin: 3.0,
    levelMax: 4.5,
    openToAllLevels: false,
    capacity: 4,
    joined: ['mert', 'ayca'],
    hostId: 'mert',
    card: img.thumbCourt,
    hero: img.thumbCourt,
    thumb: img.thumbCourt,
    matchReason: null,
    keywords: 'morning weekend relaxed doubles',
  },
  {
    id: 'football-atasehir',
    sport: 'football',
    title: '7-a-side · League warm-up',
    headline: '7-a-side at Ataşehir',
    time: '20:00',
    whenPrefix: 'Sat',
    daysAway: 3,
    dayShort: 'SAT',
    dayNum: '30',
    venue: 'Ataşehir Saha',
    venueFull: 'Ataşehir Spor Tesisi',
    venueAddress: 'Barbaros Mah., Ataşehir',
    dateLine: 'Sat 30 Aug',
    timeRange: '20:00–21:30',
    dateTimeLine: 'Sat 30 Aug · 20:00–21:30',
    feedLine: 'Sat 20:00 · Ataşehir Saha',
    distanceKm: 6.8,
    travel: '22 min by bike',
    price: 150,
    priceNote: 'pitch split 14 ways',
    levelLabel: 'Levels 3.0–5.5',
    levelMin: 3.0,
    levelMax: 5.5,
    // Mert takes anyone who asks — the one seeded game that shows the opt-in
    openToAllLevels: true,
    capacity: 14,
    joined: ['mert', 'deniz', 'selin', 'ayca', 'mert', 'deniz', 'selin', 'ayca', 'mert', 'deniz', 'selin'],
    hostId: 'mert',
    card: img.cardPitch,
    hero: img.cardPitch,
    thumb: img.cardPitch,
    matchReason: null,
    keywords: 'evening astro league competitive',
  },
  {
    id: 'run-track-intervals',
    sport: 'run',
    title: 'Running · Track intervals',
    headline: 'Track intervals at Kalamış',
    time: '07:00',
    whenPrefix: 'Tue',
    daysAway: 6,
    dayShort: 'TUE',
    dayNum: '02',
    venue: 'Kalamış Pisti',
    venueFull: 'Kalamış Atletizm Pisti',
    venueAddress: 'Kalamış Mah., Kadıköy',
    dateLine: 'Tue 2 Sep',
    timeRange: '07:00–08:00',
    dateTimeLine: 'Tue 2 Sep · 07:00–08:00',
    feedLine: 'Tue 07:00 · Kalamış Pisti',
    distanceKm: 2.2,
    travel: '10 min by bike',
    price: null,
    priceNote: '',
    levelLabel: 'Sub-5:00 pace',
    levelMin: null,
    levelMax: null,
    openToAllLevels: true,
    capacity: 8,
    joined: ['selin', 'mert', 'deniz', 'ayca', 'selin'],
    hostId: 'selin',
    card: img.thumbTrack,
    hero: img.thumbTrack,
    thumb: img.thumbTrack,
    matchReason: null,
    keywords: 'morning track speed intervals fast free',
  },
  {
    id: 'tennis-social-caddebostan',
    sport: 'tennis',
    title: 'Tennis · Social doubles',
    headline: 'Social doubles at Caddebostan',
    time: '09:00',
    whenPrefix: 'Sun',
    daysAway: 4,
    dayShort: 'SUN',
    dayNum: '31',
    venue: 'Caddebostan',
    venueFull: 'Caddebostan Tenis Kulübü',
    venueAddress: 'Plaj Yolu Sk. 12, Kadıköy',
    dateLine: 'Sun 31 Aug',
    timeRange: '09:00–10:30',
    dateTimeLine: 'Sun 31 Aug · 09:00–10:30',
    feedLine: 'Sun 09:00 · Caddebostan',
    distanceKm: 1.4,
    travel: '8 min by bike',
    price: 110,
    priceNote: 'court split 4 ways',
    levelLabel: 'All levels',
    levelMin: null,
    levelMax: null,
    openToAllLevels: true,
    capacity: 4,
    joined: ['ayca', 'selin'],
    hostId: 'ayca',
    card: img.cardTennis,
    hero: img.cardTennis,
    thumb: img.cardTennis,
    matchReason: null,
    keywords: 'morning weekend social beginners welcome doubles',
  },
];

export const byId = (id: string) => activities.find((a) => a.id === id);

/** Discover filter chips, in mockup order. "All sports" is the default. */
export const sportFilters: { key: SportKey | 'all'; label: string; icon: IconName | null }[] = [
  { key: 'all', label: 'All sports', icon: null },
  { key: 'padel', label: 'Padel', icon: 'racquet' },
  { key: 'football', label: 'Football', icon: 'soccer-ball' },
  { key: 'tennis', label: 'Tennis', icon: 'tennis-ball' },
  { key: 'run', label: 'Run', icon: 'person-simple-run' },
];

/** How many spots an activity still has, given whether you are in it. */
export function spotsLeft(a: Activity, joined: boolean) {
  return Math.max(0, a.capacity - a.joined.length - (joined ? 1 : 0));
}

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

/* ----------------------------------------------------------------- rating -- */

/** The four tags on Rate.body.html, in order. The first two start selected. */
export const ratingTags = ['On time', 'Good to play with', 'Brought the balls', 'Sorted the court'];

/** Who you rate after the padel game, in the mockup's order. */
export const rateQueue: PersonId[] = ['selin', 'mert', 'deniz'];

/* ------------------------------------------------------------ past games --- */

export type PastGame = {
  id: string;
  title: string;
  /** the Games prompt headline, written whole so it can be translated whole */
  promptTitle: string;
  dateLine: string;
  venue: string;
  thumb: ImageSourcePropType;
  /** who was there, for the rating queue */
  players: PersonId[];
  /** already rated in the seed — the padel one is the outstanding job */
  rated: boolean;
};

export const pastGames: PastGame[] = [
  {
    id: 'past-padel-sunday',
    title: 'Padel · Doubles',
    promptTitle: "Rate Sunday's padel",
    dateLine: 'Sun 24 Aug',
    venue: 'Caddebostan',
    thumb: img.cardPadel,
    players: rateQueue,
    rated: false,
  },
  {
    id: 'past-tennis-singles',
    title: 'Tennis · Singles',
    promptTitle: "Rate Thursday's tennis",
    dateLine: 'Thu 21 Aug',
    venue: 'Fenerbahçe Parkı',
    thumb: img.thumbCourt,
    players: ['ayca'],
    rated: true,
  },
  {
    id: 'past-five-a-side',
    title: '5-a-side · Friendly match',
    promptTitle: "Rate Tuesday's five-a-side",
    dateLine: 'Tue 19 Aug',
    venue: 'Moda Halı Saha',
    thumb: img.cardPitch,
    players: ['mert', 'deniz'],
    rated: true,
  },
];

/* --------------------------------------------------------------- reviews --- */

export type Review = {
  id: string;
  by: PersonId;
  when: string;
  text: string;
  tags: string[];
};

export const reviewsFor: Record<PersonId, Review[]> = {
  deniz: [
    {
      id: 'r1',
      by: 'selin',
      when: '2 days ago',
      text: 'Booked the court, brought spare balls, and put us in even teams. Genuinely a 5.0 — no sandbagging.',
      tags: ['On time', 'Level as described'],
    },
    {
      id: 'r2',
      by: 'mert',
      when: 'last week',
      text: 'Turned up early to warm up and stayed to help clear the court. Easy game to be part of.',
      tags: ['On time', 'Good to play with'],
    },
  ],
  selin: [
    {
      id: 'r3',
      by: 'deniz',
      when: '3 days ago',
      text: 'Sets the pace on the front foot and keeps the whole court talking. Never once late.',
      tags: ['On time', 'Good to play with'],
    },
  ],
  mert: [
    {
      id: 'r4',
      by: 'ayca',
      when: '5 days ago',
      text: 'Organises the pitch, the bibs and the split without being asked. Plays hard, no arguments.',
      tags: ['Sorted the court', 'Good to play with'],
    },
  ],
  ayca: [
    {
      id: 'r5',
      by: 'selin',
      when: 'a week ago',
      text: 'Patient with anyone newer and still gives you a proper match. Would play again any week.',
      tags: ['Good to play with', 'Level as described'],
    },
  ],
};

/** Reviews other players have left on you. */
export const reviewsOfYou: Review[] = [
  {
    id: 'y1',
    by: 'mert',
    when: 'yesterday',
    text: 'Held the level all evening and covered the tram side without being asked. Good hands at the net.',
    tags: ['On time', 'Level as described'],
  },
  {
    id: 'y2',
    by: 'ayca',
    when: 'last week',
    text: 'Messaged ahead when the traffic looked bad, then got there first anyway.',
    tags: ['On time'],
  },
];

/* --------------------------------------------------------------- courses --- */

export type Course = {
  id: string;
  kind: string;
  /** which sport it teaches — matched against a bulletin story's sport */
  sport: SportKey;
  title: string;
  /** the title without its duration, for rows that also print the schedule —
   *  "Padel fundamentals, 6 weeks" beside "6 weeks from 15 Sep" says it twice
   *  and then truncates */
  shortTitle: string;
  venue: string;
  coachId: PersonId;
  coachLine: string;
  hero: ImageSourcePropType;
  thumb: ImageSourcePropType;
  placesLeft: number;
  groupOf: number;
  alreadyJoined: number;
  schedule: string;
  runs: string;
  levelMin: number;
  levelMax: number;
  levelNote: string;
  price: number;
  priceNote: string;
  /** how many sessions the price covers — the checkout divides by this */
  sessions: number;
  includes: string[];
  cancelNote: string;
};

export const courses: Course[] = [
  {
    id: 'beginner-tennis-8-weeks',
    kind: 'COURSE',
    sport: 'tennis',
    title: 'Beginner tennis, 8 weeks',
    shortTitle: 'Beginner tennis',
    venue: 'Caddebostan Tenis Akademisi · Kadıköy',
    coachId: 'deniz',
    coachLine: 'TTF Level 2 coach · 9 years teaching',
    hero: img.cardTennis,
    thumb: img.cardTennis,
    placesLeft: 3,
    groupOf: 12,
    alreadyJoined: 9,
    schedule: 'Tue and Thu, 18:00',
    runs: '8 weeks from 9 Sep',
    levelMin: 1.0,
    levelMax: 2.5,
    levelNote: 'New to tennis is fine',
    price: 2400,
    priceNote: 'for all 8 sessions',
    sessions: 8,
    includes: [
      'Court fee and balls included',
      'A racquet to borrow if you need one',
      'Video review of your serve in week 4',
      'One make-up session if you miss a week',
    ],
    cancelNote: 'Free to cancel up to 7 days before it starts.',
  },
  {
    id: 'padel-fundamentals-6-weeks',
    kind: 'COURSE',
    sport: 'padel',
    title: 'Padel fundamentals, 6 weeks',
    shortTitle: 'Padel fundamentals',
    venue: 'Bostancı Padel Kulübü · Kadıköy',
    coachId: 'mert',
    coachLine: 'Padel coach · 6 years teaching',
    hero: img.thumbCourt,
    thumb: img.thumbCourt,
    placesLeft: 5,
    groupOf: 8,
    alreadyJoined: 3,
    schedule: 'Mon and Wed, 20:00',
    runs: '6 weeks from 15 Sep',
    levelMin: 2.0,
    levelMax: 3.5,
    levelNote: 'Some racquet sport helps',
    price: 1800,
    priceNote: 'for all 6 sessions',
    sessions: 6,
    includes: [
      'Court and balls included',
      'Two coaches on the court from week 3',
      'A match night in the final week',
      'One make-up session if you miss a week',
    ],
    cancelNote: 'Free to cancel up to 7 days before it starts.',
  },
];

export const courseById = (id: string) => courses.find((c) => c.id === id);

/* --------------------------------------------------------- notifications --- */

export type Notification = {
  id: string;
  icon: IconName;
  tone: 'blue' | 'orange' | 'plain';
  title: string;
  body: string;
  when: string;
  /** where tapping it goes */
  href: string | null;
  face: PersonId | null;
};

export const notifications: Notification[] = [
  {
    id: 'n1',
    icon: 'hand-heart',
    tone: 'orange',
    title: 'One spot left tonight',
    body: 'Padel doubles at Caddebostan needs a fourth at 19:30.',
    when: '12 min ago',
    href: '/activity/padel-caddebostan',
    face: null,
  },
  {
    id: 'n2',
    icon: 'star-fill',
    tone: 'orange',
    title: 'Two players are waiting on you',
    body: "Rate Sunday's padel — it takes about twenty seconds.",
    when: '2 h ago',
    href: '/rate',
    face: null,
  },
  {
    id: 'n3',
    icon: 'user-fill',
    tone: 'plain',
    title: 'Selin started following you',
    body: 'You have played together twice this month.',
    when: 'Yesterday',
    href: '/player/selin',
    face: 'selin',
  },
  {
    id: 'n4',
    icon: 'seal-check',
    tone: 'blue',
    title: 'Your padel level held at 4 stars',
    body: 'Nine of the last ten players said the level was spot on.',
    when: 'Tue',
    href: '/(tabs)/profile',
    face: null,
  },
  {
    id: 'n5',
    icon: 'calendar-check',
    tone: 'plain',
    title: 'Mert confirmed the pitch',
    body: '5-a-side at Moda Halı Saha is on for Thursday 21:00.',
    when: 'Mon',
    href: '/activity/five-a-side-moda',
    face: 'mert',
  },
];

/* ------------------------------------------------------------------- fee --- */

/**
 * What Avenza takes on a booking. Beta does not mean free — the deck used to say
 * "free while in beta", which was a promise nobody made.
 */
export const FEE_RATE = 0.1;

/** The fee on a share, rounded to whole lira. */
export const feeOn = (share: number) => Math.round(share * FEE_RATE);

/* ---------------------------------------------------------------- create --- */

/**
 * The pickers behind the Create form's When / Where / Format rows.
 *
 * A when option is an object rather than a display string: the published activity
 * needs the day and the time as data to sit in a list next to the seeded ones, and
 * a string like "Tonight · 19:30" is neither translatable nor sortable.
 */
export type WhenOption = {
  label: string;
  whenPrefix: string;
  time: string;
  dayShort: string;
  dayNum: string;
  daysAway: number;
  dateLine: string;
};

export const createWhenOptions: WhenOption[] = [
  { label: 'Tonight', whenPrefix: 'Tonight', time: '19:30', dayShort: 'WED', dayNum: '27', daysAway: 0, dateLine: 'Wed 27 Aug' },
  { label: 'Tomorrow', whenPrefix: 'Thu', time: '20:00', dayShort: 'THU', dayNum: '28', daysAway: 1, dateLine: 'Thu 28 Aug' },
  { label: 'Friday', whenPrefix: 'Fri', time: '18:00', dayShort: 'FRI', dayNum: '29', daysAway: 2, dateLine: 'Fri 29 Aug' },
  { label: 'Saturday', whenPrefix: 'Sat', time: '11:00', dayShort: 'SAT', dayNum: '30', daysAway: 3, dateLine: 'Sat 30 Aug' },
  { label: 'Sunday', whenPrefix: 'Sun', time: '09:00', dayShort: 'SUN', dayNum: '31', daysAway: 4, dateLine: 'Sun 31 Aug' },
];

export const createVenueOptions = [
  'Caddebostan',
  'Bostancı Padel',
  'Moda Halı Saha',
  'Fenerbahçe Parkı',
  'Kalamış Pisti',
];

export const createFormatOptions: Record<string, string[]> = {
  padel: ['Doubles', 'Singles', 'Americano'],
  football: ['5-a-side', '7-a-side', 'Kickabout'],
  tennis: ['Singles', 'Doubles', 'Hitting session'],
  running: ['Easy run', 'Track intervals', 'Long run'],
};

/** The default capacity a format implies. */
export const formatCapacity: Record<string, number> = {
  Doubles: 4,
  Singles: 2,
  Americano: 8,
  '5-a-side': 10,
  '7-a-side': 14,
  Kickabout: 12,
  'Hitting session': 2,
  'Easy run': 10,
  'Track intervals': 8,
  'Long run': 8,
};

/* ------------------------------------------------- what you published ------ */

/** The photo a published activity gets, by sport. */
const CREATED_ART: Record<string, ImageSourcePropType> = {
  padel: img.cardPadel,
  football: img.cardPitch,
  tennis: img.cardTennis,
  running: img.thumbRun,
};

/**
 * Turns something you published into a full Activity, so it can sit in the same
 * lists as the seeded ones and open the same detail screen. Without this a
 * published activity exists in the store but appears nowhere you can tap.
 */
export function draftToActivity(d: {
  id: string;
  sport: string;
  format: string;
  dateLine: string;
  time: string;
  venue: string;
  capacity: number;
  price: number | null;
  levelMin: number;
  levelMax: number;
  openToAllLevels?: boolean;
}): Activity {
  const when = createWhenOptions.find((w) => w.dateLine === d.dateLine) ?? createWhenOptions[0];
  const art = CREATED_ART[d.sport] ?? img.cardPadel;
  const rated = d.sport !== 'running';

  return {
    id: d.id,
    sport: (d.sport === 'running' ? 'run' : d.sport) as SportKey,
    title: `${sportLabel(d.sport)} · ${d.format}`,
    headline: `${d.format} at ${d.venue}`,
    time: d.time,
    whenPrefix: when.whenPrefix,
    daysAway: when.daysAway,
    dayShort: when.dayShort,
    dayNum: when.dayNum,
    venue: d.venue,
    venueFull: d.venue,
    venueAddress: `${d.venue}, İstanbul`,
    dateLine: d.dateLine,
    timeRange: d.time,
    dateTimeLine: `${d.dateLine} · ${d.time}`,
    feedLine: `${when.whenPrefix} ${d.time} · ${d.venue}`,
    distanceKm: 1.0,
    travel: '8 min by bike',
    price: d.price,
    priceNote: d.price != null ? 'court split evenly' : '',
    levelLabel: rated ? 'Levels' : 'All levels',
    levelMin: rated ? d.levelMin : null,
    levelMax: rated ? d.levelMax : null,
    openToAllLevels: d.openToAllLevels ?? false,
    capacity: d.capacity,
    // you are the host, and the store tracks you separately from the seeded four
    joined: [],
    hostId: 'deniz',
    card: art,
    hero: art,
    thumb: art,
    matchReason: null,
    keywords: 'yours published',
  };
}

/* ------------------------------------------------------- why it matches ---- */

/**
 * The reason pill over the feed photo. It used to be a fixed string on the
 * activity, so it claimed "Matches your padel level" even when your level sat
 * outside the range the game asks for. It is computed now, and says nothing at
 * all rather than something untrue.
 */
export function matchReasonFor(a: Activity, myLevel: number): string | null {
  if (a.levelMin == null || a.levelMax == null) return null;
  if (myLevel < a.levelMin || myLevel > a.levelMax) return null;
  return a.sport;
}

/** Whether your level sits inside what a game asks for. */
export function inBand(a: Activity, myLevel: number) {
  if (a.levelMin == null || a.levelMax == null) return true;
  return myLevel >= a.levelMin && myLevel <= a.levelMax;
}

/**
 * Your level in the sport a game is actually played in.
 *
 * Everything used to compare against your padel level, so a tennis game was
 * judged by how well you play padel. The activity's key and the onboarding's key
 * differ for running, which is the only mapping needed.
 */
export function levelForSport(levels: Record<string, string>, sport: SportKey | string) {
  const key = sport === 'run' ? 'running' : sport;
  const raw = levels[key];
  return raw != null ? Number(raw) : you.padelLevel;
}

/**
 * Whether a game belongs in your feed at all.
 *
 * A game you cannot get into is noise, so the lists hide it — unless the host
 * has opted to hear from players outside the range, which is the only thing that
 * makes "ask to join anyway" a real offer rather than a dead end.
 */
export function eligible(a: Activity, levels: Record<string, string>) {
  return inBand(a, levelForSport(levels, a.sport)) || a.openToAllLevels;
}
