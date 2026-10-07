import type { ImageSourcePropType } from 'react-native';
import type { IconName } from '../../components/Icon';
import { img } from './images';
import { PersonId } from './people';

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
