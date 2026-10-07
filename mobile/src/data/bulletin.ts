import { useMemo } from 'react';

import { useStore } from '../store';
import { useAllActivities } from './activities';
import { courses, eligible, img, sportFilters, type SportKey } from './seed';
import { venueId } from './venues';
import { NEWS_IMAGES } from '../generated/news-images.gen';
import raw from './bulletin.json';
import adsRaw from './ads.json';
import world from './bulletin.world.json';

/** A translated pair. News copy carries its own Turkish rather than going through
 *  strings.json — the feed writes both languages, and t() keys are for UI chrome. */
export type Bi = { en: string; tr: string };

export type BulletinItem = {
  id: string;
  /** 'local' is written from Avenza's own data; 'world' comes from the news feed */
  scope: 'local' | 'world';
  /** kept for the JSON's shape; ordering is decided by rank(), not by a flag */
  lead?: boolean;
  /** the uppercase kicker before the source and the timestamp */
  category: Bi;
  /** publisher name — world items only, and the only thing separating them in the list */
  source: string | null;
  sourceUrl: string | null;
  hoursAgo: number;
  headline: Bi;
  summary: Bi[];
  image: keyof typeof img | null;
  /** the one orange pill a screen is allowed */
  badge: Bi | null;
  sport: string | null;
  /** a local item that ends in a specific game */
  activityId: string | null;
  /** a local item that is about a place — a new court, a change in its prices */
  venue?: string | null;
  why: Bi;
};

type Feed = { edition: string; dateLine: Bi; items: BulletinItem[] };

/** Local items are curated; the world half is whatever the feed job last wrote.
 *  Two files so a feed refresh is a single-file replace that cannot touch ours. */
const feed: Feed = {
  ...(raw as unknown as Feed),
  items: [...(raw as unknown as Feed).items, ...(world as unknown as BulletinItem[])],
};

export const edition = feed.edition;
export const dateLine = feed.dateLine;

/** News categories are editorial words; these are the ones that map to a sport
 *  we actually have games for, which is what a story is allowed to end in. */
const CATEGORY_SPORT: Record<string, SportKey> = {
  padel: 'padel',
  football: 'football',
  tennis: 'tennis',
  run: 'run',
  running: 'run',
};

/** Feed items arrive with an editorial category and no sport field, so the
 *  category is the fallback — otherwise a world story could never end in a game,
 *  which is the whole reason it is in this app rather than a news app. */
export const sportOf = (item: BulletinItem): SportKey | null =>
  CATEGORY_SPORT[(item.sport ?? '').toLowerCase()] ??
  CATEGORY_SPORT[item.category.en.toLowerCase()] ??
  null;

/**
 * The picture for an item, from either of the two sources that can supply one.
 *
 * A local item names a key in `img` — art the repo owns. A feed item carries a
 * photograph pulled from the publisher's own article, keyed by item id in the
 * generated map, because require() is resolved at build time and a path sitting
 * in JSON cannot be required.
 */
export function imageOf(item: BulletinItem) {
  return NEWS_IMAGES[item.id] ?? (item.image ? img[item.image] : null);
}

/** `KADIKÖY · PADEL · 2H` for ours, `FOOTBALL · FANATİK · 1H` for a feed item.
 *  The publisher name is the whole distinction, so it never gets dropped. */
export function kicker(item: BulletinItem, lang: 'en' | 'tr') {
  const h = item.hoursAgo;
  const days = Math.max(1, Math.floor(h / 24));
  const age =
    h < 24
      ? lang === 'tr'
        ? `${h} SA`
        : `${h}H`
      : lang === 'tr'
        ? `${days} GÜN`
        : `${days}D`;
  return [item.category[lang], sourceCaps(item), age].filter(Boolean).join(' · ');
}

/**
 * Turkish is the only locale here where uppercasing changes a letter's identity
 * (i -> İ), and every outlet in the feed is a Turkish masthead, so 'tr' is the
 * right rule for this data — HÜRRİYET, MİLLİYET. A non-Turkish source carrying a
 * lowercase i would need its display form written into the JSON instead.
 */
export const sourceCaps = (item: BulletinItem) => item.source?.toLocaleUpperCase('tr');

/**
 * Stand-in for the ranker, not a ranker.
 *
 * Sports news leads and the app's own local items follow. That is a deliberate
 * reversal: the first cut reserved the lead for a local story on the argument
 * that a Süper Lig headline would otherwise bury the one thing only Avenza can
 * do. The call went the other way — this is a sports bulletin, so the sports
 * news is the reason to open it, and the local items are what you find once you
 * are here.
 *
 * Within each half: freshest first, with your own sports lifted six hours.
 * When a real ranker arrives it replaces this function and nothing else — the
 * screens read `useBulletin()` and know nothing about ordering.
 */
