import React from 'react';
import { color, radius, elevation } from '../../theme';
import { ui } from '../../copy';
import { type Person, turnedUpOf, streakOf, personReliability, trDecimal } from '../../data';
import { Avatar, Card, Icon, Row, SectionHead, Txt } from '../primitives';

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
