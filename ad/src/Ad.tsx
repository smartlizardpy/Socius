import React from 'react';
import { AbsoluteFill, Sequence, staticFile } from 'remotion';
import { Audio } from '@remotion/media';

import { color } from './theme';
import { SCENES, sceneFrames, sceneFrom, sec } from './timing';
import { Hook } from './scenes/Hook';
import { HookChat } from './scenes/HookChat';
import { Nearby } from './scenes/Nearby';
import { Reliability } from './scenes/Reliability';
import { Join } from './scenes/Join';
import { Outro } from './scenes/Outro';
import { OutroBrand } from './scenes/OutroBrand';

/**
 * The ad.
 *
 * There are two cuts of it, and they share everything but their first and last
 * scene. The middle three — Discover, the trust beat, the join — are the same
 * component instances in both, at the same frames, and neither cut is allowed
 * to reach into them.
 *
 *   `ugc: false`  the delivered cut. A group chat opens it and a motion-design
 *                 payoff closes it. Depends on no footage at all.
 *   `ugc: true`   the original cut, for when presenter footage exists. Its two
 *                 scenes are unchanged and still take `ugcIntro` / `ugcOutro`.
 *
 * The handover between the two ends and the middle is a contract about one
 * point in the frame, not about which scene is mounted: the opening scene
 * closes an ink disc at (540, 1060), which is exactly where `Nearby` opens one
 * back out, and the closing scene opens one at (932, 983), which is where
 * `Join` closed one. Both cuts honour it, so the cut points are identical.
 *
 * Three things are deliberately absent and deliberately replaceable:
 *
 *   `voiceover`  — the single ElevenLabs read. Wired. The line windows in
 *                  `timing.ts` are measured off this file, and every beat in
 *                  every scene hangs off those windows.
 *   `ugcIntro`   — the Higgsfield opening plate. Still null.
 *   `ugcOutro`   — the closing plate. Still null.
 *
 * Each is a prop, so swapping in real media is a `defaultProps` change here (or
 * `--props` at render time) and nothing else. No scene reaches for a file
 * directly, and none of them fails when a file is not there.
 *
 * Scenes are cut, not dissolved. The joins between them are carried by two ink
 * irises and a match cut, all of which are drawn inside the scenes on either
 * side — so a scene can be retimed without a transition component's duration
 * needing to agree with it.
 */

export type AdProps = {
  /** which cut: the UGC one, or the motion-design one that needs no footage */
  ugc: boolean;
  /** the finished narration, as one file in public/. Null until it exists. */
  voiceover: string | null;
  /** the opening UGC clip. Null falls back to the drawn pitch plate. */
  ugcIntro: string | null;
  /** the closing UGC clip. Same fallback. */
  ugcOutro: string | null;
  /** seconds to skip into each UGC clip, for framing the take */
  ugcIntroTrim: number;
  ugcOutroTrim: number;
  /** music bed, added at the sound-design pass */
  music: string | null;
  musicVolume: number;
};

export const Ad: React.FC<AdProps> = ({
  ugc,
  voiceover,
  ugcIntro,
  ugcOutro,
  music,
  musicVolume,
}) => (
  <AbsoluteFill style={{ backgroundColor: color.paper }}>
    <Sequence
      from={sceneFrom('hook')}
      durationInFrames={sceneFrames('hook')}
      premountFor={sec(1)}
      name={ugc ? '1 · Hook (UGC)' : '1 · Grup sohbeti'}
    >
      {ugc ? <Hook ugcSrc={ugcIntro} /> : <HookChat />}
    </Sequence>

    <Sequence
      from={sceneFrom('nearby')}
      durationInFrames={sceneFrames('nearby')}
      premountFor={sec(1)}
      name="2 · Yakınındaki maçlar"
    >
      <Nearby />
    </Sequence>

    <Sequence
      from={sceneFrom('reliability')}
      durationInFrames={sceneFrames('reliability')}
      premountFor={sec(1)}
      name="3 · Kim geliyor?"
    >
      <Reliability />
    </Sequence>

    <Sequence
      from={sceneFrom('join')}
      durationInFrames={sceneFrames('join')}
      premountFor={sec(1)}
      name="4 · Tek dokunuş"
    >
      <Join />
    </Sequence>

    <Sequence
      from={sceneFrom('outro')}
      durationInFrames={sceneFrames('outro')}
      premountFor={sec(1)}
      name={ugc ? '5 · Kapanış (UGC)' : '5 · Kapanış'}
    >
      {ugc ? <Outro ugcSrc={ugcOutro} /> : <OutroBrand />}
    </Sequence>

    {/*
      One narration file across the whole ad, as the brief asks — not one per
      scene. It starts at frame 0 so the recording's own leading silence is what
      lines the first word up with TIMING.introStart.
    */}
    {voiceover === null ? null : (
      <Sequence from={0} name="Voiceover" premountFor={sec(1)}>
        <Audio src={voiceover} />
      </Sequence>
    )}

    {music === null ? null : (
      <Sequence from={0} name="Music" premountFor={sec(1)}>
        <Audio src={music} volume={musicVolume} />
      </Sequence>
    )}
  </AbsoluteFill>
);

/**
 * The defaults every entry point starts from.
 *
 * Kept beside the component rather than in Root.tsx so the render script and
 * the studio cannot disagree about what "no voiceover yet" means.
 *
 * To wire real media: drop the file in `public/` and put its `staticFile()`
 * path here, e.g. `ugcIntro: staticFile('ugc/intro.mp4')`.
 */
export const adDefaults: AdProps = {
  // the cut that ships. Nothing in it waits on footage that does not exist.
  ugc: false,
  // the delivered ElevenLabs read. `timing.ts` is measured off this exact file,
  // so replacing it means re-measuring the five line windows there.
  voiceover: staticFile('audio/voiceover.mp3'),
  ugcIntro: null,
  ugcOutro: null,
  ugcIntroTrim: 0,
  ugcOutroTrim: 0,
  music: null,
  musicVolume: 0.18,
};

/** Kept referenced so the import documents the shape a wired-up prop takes. */
export const examplePaths = {
  voiceover: () => staticFile('audio/voiceover.mp3'),
  ugcIntro: () => staticFile('ugc/intro.mp4'),
  ugcOutro: () => staticFile('ugc/outro.mp4'),
  music: () => staticFile('audio/music.mp3'),
};
