import React from 'react';
import { AbsoluteFill, Easing, Img, interpolate, spring } from 'remotion';

import { color } from '../theme';
import { outro as outroCopy, ui } from '../copy';
import { mark, match, people } from '../data';
import { face } from '../fonts';
import { SCENES, fromLine } from '../timing';
import { PaperBackdrop, useSceneSeconds } from '../ui/film';
import { StatePill, Txt } from '../ui/primitives';
import { AvatarFan, BigLine, SeatRow } from '../ui/story';

/**
 * Scene 5 — "Grubun tamamlanmasını bekleme. Maçını bul, sahaya çık."
 *
 * The shot opens under the ink the join scene closed on, retracting from the
 * point the filled seat occupied. Then it answers the hook, in the hook's own
 * terms.
 *
 * The two empty seats come back — the same row, unchanged, so it is recognised
 * in half a second. And then they are **left behind** rather than filled: the
 * row goes up and out while the roster of the match you actually joined opens
 * out of the middle underneath it. That is the line, literally. "Grubun
 * tamamlanmasını bekleme" is *don't wait for your group to fill*, so a close
 * that resolves by filling the group contradicts the words being spoken over
 * it. This one resolves by walking away from it.
 *
 * The count under the faces is the app's own arithmetic and the app's own
 * string: nine of ten, because joining took the match from 8/10 to 9/10 and it
 * does not fill. The picture reads as a crowd; the number stays true.
 *
 * Then the two display lines, set exactly as the hook's two were — ink over
 * orange — so the ends of the film rhyme without repeating a word. Then the
 * mark.
 *
 * Beat placement is measured off the read, not guessed: line 5 breaks into
 * "Grubun tamamlanmasını bekleme." 23.90–25.64, "Maçını bul," 25.82–26.69,
 * "sahaya çık." 26.77–27.42, and a last brand tag 27.61–28.46, which is where
 * the lockup lands. The mark then holds in silence for the 1.54s that remain —
 * the one stretch of this cut that exists only to let something land.
 */

const S = SCENES.outro;
const rel = (atSeconds: number) => atSeconds - S.start;

/* beats, as offsets from the moment the line is spoken --------------------- */
const cueAt = (offset: number) => fromLine('outro', offset);
const IRIS_OUT = cueAt(0.07); //   the ink from the join clears
const SEATS_AT = cueAt(0.05); //   the hook's row, unchanged
const SWAP_AT = cueAt(0.62); //    it leaves; the real match opens out
const COUNT_AT = cueAt(1.24); //   nine of ten, and KATILDIN
const LIFT_AT = cueAt(1.8); //     the faces make room
const LINE_A_AT = cueAt(1.9); //   "Maçını bul,"       — spoken 25.82
const LINE_B_AT = cueAt(2.85); //  "sahaya çık."       — spoken 26.76
const LOCK_AT = cueAt(3.6); //     the brand tag       — spoken 27.60

/**
 * Where the join scene's ink disc was when it handed over.
 *
 * Derived, not guessed: `toFrame(YOU_SLOT)` under that scene's closing camera
 * (scale 2.9, focusY 312, anchorY 0.5) — the seat that had just filled.
 */
const CUT_POINT = { x: 932, y: 983 };

/* frame-space layout ------------------------------------------------------- */
const SEAT_Y = 1000;
const GROUP_Y = 940;
const HERO_Y = 1010;
const LOCK_Y = 930;

/** The roster of the match you joined, and you on the end of it. */
const FACES = match.joined.map((id) => people[id].face);
const IN_COUNT = match.joined.length + 1;

