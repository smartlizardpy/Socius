import React from 'react';
import { AbsoluteFill, Easing, Img, interpolate, useCurrentFrame, useVideoConfig } from 'remotion';
import { Video } from '@remotion/media';

import { color } from '../theme';
import { PitchPlate, handheld } from './plate';
import { SCREEN_W } from './parts';

/* -------------------------------------------------------------- ugc slot -- */

/**
 * The intro / outro plate.
 *
 * `src` is the Higgsfield clip once it exists. Until then the drawn pitch holds
 * the shot. Swapping one for the other is a prop change and nothing else — no
 * scene reaches past this component for its background, and the composition
 * renders fully with `src` null.
 */
const STILL = /\.(jpe?g|png|webp|avif)$/i;

export const UgcSlot: React.FC<{
  src: string | null;
  /** seconds into the clip to start from, once there is a clip */
  trimBefore?: number;
  shake?: number;
  push?: number;
}> = ({ src, trimBefore = 0, shake = 1, push = 0 }) => {
  const { fps } = useVideoConfig();
  const frame = useCurrentFrame();

  if (src === null) {
    return <PitchPlate shake={shake} push={push} />;
  }

  // A still is as valid a plate as a clip: a good photograph of the pitch, given
  // the same handheld drift and push, holds the shot better than a weak video.
  if (STILL.test(src)) {
    const h = handheld(frame, fps, shake);
    return (
      <AbsoluteFill style={{ overflow: 'hidden', backgroundColor: color.ink }}>
        <Img
          src={src}
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            transform: `translate(${h.x}px, ${h.y}px) rotate(${h.rotate}deg) scale(${
              h.scale * (1.04 + push * 0.2)
            })`,
          }}
        />
      </AbsoluteFill>
    );
  }

  return (
    <AbsoluteFill style={{ overflow: 'hidden' }}>
      <Video
        src={src}
        trimBefore={Math.round(trimBefore * fps)}
        style={{
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          transform: `scale(${1 + push * 0.2})`,
        }}
      />
    </AbsoluteFill>
  );
};

/* ----------------------------------------------------------------- stage -- */

/**
 * The camera.
 *
 * Screen content is laid out at the app's own 390pt width and then framed by
 * this: `scale` is how much of the 1080px frame one screen point takes,
 * `focusX` / `focusY` name the point in screen space that sits at `anchorY`
 * down the frame. Panning is therefore stated in the coordinates of the screen
 * being filmed, which is what makes a move like "travel from the card's photo
 * to its Join button" writable.
 *
 * `tilt` adds the small perspective rotation the 2.5D shots use. It is applied
 * about the focus point so a tilt never slides the subject out of frame.
 */
export const Stage: React.FC<{
  scale: number;
  focusX?: number;
  focusY: number;
  /** where the focus point sits vertically in the frame, 0–1 */
  anchorY?: number;
  tiltX?: number;
  tiltY?: number;
  style?: React.CSSProperties;
  children?: React.ReactNode;
}> = ({
  scale,
  focusX = SCREEN_W / 2,
  focusY,
  anchorY = 0.5,
  tiltX = 0,
  tiltY = 0,
  style,
  children,
}) => (
  <AbsoluteFill style={{ perspective: 1600, perspectiveOrigin: `50% ${anchorY * 100}%` }}>
    <div
      style={{
        position: 'absolute',
        left: 0,
        top: 0,
        width: SCREEN_W,
        /*
         * Read right to left: put the focus point at the origin, rotate and
         * scale about it, then move it to where it should sit in the frame.
         * With `transform-origin: 0 0` this composes to
         *   screen (x, y) → (540 + s·(x − focusX), 1920·anchorY + s·(y − focusY))
         * which is the whole of the camera. Any other origin double-counts the
         * focus offset and slides the subject out of frame.
         */
        transform: [
          `translate(540px, ${1920 * anchorY}px)`,
          `scale(${scale})`,
          `rotateX(${tiltX}deg) rotateY(${tiltY}deg)`,
          `translate(${-focusX}px, ${-focusY}px)`,
        ].join(' '),
        transformOrigin: '0 0',
        transformStyle: 'preserve-3d',
        ...style,
      }}
    >
      {children}
    </div>
  </AbsoluteFill>
);

/**
 * Where a point of the screen lands in the frame, under a given camera.
 *
 * The inverse of what <Stage> does, and the reason it exists: a tap ring, or
 * the centre of a match cut, is authored in the coordinates of the thing it is
 * on — a button, an avatar — but has to be drawn in frame coordinates, outside
 * the Stage. Deriving it from the same three numbers the camera is using means
 * the two cannot drift apart when a shot is retimed or reframed.
 */
export const toFrame = (
  screenX: number,
  screenY: number,
  { scale, focusY, focusX = SCREEN_W / 2, anchorY = 0.5 }: {
    scale: number;
    focusY: number;
    focusX?: number;
    anchorY?: number;
  },
) => ({
  x: 540 + scale * (screenX - focusX),
  y: 1920 * anchorY + scale * (screenY - focusY),
});

/* ------------------------------------------------------------ backdrops -- */

/** The paper ground the product section sits on. */
export const PaperBackdrop: React.FC<{ children?: React.ReactNode }> = ({ children }) => (
  <AbsoluteFill style={{ backgroundColor: color.paper, overflow: 'hidden' }}>{children}</AbsoluteFill>
);

/* ---------------------------------------------------------------- extras -- */

/**
 * The circular match-cut the brief asks for: a dark shape that grows until it
 * owns the frame, then hands over to the next scene. Used once, out of the
 * hook, in place of a flash or a swipe.
 */
export const CircleWipe: React.FC<{
  /** 0 = nothing, 1 = frame filled */
  progress: number;
  fill: string;
  cx?: number;
  cy?: number;
}> = ({ progress, fill, cx = 540, cy = 1120 }) => {
  // the radius that clears the furthest corner from (cx, cy)
  const max = Math.hypot(Math.max(cx, 1080 - cx), Math.max(cy, 1920 - cy));
  return (
    <AbsoluteFill style={{ pointerEvents: 'none' }}>
      <svg width={1080} height={1920}>
        <circle cx={cx} cy={cy} r={max * progress} fill={fill} />
      </svg>
    </AbsoluteFill>
  );
};

/** A soft pulse ring, for the tap. */
export const TapRing: React.FC<{ x: number; y: number; progress: number }> = ({
  x,
  y,
  progress,
}) => {
  if (progress <= 0 || progress >= 1) return null;
  const r = interpolate(progress, [0, 1], [10, 150]);
  const o = interpolate(progress, [0, 0.25, 1], [0, 0.45, 0]);
  return (
    <AbsoluteFill style={{ pointerEvents: 'none' }}>
      <svg width={1080} height={1920}>
        <circle cx={x} cy={y} r={r} fill="none" stroke={color.blue} strokeWidth={6} opacity={o} />
        <circle cx={x} cy={y} r={r * 0.55} fill={color.blue} opacity={o * 0.35} />
      </svg>
    </AbsoluteFill>
  );
};

/** Scene-relative seconds. Every scene starts by calling this. */
export const useSceneSeconds = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  return { t: frame / fps, frame, fps };
};
