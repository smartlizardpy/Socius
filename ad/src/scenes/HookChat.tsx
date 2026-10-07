import React from 'react';
import { AbsoluteFill, Easing, interpolate, spring } from 'remotion';

import { color } from '../theme';
import { chat, type ChatMessage } from '../copy';
import { match, people } from '../data';
import { SCENES, fromLine } from '../timing';
import { CircleWipe, PaperBackdrop, useSceneSeconds } from '../ui/film';
import { BigLine, ChatBubble, SeatRow } from '../ui/story';

/**
 * Scene 1 — the group chat.
 *
 * "Halı saha yapmak istiyorsun… ama yine iki kişi eksik, değil mi?"
 *
 * The problem, before the product: you ask who is coming, three people fall
 * out, and you are counting what is left. The thread scrolls the way a thread
 * scrolls — each message pushes the ones above it up and off — so the shot is
 * never carrying more than four bubbles at once and the last one to land is
 * always the one being read.
 *
 * Then the thread goes soft and back, and the count it has been building to
 * takes the frame. `2 KİŞİ EKSİK` lands at 2.75s, and the voice reaches "iki
 * kişi eksik" at 2.87 — the word is on screen a beat before it is spoken, which
 * is the only order that works.
 *
 * The delivered read is more even than the take before it, which spiked on that
 * phrase hard enough to be the loudest moment in the whole file; this one peaks
 * in line four instead. So the card is placed on the words rather than on a
 * peak, which is where it belonged anyway.
 *
 * The two seats nobody has taken are drawn under it, and they are the one
 * element the close comes back to.
 *
 * All beats are stated as offsets from the moment line 1 is spoken, so a
 * re-recorded voiceover moves them by editing `timing.ts` and nothing else.
 */

const S = SCENES.hook;
/** absolute second → this scene's second */
const rel = (atSeconds: number) => atSeconds - S.start;

/* beats, as offsets from the moment the line is spoken --------------------- */
const cueAt = (offset: number) => fromLine('hook', offset);

/**
 * When each message lands, tightening as it goes: 0.45s between the first two,
 * 0.30 between the last two. The thread is meant to feel like it is getting
 * away from you.
 */
const MSG_AT = [-0.25, 0.2, 0.62, 1.02, 1.38, 1.68].map(cueAt);

const HERO_AT = cueAt(2.08); //   2.75s — "iki kişi eksik" peaks at 2.87
const SEATS_AT = cueAt(2.39); //  the two nobody has taken
const IRIS_FROM = cueAt(4.01); // the ink that hands over to Discover

/* frame-space layout ------------------------------------------------------- */
const MARGIN = 92;
/** where a message sits at the moment it lands */
const ENTRY_Y = 1265;
/** and how far the one above it is pushed */
const SPACING = 208;

const HERO_Y = 950;
const SEAT_Y = 1300;

/**
 * Where the ink closes, and therefore where Discover opens back out of it.
 *
 * Not a free choice: `Nearby` retracts its iris from exactly this point. The
 * two have to agree or the cut tears. It sits just under the display type, so
 * the ink appears to come out of the word rather than out of the middle of
 * nowhere.
 */
const IRIS = { x: 540, y: 1060 };

/** `who` is only on incoming messages, so both reads are guarded. */
const senderOf = (m: ChatMessage) => ('who' in m ? people[m.who] : undefined);
const accentOf = (m: ChatMessage) => ('accent' in m ? m.accent === true : false);

