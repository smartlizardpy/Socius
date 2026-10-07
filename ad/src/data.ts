import { staticFile } from 'remotion';

/**
 * The real seeded halı saha match and its real players.
 *
 * Transcribed from mobile/src/data/seed.ts — activity `five-a-side-moda` and
 * the people on it. Nothing is invented: the capacity, the roster, the price,
 * the reliability records and the arithmetic on them are the app's.
 *
 * The match is the right one for this script by accident of the seed, not by
 * arrangement: capacity 10, eight players already in, so it stands at exactly
 * **two spots left** — which is the ad's opening line.
 */

export type Person = {
  id: string;
  name: string;
  first: string;
  face: string;
  /** the app's level, shown as stars on the roster */
  level: number;
  gamesPlayed: number;
  /** which game of the set was the no-show; -1 means none */
  noShowAt: number;
  /** the players-list star rating */
  rating: number;
};

export const people: Record<string, Person> = {
  mert: {
    id: 'mert',
    name: 'Mert Kaya',
    first: 'Mert',
    face: staticFile('img/face-mert.jpg'),
    level: 4.5,
    gamesPlayed: 17,
    noShowAt: 12,
    rating: 4.7,
  },
  ayca: {
    id: 'ayca',
    name: 'Ayça Demir',
    first: 'Ayça',
    face: staticFile('img/face-ayca.jpg'),
    level: 4.5,
    gamesPlayed: 29,
    noShowAt: 19,
    rating: 4.8,
  },
  deniz: {
    id: 'deniz',
    name: 'Deniz Yılmaz',
    first: 'Deniz',
    face: staticFile('img/face-deniz.jpg'),
    level: 5.0,
    gamesPlayed: 41,
    noShowAt: 26,
    rating: 4.9,
  },
  selin: {
    id: 'selin',
    name: 'Selin Arslan',
    first: 'Selin',
    face: staticFile('img/face-selin.jpg'),
    level: 5.0,
    gamesPlayed: 34,
    noShowAt: -1,
    rating: 5.0,
  },
};

/** activity `five-a-side-moda`, verbatim. */
export const match = {
  id: 'five-a-side-moda',
  sport: 'football',
  card: staticFile('img/card-pitch.jpg'),
  capacity: 10,
  /** the football roster repeats a face to reach its count — the app's comment */
  joined: ['mert', 'ayca', 'deniz', 'selin', 'mert', 'ayca', 'deniz', 'selin'],
  hostId: 'mert',
  price: 120,
} as const;

/**
 * activity `padel-caddebostan` — the first row in the seed, and therefore what
 * Discover features while the filter is still on "Tüm sporlar".
 *
 * It is in the ad for one second, so the football filter has something real to
 * replace. Capacity 4 with three in makes it one spot left, and its band is
 * 4.0–6.0, which your 5.0 sits inside — so it carries the level rail and the
 * "seviyene uygun" pill that the halı saha match, being open to all levels,
 * does not.
 */
export const padelMatch = {
  id: 'padel-caddebostan',
  card: staticFile('img/card-padel.jpg'),
  capacity: 4,
  joined: ['deniz', 'selin', 'mert'],
  hostId: 'deniz',
  levelMin: 4.0,
  levelMax: 6.0,
} as const;

/** capacity 4 − 3 joined = 1 */
export const padelSpots = padelMatch.capacity - padelMatch.joined.length;

/** Your padel level, from `you` in the seed. */
export const yourLevel = 5.0;

/**
 * activity `football-atasehir`, the other seeded halı saha game.
 *
 * It exists in the ad only so line 2 can say "maçlarını" honestly — the plural
 * needs a second match on screen, and this is the one the app actually has.
 */
export const secondMatch = {
  id: 'football-atasehir',
  title: "Halı saha 7'li · Lig hazırlığı", //   "7-a-side · League warm-up"
  whenVenue: 'Cmt 20.00 · Ataşehir Saha', //    "Sat 20:00 · Ataşehir Saha"
  thumb: staticFile('img/card-pitch.jpg'),
  price: 150,
  capacity: 14,
  joinedCount: 11,
} as const;

/** capacity 14 − 11 joined = 3. "{n} yer kaldı" */
export const secondMatchSpots = secondMatch.capacity - secondMatch.joinedCount;

/*
 * The symbol, without the wordmark — the type next to it is always set from
 * `ui.brand`, so the rename only had to touch one string.
 *
 * This file is still the Avenza glyph. Nothing in the code can change that:
 * drop the Socius symbol in at 144×144 and repoint this line.
 */
export const mark = staticFile('img/mark-avenza.png');

/* ----------------------------------------------------------- arithmetic -- */
/* The same four functions the app derives every reliability figure from.     */

/** mobile/src/data/seed.ts — turnedUpOf */
export const turnedUpOf = (p: Person) => p.gamesPlayed - (p.noShowAt >= 0 ? 1 : 0);

/** mobile/src/data/seed.ts — streakOf: games in the current clean run */
export const streakOf = (p: Person) =>
  p.noShowAt >= 0 ? p.gamesPlayed - 1 - p.noShowAt : p.gamesPlayed;

/** mobile/src/data/seed.ts — reliabilityOf */
export const reliabilityOf = (turnedUp: number, played: number) =>
  played <= 0 ? 100 : Math.round((turnedUp / played) * 100);

/** mobile/src/data/seed.ts — personReliability */
export const personReliability = (p: Person) => reliabilityOf(turnedUpOf(p), p.gamesPlayed);

/** mobile/src/i18n.tsx — formatDecimal, tr: a comma, not a point */
export const trDecimal = (n: number, digits = 1) => n.toFixed(digits).replace('.', ',');

/** mobile/src/data/seed.ts — starsOf, for the roster's "4.5★" line */
export const starsOf = (level: number) => Math.round(level);

/** How many spots the match still has. capacity 10 − 8 joined = 2. */
export const spotsLeft = (joinedYourself: boolean) =>
  Math.max(0, match.capacity - match.joined.length - (joinedYourself ? 1 : 0));

/** The three players the detail screen shows, then the open slot. */
export const roster = match.joined.slice(0, 3).map((id) => people[id]);

export const host = people[match.hostId];
