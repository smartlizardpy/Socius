/**
 * İstanbul semts, with a centroid each.
 *
 * The onboarding location step offered four hard-coded names. A device knows
 * better than that, but `expo-location`'s reverse geocoder is native-only —
 * `reverseGeocodeAsync` throws a GeocoderError on web — so a lookup that leans
 * on it would leave the web build, and the whole verification harness, with
 * nothing to show. It also returns the *ilçe* more reliably than the semt, and
 * the semt is what people actually say: nobody in Moda says they live in
 * Kadıköy.
 *
 * So the lookup is local. Coordinates in, nearest centroid out. It behaves the
 * same on iOS, Android and web, needs no key, no network and no rate limit, and
 * for an app whose entire product is one city's neighbourhoods, a table of that
 * city's neighbourhoods is not a workaround — it is the domain.
 *
 * Centroids are approximate to a few hundred metres, which is all a
 * nearest-match needs. Kadıköy and the shore east of it are dense because that
 * is where the games are; the rest of the city is one point per ilçe, enough to
 * name where somebody is and to know it is not somewhere Avenza covers yet.
 */

export type Semt = {
  name: string;
  /** the ilçe it sits in — "Moda, Kadıköy" is how the pair is spoken */
  district: string;
  lat: number;
  lon: number;
};

export const semts: Semt[] = [
  // --- Kadıköy and the shore, where the seeded games are -------------------
  { name: 'Moda', district: 'Kadıköy', lat: 40.9795, lon: 29.0248 },
  { name: 'Caddebostan', district: 'Kadıköy', lat: 40.9639, lon: 29.0641 },
  { name: 'Fenerbahçe', district: 'Kadıköy', lat: 40.9723, lon: 29.0392 },
  { name: 'Kalamış', district: 'Kadıköy', lat: 40.9742, lon: 29.0332 },
  { name: 'Göztepe', district: 'Kadıköy', lat: 40.9769, lon: 29.0616 },
  { name: 'Erenköy', district: 'Kadıköy', lat: 40.9703, lon: 29.0784 },
  { name: 'Suadiye', district: 'Kadıköy', lat: 40.9617, lon: 29.0793 },
  { name: 'Bostancı', district: 'Kadıköy', lat: 40.9531, lon: 29.0942 },
  { name: 'Kozyatağı', district: 'Kadıköy', lat: 40.9748, lon: 29.1003 },
  { name: 'Acıbadem', district: 'Kadıköy', lat: 40.9976, lon: 29.0405 },
  { name: 'Koşuyolu', district: 'Kadıköy', lat: 41.0031, lon: 29.0350 },
  { name: 'Fikirtepe', district: 'Kadıköy', lat: 40.9908, lon: 29.0435 },
  { name: 'Kadıköy', district: 'Kadıköy', lat: 40.9903, lon: 29.0270 },

  // --- the rest of the Anatolian side -------------------------------------
  { name: 'Üsküdar', district: 'Üsküdar', lat: 41.0255, lon: 29.0152 },
  { name: 'Kuzguncuk', district: 'Üsküdar', lat: 41.0356, lon: 29.0334 },
  { name: 'Çengelköy', district: 'Üsküdar', lat: 41.0534, lon: 29.0531 },
  { name: 'Ataşehir', district: 'Ataşehir', lat: 40.9923, lon: 29.1274 },
  { name: 'Ümraniye', district: 'Ümraniye', lat: 41.0163, lon: 29.1245 },
  { name: 'Maltepe', district: 'Maltepe', lat: 40.9352, lon: 29.1305 },
  { name: 'Kartal', district: 'Kartal', lat: 40.8894, lon: 29.1903 },
  { name: 'Pendik', district: 'Pendik', lat: 40.8762, lon: 29.2336 },
  { name: 'Tuzla', district: 'Tuzla', lat: 40.8161, lon: 29.3003 },
  { name: 'Sancaktepe', district: 'Sancaktepe', lat: 41.0005, lon: 29.2312 },
  { name: 'Sultanbeyli', district: 'Sultanbeyli', lat: 40.9668, lon: 29.2673 },
  { name: 'Çekmeköy', district: 'Çekmeköy', lat: 41.0403, lon: 29.1795 },
  { name: 'Beykoz', district: 'Beykoz', lat: 41.1253, lon: 29.0931 },
  { name: 'Şile', district: 'Şile', lat: 41.1752, lon: 29.6131 },
  { name: 'Adalar', district: 'Adalar', lat: 40.8763, lon: 29.0903 },

  // --- the European side ---------------------------------------------------
  { name: 'Beşiktaş', district: 'Beşiktaş', lat: 41.0430, lon: 29.0064 },
  { name: 'Ortaköy', district: 'Beşiktaş', lat: 41.0475, lon: 29.0270 },
  { name: 'Bebek', district: 'Beşiktaş', lat: 41.0772, lon: 29.0430 },
  { name: 'Etiler', district: 'Beşiktaş', lat: 41.0826, lon: 29.0301 },
  { name: 'Levent', district: 'Beşiktaş', lat: 41.0805, lon: 29.0109 },
  { name: 'Şişli', district: 'Şişli', lat: 41.0602, lon: 28.9877 },
  { name: 'Nişantaşı', district: 'Şişli', lat: 41.0480, lon: 28.9944 },
  { name: 'Mecidiyeköy', district: 'Şişli', lat: 41.0672, lon: 28.9944 },
  { name: 'Beyoğlu', district: 'Beyoğlu', lat: 41.0370, lon: 28.9770 },
  { name: 'Taksim', district: 'Beyoğlu', lat: 41.0370, lon: 28.9850 },
  { name: 'Karaköy', district: 'Beyoğlu', lat: 41.0234, lon: 28.9773 },
  { name: 'Kâğıthane', district: 'Kâğıthane', lat: 41.0803, lon: 28.9720 },
  { name: 'Sarıyer', district: 'Sarıyer', lat: 41.1671, lon: 29.0573 },
  { name: 'Fatih', district: 'Fatih', lat: 41.0186, lon: 28.9400 },
  { name: 'Eyüpsultan', district: 'Eyüpsultan', lat: 41.0478, lon: 28.9337 },
  { name: 'Zeytinburnu', district: 'Zeytinburnu', lat: 40.9903, lon: 28.9021 },
  { name: 'Bayrampaşa', district: 'Bayrampaşa', lat: 41.0430, lon: 28.9130 },
  { name: 'Gaziosmanpaşa', district: 'Gaziosmanpaşa', lat: 41.0578, lon: 28.9119 },
  { name: 'Sultangazi', district: 'Sultangazi', lat: 41.1062, lon: 28.8722 },
  { name: 'Esenler', district: 'Esenler', lat: 41.0435, lon: 28.8900 },
  { name: 'Bağcılar', district: 'Bağcılar', lat: 41.0392, lon: 28.8564 },
  { name: 'Güngören', district: 'Güngören', lat: 41.0201, lon: 28.8790 },
  { name: 'Bahçelievler', district: 'Bahçelievler', lat: 41.0022, lon: 28.8601 },
  { name: 'Bakırköy', district: 'Bakırköy', lat: 40.9800, lon: 28.8720 },
  { name: 'Küçükçekmece', district: 'Küçükçekmece', lat: 41.0001, lon: 28.7783 },
  { name: 'Başakşehir', district: 'Başakşehir', lat: 41.0932, lon: 28.8022 },
  { name: 'Avcılar', district: 'Avcılar', lat: 40.9798, lon: 28.7215 },
  { name: 'Beylikdüzü', district: 'Beylikdüzü', lat: 41.0011, lon: 28.6403 },
  { name: 'Esenyurt', district: 'Esenyurt', lat: 41.0290, lon: 28.6800 },
  { name: 'Büyükçekmece', district: 'Büyükçekmece', lat: 41.0203, lon: 28.5851 },
  { name: 'Arnavutköy', district: 'Arnavutköy', lat: 41.1840, lon: 28.7400 },
  { name: 'Çatalca', district: 'Çatalca', lat: 41.1430, lon: 28.4610 },
  { name: 'Silivri', district: 'Silivri', lat: 41.0730, lon: 28.2460 },
];

