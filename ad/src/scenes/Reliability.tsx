import React from 'react';
import { AbsoluteFill, Easing, interpolate, spring, useVideoConfig } from 'remotion';

import { color, gutter, lift as liftShadow } from '../theme';
import { ui } from '../copy';
import { SCENES, fromLine } from '../timing';
import { host, match, people, personReliability, roster } from '../data';
import {
  FitCard,
  OpenSlot,
  PlayerLine,
  ReliabilityCard,
  RosterHead,
  RosterSlot,
  SCREEN_W,
} from '../ui/parts';
import { Icon, Row, Txt } from '../ui/primitives';
import { PaperBackdrop, Stage, TapRing, toFrame, useSceneSeconds } from '../ui/film';

/**
 * Scene 3 — "Katılmadan önce kimlerin geleceğini, gerçekten gelip gelmediğini
 * görüyorsun." The trust beat, and the one thing in the ad no other app claims.
 *
 * The shot is close: the roster fans out, a face is tapped, and that player's
 * reliability record comes up. It stays close deliberately — the record is a
 * card of small numbers, and the ad has one shot to make them readable.
 *
 * It is the navigation the app actually supports. The reliability card lives on
 * the player's profile in the product, reachable from a roster slot, and it
 * lives on a profile here. It is not lifted onto the activity screen.
 *
 * The record is Mert's, and every number on it is the app's arithmetic on his
 * single recorded fact: 17 games, one missed, at index 12. That yields %94,
 * "17 maçın 16 tanesine geldi", and a four-game clean run — including the one
 * orange tick. The miss is not hidden, because not hiding it is the point.
 */

const S = SCENES.reliability;
const rel = (atSeconds: number) => atSeconds - S.start;

/* beats, as offsets from the moment the line is spoken --------------------- */
const cueAt = (offset: number) => fromLine('reliability', offset);
const FAN_AT = cueAt(-0.25); //   roster slots land, one after another
/*
 * The fit card, at 10.00, out at 12.00.
 *
 * Between the roster landing and the tap on Mert this shot held one static row
 * of four faces for two and a half seconds, which is where the ad stalled. The
 * concept doc's script had a sentence for exactly that stretch — "saatine ve
 * seviyene uyan maçı seçiyorsun" — that the recorded read dropped, so the hole
 * and the missing line are the same hole. The card puts the line back as
 * picture, and vacates the space a third of a second before the reliability
 * card needs it.
 */
const FIT_AT = cueAt(-0.1); //    10.95 — the card lands, rows in sequence
const FIT_STEP = 0.3; //          the second row after the first
const FIT_TICK = 0.62; //         each row's tick, once its line has been read
const FIT_OUT = cueAt(2.45); //   13.50 — it leaves, clearing on the comma
/**
 * The roster takes the emphasis, on the words that are about it.
 *
 * "kimlerin" lands around 11.55, and until this the four slots had been sitting
 * still since 9.85 while the card beside them did the moving.
 */
const WHO_AT = cueAt(1.45); //    12.50 — a lift across the four, in turn

/*
 * The trust beat, moved a full second later than it used to sit.
 *
 * Line 3 is two sentences with a comma between them, and the read puts a 0.52s
 * pause in it: "Katılmadan önce kimlerin geleceğini," runs 10.77–13.56, and
 * "gerçekten gelip gelmediğini görüyorsun." runs 14.08–19.06. The tap used to
 * fire at 13.25 and the record land at 13.50 — both inside the first half, so
 * the picture was answering "do they actually turn up" while the voice was
 * still asking "who is coming". Everything below now starts on the far side of
 * that pause, and the roster owns the half of the line that is about the
 * roster.
 */
const TAP_AT = cueAt(3.1); //     14.15 — Mert's face, on "gerçekten"
const CARD_AT = cueAt(3.35); //   his profile's reliability card arrives
const COUNT_FROM = cueAt(3.55); // the percentage counts up
const COUNT_TO = cueAt(4.68);
const MISS_AT = cueAt(5.42); //   the strip reaches the game he missed
const OTHERS_AT = cueAt(6.12); // and the rest of the roster, from the players list
const OUT_AT = cueAt(7.71); //    the shot lifts away, handing over to the join

/** The roster's own stagger, matching the app's list entrance. */
const STAGGER = 0.075;

/** Where the focused point of the screen sits down the frame. */
const ANCHOR = 0.46;

