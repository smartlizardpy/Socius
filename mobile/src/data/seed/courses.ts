import type { ImageSourcePropType } from 'react-native';
import { SportKey } from './activities';
import { img } from './images';
import { PersonId } from './people';

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