export const OutroBrand: React.FC = () => {
  const { t, frame, fps } = useSceneSeconds();
  const cue = (seconds: number) => frame - Math.round(rel(seconds) * fps);

  /* the join's ink, clearing ------------------------------------------------- */
  const iris = interpolate(t, [0, rel(IRIS_OUT)], [1, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: Easing.out(Easing.cubic),
  });

  /* the hook's row, and its exit --------------------------------------------- */
  const seats = spring({
    frame: cue(SEATS_AT),
    fps,
    config: { damping: 200 },
    durationInFrames: Math.round(0.4 * fps),
  });
  const leave = spring({
    frame: cue(SWAP_AT),
    fps,
    config: { damping: 200 },
    durationInFrames: Math.round(0.42 * fps),
  });

  /* the match, opening out of the middle -------------------------------------- */
  const mid = (IN_COUNT - 1) / 2;
  const open = (i: number) =>
    spring({
      frame: cue(SWAP_AT + 0.1 + Math.abs(i - mid) * 0.045),
      fps,
      config: { damping: 16, stiffness: 180 },
      durationInFrames: Math.round(0.7 * fps),
    });

  const count = spring({
    frame: cue(COUNT_AT),
    fps,
    config: { damping: 200 },
    durationInFrames: Math.round(0.45 * fps),
  });

  /* the faces making room ----------------------------------------------------- */
  const lift = spring({
    frame: cue(LIFT_AT),
    fps,
    config: { damping: 200 },
    durationInFrames: Math.round(0.75 * fps),
  });

  /* the answer ---------------------------------------------------------------- */
  const lineA = spring({ frame: cue(LINE_A_AT), fps, config: { damping: 15, stiffness: 170 } });
  const lineB = spring({ frame: cue(LINE_B_AT), fps, config: { damping: 15, stiffness: 170 } });

  /* the mark ------------------------------------------------------------------ */
  /*
   * The type leaves before the mark arrives, rather than dissolving through it.
   *
   * Driving both off `lock` put them both at half opacity for four frames and
   * printed the wordmark straight through "MAÇINI BUL." — the same mush the
   * Discover card swap was fixed for, and the same fix: a short leave that
   * starts first and finishes before the arrival has really begun.
   */
  const clear = spring({
    frame: cue(LOCK_AT - 0.2),
    fps,
    config: { damping: 200 },
    durationInFrames: Math.round(0.3 * fps),
  });
  const lock = spring({
    frame: cue(LOCK_AT),
    fps,
    config: { damping: 200 },
    durationInFrames: Math.round(0.6 * fps),
  });
  const markIn = spring({ frame: cue(LOCK_AT), fps, config: { damping: 13, stiffness: 150 } });
  const cta = spring({
    frame: cue(LOCK_AT + 0.26),
    fps,
    config: { damping: 200 },
    durationInFrames: Math.round(0.45 * fps),
  });

  /** everything the close has said so far clears for the mark */
  const clearing: React.CSSProperties = {
    opacity: 1 - clear,
    transform: `scale(${1 - clear * 0.1}) translateY(${-clear * 40}px)`,
  };

  /* a whole-scene settle, so the close is not static -------------------------- */
  const settle = interpolate(t, [0, rel(S.end)], [1.03, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: Easing.out(Easing.quad),
  });

  return (
    <PaperBackdrop>
      <AbsoluteFill style={{ transform: `scale(${settle})`, transformOrigin: '50% 50%' }}>
        {/* the hook's two empty seats, recognised and then left behind */}
        {leave < 0.995 ? (
          <div
            style={{
              position: 'absolute',
              left: 0,
              right: 0,
              top: SEAT_Y,
              opacity: seats * (1 - leave),
              filter: leave > 0.01 ? `blur(${leave * 10}px)` : undefined,
              transform: `translateY(${-50 - leave * 26}%) scale(${1 - leave * 0.14})`,
            }}
          >
            <SeatRow total={match.capacity} filled={match.joined.length} d={76} gap={15} />
          </div>
        ) : null}

        {/* the match you joined instead */}
        <div
          style={{
            position: 'absolute',
            left: 0,
            right: 0,
            top: GROUP_Y,
            ...clearing,
          }}
        >
          <div
            style={{
              transform: `translateY(-50%) translateY(${-lift * 320}px) scale(${1 - lift * 0.44})`,
              transformOrigin: '50% 50%',
            }}
          >
            <AvatarFan faces={FACES} d={124} step={86} open={open} />

            <div
              style={{
                marginTop: 34,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: 18,
                opacity: count,
                transform: `translateY(${(1 - count) * 18}px)`,
              }}
            >
              <StatePill label={ui.youreIn} height={70} size={31} />
              <Txt f="bold" size={42} c={color.inkMuted}>
                {ui.ofIn(IN_COUNT, match.capacity)}
              </Txt>
            </div>
          </div>
        </div>

        {/* the answer, set as the hook's problem was */}
        <div
          style={{
            position: 'absolute',
            left: 0,
            right: 0,
            top: HERO_Y,
            textAlign: 'center',
            ...clearing,
          }}
        >
          <div style={{ transform: 'translateY(-50%)' }}>
            <BigLine size={158} enter={lineA}>
              {outroCopy.hero.top}
            </BigLine>
            <BigLine size={158} c={color.orange} enter={lineB}>
              {outroCopy.hero.bottom}
            </BigLine>
          </div>
        </div>

        {/* the mark, and one CTA */}
        <div
          style={{
            position: 'absolute',
            left: 0,
            right: 0,
            top: LOCK_Y,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            opacity: lock,
            transform: 'translateY(-50%)',
          }}
        >
          <Img
            src={mark}
            style={{
              width: 196,
              height: 196,
              objectFit: 'contain',
              transform: `scale(${0.8 + markIn * 0.2})`,
            }}
          />
          <div
            style={{
              ...face.display,
              fontSize: 118,
              letterSpacing: '-4px',
              color: color.ink,
              marginTop: 22,
              transform: `translateY(${(1 - lock) * 16}px)`,
            }}
          >
            {ui.brand}
          </div>
          <Txt
            f="semibold"
            size={46}
            c={color.orange}
            style={{
              marginTop: 26,
              opacity: cta,
              transform: `translateY(${(1 - cta) * 14}px)`,
            }}
          >
            {outroCopy.cta}
          </Txt>
        </div>
      </AbsoluteFill>

      {/* the join scene's ink, opening back out */}
      {iris > 0.001 ? (
        <AbsoluteFill style={{ pointerEvents: 'none' }}>
          <svg width={1080} height={1920}>
            <defs>
              <mask id="outro-brand-iris">
                <rect width={1080} height={1920} fill="white" />
                <circle cx={CUT_POINT.x} cy={CUT_POINT.y} r={(1 - iris) * 2400} fill="black" />
              </mask>
            </defs>
            <rect width={1080} height={1920} fill={color.ink} mask="url(#outro-brand-iris)" />
          </svg>
        </AbsoluteFill>
      ) : null}
    </PaperBackdrop>
  );
};
