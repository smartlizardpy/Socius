import React from 'react';
import { AbsoluteFill, Img, staticFile, useCurrentFrame, useVideoConfig } from 'remotion';

/**
 * The photographic stand-in for the UGC plates.
 *
 * The photograph is the app's own `card-pitch.jpg` — the floodlit pitch the
 * halı saha match is carded with in the product, and the only real halı saha
 * photograph in this repository. At 620×360 it cannot fill a 1080×1920 frame:
 * covering the frame would mean a 5× upscale, which is why the first attempt at
 * this had to hide behind so much blur that the photograph stopped being one.
 *
 * So it is not asked to cover. It is laid in as a wide plate across the middle
 * of the frame at roughly 1.7× — soft, but legibly a photograph — and the rest
 * of the frame is filled by the same image blown out and blurred behind it,
 * feathered so the two meet without an edge. That is a real letterboxed phone
 * frame, not a compromise, and the pitch stays recognisably a pitch.
 *
 * Drop a clip or a still into `public/ugc/` and none of this is drawn.
 */

export const PITCH_PHOTO = staticFile('img/card-pitch.jpg');

/** The handheld wobble a phone camera has. Sum of sines, so it never loops. */
export const handheld = (frame: number, fps: number, amount = 1) => {
  const t = frame / fps;
  return {
    x: (Math.sin(t * 1.7) * 6 + Math.sin(t * 0.61 + 1.2) * 9) * amount,
    y: (Math.cos(t * 1.31 + 0.4) * 5 + Math.sin(t * 0.47) * 7) * amount,
    rotate: (Math.sin(t * 0.83 + 2.1) * 0.35 + Math.sin(t * 0.29) * 0.25) * amount,
    scale: 1 + Math.sin(t * 0.53 + 0.8) * 0.006 * amount,
  };
};

/** The sharp plate's height at 1080 wide, from the source's 620×360. */
const PLATE_H = Math.round((1080 * 360) / 620); // 627

export const PitchPlate: React.FC<{
  /** 0 = locked off, 1 = full handheld */
  shake?: number;
  /** pushes the plate in across the shot */
  push?: number;
  /** where the sharp plate sits vertically, 0–1 of the frame */
  center?: number;
}> = ({ shake = 1, push = 0, center = 0.46 }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const h = handheld(frame, fps, shake);
  const t = frame / fps;

  const drift = `translate(${h.x}px, ${h.y}px) rotate(${h.rotate}deg) scale(${
    h.scale * (1 + push * 0.16)
  })`;

  return (
    <AbsoluteFill style={{ overflow: 'hidden', backgroundColor: '#0A1B33' }}>
      {/* the same frame, blown up and thrown away, to fill the tall edges */}
      <AbsoluteFill style={{ transform: drift }}>
        <Img
          src={PITCH_PHOTO}
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            filter: 'blur(46px) saturate(1.3) brightness(1.5)',
            transform: 'scale(1.35)',
          }}
        />
      </AbsoluteFill>

      {/* the photograph itself, wide across the middle */}
      <AbsoluteFill style={{ transform: drift }}>
        <Img
          src={PITCH_PHOTO}
          style={{
            position: 'absolute',
            left: 0,
            top: 1920 * center - PLATE_H / 2,
            width: 1080,
            height: PLATE_H,
            objectFit: 'cover',
            // a touch of softness for the upscale, and a lift so the night
            // photograph reads at phone brightness rather than as a black frame
            filter: 'blur(1.6px) saturate(1.18) contrast(1.05) brightness(1.34)',
            // feathered top and bottom, so it sits into the blurred fill
            maskImage:
              'linear-gradient(180deg, transparent 0%, #000 13%, #000 87%, transparent 100%)',
            WebkitMaskImage:
              'linear-gradient(180deg, transparent 0%, #000 13%, #000 87%, transparent 100%)',
          }}
        />
      </AbsoluteFill>

      {/* the floodlight bloom, drifting, so the still photograph is not static */}
      <AbsoluteFill
        style={{
          background: `radial-gradient(44% 22% at ${50 + Math.sin(t * 0.33) * 5}% ${
            center * 100 - 3 + Math.cos(t * 0.27) * 2
          }%, rgba(255,240,205,0.26), rgba(255,240,205,0) 70%)`,
          mixBlendMode: 'screen',
        }}
      />

      {/* blue-hour grade, and the falloff a wide phone lens gives you */}
      <AbsoluteFill
        style={{
          background:
            'linear-gradient(180deg, rgba(6,18,44,0.52) 0%, rgba(10,32,74,0.10) 30%, rgba(8,28,58,0.10) 66%, rgba(4,12,28,0.62) 100%)',
        }}
      />
      <AbsoluteFill
        style={{
          background:
            'radial-gradient(80% 52% at 50% 46%, rgba(0,0,0,0) 46%, rgba(2,8,20,0.26) 80%, rgba(2,8,20,0.52) 100%)',
        }}
      />
    </AbsoluteFill>
  );
};

/** Film grain, so the treated photograph does not read as a flat gradient. */
export const Grain: React.FC<{ opacity?: number }> = ({ opacity = 0.07 }) => {
  const frame = useCurrentFrame();
  // one of four static fields, swapped every other frame — cheap, and it moves
  const field = frame % 4;
  return (
    <svg
      width={1080}
      height={1920}
      style={{ position: 'absolute', inset: 0, opacity, mixBlendMode: 'overlay' }}
    >
      <filter id={`grain-${field}`}>
        <feTurbulence type="fractalNoise" baseFrequency="0.85" numOctaves={2} seed={field} />
      </filter>
      <rect width={1080} height={1920} filter={`url(#grain-${field})`} />
    </svg>
  );
};
