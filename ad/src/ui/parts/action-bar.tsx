import React from 'react';
import { color, radius, gutter, blueGlow } from '../../theme';
import { ui } from '../../copy';
import { Icon, Row, SectionHead, StatePill, Txt, UrgencyPill, YouAvatar } from '../primitives';

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
