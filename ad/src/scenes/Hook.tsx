import React from 'react';
import { AbsoluteFill, Easing, interpolate } from 'remotion';

import { color } from '../theme';
import { SCENES, fromLine } from '../timing';
import { CircleWipe, UgcSlot, useSceneSeconds } from '../ui/film';
import { Grain } from '../ui/plate';

/**
 * Scene 1 — the UGC hook.
 *
 * "Halı saha yapmak istiyorsun… ama yine iki kişi eksik, değil mi?"
 *
 * The shot is the presenter plate and nothing else — no product, and no
 * annotation. The pointer callouts belong to the product section, where there
 * is an interface to point at; over a person talking to camera they would only
 * compete with her. The film adds one thing here: the ink iris that carries the
 * cut into the app.
 *
 * All beats are absolute seconds, converted to this scene's clock by `rel()`.
 * Retiming the ad never means editing this file.
 */

const S = SCENES.hook;
/** absolute second → this scene's second */
const rel = (atSeconds: number) => atSeconds - S.start;

/* beats, as offsets from the moment the line is spoken --------------------- */
/** the ink that hands over to Discover — just after the last word */
const IRIS_FROM = fromLine('hook', 4.01);

export const Hook: React.FC<{ ugcSrc: string | null }> = ({ ugcSrc }) => {
  const { t } = useSceneSeconds();

  // the plate pushes in very slightly across the shot, so the cut has momentum
  const push = interpolate(t, [0, S.end - S.start], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: Easing.in(Easing.quad),
  });

  const iris = interpolate(t, [rel(IRIS_FROM), rel(S.end)], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: Easing.in(Easing.cubic),
  });

  return (
    <AbsoluteFill style={{ backgroundColor: color.ink }}>
      <UgcSlot src={ugcSrc} shake={1} push={push} />
      <Grain />


      {/* the dark shape that fills the frame, in place of a flash or a swipe */}
      <CircleWipe progress={iris} fill={color.ink} cy={1060} />
    </AbsoluteFill>
  );
};
