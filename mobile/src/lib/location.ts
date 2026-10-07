import { useCallback, useState } from 'react';
import * as Location from 'expo-location';

import { nearbySemts, nearestSemt, OUT_OF_TOWN_KM } from '../data/semts';

/**
 * What the fix was and what was done with it, in the Metro console.
 *
 * A location resolution is the one thing in this app you cannot check by
 * looking at the screen: the screen shows a name, and a wrong name looks
 * exactly like a right one. So this prints the coordinates, the accuracy they
 * came with, the three nearest centroids with their distances, and which of the
 * two sources actually decided — because when a reading is wrong, the question
 * is always whether the right answer lost by 200 m (move the centroid) or by
 * 8 km (the fix is somewhere else entirely).
 *
 * `__DEV__` only. A release build prints nothing, and a user's coordinates are
 * not something to leave lying in a log.
 */
const log = (...parts: unknown[]) => {
  if (__DEV__) console.log('[socius:location]', ...parts);
};

const round = (n: number, p = 5) => Number(n.toFixed(p));

/**
 * Where the phone is, named the way a person would name it.
 *
 * Two sources, in order, because neither covers the ground alone:
 *
 *  1. **The device's own geocoder.** Works anywhere on earth and returns the
 *     local administrative name, which is what somebody outside İstanbul needs.
 *     `reverseGeocodeAsync` is native-only — it throws a GeocoderError on web.
 *  2. **The local semt table.** Works on web, offline, and in the simulator, and
 *     is finer-grained than the geocoder inside İstanbul, where the geocoder
 *     tends to answer with the ilçe. Nobody in Moda says they live in Kadıköy.
 *
 * There is no "you are not in İstanbul" state any more. The geocoder names
 * Çankaya and Camden as readily as Moda, and the table only answers when the
 * point is genuinely near one of its centroids, so the failure left is the
 * honest one: we could not work out where you are.
 */
export type SemtState =
  | { kind: 'idle' }
  | { kind: 'asking' }
  /** `name` is the semt, `region` the il it sits in, `area` what to print under it */
  | { kind: 'found'; name: string; area: string | null; region: string }
  | { kind: 'denied' }
  | { kind: 'unknown' };

/** The finest name the device geocoder gives, and what to print under it. */
function fromGeocode(a: Location.LocationGeocodedAddress) {
  // `district` is the geocoder's own words for "additional city-level
  // information like district name" — the semt, where it knows one.
  const name = a.district || a.subregion || a.city || a.name;
  if (!name) return null;

  // `region` is the state/province — the il. It is the half the profile line
  // needs, and the half that used to be hardcoded to İstanbul.
  const region = [a.region, a.city, a.subregion].find((x) => !!x && x !== name) ?? '';

  const area = [region, a.country]
    .filter((x): x is string => !!x && x !== name)
    .filter((x, i, xs) => xs.indexOf(x) === i)
    .join(', ');
  return { name, area: area || null, region };
}

export function useDeviceSemt() {
  const [state, setState] = useState<SemtState>({ kind: 'idle' });

  const locate = useCallback(async () => {
    setState({ kind: 'asking' });
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        log(`-> denied (permission status: ${status})`);
        setState({ kind: 'denied' });
        return null;
      }

      // Balanced, not High: this resolves to a neighbourhood name, and a
      // block-level fix costs seconds of GPS warm-up to land in the same semt.
      const pos = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Balanced,
      });
      const { latitude, longitude, accuracy } = pos.coords;

      log(
        `fix ${round(latitude)}, ${round(longitude)}` +
          (accuracy != null ? ` ±${Math.round(accuracy)}m` : ''),
      );
      log(
        'nearest:',
        nearbySemts(latitude, longitude)
          .map((x) => `${x.semt.name} ${x.km.toFixed(2)}km`)
          .join('  ·  '),
      );

      // the table first inside İstanbul, because it knows the semt and the
      // geocoder usually only knows the ilçe
      const near = nearestSemt(latitude, longitude);
      if (near && near.km <= OUT_OF_TOWN_KM) {
        log(`-> table: ${near.semt.name} (${near.km.toFixed(2)}km from its centroid)`);
        const found = {
          kind: 'found' as const,
          name: near.semt.name,
          region: 'İstanbul',
          area:
            near.semt.name === near.semt.district
              ? 'İstanbul'
              : `${near.semt.district}, İstanbul`,
        };
        setState(found);
        return found;
      }

      log(`table has nothing within ${OUT_OF_TOWN_KM}km — asking the device geocoder`);
      const [addr] = await Location.reverseGeocodeAsync({ latitude, longitude });
      log('geocoder:', addr ? JSON.stringify(addr) : 'no result');
      const hit = addr ? fromGeocode(addr) : null;
      if (hit) {
        log(`-> geocoder: ${hit.name}${hit.area ? ` (${hit.area})` : ''}`);
        const found = { kind: 'found' as const, ...hit };
        setState(found);
        return found;
      }

      log('-> unknown: neither source produced a name');
      setState({ kind: 'unknown' });
    } catch (e) {
      log('-> unknown:', e instanceof Error ? e.message : String(e));
      // no geocoder on this platform, no fix in the simulator, a timeout. Not a
      // refusal, and it must not be reported as one.
      setState({ kind: 'unknown' });
    }
    return null;
  }, []);

  return [state, locate] as const;
}
