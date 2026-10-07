import React from 'react';
import { Img } from 'remotion';

import { color, radius } from '../theme';
import { face } from '../fonts';
import { Icon } from './primitives';

/**
 * The ad's own graphics.
 *
 * Everything in `parts.tsx` is the app, redrawn. Nothing in here is. These are
 * the two moments the product has no screen for — the group chat that is the
 * reason somebody opens Socius in the first place, and the close that sends
 * them to it.
 *
 * They are drawn in **frame space** (1080×1920), not the app's 390pt screen
 * space, so they are not filmed through `<Stage>` and every size below is the
 * size it appears at. The reference for that scale is `JoinConfirmFull`, which
 * is the one existing full-frame composition in the project: 132 display, 46
 * bold, 40 body, 34 small.
 *
 * The chat is deliberately not any real messenger. No branded green, no tails,
 * no timestamps, no read ticks, no avatars-in-a-circle-with-a-badge. It is the
 * app's own surface, hairline, radius and ink carrying the same conversation —
 * which is both the safer thing to draw and the one that belongs in this ad.
 */

/**
 * Frame-space elevation.
 *
 * `theme.elevation` and `theme.lift` are both authored at 390pt and then
 * magnified by the camera. Nothing here goes through a camera, so the shadow
 * has to be stated at 1080-wide scale or it disappears.
 */
const bubbleLift = '0 18px 40px rgba(16, 26, 43, 0.10), 0 4px 10px rgba(16, 26, 43, 0.05)';

/* ------------------------------------------------------------------ chat -- */

/**
 * One message.
 *
 * `you` is the person trying to organise the game; `them` is everybody
 * answering. Only the sender's first name is drawn, and only on incoming
 * messages — you do not label your own.
 */
export const ChatBubble: React.FC<{
  text: string;
  side: 'you' | 'them';
  from?: string;
  avatar?: string;
  /** the one message the ad is actually about, in the app's blue */
  accent?: boolean;
}> = ({ text, side, from, avatar, accent = false }) => {
  const you = side === 'you';
  const bg = accent ? color.blue : you ? color.ink : color.surface;
  const fg = accent || you ? color.surface : color.ink;

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: you ? 'row-reverse' : 'row',
        alignItems: 'flex-end',
        gap: 18,
      }}
    >
      {you || !avatar ? null : (
        <Img
          src={avatar}
          style={{
            width: 66,
            height: 66,
            borderRadius: radius.pill,
            objectFit: 'cover',
            flexShrink: 0,
          }}
        />
      )}

      <div style={{ display: 'flex', flexDirection: 'column', alignItems: you ? 'flex-end' : 'flex-start' }}>
        {you || !from ? null : (
          <div
            style={{
              ...face.semibold,
              fontSize: 27,
              color: color.inkMuted,
              margin: '0 8px 10px',
            }}
          >
            {from}
          </div>
        )}

        <div
          style={{
            ...face.medium,
            fontSize: 44,
            lineHeight: '54px',
            color: fg,
            backgroundColor: bg,
            padding: '26px 36px',
            /*
             * One tightened corner on the side the message comes from. It is
             * the whole of the chat cue — enough to read as a thread, without
             * the tail-and-timestamp furniture of a real messenger.
             */
            borderRadius: you ? '36px 36px 12px 36px' : '36px 36px 36px 12px',
            border: you || accent ? 'none' : `2px solid ${color.lineOnSurface}`,
            boxShadow: bubbleLift,
            whiteSpace: 'nowrap',
            boxSizing: 'border-box',
          }}
        >
          {text}
        </div>
      </div>
    </div>
  );
};

/* ----------------------------------------------------------------- seats -- */

/**
 * The row of seats a five-a-side needs, with the ones nobody has taken.
 *
 * This is the ad's picture of the problem, and it is the one element the close
 * calls back to — so it is drawn once, here, and used from both ends.
 *
 * The two states are the app's own, scaled up: a taken seat is `OpenSlot`'s
 * filled state (ink disc, user-fill), an empty one is its unfilled state
 * (dashed `controlRing`, plus). `pulse` puts the app's orange behind the empty
 * ones, which is the colour the product already uses for "this is running out".
 */
