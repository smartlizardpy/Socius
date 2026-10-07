import React from 'react';
import { AbsoluteFill, Easing, Img, interpolate, spring, useVideoConfig } from 'remotion';

import { color } from '../theme';
import { outro as outroCopy, ui } from '../copy';
import { SCENES, fromLine } from '../timing';
import { mark } from '../data';
import { face } from '../fonts';
import { UgcSlot, useSceneSeconds } from '../ui/film';
import { Grain } from '../ui/plate';

/**
 * Scene 5 — "Grubun tamamlanmasını bekleme. Maçını bul, sahaya çık."
 *
 * The shot opens under the ink the join scene closed on, which retracts from
 * the same point the filled slot occupied: a circular UI element opening back
 * out onto the pitch, which is the match cut the brief asks to bookend with.
 *
 * The second UGC plate goes in the same replaceable slot as the first. If the
 * closing clip is the non-speaking option, nothing here changes — the voice
 * carries the line either way, and the end card is the film's, not the clip's.
 *
 * No pointer callout here either: the close is the mark and one CTA, and an
 * arrow pointing at a logo explains nothing.
 */

const S = SCENES.outro;
const rel = (atSeconds: number) => atSeconds - S.start;

/* beats, as offsets from the moment the line is spoken --------------------- */
const cueAt = (offset: number) => fromLine('outro', offset);
const IRIS_OUT = cueAt(0.15); //  the ink from the join clears
/** the mark arrives in the pause between "bekleme." and "Maçını bul" */
const CARD_AT = cueAt(2.11);
const CTA_AT = cueAt(2.9);

/** Where the ink disc was when the join scene handed over. */
const CUT_POINT = { x: 812, y: 880 };

export const Outro: React.FC<{ ugcSrc: string | null }> = ({ ugcSrc }) => {
  const { t, frame, fps } = useSceneSeconds();
  const { fps: videoFps } = useVideoConfig();
  const cue = (seconds: number) => frame - Math.round(rel(seconds) * fps);

  const iris = interpolate(t, [0, rel(IRIS_OUT)], [1, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: Easing.out(Easing.cubic),
  });

  const push = interpolate(t, [0, rel(S.end)], [0.18, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: Easing.out(Easing.quad),
  });

  const draw = (fromSec: number, over: number) =>
    interpolate(t, [rel(fromSec), rel(fromSec + over)], [0, 1], {
      extrapolateLeft: 'clamp',
      extrapolateRight: 'clamp',
    });
  const fade = (outSec: number) =>
    interpolate(t, [rel(outSec), rel(outSec + 0.3)], [1, 0], {
      extrapolateLeft: 'clamp',
      extrapolateRight: 'clamp',
    });

  /* the end card ------------------------------------------------------------- */
  const card = spring({
    frame: cue(CARD_AT),
    fps,
    config: { damping: 200 },
    durationInFrames: Math.round(0.75 * videoFps),
  });
  const markIn = spring({
    frame: cue(CARD_AT),
    fps,
    config: { damping: 13, stiffness: 150 },
  });
  const cta = spring({
    frame: cue(CTA_AT),
    fps,
    config: { damping: 200 },
    durationInFrames: Math.round(0.5 * videoFps),
  });

  return (
    <AbsoluteFill style={{ backgroundColor: color.ink }}>
      <UgcSlot src={ugcSrc} shake={0.85} push={push} />
      <Grain />

      {/* the plate falls back so the mark can carry the frame */}
      <AbsoluteFill
        style={{
          background: `linear-gradient(180deg, rgba(7,18,38,${0.35 + card * 0.45}) 0%, rgba(7,18,38,${
            0.15 + card * 0.55
          }) 40%, rgba(7,18,38,${0.6 + card * 0.32}) 100%)`,
        }}
      />


      {/* the mark, and one CTA */}
      <AbsoluteFill
        style={{
          alignItems: 'center',
          justifyContent: 'center',
          opacity: card,
          // the caption owns the bottom third until it clears, so the card sits high
          transform: 'translateY(-150px)',
        }}
      >
        <Img
          src={mark}
          style={{
            width: 168,
            height: 168,
            objectFit: 'contain',
            transform: `scale(${0.82 + markIn * 0.18})`,
          }}
        />
        <div
          style={{
            ...face.display,
            fontSize: 92,
            letterSpacing: '-2.8px',
            color: '#FFFFFF',
            marginTop: 18,
            transform: `translateY(${(1 - card) * 14}px)`,
          }}
        >
          {ui.brand}
        </div>
        <div
          style={{
            ...face.semibold,
            fontSize: 40,
            color: color.orange,
            marginTop: 22,
            opacity: cta,
            transform: `translateY(${(1 - cta) * 12}px)`,
            textShadow: '0 4px 24px rgba(0,8,20,0.5)',
          }}
        >
          {outroCopy.cta}
        </div>
      </AbsoluteFill>

      {/* the join scene's ink, opening back out onto the pitch */}
      {iris > 0.001 ? (
        <AbsoluteFill style={{ pointerEvents: 'none' }}>
          <svg width={1080} height={1920}>
            <defs>
              <mask id="outro-iris">
                <rect width={1080} height={1920} fill="white" />
                <circle cx={CUT_POINT.x} cy={CUT_POINT.y} r={(1 - iris) * 2400} fill="black" />
              </mask>
            </defs>
            <rect width={1080} height={1920} fill={color.ink} mask="url(#outro-iris)" />
          </svg>
        </AbsoluteFill>
      ) : null}
    </AbsoluteFill>
  );
};
