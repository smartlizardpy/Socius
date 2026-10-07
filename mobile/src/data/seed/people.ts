import type { ImageSourcePropType } from 'react-native';
import { img } from './images';

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
