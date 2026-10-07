import React from 'react';
import { color, radius } from '../../theme';
import { ui } from '../../copy';
import { type Person, starsOf } from '../../data';
import { Avatar, Icon, Txt } from '../primitives';

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
