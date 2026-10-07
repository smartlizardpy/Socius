import React from 'react';
import { Composition } from 'remotion';

import { Ad, adDefaults, type AdProps } from './Ad';
import { DURATION, FPS } from './timing';

/**
 * Two cuts of the same ad, 9:16, for TikTok / Reels / Shorts.
 *
 * They share one component, one timeline and one set of middle scenes; the
 * only difference is which pair of scenes opens and closes them. Registering
 * both here rather than branching inside a single composition means the studio
 * can scrub them side by side and either can be rendered by id.
 *
 * `SociusHalisaha` is the one that ships. `SociusHalisahaUgc` is kept wired so
 * the presenter cut is a render away if the footage ever arrives.
 *
 * The duration is not a number typed here — it comes from `timing.ts`, so when
 * a new voiceover moves the last beat, both compositions follow on their own.
 */

const frame = {
  durationInFrames: DURATION,
  fps: FPS,
  width: 1080,
  height: 1920,
} as const;

export const RemotionRoot: React.FC = () => (
  <>
    <Composition
      id="SociusHalisaha"
      component={Ad}
      {...frame}
      defaultProps={adDefaults satisfies AdProps}
    />

    <Composition
      id="SociusHalisahaUgc"
      component={Ad}
      {...frame}
      defaultProps={{ ...adDefaults, ugc: true } satisfies AdProps}
    />
  </>
);
