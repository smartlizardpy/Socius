/**
 * The Socius screen, rebuilt as DOM.
 *
 * Each block below is one region of a real screen — Discover's header, its
 * headline, its filter row, its featured card; the activity detail's roster and
 * its pinned action bar. The measurements are the app's, copied across from
 * app/(tabs)/index.tsx and app/activity/[id].tsx.
 *
 * They are separate components rather than two whole screens because the ad
 * moves through them as layers: the film pulls the match card off the screen
 * plane, fans the roster out, lifts the reliability card. That needs the pieces
 * addressable one at a time.
 */

export * from './constants';
export * from './discover';
export * from './roster';
export * from './cards';
export * from './action-bar';
export * from './detail';
