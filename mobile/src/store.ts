import { useSyncExternalStore } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import type { PersonId } from './data/seed';

export type Lang = 'en' | 'tr';

export type Rating = {
  stars: number;
  tags: string[];
  /** how the player's stated level felt */
  levelVerdict: 'below' | 'spot-on' | 'above';
};

/** An activity the user published from the Create tab. */
export type DraftActivity = {
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
  /** the host will hear from players outside the range */
  openToAllLevels: boolean;
  createdAt: number;
};

/** Filters the Search tab applies. Kept in the store so the filter sheet and the
 *  results list cannot drift apart. */
export type Filters = {
  sports: string[];
  /** 'any' | 'today' | 'week' */
  when: string;
  /** only games whose level range contains your level */
  myLevel: boolean;
  /** km */
  distance: number;
  /** free games only */
  freeOnly: boolean;
  /** hosts above 95% reliable — a Pro filter */
  reliableHosts: boolean;
};

export const emptyFilters: Filters = {
  sports: [],
  when: 'any',
  myLevel: false,
  distance: 10,
  freeOnly: false,
  reliableHosts: false,
};

export function countFilters(f: Filters) {
  let n = 0;
  if (f.sports.length) n += 1;
  if (f.when !== 'any') n += 1;
  if (f.myLevel) n += 1;
  if (f.distance < 10) n += 1;
  if (f.freeOnly) n += 1;
  if (f.reliableHosts) n += 1;
  return n;
}

/** A mocked sign-in. No credentials are collected and none are stored — the
 *  provider name and the address it would have returned, nothing else. */
export type Account = { provider: 'google' | 'apple'; email: string };

export type State = {
  lang: Lang;
  setLang: (l: Lang) => void;

  /** null until the user signs in, which onboarding lets them skip */
  account: Account | null;
  signIn: (provider: Account['provider']) => void;
  signOut: () => void;

  /** how far out Discover and Search look, set on the neighbourhood step */
  radiusKm: number;
  setRadiusKm: (km: number) => void;

  /** whether the OS location prompt was primed and accepted */
  locationAllowed: boolean;
  setLocationAllowed: (v: boolean) => void;

  /** the contextual notification ask fires once, after the first join */
  notificationsAsked: boolean;
  notificationsOn: boolean;
  answerNotifications: (on: boolean) => void;

  /** onboarding: the mockup opens with Padel and Tennis chosen */
  sports: string[];
  toggleSport: (key: string) => void;

  /** a level per sport — the onboarding walks every picked sport that has a scale */
  levels: Record<string, string>;
  setLevel: (sport: string, value: string) => void;

  /** activity ids you have joined — persisted, so a reload keeps them */
  joined: string[];
  join: (id: string) => void;
  leave: (id: string) => void;

  /** activity ids you saved for later */
  saved: string[];
  toggleSaved: (id: string) => void;

  /** people you follow */
  following: PersonId[];
  toggleFollow: (id: PersonId) => void;

  ratings: Record<string, Rating>;
  setRating: (personId: PersonId, r: Rating) => void;
  /** past games whose rating queue you have finished */
  ratedGames: string[];
  markGameRated: (gameId: string) => void;

  /** activities you published */
  created: DraftActivity[];
  publish: (a: DraftActivity) => void;

  /** courses you applied to */
  courses: string[];
  applyToCourse: (id: string) => void;

  /** notification ids you have opened */
  seenNotifications: string[];
  markAllNotificationsSeen: () => void;

  /** the neighbourhood chip in the Discover header */
  city: string;
  /**
   * The il the neighbourhood sits in.
   *
   * It travels with the city because the profile used to print
   * `${city}, İstanbul` — fine while the four names were all İstanbul ones, and
   * wrong the moment the device answered "Kumluca", which is in Antalya. Same
   * shape of bug as welding a Turkish case ending onto a hole: something fixed
   * hardcoded onto something that varies.
   */
  region: string;
  setCity: (c: string, region?: string) => void;

  filters: Filters;
  setFilters: (f: Filters) => void;

  /** recent search terms, most recent first, capped at 5 */
  recentSearches: string[];
  addRecentSearch: (q: string) => void;
  clearRecentSearches: () => void;

  /** cleared by the Welcome screen so a demo run always starts fresh */
  resetDemo: () => void;
};

const initialSports = ['padel', 'tennis'];
const initialLevels: Record<string, string> = { padel: '5.0', tennis: '4.0' };

/* ------------------------------------------------------------------ store -- */

type Data = Pick<
  State,
  | 'lang'
  | 'account'
  | 'radiusKm'
  | 'locationAllowed'
  | 'notificationsAsked'
  | 'notificationsOn'
  | 'sports'
  | 'levels'
  | 'joined'
  | 'saved'
  | 'following'
  | 'ratings'
  | 'ratedGames'
  | 'created'
  | 'courses'
  | 'seenNotifications'
  | 'city'
  | 'region'
  | 'filters'
  | 'recentSearches'
>;

