import React from 'react';
import { Img } from 'remotion';

import { color, radius, gutter, elevation, blueGlow, floatShadow, lift } from '../theme';
import { ui } from '../copy';
import type { IconName } from '../icons';
import {
  mark,
  type Person,
  starsOf,
  turnedUpOf,
  streakOf,
  personReliability,
  trDecimal,
} from '../data';
import {
  Avatar,
  AvatarStack,
  Card,
  Chip,
  Icon,
  LevelRail,
  LevelStars,
  Row,
  RoundButton,
  SectionHead,
  StarRange,
  StatePill,
  Txt,
  UrgencyPill,
  YouAvatar,
} from './primitives';

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

/** The logical width every screen block is laid out at, before the film scales it. */
export const SCREEN_W = 390;

/* ---------------------------------------------------------------- header -- */

export const DiscoverHeader: React.FC = () => (
  <Row
    style={{
      justifyContent: 'space-between',
      padding: `14px ${gutter}px 0`,
      minHeight: 48,
      boxSizing: 'border-box',
    }}
  >
    <Row gap={9}>
      <Img src={mark} style={{ width: 30, height: 30, objectFit: 'contain' }} />
      <Txt f="display" size={20} em={-0.03}>
        {ui.brand}
      </Txt>
    </Row>

    <Row gap={8}>
      <Row
        gap={5}
        style={{
          height: 44,
          padding: '0 12px 0 10px',
          borderRadius: radius.pill,
          backgroundColor: color.surface,
          border: `1px solid ${color.lineOnPaper}`,
          boxSizing: 'border-box',
        }}
      >
        <Icon name="map-pin" size={15} color={color.orange} />
        <Txt f="semibold" size={13}>
          {ui.city}
        </Txt>
        <Icon name="caret-down" size={11} color={color.inkMuted} />
      </Row>
      <RoundButton icon="newspaper" size={19} d={44} />
      <RoundButton icon="bell" size={19} d={44} />
    </Row>
  </Row>
);

/* -------------------------------------------------------------- headline -- */

export const DiscoverHeadline: React.FC = () => (
  <div style={{ padding: `8px ${gutter}px 0` }}>
    <Txt f="display" size={31} em={-0.035} lh={1.06} style={{ maxWidth: 300 }}>
      {ui.headlineTop}
      <br />
      {ui.headlineBottom}
    </Txt>
    <Txt f="medium" size={14} lh={1.35} c={color.inkMuted} style={{ marginTop: 8 }}>
      {ui.nearbyCount}
    </Txt>
  </div>
);

/* ----------------------------------------------------------- filter row -- */

/** The app's sportFilters, in the app's order. */
const FILTERS = [
  { key: 'all', label: ui.filters.all, icon: null },
  { key: 'padel', label: ui.filters.padel, icon: 'racquet' },
  { key: 'football', label: ui.filters.football, icon: 'soccer-ball' },
  { key: 'tennis', label: ui.filters.tennis, icon: 'tennis-ball' },
  { key: 'run', label: ui.filters.run, icon: 'person-simple-run' },
] as const;

export type FilterKey = (typeof FILTERS)[number]['key'];

/**
 * The sport chips.
 *
 * `selectProgress` drives the handoff between two chips: at 0 `from` is filled,
 * at 1 `to` is. The film runs it through a spring so the fill lands on the
 * consonant, which is why it is a number here rather than a boolean.
 */
export const FilterRow: React.FC<{
  from: FilterKey;
  to: FilterKey;
  selectProgress: number;
  /** how far the row has scrolled the chips left, in px */
  scrollX?: number;
  /** per-chip lift, indexed the same as FILTERS */
  lift?: number[];
}> = ({ from, to, selectProgress, scrollX = 0, lift }) => (
  <div style={{ paddingTop: 14, overflow: 'hidden' }}>
    <Row
      gap={8}
      style={{
        padding: `0 ${gutter}px`,
        transform: `translateX(${-scrollX}px)`,
        width: 'max-content',
      }}
    >
      {FILTERS.map((f, i) => {
        // Two chips are in flight at once; everything else is plainly inactive.
        const t = f.key === to ? selectProgress : f.key === from ? 1 - selectProgress : 0;
        return (
          <div
            key={f.key}
            style={{
              position: 'relative',
              transform: `translateY(${-(lift?.[i] ?? 0)}px)`,
            }}
          >
            <Chip label={f.label} icon={f.icon} height={38} />
            {/* the filled state, cross-faded on top so both can be part-way */}
            <div style={{ position: 'absolute', inset: 0, opacity: t }}>
              <Chip label={f.label} icon={f.icon} height={38} active />
            </div>
          </div>
        );
      })}
    </Row>
  </div>
);

/* ------------------------------------------------------------ match card -- */

