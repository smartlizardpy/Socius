import { useMemo } from 'react';
import type { ImageSourcePropType } from 'react-native';

import { useStore } from '../store';
import { useAllActivities } from './activities';
import { eligible, type Activity, type SportKey } from './seed';

export type Venue = {
  id: string;
  /** "Caddebostan Tenis Kulübü" */
  name: string;
  /** "Caddebostan" — the short form the feed lines use */
  short: string;
  address: string;
  distanceKm: number;
  travel: string;
  sports: SportKey[];
  hero: ImageSourcePropType;
  thumb: ImageSourcePropType;
  /** cheapest per-person price across the games here, null when they are all free */
  priceFrom: number | null;
  gameCount: number;
};

const TR_MAP: Record<string, string> = {
  ç: 'c', Ç: 'c', ğ: 'g', Ğ: 'g', ı: 'i', İ: 'i', ö: 'o', Ö: 'o',
  ş: 's', Ş: 's', ü: 'u', Ü: 'u', â: 'a', î: 'i', û: 'u',
};

/**
 * A venue has no id in the seed — it is a string on an activity. The slug is
 * derived so the two stay in step: rename a venue and its route follows.
 * Turkish letters are folded by hand; toLowerCase would leave İ as i̇ (i plus a
 * combining dot), which is a different string from the i everyone would type.
 */
export const venueId = (name: string) =>
  [...name]
    .map((c) => TR_MAP[c] ?? c)
    .join('')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');

function build(list: Activity[]): Venue[] {
  const byId = new Map<string, Venue>();
  for (const a of list) {
    const id = venueId(a.venueFull);
    const seen = byId.get(id);
    if (!seen) {
      byId.set(id, {
        id,
        name: a.venueFull,
        short: a.venue,
        address: a.venueAddress,
        distanceKm: a.distanceKm,
        travel: a.travel,
        sports: [a.sport],
        hero: a.hero,
        thumb: a.thumb,
        priceFrom: a.price ?? null,
        gameCount: 1,
      });
      continue;
    }
    if (!seen.sports.includes(a.sport)) seen.sports.push(a.sport);
    // the nearest reading wins — the same venue should not report two distances
    if (a.distanceKm < seen.distanceKm) {
      seen.distanceKm = a.distanceKm;
      seen.travel = a.travel;
    }
    if (a.price != null && (seen.priceFrom == null || a.price < seen.priceFrom)) {
      seen.priceFrom = a.price;
    }
    seen.gameCount += 1;
  }
  return [...byId.values()];
}

export function useVenues(): Venue[] {
  const all = useAllActivities();
  const levels = useStore((s) => s.levels);
  // a venue is only worth listing for the games you could actually join, so it
  // is built from the same filtered set the rest of the app shows
  return useMemo(() => build(all.filter((a) => eligible(a, levels))), [all, levels]);
}

export function useVenue(id: string | undefined): Venue | undefined {
  const all = useAllActivities();
  // built unfiltered: arriving from a story or a game you are in, the venue must
  // exist even when nothing there currently matches your level
  return useMemo(() => build(all).find((v) => v.id === id), [all, id]);
}

/** The games at this venue you can actually get into, soonest first. */
export function useVenueGames(id: string | undefined): Activity[] {
  const all = useAllActivities();
  const levels = useStore((s) => s.levels);
  return useMemo(
    () =>
      all
        .filter((a) => venueId(a.venueFull) === id && eligible(a, levels))
        .sort((x, y) => x.daysAway - y.daysAway),
    [all, levels, id],
  );
}
