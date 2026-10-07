import React from 'react';
import { Easing, interpolate, spring, useVideoConfig } from 'remotion';

import { color, gutter, lift as liftShadow } from '../theme';
import { SCENES, fromLine } from '../timing';
import { match, roster, spotsLeft } from '../data';
import {
  ActionBar,
  DetailHead,
  JoinConfirmFull,
  LevelNote,
  OpenSlot,
  RosterHead,
  RosterSlot,
  SCREEN_W,
  VenueCard,
} from '../ui/parts';
import { Row } from '../ui/primitives';
import { PaperBackdrop, Stage, TapRing, toFrame, useSceneSeconds } from '../ui/film';

/**
 * Scene 4 — "Sana uyan maça tek dokunuşla katılıyorsun."
 *
 * The activity screen, in the language the rest of the film speaks: its parts
 * lifted off the page and floated on paper, arriving one after another, rather
 * than a screenshot of the page with a camera moving over it. The date and the
 * headline, the all-levels note, the venue, the roster, and the action bar cut
 * loose from the bottom of the screen — enough of the screen to read as the
 * screen, without pretending to be a photograph of one.
 *
 * Then the press. Four things in the app change at once: the open slot fills,
 * the count goes to nine of ten, the pill drops from two spots to one, and the
 * bar turns into KATILDIN. Then the button's own blue opens out of it and takes
 * the whole frame for the confirmation.
 *
 * Two things are worth saying plainly about this beat:
 *
 *   The match does not fill. Joining takes it from 8/10 to 9/10, because
 *   `spotsLeft` is capacity minus the roster minus you, and a seat is still
 *   open afterwards. The brief sketched the roster completing; the product does
 *   not do that on one join, so neither does the ad.
 *
 *   The real app puts a Confirm-and-pay screen between the tap and the join for
 *   any priced game, and this one is ₺120 — `useJoinFlow` routes to `/pay/:id`
 *   rather than joining outright. The ad shows one tap because the script says
 *   "tek dokunuşla". That is a real difference between the ad and the product,
 *   and it is a call for the brief to make, not for this file to paper over.
 */

const S = SCENES.join;
const rel = (atSeconds: number) => atSeconds - S.start;

/* beats, as offsets from the moment the line is spoken --------------------- */
const cueAt = (offset: number) => fromLine('join', offset);
const BUILD_AT = cueAt(-0.4); //    the parts start landing, top to bottom
const BUILD_STEP = 0.075; //        each one this long after the last
const HOLD_AT = cueAt(0.5); //      the assembled screen is held
const TAP_AT = cueAt(1.15); //      the press, on "tek dokunuşla"
const COMMIT_AT = cueAt(1.4); //    everything on the screen changes at once
const SEE_IT_AT = cueAt(1.4); //    and is held long enough to be seen
const FLOOD_AT = cueAt(1.85); //    the button's blue opens out and takes the frame
const SEAL_AT = cueAt(2.13); //     the check lands
const COPY_AT = cueAt(2.27); //     and the words under it
const MATCH_CUT_AT = cueAt(3.32); // ink takes the frame, handing over to the close

/** Where the focused point sits down the frame. */
const ANCHOR = 0.5;

/**
 * The parts, in the order they land. The stack is laid out at the app's own
 * 390pt width, so every size on it is still the app's.
 */
const PART = { head: 0, level: 1, venue: 2, rosterHead: 3, roster: 4, bar: 8 } as const;

/**
 * Points on the stack, in the stack's own coordinates, measured off a render
 * rather than guessed: the seat that fills, and the centre of the CTA. The
 * camera projects them into the frame, so the tap ring and the closing cut stay
 * on them through any reframing.
 */
const YOU_SLOT = { x: 330, y: 320 };
const CTA = { x: 278, y: 445 };
/** The middle of the assembled stack, which runs 0 to about 480. */
const STACK_MID = 244;

