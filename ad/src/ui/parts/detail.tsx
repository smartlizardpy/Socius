import React from 'react';
import { Img } from 'remotion';
import { color, radius, gutter, floatShadow } from '../../theme';
import { ui } from '../../copy';
import { type IconName } from '../../icons';
import { type Person } from '../../data';
import { Card, Icon, Row, Txt } from '../primitives';
import { ActionBar, DetailHead, RosterHead } from './action-bar';
import { SCREEN_W } from './constants';
import { OpenSlot, RosterSlot } from './roster';

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
