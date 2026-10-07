import { Activity, SportKey } from './activities';
import { you } from './people';

/* ------------------------------------------------------- why it matches ---- */

/**
 * The reason pill over the feed photo. It used to be a fixed string on the
 * activity, so it claimed "Matches your padel level" even when your level sat
 * outside the range the game asks for. It is computed now, and says nothing at
 * all rather than something untrue.
 */
export function matchReasonFor(a: Activity, myLevel: number): string | null {
  if (a.levelMin == null || a.levelMax == null) return null;
  if (myLevel < a.levelMin || myLevel > a.levelMax) return null;
  return a.sport;
}

/** Whether your level sits inside what a game asks for. */
export function inBand(a: Activity, myLevel: number) {
  if (a.levelMin == null || a.levelMax == null) return true;
  return myLevel >= a.levelMin && myLevel <= a.levelMax;
}

/**
 * Your level in the sport a game is actually played in.
 *
 * Everything used to compare against your padel level, so a tennis game was
 * judged by how well you play padel. The activity's key and the onboarding's key
 * differ for running, which is the only mapping needed.
 */
export function levelForSport(levels: Record<string, string>, sport: SportKey | string) {
  const key = sport === 'run' ? 'running' : sport;
  const raw = levels[key];
  return raw != null ? Number(raw) : you.padelLevel;
}

/**
 * Whether a game belongs in your feed at all.
 *
 * A game you cannot get into is noise, so the lists hide it — unless the host
 * has opted to hear from players outside the range, which is the only thing that
 * makes "ask to join anyway" a real offer rather than a dead end.
 */
export function eligible(a: Activity, levels: Record<string, string>) {
  return inBand(a, levelForSport(levels, a.sport)) || a.openToAllLevels;
}