/** Great-circle distance in km. */
export function kmBetween(aLat: number, aLon: number, bLat: number, bLon: number) {
  const R = 6371;
  const rad = (d: number) => (d * Math.PI) / 180;
  const dLat = rad(bLat - aLat);
  const dLon = rad(bLon - aLon);
  const h =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(rad(aLat)) * Math.cos(rad(bLat)) * Math.sin(dLon / 2) ** 2;
  return 2 * R * Math.asin(Math.sqrt(h));
}

/**
 * The nearest semt to a point, with how far off it is.
 *
 * The distance is returned rather than swallowed because it is the only honest
 * way to say "you are not in İstanbul": the nearest entry to a phone in Ankara
 * is still some İstanbul semt, 350 km away.
 */
export function nearestSemt(lat: number, lon: number) {
  let best: { semt: Semt; km: number } | null = null;
  for (const semt of semts) {
    const km = kmBetween(lat, lon, semt.lat, semt.lon);
    if (!best || km < best.km) best = { semt, km };
  }
  return best;
}

/**
 * The n nearest semts, each with its distance.
 *
 * The runner-up is the useful part: when a reading looks wrong, what you need
 * to know is whether the right answer lost by 200 m or by 8 km — the first is a
 * centroid worth moving, the second means the fix is somewhere else entirely.
 */
export function nearbySemts(lat: number, lon: number, n = 3) {
  return semts
    .map((semt) => ({ semt, km: kmBetween(lat, lon, semt.lat, semt.lon) }))
    .sort((a, b) => a.km - b.km)
    .slice(0, n);
}

/** Past this from the nearest centroid, the answer is "somewhere else". */
export const OUT_OF_TOWN_KM = 25;

/**
 * Where Avenza actually has games, as a point and a radius.
 *
 * The seeded venues run from Moda to Ataşehir along the Anatolian shore. This
 * is what decides whether a detected semt gets a game count or an honest "not
 * here yet" — quoting "6 games within 5 km" to somebody in Silivri would be the
 * location step lying about the very thing it just measured.
 */
export const COVERAGE = { lat: 40.976, lon: 29.06, km: 12 };

export const covered = (s: Semt) =>
  kmBetween(s.lat, s.lon, COVERAGE.lat, COVERAGE.lon) <= COVERAGE.km;

/** The name as it is spoken: "Moda, Kadıköy" — or just "Kadıköy" for the ilçe. */
export const semtLabel = (s: Semt) => (s.name === s.district ? s.name : `${s.name}, ${s.district}`);