const initialData: Data = {
  lang: 'en',
  account: null,
  radiusKm: 5,
  locationAllowed: false,
  notificationsAsked: false,
  notificationsOn: false,
  sports: initialSports,
  levels: initialLevels,
  joined: [],
  saved: [],
  following: [],
  ratings: {},
  ratedGames: [],
  created: [],
  courses: [],
  seenNotifications: [],
  city: 'Kadıköy',
  region: 'İstanbul',
  filters: emptyFilters,
  recentSearches: ['evening games near me', 'padel doubles'],
};

let data: Data = { ...initialData };

const listeners = new Set<() => void>();
const KEY = 'avenza-demo';

/** Everything the demo carries survives a reload — a mockup you can put down. */
function persist() {
  AsyncStorage.setItem(KEY, JSON.stringify(data)).catch(() => {});
}

function set(patch: Partial<Data>) {
  data = { ...data, ...patch };
  rebuild();
  listeners.forEach((l) => l());
  persist();
}

const actions = {
  setLang: (lang: Lang) => set({ lang }),

  // the demo has no auth; this records which button was pressed so the profile
  // can say so and sign-out can undo it
  signIn: (provider: Account['provider']) =>
    set({ account: { provider, email: 'you@example.com' } }),
  signOut: () => set({ account: null }),

  setRadiusKm: (radiusKm: number) => set({ radiusKm }),
  setLocationAllowed: (locationAllowed: boolean) => set({ locationAllowed }),
  answerNotifications: (on: boolean) => set({ notificationsAsked: true, notificationsOn: on }),

  toggleSport: (key: string) =>
    set({
      sports: data.sports.includes(key)
        ? data.sports.filter((k) => k !== key)
        : [...data.sports, key],
    }),

  setLevel: (sport: string, value: string) =>
    set({ levels: { ...data.levels, [sport]: value } }),

  join: (id: string) => {
    if (data.joined.includes(id)) return;
    set({ joined: [...data.joined, id] });
  },

  leave: (id: string) => set({ joined: data.joined.filter((j) => j !== id) }),

  toggleSaved: (id: string) =>
    set({
      saved: data.saved.includes(id)
        ? data.saved.filter((s) => s !== id)
        : [...data.saved, id],
    }),

  toggleFollow: (id: PersonId) =>
    set({
      following: data.following.includes(id)
        ? data.following.filter((f) => f !== id)
        : [...data.following, id],
    }),

  setRating: (personId: PersonId, r: Rating) =>
    set({ ratings: { ...data.ratings, [personId]: r } }),

  markGameRated: (gameId: string) => {
    if (data.ratedGames.includes(gameId)) return;
    set({ ratedGames: [...data.ratedGames, gameId] });
  },

  publish: (a: DraftActivity) => set({ created: [a, ...data.created] }),

  applyToCourse: (id: string) => {
    if (data.courses.includes(id)) return;
    set({ courses: [...data.courses, id] });
  },

  markAllNotificationsSeen: () => set({ seenNotifications: ['*'] }),

  // the four quick-pick names are İstanbul neighbourhoods, so the default is
  // right for every caller that does not know better
  setCity: (city: string, region = 'İstanbul') => set({ city, region }),

  setFilters: (filters: Filters) => set({ filters }),

  addRecentSearch: (q: string) => {
    const term = q.trim();
    if (!term) return;
    const next = [term, ...data.recentSearches.filter((r) => r !== term)].slice(0, 5);
    set({ recentSearches: next });
  },

  clearRecentSearches: () => set({ recentSearches: [] }),

  /** Keeps the language and the city — those are settings, not demo state. */
  resetDemo: () =>
    set({
      ...initialData,
      lang: data.lang,
      city: data.city,
      region: data.region,
      recentSearches: data.recentSearches,
    }),
};

/** The snapshot is rebuilt only when data changes, so selectors stay referentially stable. */
let snapshot: State = { ...data, ...actions };
const rebuild = () => {
  snapshot = { ...data, ...actions };
};

const subscribe = (cb: () => void) => {
  listeners.add(cb);
  return () => {
    listeners.delete(cb);
  };
};

const getSnapshot = () => snapshot;

/**
 * Same call shape as a Zustand store: useStore(s => s.joined).
 * Hand-rolled on useSyncExternalStore because zustand's middleware bundle
 * references import.meta.env, which Metro cannot parse for web.
 */
export function useStore<T>(selector: (s: State) => T): T {
  return useSyncExternalStore(
    subscribe,
    () => selector(getSnapshot()),
    () => selector(getSnapshot()),
  );
}

/** Read outside React (actions, one-off checks). */
export const getState = () => snapshot;

/* ---------------------------------------------------------------- hydrate -- */

AsyncStorage.getItem(KEY)
  .then((raw) => {
    if (!raw) return;
    const saved = JSON.parse(raw) as Partial<Data>;
    // spread key by key so a stored blob written by an older build cannot
    // delete a field this build expects to exist
    data = {
      ...data,
      ...Object.fromEntries(
        Object.entries(saved).filter(([k, v]) => v != null && k in initialData),
      ),
      filters: { ...emptyFilters, ...(saved.filters ?? null) },
    };
    rebuild();
    listeners.forEach((l) => l());
  })
  .catch(() => {});