export const Join: React.FC = () => {
  const { t, frame, fps } = useSceneSeconds();
  const { fps: videoFps } = useVideoConfig();
  const cue = (seconds: number) => frame - Math.round(rel(seconds) * fps);

  /* the parts arriving ------------------------------------------------------- */
  const enter = (index: number) =>
    spring({
      frame: cue(BUILD_AT + index * BUILD_STEP),
      fps,
      config: { damping: 200 },
      durationInFrames: Math.round(0.42 * videoFps),
    });
  /** how a part arrives — the one entrance used by every part in the shot */
  const arrival = (e: number): React.CSSProperties => ({
    opacity: e,
    transform: `translateY(${(1 - e) * 22}px) scale(${0.975 + e * 0.025})`,
    transformOrigin: 'top center',
  });

  /* the press ---------------------------------------------------------------- */
  const tap = interpolate(t, [rel(TAP_AT), rel(TAP_AT + 0.6)], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const press = interpolate(t, [rel(TAP_AT), rel(TAP_AT + 0.09), rel(TAP_AT + 0.26)], [0, 1, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  /* the commit — one spring, driving every changed thing on the screen -------- */
  const commit = spring({
    frame: cue(COMMIT_AT),
    fps,
    config: { damping: 15, stiffness: 190 },
  });
  const joined = t >= rel(COMMIT_AT);

  /*
   * The confirmation.
   *
   * The blue does not fade up over the screen — it opens out of the button that
   * was just pressed, from that button's own position in the frame, so the
   * payoff is the thing the viewer touched becoming the whole picture. The
   * seal lands once the blue has arrived, and the words after it.
   */
  const flood = interpolate(t, [rel(FLOOD_AT), rel(FLOOD_AT + 0.42)], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: Easing.inOut(Easing.cubic),
  });
  const seal = spring({
    frame: cue(SEAL_AT),
    fps,
    config: { damping: 12, stiffness: 170 },
  });
  const copy = spring({
    frame: cue(COPY_AT),
    fps,
    config: { damping: 200 },
    durationInFrames: Math.round(0.5 * videoFps),
  });

  /* camera ------------------------------------------------------------------- */
  const ease = {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: Easing.inOut(Easing.cubic),
  } as const;
  /*
   * The stack is 390 wide and about 480 tall — a squarer shape than a 9:16
   * frame, so it can never fill one. 2.77 is the scale at which it fills the
   * width, and past that the app's 20pt gutters start getting cropped. So the
   * wide framing sits just under that with the stack centred, and the paper it
   * cannot fill is split evenly above and below rather than dumped at the
   * bottom, which is what focusing low on the CTA had been doing.
   */
  const keys = [0, rel(HOLD_AT), rel(TAP_AT), rel(SEE_IT_AT + 0.3), rel(FLOOD_AT + 0.5)];
  const focusY = interpolate(t, keys, [150, STACK_MID, 330, 296, 312], ease);
  const scale = interpolate(t, keys, [2.86, 2.72, 2.96, 2.8, 2.9], ease);

  const cam = { scale, focusY, anchorY: ANCHOR };
  const tapAt = toFrame(CTA.x, CTA.y, cam);
  const cutAt = toFrame(YOU_SLOT.x, YOU_SLOT.y, cam);

  /* the match cut out -------------------------------------------------------- */
  const cut = interpolate(t, [rel(MATCH_CUT_AT), rel(S.end)], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: Easing.in(Easing.cubic),
  });

  /** the stack is simply covered by the flood; it does not need to fade too */
  const stackStyle: React.CSSProperties = {};

  return (
    <PaperBackdrop>
      <Stage scale={scale} focusY={focusY} anchorY={ANCHOR}>
        <div
          style={{
            width: SCREEN_W,
            padding: `0 ${gutter}px`,
            boxSizing: 'border-box',
            ...stackStyle,
          }}
        >
          <div style={arrival(enter(PART.head))}>
            <DetailHead spots={spotsLeft(joined)} joined={joined} />
          </div>

          <div style={arrival(enter(PART.level))}>
            <LevelNote />
          </div>

          <div style={{ marginTop: 12, ...arrival(enter(PART.venue)) }}>
            <VenueCard />
          </div>

          <div style={{ marginTop: 20, ...arrival(enter(PART.rosterHead)) }}>
            <RosterHead inCount={match.joined.length + (joined ? 1 : 0)} capacity={match.capacity} />
          </div>

          <Row gap={10} style={{ alignItems: 'flex-start', marginTop: 12 }}>
            {roster.map((p, i) => (
              <div
                key={`${p.id}-${i}`}
                style={{
                  flexGrow: 1,
                  flexBasis: 0,
                  minWidth: 0,
                  ...arrival(enter(PART.roster + i)),
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
                ...arrival(enter(PART.roster + roster.length)),
              }}
            >
              <div style={{ transform: `scale(${1 + Math.max(0, Math.sin(commit * Math.PI)) * 0.08})` }}>
                <OpenSlot fill={commit} />
              </div>
            </div>
          </Row>

          {/* the pinned bar, cut loose and floated with the rest */}
          <div
            style={{
              marginTop: 22,
              ...arrival(enter(PART.bar)),
              boxShadow: enter(PART.bar) > 0.02 ? liftShadow : undefined,
              borderRadius: 24,
            }}
          >
            <ActionBar joined={joined} press={press} floating />
          </div>
        </div>
      </Stage>

      <TapRing x={tapAt.x} y={tapAt.y} progress={tap} />

      {/*
        The button's blue, opening out from where the button is. `flood` is a
        radius, so the circle grows from the tap point rather than the middle of
        the frame — the confirmation arrives from the thing that caused it.
      */}
      {flood > 0.001 ? (
        <svg
          width={1080}
          height={1920}
          style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}
        >
          <circle cx={tapAt.x} cy={tapAt.y} r={flood * 2400} fill={color.blue} />
        </svg>
      ) : null}

      {flood > 0.35 ? <JoinConfirmFull seal={seal} copy={copy} /> : null}

      {/* the filled slot's ink disc, opening out to carry the cut */}
      {cut > 0.001 ? (
        <svg
          width={1080}
          height={1920}
          style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}
        >
          <circle cx={cutAt.x} cy={cutAt.y} r={cut * 2400} fill={color.ink} />
        </svg>
      ) : null}
    </PaperBackdrop>
  );
};