export const SeatRow: React.FC<{
  total: number;
  filled: number;
  /** seat diameter */
  d?: number;
  gap?: number;
  /** 0–1 attention on the empty seats */
  pulse?: number;
  /** 0–1 arrival, staggered outward by the caller */
  enter?: (index: number) => number;
}> = ({ total, filled, d = 72, gap = 18, pulse = 0, enter }) => (
  <div style={{ display: 'flex', flexDirection: 'row', gap, justifyContent: 'center' }}>
    {Array.from({ length: total }, (_, i) => {
      const taken = i < filled;
      const e = enter ? enter(i) : 1;
      return (
        <div
          key={i}
          style={{
            width: d,
            height: d,
            position: 'relative',
            flexShrink: 0,
            opacity: e,
            transform: `scale(${0.5 + e * 0.5})`,
          }}
        >
          {taken || pulse <= 0 ? null : (
            <div
              style={{
                position: 'absolute',
                inset: -d * 0.16,
                borderRadius: radius.pill,
                backgroundColor: color.orange,
                opacity: 0.12 + pulse * 0.3,
                transform: `scale(${0.94 + pulse * 0.2})`,
              }}
            />
          )}
          <div
            style={{
              position: 'absolute',
              inset: 0,
              borderRadius: radius.pill,
              boxSizing: 'border-box',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              ...(taken
                ? { backgroundColor: color.ink }
                : { border: `${Math.round(d * 0.042)}px dashed ${color.controlRing}` }),
            }}
          >
            <Icon
              name={taken ? 'user-fill' : 'plus'}
              size={Math.round(d * (taken ? 0.5 : 0.38))}
              color={taken ? color.surface : color.inkMuted}
            />
          </div>
        </div>
      );
    })}
  </div>
);

/* ---------------------------------------------------------------- people -- */

/**
 * The match's roster, opening out of the middle.
 *
 * An overlapping row rather than a grid, because it has to read as "a crowd
 * already playing" in about a third of a second. `open` is handed in per
 * avatar so the row can unpack from its centre outwards instead of arriving
 * pre-arranged — the same assemble-don't-appear rule the join scene follows.
 */
export const AvatarFan: React.FC<{
  faces: string[];
  /** drawn after the photographs, as the app draws you: ink and a user glyph */
  withYou?: boolean;
  d?: number;
  step?: number;
  ring?: string;
  open: (index: number) => number;
}> = ({ faces, withYou = true, d = 112, step = 78, ring = color.paper, open }) => {
  const n = faces.length + (withYou ? 1 : 0);
  const width = (n - 1) * step + d;
  const slot = (i: number) => -width / 2 + d / 2 + i * step;

  return (
    <div style={{ position: 'relative', width, height: d, margin: '0 auto' }}>
      {Array.from({ length: n }, (_, i) => {
        const o = open(i);
        const isYou = withYou && i === n - 1;
        return (
          <div
            key={i}
            style={{
              position: 'absolute',
              left: '50%',
              top: 0,
              width: d,
              height: d,
              marginLeft: -d / 2,
              transform: `translateX(${slot(i) * o}px) scale(${0.55 + o * 0.45})`,
              opacity: o,
              zIndex: isYou ? n : n - i,
            }}
          >
            {isYou ? (
              <div
                style={{
                  width: d,
                  height: d,
                  borderRadius: radius.pill,
                  backgroundColor: color.ink,
                  border: `5px solid ${ring}`,
                  boxSizing: 'border-box',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <Icon name="user-fill" size={Math.round(d * 0.46)} color={color.surface} />
              </div>
            ) : (
              <Img
                src={faces[i]}
                style={{
                  width: d,
                  height: d,
                  borderRadius: radius.pill,
                  objectFit: 'cover',
                  border: `5px solid ${ring}`,
                  boxSizing: 'border-box',
                }}
              />
            )}
          </div>
        );
      })}
    </div>
  );
};

/* ------------------------------------------------------------------ type -- */

/**
 * One line of the ad's display type.
 *
 * Used four times and only four times: the two lines of the hook's problem and
 * the two of the close's answer. Both pairs are ink over orange, so the two
 * ends of the ad rhyme without repeating a word.
 */
export const BigLine: React.FC<{
  c?: string;
  size?: number;
  /** 0–1 arrival */
  enter?: number;
  style?: React.CSSProperties;
  children?: React.ReactNode;
}> = ({ c = color.ink, size = 168, enter = 1, style, children }) => (
  <div
    style={{
      ...face.display,
      fontSize: size,
      lineHeight: `${Math.round(size * 0.94)}px`,
      letterSpacing: `${(size * -0.045).toFixed(1)}px`,
      color: c,
      opacity: enter,
      transform: `translateY(${(1 - enter) * 30}px) scale(${0.88 + enter * 0.12})`,
      transformOrigin: '50% 70%',
      whiteSpace: 'nowrap',
      ...style,
    }}
  >
    {children}
  </div>
);
