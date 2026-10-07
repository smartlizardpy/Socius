import React from 'react';
import { AbsoluteFill, Easing, interpolate, spring, useVideoConfig } from 'remotion';

import { color, gutter, lift as liftShadow } from '../theme';
import { ui } from '../copy';
import { SCENES, fromLine } from '../timing';
import {
  host,
  match,
  padelMatch,
  padelSpots,
  people,
  personReliability,
  secondMatch,
  secondMatchSpots,
  spotsLeft,
  starsOf,
  yourLevel,
} from '../data';
import {
  DiscoverHeader,
  DiscoverHeadline,
  FilterRow,
  MatchCard,
  MatchRow,
  SCREEN_W,
  type FeaturedActivity,
} from '../ui/parts';
import { SectionHead } from '../ui/primitives';
import { PaperBackdrop, Stage, useSceneSeconds } from '../ui/film';

/**
 * Scene 2 — "Socius'ta yakınındaki halı saha maçlarını buluyorsun."
 *
 * Discover, as the app draws it, in three movements:
 *
 *   A. the screen arrives whole, so the viewer sees what they are looking at
 *      before anything moves;
 *   B. the football filter selects, and the featured card swaps padel for halı
 *      saha — real content for real content, which is the only reason the beat
 *      is in the ad;
 *   C. the camera travels into the card and stops, and the card lifts off the
 *      screen plane while the rest of the screen recedes behind it.
 *
 * The camera holds at the head and the tail of each movement and only travels
 * between them. Continuous drift is what makes product film restless; the eye
 * needs somewhere to stand while it reads a card.
 */

const S = SCENES.nearby;
const rel = (atSeconds: number) => atSeconds - S.start;

/* beats, as offsets from the moment the line is spoken --------------------- */
const cueAt = (offset: number) => fromLine('nearby', offset);
const IRIS_OUT = cueAt(0.25); //    the ink from the hook clears
const HOLD_WIDE = cueAt(0.55); //   the screen is read whole before anything moves
const CHIP_AT = cueAt(0.97); //     "Futbol" fills, under the words "halı saha"
const SWAP_AT = cueAt(1.27); //     and the featured card swaps under it
const PUSH_AT = cueAt(1.9); //      the camera travels down to the card
const ARRIVE_AT = cueAt(2.86); //   and stops on it
const LIFT_AT = cueAt(3.31); //     the card comes off the plane
/*
 * Where the shot starts opening back out.
 *
 * Line 2 ends at 9.80 and line 3 does not start until 11.05 — a second and a
 * quarter, the widest pause in the ad — and the picture used to be locked on a
 * card that had finished moving for most of it. The answer to that gap is the
 * fit card in the next scene, which lands at 10.95;
 * what this key does is stop the shot being still on the way there, and hand
 * over on a widening frame rather than a frozen one — the roster it cuts to is
 * a wider composition than this card.
 */
const LEVEL_AT = cueAt(3.76); //   the shot begins easing back off the card


/** The app's own list stagger: 45ms per item, capped at the first 6. */
const STAGGER = 0.045;

/** Where the focused point of the screen sits down the frame. */
const ANCHOR = 0.5;

/**
 * What Discover features before and after the filter moves.
 *
 * Under "Tüm sporlar" the featured card is the first activity in the seed — the
 * padel game — and under "Futbol" it is the halı saha one. The padel card
 * carries a level band, so it draws the rail and the "seviyene uygun" pill; the
 * halı saha one is open to all levels, so it draws neither. Both are the app's.
 */
const FEATURED_ALL: FeaturedActivity = {
  title: ui.padel.title,
  whenLine: ui.padel.whenLine,
  venue: ui.padel.venue,
  price: ui.padel.price,
  card: padelMatch.card,
  spots: padelSpots,
  hostFaces: padelMatch.joined.map((id) => people[id].face),
  hostFirst: people[padelMatch.hostId].first,
  hostReliability: personReliability(people[padelMatch.hostId]),
  band: {
    lo: starsOf(padelMatch.levelMin),
    hi: starsOf(padelMatch.levelMax),
    min: padelMatch.levelMin,
    max: padelMatch.levelMax,
    you: yourLevel,
  },
  matchPill: ui.padel.matchPill,
};