/** Mert's seat, in this shot's own coordinates — first of four across 350pt. */
const MERT_SLOT = { x: 60, y: 52 };

export const Reliability: React.FC = () => {
  const { t, frame, fps } = useSceneSeconds();
  const { fps: videoFps } = useVideoConfig();
  const cue = (seconds: number) => frame - Math.round(rel(seconds) * fps);

  /* the roster fanning out --------------------------------------------------- */
  const fan = (i: number) =>
    spring({ frame: cue(FAN_AT + i * STAGGER), fps, config: { damping: 16, stiffness: 170 } });

  /* why it fits: the time, and the level ------------------------------------- */
  const fitIn = (i: number) =>
    spring({
      frame: cue(FIT_AT + i * FIT_STEP),
      fps,
      config: { damping: 200 },
      durationInFrames: Math.round(0.42 * videoFps),
    });
  const fitTick = (i: number) =>
    spring({
      frame: cue(FIT_AT + i * FIT_STEP + FIT_TICK),
      fps,
      config: { damping: 12, stiffness: 180 },
    });
  const fitCard = spring({
    frame: cue(FIT_AT),
    fps,
    config: { damping: 200 },
    durationInFrames: Math.round(0.42 * videoFps),
  });
  const fitOut = spring({
    frame: cue(FIT_OUT),
    fps,
    config: { damping: 200 },
    durationInFrames: Math.round(0.36 * videoFps),
  });

  /*
   * The roster's own beat.
   *
   * One small lift per slot, left to right, on "kimlerin geleceğini". It is the
   * app's PressScale idiom read backwards — the same hop the filter chip takes
   * in Discover — rather than a new gesture, and it is deliberately small: the
   * faces are the answer to that half of the line and they only need to be
   * pointed at, not animated.
   */
  const who = (i: number) => {
    const w = spring({
      frame: cue(WHO_AT + i * 0.085),
      fps,
      config: { damping: 200 },
      durationInFrames: Math.round(0.5 * videoFps),
    });
    return Math.max(0, Math.sin(w * Math.PI));
  };

  /* the tap on Mert ---------------------------------------------------------- */
  const tap = interpolate(t, [rel(TAP_AT), rel(TAP_AT + 0.55)], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const tapPress = Math.max(0, Math.sin(tap * Math.PI)) * (tap < 0.5 ? 1 : 0.35);

  /* his reliability card ----------------------------------------------------- */
  const card = spring({
    frame: cue(CARD_AT),
    fps,
    config: { damping: 200 },
    durationInFrames: Math.round(0.7 * videoFps),
  });

  /* the strip drawing, and the percentage counting to it ---------------------- */
  const reveal = interpolate(t, [rel(COUNT_FROM), rel(MISS_AT + 0.35)], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: Easing.inOut(Easing.quad),
  });
  const count = interpolate(t, [rel(COUNT_FROM), rel(COUNT_TO)], [0, personReliability(host)], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: Easing.out(Easing.cubic),
  });

  /* the other players, from the players list --------------------------------- */
  const others = [people.deniz, people.selin, people.ayca];
  const other = (i: number) =>
    spring({
      frame: cue(OTHERS_AT + i * 0.11),
      fps,
      config: { damping: 200 },
      durationInFrames: Math.round(0.5 * videoFps),
    });

  /* camera ------------------------------------------------------------------- */
  const keys = [0, rel(TAP_AT), rel(CARD_AT + 0.6), rel(OTHERS_AT), rel(S.end)];
  const ease = {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: Easing.inOut(Easing.quad),
  } as const;
  /*
   * Opened out from 2.90 to 2.72 so the fit card is in the same frame as the
   * roster it belongs to. Still one direction the whole way — widening, panning
   * down — because a shot that goes out, back in, and out again to accommodate
   * one element reads as the camera being unsure rather than as a move.
   */
  const focusY = interpolate(t, keys, [138, 132, 196, 268, 286], ease);
  const scale = interpolate(t, keys, [2.72, 2.68, 2.6, 2.42, 2.36], ease);

  const tapAt = toFrame(MERT_SLOT.x, MERT_SLOT.y, { scale, focusY, anchorY: ANCHOR });

  /*
   * The hand-over.
   *
   * The next scene opens on the whole activity page, which is a wider frame
   * than this one ends on, so the cut needs a direction rather than a dissolve.
   * This shot lifts up and away; the page there rises into the space it leaves.
   * One continuous upward move across the cut, which reads as carrying on
   * through the screen rather than as arriving somewhere new.
   */
  const out = interpolate(t, [rel(OUT_AT), rel(S.end)], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: Easing.in(Easing.cubic),
  });

  return (
    <PaperBackdrop>
      {/*
        It lifts away but does not fade out. Taking it to zero opacity meant the
        last frame of this shot was empty paper, so the cut landed on nothing and
        read as a flicker. Leaving it part-way there makes the cut content to
        content, which is what a cut should be.
      */}
      <div style={{ opacity: 1 - out * 0.55, transform: `translateY(${-out * 250}px)` }}>
        <Stage scale={scale} focusY={focusY} anchorY={ANCHOR}>
          <div style={{ width: SCREEN_W, padding: `0 ${gutter}px`, boxSizing: 'border-box' }}>
            <RosterHead inCount={match.joined.length} capacity={match.capacity} />

            {/* the activity's roster — three players in, then the open slot */}
            <Row gap={10} style={{ alignItems: 'flex-start', marginTop: 12 }}>
              {roster.map((p, i) => (
                <div
                  key={`${p.id}-${i}`}
                  style={{
                    flexGrow: 1,
                    flexBasis: 0,
                    minWidth: 0,
                    opacity: fan(i),
                    transform: `translateY(${(1 - fan(i)) * 14 - who(i) * 7}px) scale(${
                      (0.9 + fan(i) * 0.1) *
                      (1 + who(i) * 0.035) *
                      (p.id === host.id ? 1 - tapPress * 0.06 : 1)
                    })`,
                  }}
                >
                  <RosterSlot person={p} isHost={p.id === match.hostId} />
                </div>
              ))}
              <div
                style={{
                  flexGrow: 1,
                  flexBasis: 0,
                  minWidth: 0,
                  opacity: fan(3),
                  transform: `translateY(${(1 - fan(3)) * 14 - who(3) * 7}px) scale(${
                    1 + who(3) * 0.035
                  })`,
                }}
              >
                {/* still open — this is the state before the join */}
                <OpenSlot fill={0} />
              </div>
            </Row>

            {/*
              Why it fits, in the gap the dropped script line left.

              Hung off the roster with no height of its own, so it occupies
              exactly the space the reliability card arrives into and the stack
              never reflows when it goes. The two never share the frame: this
              one is gone by 13.86 and that one does not start until 14.40.
            */}
            <div style={{ position: 'relative', height: 0 }}>
              <div
                style={{
                  position: 'absolute',
                  top: 18,
                  left: 0,
                  right: 0,
                  opacity: (1 - fitOut) * fitCard,
                  transform: `translateY(${(1 - fitCard) * 18 - fitOut * 26}px) scale(${
                    (0.97 + fitCard * 0.03) * (1 - fitOut * 0.04)
                  })`,
                  transformOrigin: 'top center',
                  boxShadow: fitCard > 0.02 ? liftShadow : undefined,
                  borderRadius: 20,
                }}
              >
                <FitCard rows={fitIn} ticks={fitTick} />
              </div>
            </div>

            {/* his profile's reliability card */}
            <div
              style={{
                marginTop: 18,
                opacity: card,
                transform: `translateY(${(1 - card) * 26}px) scale(${0.96 + card * 0.04})`,
              }}
            >
              <Row gap={8} style={{ marginBottom: 10, opacity: card }}>
                <Icon name="seal-check" size={15} color={color.blue} />
                <Txt f="semibold" size={12.5} c={color.inkMuted}>
                  {ui.hosts(host.first)}
                </Txt>
              </Row>
              <ReliabilityCard
                person={host}
                reveal={reveal}
                count={count}
                style={card > 0.02 ? { boxShadow: liftShadow } : undefined}
              />
            </div>

            {/* and the rest of them, as the players list states it */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginTop: 14 }}>
              {others.map((p, i) => (
                <PlayerLine key={p.id} person={p} opacity={other(i)} y={(1 - other(i)) * 16} />
              ))}
            </div>
          </div>
        </Stage>
      </div>

      {/* the tap that opened the profile */}
      <TapRing x={tapAt.x} y={tapAt.y} progress={tap} />
    </PaperBackdrop>
  );
};