function rank(items: BulletinItem[], sports: string[]): BulletinItem[] {
  const mine = new Set(sports.map((s) => (s === 'running' ? 'run' : s)));
  const score = (i: BulletinItem) => i.hoursAgo - (sportOf(i) && mine.has(sportOf(i)!) ? 6 : 0);
  return [...items].sort((a, b) => {
    const half = (i: BulletinItem) => (i.scope === 'world' ? 0 : 1);
    if (half(a) !== half(b)) return half(a) - half(b);
    return score(a) - score(b);
  });
}

export function useBulletin(): BulletinItem[] {
  const sports = useStore((s) => s.sports);
  return useMemo(() => rank(feed.items, sports), [sports]);
}

export function useBulletinItem(id: string | undefined): BulletinItem | undefined {
  return useMemo(() => feed.items.find((i) => i.id === id), [id]);
}

/**
 * What sits at the foot of a story — exactly one card, chosen by what the story
 * is actually about rather than by a global policy.
 *
 *   names a game     -> that game
 *   about a place    -> that venue
 *   about learning   -> a course, sold as a placement
 *   sports news      -> a sponsor
 *
 * The first two are our own content and carry no label. The last two are
 * sponsored and say so. Two cards was too many; one card that is always the
 * right one is better than picking a winner once for every story in the feed.
 */
export type StorySlot =
  | { kind: 'game'; href: string; title: string; sub: string; icon: string }
  | { kind: 'venue'; href: string; title: string; count: number; priceFrom: number | null }
  | { kind: 'course'; href: string; title: string; sub: string; price: number }
  | { kind: 'ad'; ad: Ad };

export function useStorySlot(item: BulletinItem | undefined): StorySlot | null {
  const all = useAllActivities();
  const levels = useStore((s) => s.levels);
  const sport = item ? sportOf(item) : null;

  return useMemo(() => {
    if (!item) return null;

    // 1. the story names a game
    if (item.activityId) {
      const a = all.find((x) => x.id === item.activityId);
      if (a) {
        return {
          kind: 'game',
          href: `/activity/${a.id}`,
          title: a.title,
          sub: a.feedLine,
          icon: sportFilters.find((f) => f.key === a.sport)?.icon ?? 'calendar-blank',
        };
      }
    }

    // 2. the story is about a place
    if (item.venue) {
      const here = all.filter((a) => venueId(a.venueFull) === item.venue && eligible(a, levels));
      const named = all.find((a) => venueId(a.venueFull) === item.venue);
      // only if there is something to send them to — a venue card reading
      // "0 games here this week" is worse than an ad, because it invites a tap
      // into an empty room
      if (named && here.length) {
        const priced = here.map((a) => a.price ?? 0).filter((p) => p > 0);
        return {
          kind: 'venue',
          href: `/venue/${item.venue}`,
          title: named.venueFull,
          count: here.length,
          priceFrom: priced.length ? Math.min(...priced) : null,
        };
      }
    }

    // 3. a course in this sport, sold as a placement
    const course = sport ? courses.find((c) => c.sport === sport) : undefined;
    if (course) {
      return {
        kind: 'course',
        href: `/course/${course.id}`,
        title: course.shortTitle,
        sub: course.runs,
        price: course.price,
      };
    }

    // 4. everything else — which is all the sports news — carries a sponsor
    const ad = adFor(item);
    return ad ? { kind: 'ad', ad } : null;
  }, [all, levels, item, sport]);
}


const MONTHS = {
  en: ['January', 'February', 'March', 'April', 'May', 'June',
       'July', 'August', 'September', 'October', 'November', 'December'],
  tr: ['Ocak', 'Şubat', 'Mart', 'Nisan', 'Mayıs', 'Haziran',
       'Temmuz', 'Ağustos', 'Eylül', 'Ekim', 'Kasım', 'Aralık'],
} as const;

/** "28 August" / "28 Ağustos" — a plain table, because t() keys for month names
 *  is exactly the shape that shipped "day.Mo" to the profile. */
export function editionLabel(lang: 'en' | 'tr') {
  const [, m, d] = edition.split('-');
  return `${Number(d)} ${MONTHS[lang][Number(m) - 1]}`;
}


/* -------------------------------------------------------------------- ads -- */

export type Ad = {
  id: string;
  /** which sports this sponsor is bought against; empty means any */
  sports: string[];
  icon: string;
  name: string;
  line: Bi;
};

const ads = (adsRaw as unknown as { ads: Ad[] }).ads;

/**
 * The sponsor for a story: one bought against this sport if there is one, else
 * a general slot. Deterministic per story rather than random, so the same story
 * does not show a different advertiser on every open.
 */
export function adFor(item: BulletinItem | undefined): Ad | null {
  if (!item) return null;
  const sport = (item.sport ?? item.category.en).toLowerCase();
  const matched = ads.filter((a) => a.sports.includes(sport));
  const pool = matched.length ? matched : ads.filter((a) => a.sports.length === 0);
  if (!pool.length) return null;
  const seed = [...item.id].reduce((n, c) => n + c.charCodeAt(0), 0);
  return pool[seed % pool.length];
}