/**
 * Discover's featured card. app/(tabs)/index.tsx → `FeaturedCard`.
 *
 * Two of the seed's activities go through it, and the differences between them
 * are the app's, not the film's: the padel game carries a level band, so it
 * draws the "seviyene uygun" pill on the photo and the level rail in the body;
 * the halı saha game is open to all levels with `levelMin` null, so `starBand`
 * returns null and both are simply absent. Nothing is added to fill the gap.
 */
export type FeaturedActivity = {
  title: string;
  whenLine: string;
  venue: string;
  price: string;
  card: string;
  spots: number;
  hostFaces: string[];
  hostFirst: string;
  hostReliability: number;
  /** present only when the activity states a level range */
  band: { lo: number; hi: number; min: number; max: number; you: number } | null;
  /** the "Matches your {sport} level" pill, when your level sits in the band */
  matchPill: string | null;
};

export const MatchCard: React.FC<{
  activity: FeaturedActivity;
  /** true once you are in — swaps the pill and the button, as the app does */
  joined: boolean;
  /** 0–1 press on the Join button */
  press?: number;
  /** 0–1 landing of the level rail marker */
  railSettle?: number;
  style?: React.CSSProperties;
}> = ({ activity: a, joined, press = 0, railSettle = 1, style }) => (
  <div
    style={{
      backgroundColor: color.surface,
      border: `1px solid ${color.lineOnSurface}`,
      borderRadius: radius.cardLarge,
      boxShadow: elevation,
      boxSizing: 'border-box',
      ...style,
    }}
  >
    {/* media */}
    <div
      style={{
        height: 118,
        borderTopLeftRadius: radius.cardLarge,
        borderTopRightRadius: radius.cardLarge,
        overflow: 'hidden',
        position: 'relative',
      }}
    >
      <Img src={a.card} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background:
            'linear-gradient(rgba(11,46,122,0.28) 0%, rgba(11,46,122,0) 46%, rgba(16,26,43,0.42) 100%)',
        }}
      />
      <Row gap={8} style={{ position: 'absolute', top: 12, right: 12 }}>
        {joined ? <StatePill label={ui.youreIn} /> : <UrgencyPill label={ui.spotsLeft(a.spots)} />}
        <div
          style={{
            width: 30,
            height: 30,
            borderRadius: radius.pill,
            backgroundColor: color.surface,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Icon name="bookmark-simple" size={16} color={color.ink} />
        </div>
      </Row>

      {a.matchPill === null ? null : (
        <Row
          gap={6}
          style={{
            position: 'absolute',
            left: 12,
            bottom: 12,
            height: 28,
            padding: '0 11px 0 9px',
            borderRadius: radius.pill,
            backgroundColor: color.surface,
          }}
        >
          <Icon name="lightning" size={14} color={color.blue} />
          <Txt f="semibold" size={12}>
            {a.matchPill}
          </Txt>
        </Row>
      )}
    </div>

    {/* body */}
    <div style={{ padding: 16 }}>
      <Row style={{ alignItems: 'flex-start', justifyContent: 'space-between', gap: 12 }}>
        <div style={{ flexShrink: 1 }}>
          <Txt f="display" size={19} em={-0.02} lh={1.15}>
            {a.title}
          </Txt>
          <Row gap={12} style={{ marginTop: 7, flexWrap: 'wrap' }}>
            <Row gap={5}>
              <Icon name="clock" size={15} color={color.inkMuted} />
              <Txt f="medium" size={13} c={color.inkMuted}>
                {a.whenLine}
              </Txt>
            </Row>
            <Row gap={5}>
              <Icon name="map-pin" size={15} color={color.inkMuted} />
              <Txt f="medium" size={13} c={color.inkMuted}>
                {a.venue}
              </Txt>
            </Row>
          </Row>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end' }}>
          <Txt f="display" size={19} em={-0.02}>
            {a.price}
          </Txt>
          <Txt f="semibold" size={11} em={0.02} c={color.inkMuted}>
            {ui.perPerson}
          </Txt>
        </div>
      </Row>

      {/* where you sit in the band — only when the activity states one */}
      {a.band === null ? null : (
        <Row gap={10} style={{ marginTop: 16 }}>
          <StarRange lo={a.band.lo} hi={a.band.hi} size={12} c={color.inkMuted} />
          <LevelRail min={a.band.min} max={a.band.max} you={a.band.you} settle={railSettle} />
          <Row gap={5}>
            <Txt f="bold" size={12} c={color.orangeDeep}>
              {ui.you}
            </Txt>
            <LevelStars n={starsOf(a.band.you)} size={11} />
          </Row>
        </Row>
      )}

      {/* host + join */}
      <Row gap={12} style={{ justifyContent: 'space-between', marginTop: 16 }}>
        <Row gap={9} style={{ flexShrink: 1 }}>
          <AvatarStack faces={a.hostFaces} size={34} ring={color.surface} overlap={11} />
          <div>
            <Txt f="medium" size={12} lh={1.3} c={color.inkMuted}>
              {ui.hosts(a.hostFirst)}
            </Txt>
            <Txt f="semibold" size={12} lh={1.3}>
              {ui.reliable(a.hostReliability)}
            </Txt>
          </div>
        </Row>

        {joined ? (
          <div
            style={{
              height: 44,
              padding: '0 22px',
              borderRadius: radius.pill,
              backgroundColor: color.blueTint,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Txt f="bold" size={15} c={color.blueDeep}>
              {ui.youreIn}
            </Txt>
          </div>
        ) : (
          <div
            style={{
              height: 44,
              padding: '0 22px',
              borderRadius: radius.pill,
              backgroundColor: color.blue,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transform: `scale(${1 - press * 0.06})`,
            }}
          >
            <Txt f="semibold" size={15} c={color.onBlue}>
              {ui.join}
            </Txt>
          </div>
        )}
      </Row>
    </div>
  </div>
);

/**
 * Discover's list row, for the second halı saha match.
 * app/(tabs)/index.tsx → `ActivityRow`, at the app's 12px padding and 68px thumb.
 */
export const MatchRow: React.FC<{
  title: string;
  whenVenue: string;
  spots: number;
  price: number;
  thumb: string;
  style?: React.CSSProperties;
}> = ({ title, whenVenue, spots, price, thumb, style }) => (
  <Card style={{ display: 'flex', flexDirection: 'row', gap: 12, padding: 12, ...style }}>
    <Img
      src={thumb}
      style={{ width: 68, height: 68, borderRadius: radius.media, objectFit: 'cover', flexShrink: 0 }}
    />
    <div style={{ flexGrow: 1, flexShrink: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', minWidth: 0 }}>
      <Txt f="bold" size={15} em={-0.01} style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
        {title}
      </Txt>
      <Txt f="medium" size={12.5} c={color.inkMuted} style={{ marginTop: 5 }}>
        {whenVenue}
      </Txt>
      <Row gap={6} style={{ marginTop: 7 }}>
        <Icon name="users-three" size={14} color={color.inkMuted} />
        <Txt f="semibold" size={11.5} c={spots === 1 ? color.orangeDeep : color.inkMuted}>
          {`${spots} yer kaldı`}
        </Txt>
      </Row>
    </div>
    <div style={{ display: 'flex', alignItems: 'center' }}>
      <Txt f="display" size={16} em={-0.02}>
        {`₺${price}`}
      </Txt>
    </div>
  </Card>
);

/* ---------------------------------------------------------------- roster -- */

/** One player on the activity detail's roster. app/activity/[id].tsx → RosterSlot. */
export const RosterSlot: React.FC<{ person: Person; isHost: boolean }> = ({ person, isHost }) => (
  <div
    style={{
      flexGrow: 1,
      flexBasis: 0,
      minWidth: 0,
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      gap: 7,
    }}
  >
    <div style={{ width: 52, height: 52, position: 'relative' }}>
      <Avatar src={person.face} size={52} />
      {isHost ? (
        <div
          style={{
            position: 'absolute',
            bottom: -2,
            right: -2,
            width: 20,
            height: 20,
            borderRadius: radius.pill,
            backgroundColor: color.surface,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Icon name="seal-check" size={16} color={color.blue} />
        </div>
      ) : null}
    </div>
    <Txt f="semibold" size={12}>
      {person.first}
    </Txt>
    {isHost ? (
      <Txt f="bold" size={10} em={0.06} c={color.orangeDeep}>
        {ui.host}
      </Txt>
    ) : (
      <Txt f="semibold" size={10} c={color.inkMuted}>
        {`${starsOf(person.level)}★`}
      </Txt>
    )}
  </div>
);

/**
 * The open slot at the end of the roster.
 *
 * `fill` is the app's own `withSpring` on the same element, handed in as a
 * number so the film can land it on the beat: the dashed ring fades out as the
 * filled disc scales up from 0.6, exactly as `OpenSlot` animates it.
 */
export const OpenSlot: React.FC<{ fill: number }> = ({ fill }) => (
  <div
    style={{
      flexGrow: 1,
      flexBasis: 0,
      minWidth: 0,
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      gap: 7,
    }}
  >
    <div style={{ width: 52, height: 52, position: 'relative' }}>
      <div
        style={{
          position: 'absolute',
          inset: 0,
          borderRadius: radius.pill,
          border: `2px dashed ${color.controlRing}`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxSizing: 'border-box',
          opacity: 1 - fill,
        }}
      >
        <Icon name="plus" size={20} color={color.inkMuted} />
      </div>
      <div
        style={{
          position: 'absolute',
          inset: 0,
          borderRadius: radius.pill,
          backgroundColor: color.ink,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          opacity: fill,
          transform: `scale(${0.6 + fill * 0.4})`,
        }}
      >
        <Icon name="user-fill" size={26} color={color.surface} />
      </div>
    </div>
    <Txt f="semibold" size={12} c={fill > 0.5 ? color.ink : color.inkMuted}>
      {fill > 0.5 ? 'Sen' : ui.allLevels}
    </Txt>
    <Txt f="semibold" size={10} c={color.inkMuted} style={{ opacity: 1 - fill }}>
      {' '}
    </Txt>
  </div>
);

/* ----------------------------------------------------------------- fit ---- */

/**
 * Why this match fits you — the time, and the level.
 *
 * The recorded voiceover dropped a sentence the concept doc's script had:
 * "saatine ve seviyene uyan maçı seçiyorsun". This is that sentence, put back
 * as picture rather than as words, in the gap the cut line left behind.
 *
 * Both rows are the product's own facts, and the second one is the reason this
 * card says what it says rather than what the brief asked for. The app's
 * `matchReasonFor` returns **null** for a game with no level band — "says
 * nothing at all rather than something untrue", in its own comment — so a
 * "Futbol seviyene uygun" pill on this match would contradict the function that
 * decides whether to draw one. The halı saha game states no level, so what the
 * card states is that it states no level, which is the honest answer to the
 * question and the better one for a stranger about to join.
 *
 * The one thing here that is the film's rather than the app's is the pair of
 * ticks. The overlap they mark is real — Thursday 21.00–22.00 sits inside
 * weekday evenings 19.00–22.00, and `eligible()` returns true for a game open
 * to all levels — but the app draws no such badge, so they are the ad reading
 * two of its numbers against each other out loud.
 */
const FIT_ROWS = [
  { icon: 'clock', head: ui.fit.when, sub: ui.fit.yourHours },
  /*
   * Flipped against the note on the detail page, on purpose. The open slot in
   * the roster directly above this card is already labelled "Her seviye" — the
   * app's own label for a seat with no level on it — so leading with the same
   * two words put them on screen twice in the same weight. The reassuring half
   * is the better headline anyway.
   */
  { icon: 'users-three', head: ui.everyoneWelcome, sub: ui.allLevels },
] as const;

export const FitCard: React.FC<{
  /** 0–1 arrival, per row */
  rows: (index: number) => number;
  /** 0–1 landing of a row's tick, after its line has been read */
  ticks: (index: number) => number;
}> = ({ rows, ticks }) => (
  <Card style={{ padding: '14px 16px 16px' }}>
    <SectionHead>{ui.fit.head}</SectionHead>

    {FIT_ROWS.map((r, i) => {
      const e = rows(i);
      const tick = ticks(i);
      return (
        <Row
          key={r.head}
          gap={11}
          style={{
            marginTop: i === 0 ? 12 : 12,
            paddingTop: i === 0 ? 0 : 12,
            borderTop: i === 0 ? 'none' : `1px solid ${color.lineOnSurface}`,
            opacity: e,
            transform: `translateY(${(1 - e) * 10}px)`,
          }}
        >
          <Icon name={r.icon} size={17} color={color.blue} />
          <div style={{ flexGrow: 1, minWidth: 0 }}>
            <Txt f="bold" size={13.5} em={-0.01}>
              {r.head}
            </Txt>
            <Txt f="medium" size={12} c={color.inkMuted} style={{ marginTop: 3 }}>
              {r.sub}
            </Txt>
          </div>
          <div style={{ opacity: tick, transform: `scale(${0.5 + tick * 0.5})` }}>
            <Icon name="check-circle-fill" size={20} color={color.blue} />
          </div>
        </Row>
      );
    })}
  </Card>
);

/* ---------------------------------------------------------- reliability -- */

/**
 * The reliability card from a player's profile — the ad's trust beat.
 *
 * `reveal` draws the ticks left to right; `count` is the percentage the film
 * counts up to. Both are the film's, but every number they land on is the app's
 * arithmetic on that player's one recorded fact: which game they missed.
 */
export const ReliabilityCard: React.FC<{
  person: Person;
  reveal: number;
  count: number;
  style?: React.CSSProperties;
}> = ({ person, reveal, count, style }) => {
  const played = person.gamesPlayed;
  const turnedUp = turnedUpOf(person);
  const streak = streakOf(person);
  const missed = person.noShowAt >= 0;
  // The app only states a clean run when the percentage does not already say it.
  const showStreak = missed && streak > 0;
  const bars = Math.min(played, 41);
  // the app's own widths: a dozen games get a tick you can count, forty a texture
  const tickW = bars > 24 ? 5 : bars > 16 ? 9 : 14;

  return (
    <Card
      r={22}
      style={{ padding: '18px 16px 14px', ...style }}
    >
      <Row style={{ justifyContent: 'space-between', gap: 12 }}>
        <SectionHead>{ui.reliability}</SectionHead>
        {showStreak ? (
          <Row
            gap={5}
            style={{
              height: 22,
              padding: '0 9px',
              borderRadius: radius.pill,
              backgroundColor: color.blueTint,
              opacity: reveal,
            }}
          >
            <Icon name="lightning" size={12} color={color.blueDeep} />
            <Txt f="bold" size={11} c={color.blueDeep}>
              {ui.inARow(streak)}
            </Txt>
          </Row>
        ) : null}
      </Row>

      <Row style={{ alignItems: 'flex-end', gap: 10, marginTop: 4 }}>
        <Txt f="display" size={54} em={-0.05} lh={1.18}>
          {`%${Math.round(count)}`}
        </Txt>
        <Txt
          f="medium"
          size={12.5}
          lh={1.35}
          c={color.inkMuted}
          style={{ paddingBottom: 6, flexShrink: 1 }}
        >
          {ui.turnedUp(turnedUp, played)}
        </Txt>
      </Row>

      <Row
        style={{
          alignItems: 'flex-end',
          justifyContent: 'space-between',
          height: 26,
          marginTop: 14,
        }}
      >
        {Array.from({ length: bars }, (_, i) => {
          const miss = i === person.noShowAt;
          // each tick lands in turn, oldest first, so the miss is *found*
          const at = (i + 1) / bars;
          const on = reveal >= at ? 1 : Math.max(0, 1 - (at - reveal) * bars * 0.9);
          return (
            <div
              key={i}
              style={{
                width: tickW,
                height: (miss ? 26 : 17) * on,
                borderRadius: 2.5,
                backgroundColor: miss ? color.orange : color.blue,
                opacity: on,
              }}
            />
          );
        })}
      </Row>

      <Row style={{ justifyContent: 'space-between', marginTop: 9, opacity: reveal }}>
        <Txt f="medium" size={11.5} c={color.inkMuted}>
          {ui.since}
        </Txt>
        <Txt f="medium" size={11.5} c={color.inkMuted}>
          {ui.today}
        </Txt>
      </Row>
    </Card>
  );
};

/**
 * A player's line from the players list — app/players.tsx.
 *
 * The reliability figure a host reads before letting someone in is shown in the
 * app in exactly this form: the star rating and the percentage, on one line
 * under the name. Nothing here is a new read-out invented for the ad.
 */
export const PlayerLine: React.FC<{ person: Person; opacity: number; y?: number }> = ({
  person,
  opacity,
  y = 0,
}) => (
  <Row
    gap={10}
    style={{
      opacity,
      transform: `translateY(${y}px)`,
      height: 56,
      padding: '0 14px 0 8px',
      borderRadius: radius.pill,
      backgroundColor: color.surface,
      border: `1px solid ${color.lineOnSurface}`,
      boxShadow: elevation,
      boxSizing: 'border-box',
    }}
  >
    <Avatar src={person.face} size={40} />
    <div style={{ minWidth: 0 }}>
      <Txt f="bold" size={14} em={-0.01}>
        {person.first}
      </Txt>
      <Row gap={5} style={{ marginTop: 3 }}>
        <Icon name="star-fill" size={11} color={color.orange} />
        <Txt f="semibold" size={11.5} c={color.inkMuted}>
          {ui.ratingReliable(trDecimal(person.rating), personReliability(person))}
        </Txt>
      </Row>
    </div>
  </Row>
);

/* ------------------------------------------------------------ action bar -- */

/**
 * The activity detail's pinned bar. The 10% fee is disclosed here, as it is in
 * the app.
 *
 * `floating` is the film's version of it: the same bar, cut loose from the
 * bottom of a screen and given the card treatment, for the shots that show the
 * product as lifted components on paper rather than as a page.
 */
export const ActionBar: React.FC<{
  joined: boolean;
  press?: number;
  floating?: boolean;
}> = ({ joined, press = 0, floating = false }) => (
  <Row
    gap={16}
    style={{
      padding: floating ? '14px 16px' : `14px ${gutter}px 20px`,
      backgroundColor: color.surface,
      boxSizing: 'border-box',
      ...(floating
        ? { border: `1px solid ${color.lineOnSurface}`, borderRadius: radius.cardLarge }
        : {
            borderTop: `1px solid ${color.lineOnSurface}`,
            boxShadow: '0 -8px 16px rgba(16,26,43,0.06)',
          }),
    }}
  >
    <div>
      <Txt f="display" size={21} em={-0.02} lh={1}>
        {ui.price}
      </Txt>
      <Txt f="semibold" size={11.5} c={color.inkMuted} style={{ marginTop: 3 }}>
        {`${ui.priceNote} + 10%`}
      </Txt>
    </div>

    {joined ? (
      <Row
        gap={8}
        style={{
          flexGrow: 1,
          height: 52,
          borderRadius: radius.pill,
          backgroundColor: color.blueTint,
          justifyContent: 'center',
        }}
      >
        <Icon name="check" size={18} color={color.blueDeep} />
        <Txt f="bold" size={16} em={-0.01} c={color.blueDeep}>
          {ui.youreIn}
        </Txt>
      </Row>
    ) : (
      <Row
        style={{
          flexGrow: 1,
          height: 52,
          borderRadius: radius.pill,
          backgroundColor: color.blue,
          justifyContent: 'center',
          transform: `scale(${1 - press * 0.04})`,
          boxShadow: blueGlow,
        }}
      >
        <Txt f="semibold" size={16} em={-0.01} c={color.onBlue}>
          {ui.joinGame}
        </Txt>
      </Row>
    )}
  </Row>
);

/**
 * The top of the activity detail's sheet — the date line, the state pill and the
 * headline. app/activity/[id].tsx, at its own 28px display size.
 *
 * The match carries no level band, so — as in the app — the LEVEL RANGE panel
 * that would sit under the headline is simply absent.
 */
export const DetailHead: React.FC<{ spots: number; joined: boolean }> = ({ spots, joined }) => (
  <div>
    <Row style={{ justifyContent: 'space-between', gap: 12 }}>
      <Row gap={7} style={{ flexShrink: 1 }}>
        <Icon name="calendar-check" size={16} color={color.blue} />
        <Txt f="bold" size={13} em={-0.01} c={color.blue}>
          {ui.dateTimeLine}
        </Txt>
      </Row>
      {joined ? (
        <StatePill label={ui.youreIn} height={28} />
      ) : (
        <UrgencyPill label={ui.spotsLeft(spots)} height={28} />
      )}
    </Row>
    <Txt f="display" size={28} em={-0.035} lh={1.1} style={{ marginTop: 10 }}>
      {ui.headline}
    </Txt>
  </div>
);

/** WHO'S PLAYING's head, with the live count the app swaps on join. */
export const RosterHead: React.FC<{ inCount: number; capacity: number }> = ({
  inCount,
  capacity,
}) => (
  <Row style={{ alignItems: 'baseline', justifyContent: 'space-between' }}>
    <SectionHead>{ui.whosPlaying}</SectionHead>
    <Txt f="semibold" size={12} c={color.inkMuted}>
      {ui.ofIn(inCount, capacity)}
    </Txt>
  </Row>
);

export { YouAvatar };

/* ------------------------------------------------- activity detail page -- */

/** The drawn map thumbnail. mobile/src/components/VenueMap.tsx, verbatim. */
export const VenueMap: React.FC<{ size?: number }> = ({ size = 76 }) => (
  <svg width={size} height={size} viewBox="0 0 76 76" style={{ display: 'block', flexShrink: 0 }}>
    <rect width={76} height={76} rx={16} fill={color.mapBase} />
    <rect x={4} y={6} width={22} height={18} rx={3} fill={color.blueTint} />
    <rect x={52} y={2} width={26} height={22} rx={3} fill={color.blueTint} />
    <rect x={2} y={46} width={20} height={26} rx={3} fill={color.blueTint} />
    <rect x={56} y={50} width={22} height={22} rx={3} fill={color.blueTint} />
    <path d="M0 34 H76" stroke={color.surface} strokeWidth={9} />
    <path d="M40 0 V76" stroke={color.surface} strokeWidth={7} />
    <path d="M0 62 H40" stroke={color.surface} strokeWidth={5} />
    <circle cx={40} cy={34} r={13} fill={color.blue} opacity={0.14} />
    <circle cx={40} cy={34} r={7} fill={color.orange} stroke={color.surface} strokeWidth={3} />
  </svg>
);

/**
 * The panel that stands in for the level rail on a game with no band.
 *
 * This is the app's `else` branch, not a simplification: an activity that is
 * open to all levels has nothing to draw a rail from, so the detail screen
 * states the label and "Herkes katılabilir" instead.
 */
export const LevelNote: React.FC<{ floating?: boolean }> = ({ floating = false }) => (
  <Row
    gap={9}
    style={{
      marginTop: floating ? 0 : 14,
      padding: '12px 14px',
      /*
       * Floated, it is the same note cut loose from the page: standing on paper
       * rather than inside a card, it needs the card's own surface and the
       * paper hairline to stay separate from the ground. Same rule, and same
       * prop name, as `ActionBar floating`.
       */
      border: `1px solid ${floating ? color.lineOnPaper : color.lineOnSurface}`,
      borderRadius: 18,
      backgroundColor: floating ? color.surface : color.paper,
      boxSizing: 'border-box',
    }}
  >
    <Icon name="users-three" size={17} color={color.blue} />
    <Txt f="bold" size={13.5} em={-0.01} style={{ flexGrow: 1 }}>
      {ui.allLevels}
    </Txt>
    <Txt f="medium" size={12.5} c={color.inkMuted}>
      {ui.everyoneWelcome}
    </Txt>
  </Row>
);

/** The venue row on a card of its own, for the shots that float it on paper. */
export const VenueCard: React.FC = () => (
  <Card style={{ padding: 14 }}>
    <VenueRow bare />
  </Card>
);

/** The venue row: map thumbnail, address, and how far away it is. */
export const VenueRow: React.FC<{ bare?: boolean }> = ({ bare = false }) => (
  <Row gap={12} style={{ marginTop: bare ? 0 : 12 }}>
    <VenueMap size={76} />
    <div style={{ flexGrow: 1, flexShrink: 1, minWidth: 0 }}>
      <Txt f="bold" size={15} em={-0.01}>
        {ui.venueFull}
      </Txt>
      <Txt f="medium" size={12.5} c={color.inkMuted} style={{ marginTop: 4 }}>
        {ui.venueAddress}
      </Txt>
      <Row gap={6} style={{ marginTop: 7 }}>
        <Icon name="map-trifold" size={15} color={color.blue} />
        <Txt f="semibold" size={12.5} c={color.blue}>
          {`${ui.distance} · ${ui.travel}`}
        </Txt>
      </Row>
    </div>
    <Icon name="caret-right" size={18} color={color.inkMuted} />
  </Row>
);

/** The hairline note the detail screen closes on. */
export const SafetyNote: React.FC = () => (
  <Row
    gap={9}
    style={{
      marginTop: 18,
      alignItems: 'flex-start',
      padding: '12px 14px',
      border: `1px solid ${color.lineOnSurface}`,
      borderRadius: 16,
      backgroundColor: color.paper,
      boxSizing: 'border-box',
    }}
  >
    <div style={{ paddingTop: 1 }}>
      <Icon name="info" size={15} color={color.inkMuted} />
    </div>
    <Txt f="medium" size={12} lh={1.4} c={color.inkMuted} style={{ flexShrink: 1 }}>
      {ui.safety}
    </Txt>
  </Row>
);

/** The hero photo and the three floating controls over it. */
export const DetailHero: React.FC<{ src: string }> = ({ src }) => (
  <div style={{ height: 262, position: 'relative', overflow: 'hidden' }}>
    <Img src={src} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
    <div
      style={{
        position: 'absolute',
        inset: 0,
        background:
          'linear-gradient(rgba(11,46,122,0.42) 0%, rgba(11,46,122,0.04) 40%, rgba(11,46,122,0.10) 100%)',
      }}
    />
    <Row
      style={{
        position: 'absolute',
        top: 18,
        left: gutter,
        right: gutter,
        justifyContent: 'space-between',
      }}
    >
      <FloatButton icon="caret-left" size={18} />
      <Row gap={8}>
        <FloatButton icon="bookmark-simple" size={19} />
        <FloatButton icon="share-network" size={19} />
        <FloatButton icon="dots-three" size={18} />
      </Row>
    </Row>
  </div>
);

/** A round control floating over the hero, with the app's float shadow. */
const FloatButton: React.FC<{ icon: IconName; size?: number }> = ({ icon, size = 18 }) => (
  <div
    style={{
      width: 40,
      height: 40,
      borderRadius: radius.pill,
      backgroundColor: color.surface,
      boxShadow: floatShadow,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      flexShrink: 0,
    }}
  >
    <Icon name={icon} size={size} color={color.ink} />
  </div>
);

/**
 * The whole activity screen, as one page.
 *
 * Everything on it is the app's: the 262px hero, the sheet pulled up over it by
 * 26px with 28px top corners, the date line, the headline, the all-levels panel
 * that stands where a level rail would be, the venue, the roster, the safety
 * note, and the pinned bar.
 *
 * `enter` is what lets the film assemble the page rather than present it. Each
 * region asks for its own 0–1, so a scene can land them one after another and
 * the page builds itself down the screen — the same language the trust beat
 * uses on the roster — or pass nothing and get the finished page. The indices
 * run in layout order, so a stagger is the index times a delay.
 */
export const PAGE_PART = {
  hero: 0,
  head: 1,
  level: 2,
  venue: 3,
  rosterHead: 4,
  /** the four seats take 5, 6, 7 and 8 */
  roster: 5,
  safety: 9,
  actionBar: 10,
} as const;

/** The last index `enter` will be asked for, for a scene sizing its stagger. */
export const PAGE_PARTS = 11;

/** How a region arrives: up from a little below, and a hair small. */
const arrival = (e: number): React.CSSProperties => ({
  opacity: e,
  transform: `translateY(${(1 - e) * 20}px) scale(${0.985 + e * 0.015})`,
  transformOrigin: 'top center',
});

export const ActivityDetail: React.FC<{
  hero: string;
  spots: number;
  joined: boolean;
  inCount: number;
  capacity: number;
  roster: Person[];
  hostId: string;
  /** 0–1 fill of the open slot */
  slotFill: number;
  /** 0–1 press on the pinned CTA */
  press?: number;
  /** extra scale on the slot as it lands */
  slotPop?: number;
  /** per-region arrival, indexed by PAGE_PART. Omit for the finished page. */
  enter?: (index: number) => number;
}> = ({
  hero,
  spots,
  joined,
  inCount,
  capacity,
  roster: seats,
  hostId,
  slotFill,
  press = 0,
  slotPop = 0,
  enter = () => 1,
}) => (
  <div style={{ width: SCREEN_W, backgroundColor: color.paper }}>
    <div style={arrival(enter(PAGE_PART.hero))}>
      <DetailHero src={hero} />
    </div>

    <div
      style={{
        marginTop: -26,
        backgroundColor: color.surface,
        borderTopLeftRadius: 28,
        borderTopRightRadius: 28,
        padding: `22px ${gutter}px 0`,
        boxSizing: 'border-box',
      }}
    >
      <div style={arrival(enter(PAGE_PART.head))}>
        <DetailHead spots={spots} joined={joined} />
      </div>
      <div style={arrival(enter(PAGE_PART.level))}>
        <LevelNote />
      </div>
      <div style={arrival(enter(PAGE_PART.venue))}>
        <VenueRow />
      </div>

      <div style={{ marginTop: 20, ...arrival(enter(PAGE_PART.rosterHead)) }}>
        <RosterHead inCount={inCount} capacity={capacity} />
      </div>

      <Row gap={10} style={{ alignItems: 'flex-start', marginTop: 12 }}>
        {seats.map((p, i) => (
          <div
            key={`${p.id}-${i}`}
            style={{
              flexGrow: 1,
              flexBasis: 0,
              minWidth: 0,
              ...arrival(enter(PAGE_PART.roster + i)),
            }}
          >
            <RosterSlot person={p} isHost={p.id === hostId} />
          </div>
        ))}
        <div
          style={{
            flexGrow: 1,
            flexBasis: 0,
            minWidth: 0,
            ...arrival(enter(PAGE_PART.roster + seats.length)),
          }}
        >
          <div style={{ transform: `scale(${1 + slotPop * 0.08})` }}>
            <OpenSlot fill={slotFill} />
          </div>
        </div>
      </Row>

      <div style={arrival(enter(PAGE_PART.safety))}>
        <SafetyNote />
      </div>
      <div style={{ height: 22 }} />
    </div>

    <div style={arrival(enter(PAGE_PART.actionBar))}>
      <ActionBar joined={joined} press={press} />
    </div>
  </div>
);

/* --------------------------------------------------------- confirmation -- */

/**
 * The join confirmation — the whole frame.
 *
 * A film device, and worth being honest about: the product confirms a join with
 * the small ink toast at the bottom of the screen, "Katıldın — orada
 * görüşürüz", and with the screen's own state flipping to KATILDIN. Both of
 * those happen in the shot before this one. This is the same words and the same
 * check given the frame to themselves, because a 9:16 ad watched at arm's
 * length needs the payoff to be the picture, not a detail in it.
 *
 * It is blue because the button that was pressed is blue: the flood that brings
 * it on is that button's own fill opening out. Nothing arrives from off-screen
 * that the viewer did not just touch.
 */
export const JoinConfirmFull: React.FC<{
  /** 0–1 landing of the seal */
  seal: number;
  /** 0–1 arrival of the words under it */
  copy: number;
}> = ({ seal, copy }) => (
  <div
    style={{
      position: 'absolute',
      inset: 0,
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      textAlign: 'center',
      padding: '0 90px',
      boxSizing: 'border-box',
    }}
  >
    <div
      style={{
        width: 232,
        height: 232,
        borderRadius: radius.pill,
        backgroundColor: 'rgba(255,255,255,0.16)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        transform: `scale(${0.5 + seal * 0.5})`,
        opacity: seal,
      }}
    >
      <Icon name="seal-check" size={136} color={color.onBlue} />
    </div>

    <div
      style={{
        opacity: copy,
        transform: `translateY(${(1 - copy) * 26}px)`,
        marginTop: 46,
      }}
    >
      <Txt f="display" size={132} em={-0.04} lh={1} c={color.onBlue}>
        {ui.youreIn}
      </Txt>
      <Txt
        f="medium"
        size={40}
        lh={1.3}
        c="rgba(255,255,255,0.82)"
        style={{ marginTop: 20 }}
      >
        {ui.joinedToast}
      </Txt>
    </div>

    <div
      style={{
        opacity: copy,
        transform: `translateY(${(1 - copy) * 34}px)`,
        marginTop: 60,
        paddingTop: 44,
        borderTop: '1px solid rgba(255,255,255,0.22)',
        alignSelf: 'stretch',
      }}
    >
      <Txt f="bold" size={46} em={-0.02} lh={1.25} c={color.onBlue}>
        {ui.headline}
      </Txt>
      <Row gap={12} style={{ justifyContent: 'center', marginTop: 20 }}>
        <Icon name="calendar-check" size={34} color="rgba(255,255,255,0.9)" />
        <Txt f="semibold" size={34} c="rgba(255,255,255,0.9)">
          {ui.dateTimeLine}
        </Txt>
      </Row>
    </div>
  </div>
);