const FEATURED_FOOTBALL: FeaturedActivity = {
  title: ui.title,
  whenLine: ui.whenLine,
  venue: ui.venue,
  price: ui.price,
  card: match.card,
  spots: spotsLeft(false),
  hostFaces: match.joined.slice(0, 3).map((id) => people[id].face),
  hostFirst: host.first,
  hostReliability: personReliability(host),
  band: null,
  matchPill: null,
};

export const Nearby: React.FC = () => {
  const { t, frame, fps } = useSceneSeconds();
  const { fps: videoFps } = useVideoConfig();
  const cue = (seconds: number) => frame - Math.round(rel(seconds) * fps);

  /*
   * Camera: two moves, each with a hold either side of it. The first opens the
   * screen out of the iris and sits on the header and chips; the second travels
   * to the card and stops. From ARRIVE_AT the frame is locked, and only the
   * card moves — which is what lets the lift read as depth rather than as more
   * camera.
   */
  const ease = {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: Easing.inOut(Easing.cubic),
  } as const;
  /*
   * The last pair of keys is the third move: from LEVEL_AT the camera eases
   * back off the card, so the shot is never actually still through the pause
   * between lines two and three, and so it hands over on a widening frame — the
   * roster the next scene opens on is a wider composition than this card.
   */
  const keys = [
    0,
    rel(HOLD_WIDE),
    rel(PUSH_AT),
    rel(ARRIVE_AT),
    rel(LEVEL_AT),
    rel(S.end),
  ];
  const focusY = interpolate(t, keys, [212, 196, 196, 364, 372, 430], ease);
  const scale = interpolate(t, keys, [2.04, 2.18, 2.18, 2.7, 2.72, 2.44], ease);

  /* the ink iris from the hook, retracting ---------------------------------- */
  const iris = interpolate(t, [0, rel(IRIS_OUT)], [1, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: Easing.out(Easing.cubic),
  });

  /* the filter chip ---------------------------------------------------------- */
  const chip = spring({ frame: cue(CHIP_AT), fps, config: { damping: 18, stiffness: 200 } });
  // the selected chip takes a small hop as it fills — the app's PressScale, inverted
  const chipLift = Math.max(0, Math.sin(chip * Math.PI)) * 3;

  /*
   * The featured card swapping under the new filter.
   *
   * Sequential, not a crossfade. Both of these cards are dense — a photo, a
   * title, a price, a host row, and on the padel one a level rail as well — and
   * dissolving one through the other puts two of everything on screen at half
   * opacity, which is unreadable for the third of a second it lasts. So the
   * padel card leaves first and quickly, and the halı saha card arrives after
   * it, with only a few frames of overlap. That is also what the app does: a
   * filter change unmounts one list and mounts another.
   */
  const leave = spring({
    frame: cue(SWAP_AT),
    fps,
    config: { damping: 200 },
    durationInFrames: Math.round(0.2 * videoFps),
  });
  const arrive = spring({
    frame: cue(SWAP_AT + 0.14),
    fps,
    config: { damping: 200 },
    durationInFrames: Math.round(0.34 * videoFps),
  });
  /** the row under it re-enters on the app's own stagger */
  const enter = (index: number) =>
    spring({
      frame: cue(SWAP_AT + 0.14 + Math.min(index, 6) * STAGGER),
      fps,
      config: { damping: 200 },
      durationInFrames: Math.round(0.34 * videoFps),
    });

  /* the card coming off the plane -------------------------------------------- */
  const lift = spring({
    frame: cue(LIFT_AT),
    fps,
    config: { damping: 200 },
    durationInFrames: Math.round(1.2 * videoFps),
  });
  /** everything on the screen that is not the card recedes as the card rises */
  const recede = lift;


  const contextStyle: React.CSSProperties = {
    opacity: 1 - recede * 0.86,
    filter: `blur(${recede * 5}px)`,
    transform: `translateY(${recede * -14}px)`,
  };

  return (
    <PaperBackdrop>
      <Stage scale={scale} focusY={focusY} anchorY={ANCHOR}>
        <div style={{ width: SCREEN_W }}>
          <div style={contextStyle}>
            <DiscoverHeader />
            <DiscoverHeadline />
          </div>

          <div style={{ opacity: 1 - recede * 0.86, filter: `blur(${recede * 5}px)` }}>
            <FilterRow from="all" to="football" selectProgress={chip} lift={[0, 0, chipLift, 0, 0]} />
          </div>

          {/*
            The featured card, swapping on the filter.

            The halı saha card is the one that stays, so it is the one in normal
            flow and it sets the wrapper's height. The padel card is the
            overlay, pinned by its top edge only — `inset: 0` stretched the
            shorter card to the taller one's height and left a void under the
            host row exactly where the padel card's level rail had been.
          */}
          <div
            style={{
              position: 'relative',
              margin: `14px ${gutter}px 0`,
              transform: `translateY(${-lift * 30}px) scale(${1 + lift * 0.04})`,
              boxShadow: lift > 0.01 ? liftShadow : undefined,
              borderRadius: 24,
            }}
          >
            {/*
              The arriving card settles from slightly above, not from below.
              Coming up from underneath walked it straight through the
              YAKININDA AYRICA head sitting a few points below the card, which
              is what made the two collide mid-swap.
            */}
            <div
              style={{
                opacity: arrive,
                transform: `translateY(${(1 - arrive) * -10}px) scale(${0.985 + arrive * 0.015})`,
                transformOrigin: 'top center',
              }}
            >
              <MatchCard activity={FEATURED_FOOTBALL} joined={false} />
            </div>
            <div
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                opacity: 1 - leave,
                transform: `translateY(${leave * -12}px) scale(${1 - leave * 0.04})`,
                transformOrigin: 'top center',
              }}
            >
              <MatchCard activity={FEATURED_ALL} joined={false} />
            </div>

          </div>

          {/*
            The rest of the list restages with the filter, head included — the
            head belongs to the list, so leaving it fixed while the rows beneath
            it re-entered read as the card sliding under a label that had not
            moved. The 26pt above it is the card's shadow's room; at the app's
            14 the two touch once the film puts a film-sized shadow on the card.
          */}
          <div style={contextStyle}>
            <SectionHead
              style={{
                padding: `26px ${gutter}px 0`,
                opacity: enter(0),
                transform: `translateY(${(1 - enter(0)) * 12}px)`,
              }}
            >
              {ui.alsoNearYou}
            </SectionHead>
            <MatchRow
              title={secondMatch.title}
              whenVenue={secondMatch.whenVenue}
              spots={secondMatchSpots}
              price={secondMatch.price}
              thumb={secondMatch.thumb}
              style={{
                margin: `12px ${gutter}px 0`,
                transform: `translateY(${(1 - enter(1)) * 16}px)`,
                opacity: enter(1),
              }}
            />
          </div>
        </div>
      </Stage>



      {/* the hook's ink, clearing */}
      {iris > 0.001 ? (
        <AbsoluteFill style={{ pointerEvents: 'none' }}>
          <svg width={1080} height={1920}>
            <defs>
              <mask id="iris-out">
                <rect width={1080} height={1920} fill="white" />
                <circle cx={540} cy={1060} r={(1 - iris) * 1500} fill="black" />
              </mask>
            </defs>
            <rect width={1080} height={1920} fill={color.ink} mask="url(#iris-out)" />
          </svg>
        </AbsoluteFill>
      ) : null}
    </PaperBackdrop>
  );
};
