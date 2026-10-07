import React from 'react';
import { Img } from 'remotion';
import { color, radius, gutter, elevation } from '../../theme';
import { ui } from '../../copy';
import { mark, starsOf } from '../../data';
import { AvatarStack, Card, Chip, Icon, LevelRail, LevelStars, Row, RoundButton, StarRange, StatePill, Txt, UrgencyPill } from '../primitives';

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
