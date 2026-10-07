import type { ImageSourcePropType } from 'react-native';
import { Activity, SportKey } from './activities';
import { img } from './images';
import { sportLabel } from './levels';

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