export const HookChat: React.FC = () => {
  const { t, frame, fps } = useSceneSeconds();
  const cue = (seconds: number) => frame - Math.round(rel(seconds) * fps);

  /* the thread --------------------------------------------------------------- */
  const arrive = chat.thread.map((_, i) =>
    spring({
      frame: cue(MSG_AT[i]),
      fps,
      config: { damping: 17, stiffness: 190 },
      durationInFrames: Math.round(0.6 * fps),
    }),
  );

  /*
   * The scroll.
   *
   * Every message that has landed has pushed the stack up by one slot, so the
   * offset is simply how many have landed. Stated as a sum of the springs
   * rather than as a keyframed track, it stays exactly in step with them when
   * the beats move.
   */
  const scroll = SPACING * (arrive.reduce((a, b) => a + b, 0) - 1);

  /* the thread going back, so the count can come forward ---------------------- */
  const recede = spring({
    frame: cue(HERO_AT - 0.12),
    fps,
    config: { damping: 200 },
    durationInFrames: Math.round(0.55 * fps),
  });

  /* the count ---------------------------------------------------------------- */
  const hero = spring({ frame: cue(HERO_AT), fps, config: { damping: 14, stiffness: 165 } });
  const heroTail = spring({
    frame: cue(HERO_AT + 0.09),
    fps,
    config: { damping: 14, stiffness: 165 },
  });

  const seats = spring({
    frame: cue(SEATS_AT),
    fps,
    config: { damping: 200 },
    durationInFrames: Math.round(0.5 * fps),
  });
  /** the empty seats keep asking, at about one breath a second */
  const pulse = seats * (0.5 + 0.5 * Math.sin((t - rel(SEATS_AT)) * 5.6));
  const seatEnter = (i: number) =>
    spring({
      frame: cue(SEATS_AT + i * 0.03),
      fps,
      config: { damping: 200 },
      durationInFrames: Math.round(0.42 * fps),
    });

  /* the camera --------------------------------------------------------------- */
  const push = interpolate(t, [0, rel(S.end)], [1, 1.055], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: Easing.inOut(Easing.quad),
  });

  /* into the cut ------------------------------------------------------------- */
  const collapse = interpolate(t, [rel(IRIS_FROM - 0.2), rel(IRIS_FROM + 0.12)], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: Easing.in(Easing.cubic),
  });
  const iris = interpolate(t, [rel(IRIS_FROM), rel(S.end)], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: Easing.in(Easing.cubic),
  });

  /**
   * Everything the count owns is pulled toward the point the ink comes out of,
   * so the frame closes on one place instead of simply being covered up.
   */
  const toward = (y: number): React.CSSProperties => ({
    transform: `translate(${(IRIS.x - 540) * collapse * 0.5}px, ${
      (IRIS.y - y) * collapse * 0.35
    }px) scale(${1 - collapse * 0.16})`,
    opacity: 1 - collapse * 0.4,
  });

  return (
    <PaperBackdrop>
      <AbsoluteFill style={{ transform: `scale(${push})`, transformOrigin: '50% 52%' }}>
        {/* the thread */}
        {chat.thread.map((m, i) => {
          const e = arrive[i];
          const y = ENTRY_Y + i * SPACING - scroll;

          /* messages fade as they are pushed off the top of the shot */
          const aloft = interpolate(y, [200, 500], [0, 1], {
            extrapolateLeft: 'clamp',
            extrapolateRight: 'clamp',
          });

          /* and the whole thread parts and softens when the count arrives */
          const away = m.side === 'you' ? 1 : -1;
          const sender = senderOf(m);

          return (
            <div
              key={i}
              style={{
                position: 'absolute',
                left: MARGIN,
                right: MARGIN,
                top: y,
                display: 'flex',
                justifyContent: m.side === 'you' ? 'flex-end' : 'flex-start',
                opacity: e * aloft * (1 - recede * 0.93),
                filter: recede > 0.01 ? `blur(${recede * 13}px)` : undefined,
                transform: [
                  `translate(${(1 - e) * away * 90 + recede * away * 110}px, ${
                    (y - IRIS.y) * recede * 0.16
                  }px)`,
                  `scale(${(0.9 + e * 0.1) * (1 - recede * 0.07)})`,
                  `rotate(${(i % 2 === 0 ? -0.9 : 0.8) * (1 - e * 0.55)}deg)`,
                ].join(' '),
                transformOrigin: m.side === 'you' ? '100% 50%' : '0% 50%',
              }}
            >
              <ChatBubble
                text={m.text}
                side={m.side}
                from={sender?.first}
                avatar={sender?.face}
                accent={accentOf(m)}
              />
            </div>
          );
        })}

        {/* the count the thread has been building to */}
        <div
          style={{
            position: 'absolute',
            left: 0,
            right: 0,
            top: HERO_Y,
            textAlign: 'center',
            ...toward(HERO_Y),
          }}
        >
          <div style={{ transform: 'translateY(-50%)' }}>
            <BigLine size={240} enter={hero}>
              {chat.hero.top}
            </BigLine>
            <BigLine size={240} c={color.orange} enter={heroTail}>
              {chat.hero.bottom}
            </BigLine>
          </div>
        </div>

        {/* the seats nobody has taken — the one thing the close comes back to */}
        <div
          style={{
            position: 'absolute',
            left: 0,
            right: 0,
            top: SEAT_Y,
            ...toward(SEAT_Y),
          }}
        >
          <div style={{ transform: 'translateY(-50%)', opacity: seats }}>
            <SeatRow
              total={match.capacity}
              filled={match.joined.length}
              d={76}
              gap={15}
              pulse={pulse}
              enter={seatEnter}
            />
          </div>
        </div>
      </AbsoluteFill>

      {/* the ink that carries the cut into Discover */}
      <CircleWipe progress={iris} fill={color.ink} cx={IRIS.x} cy={IRIS.y} />
    </PaperBackdrop>
  );
};
