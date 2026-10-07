import { useMemo } from 'react';
import { useStore } from '../store';
import { activities, draftToActivity, type Activity } from './seed';

/**
 * Every activity the app knows about: the seeded ones, plus anything you have
 * published, newest first.
 *
 * The seed's own `byId` cannot see the store, so anything created from the Create
 * tab used to exist only as a row in `store.created` — counted in a footnote and
 * tappable from nowhere. Screens go through here instead, and a published
 * activity behaves like any other: it lists, it opens, it counts.
 */
export function useAllActivities(): Activity[] {
  const created = useStore((s) => s.created);
  return useMemo(() => [...created.map(draftToActivity), ...activities], [created]);
}

export function useActivity(id: string | undefined): Activity | undefined {
  const all = useAllActivities();
  return useMemo(() => all.find((a) => a.id === id), [all, id]);
}

/** The ids you published, for badging a card as yours. */
export function useHostedIds(): string[] {
  const created = useStore((s) => s.created);
  return useMemo(() => created.map((c) => c.id), [created]);
}
