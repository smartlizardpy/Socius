import React from 'react';
import { Img } from 'remotion';

import { ICON_PATHS, type IconName } from '../icons';
import { face, type FaceKey } from '../fonts';
import { color, radius, tracking } from '../theme';

/* ------------------------------------------------------------------ text -- */

type TxtProps = {
  /** which face — 'display' is Bricolage 700, everything else is Instrument Sans */
  f?: FaceKey;
  size?: number;
  /** letter-spacing straight from the app, in em */
  em?: number;
  /** line-height as a multiplier, as the app states it */
  lh?: number;
  c?: string;
  style?: React.CSSProperties;
  children?: React.ReactNode;
};

/** The app's <Txt>, as a div. Same props, same defaults. */
export const Txt: React.FC<TxtProps> = ({
  f = 'medium',
  size = 14,
  em,
  lh,
  c = color.ink,
  style,
  children,
}) => (
  <div
    style={{
      ...face[f],
      fontSize: size,
      color: c,
      ...(em != null ? { letterSpacing: tracking(size, em) } : null),
      ...(lh != null ? { lineHeight: `${Math.round(size * lh)}px` } : null),
      ...style,
    }}
  >
    {children}
  </div>
);

/** 11px / 700 / 0.09em uppercase, ink-muted — the one section-head mechanism. */
export const SectionHead: React.FC<{
  size?: number;
  c?: string;
  style?: React.CSSProperties;
  children?: React.ReactNode;
}> = ({ size = 11, c = color.inkMuted, style, children }) => (
  <Txt f="bold" size={size} em={0.09} c={c} style={style}>
    {children}
  </Txt>
);

/* ----------------------------------------------------------------- icons -- */

/** Phosphor, one set throughout — the app's <Icon>, unchanged. */
export const Icon: React.FC<{ name: IconName; size: number; color?: string }> = ({
  name,
  size,
  color: fill = color.ink,
}) => (
  <svg width={size} height={size} viewBox="0 0 256 256" style={{ display: 'block', flexShrink: 0 }}>
    {ICON_PATHS[name].map((d, i) => (
      <path key={i} d={d} fill={fill} />
    ))}
  </svg>
);

/* ----------------------------------------------------------------- rows --- */

/** flex-row with the app's default cross-axis alignment. Saves a lot of noise. */
export const Row: React.FC<{ gap?: number; style?: React.CSSProperties; children?: React.ReactNode }> = ({
  gap = 0,
  style,
  children,
}) => (
  <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', gap, ...style }}>
    {children}
  </div>
);

/* --------------------------------------------------------------- avatars -- */

export const Avatar: React.FC<{
  src: string;
  size: number;
  /** the 2px ring the mockups draw in the page background colour */
  ring?: string;
  style?: React.CSSProperties;
}> = ({ src, size, ring, style }) => (
  <Img
    src={src}
    style={{
      width: size,
      height: size,
      borderRadius: radius.pill,
      objectFit: 'cover',
      flexShrink: 0,
      ...(ring ? { border: `2px solid ${ring}`, boxSizing: 'border-box' } : null),
      ...style,
    }}
  />
);

/** Overlapping avatar row. The mockups overlap by 10–11px at 32–34px. */
export const AvatarStack: React.FC<{
  faces: string[];
  size: number;
  ring: string;
  overlap: number;
}> = ({ faces, size, ring, overlap }) => (
  <div style={{ display: 'flex', flexDirection: 'row' }}>
    {faces.map((f, i) => (
      <Avatar key={i} src={f} size={size} ring={ring} style={i > 0 ? { marginLeft: -overlap } : undefined} />
    ))}
  </div>
);

/** The stand-in for you, wherever the design ships no avatar of your own. */
export const YouAvatar: React.FC<{ size: number; ring?: string }> = ({ size, ring }) => (
  <div
    style={{
      width: size,
      height: size,
      borderRadius: radius.pill,
      backgroundColor: color.ink,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      boxSizing: 'border-box',
      flexShrink: 0,
      ...(ring ? { border: `2px solid ${ring}` } : null),
    }}
  >
    <Icon name="user-fill" size={size * 0.5} color={color.surface} />
  </div>
);

/* ----------------------------------------------------------------- pills -- */

export const Chip: React.FC<{
  label: string;
  icon?: IconName | null;
  active?: boolean;
  height?: number;
  size?: number;
  style?: React.CSSProperties;
}> = ({ label, icon, active = false, height = 36, size = 13, style }) => {
  const bg = active ? color.ink : color.surface;
  const fg = active ? color.surface : color.ink;
  const iconColor = active ? fg : color.blue;

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        gap: icon ? 7 : 0,
        height,
        padding: '0 13px',
        borderRadius: radius.pill,
        backgroundColor: bg,
        boxSizing: 'border-box',
        flexShrink: 0,
        ...(active ? null : { border: `1px solid ${color.lineOnPaper}` }),
        ...style,
      }}
    >
      {icon ? <Icon name={icon} size={Math.round(size * 1.22)} color={iconColor} /> : null}
      <Txt f={active ? 'bold' : 'semibold'} size={size} c={fg}>
        {label}
      </Txt>
    </div>
  );
};

/** The orange "2 KİŞİLİK YER" pill. */
export const UrgencyPill: React.FC<{ label: string; height?: number; size?: number }> = ({
  label,
  height = 26,
  size = 11,
}) => (
  <div
    style={{
      display: 'flex',
      alignItems: 'center',
      height,
      padding: `0 ${height >= 26 ? 10 : 7}px`,
      borderRadius: radius.pill,
      backgroundColor: color.orange,
      flexShrink: 0,
    }}
  >
    <Txt f="bold" size={size} em={0.06} c={color.ink}>
      {label}
    </Txt>
  </div>
);

/** The blue-tint "KATILDIN" state pill. */
export const StatePill: React.FC<{
  label: string;
  height?: number;
  size?: number;
  tone?: 'blue' | 'orangeTint';
}> = ({ label, height = 26, size = 11, tone = 'blue' }) => {
  const bg = tone === 'blue' ? color.blueTint : color.orangeTint;
  const fg = tone === 'blue' ? color.blueDeep : color.ink;
  return (
    <div
      style={{
        height,
        padding: '0 10px',
        borderRadius: radius.pill,
        backgroundColor: bg,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexShrink: 0,
      }}
    >
      <Txt f="bold" size={size} em={0.05} c={fg}>
        {label}
      </Txt>
    </div>
  );
};

/* --------------------------------------------------------------- surface -- */

export const Card: React.FC<{
  r?: number;
  style?: React.CSSProperties;
  children?: React.ReactNode;
}> = ({ r = radius.card, style, children }) => (
  <div
    style={{
      backgroundColor: color.surface,
      border: `1px solid ${color.lineOnSurface}`,
      borderRadius: r,
      boxSizing: 'border-box',
      ...style,
    }}
  >
    {children}
  </div>
);

/* ---------------------------------------------------------------- levels -- */

/** mobile/src/components/ui.tsx — the rail runs 1 to 7. */
export const RAIL_MIN = 1;
export const RAIL_MAX = 7;
export const railPct = (level: number) =>
  Math.min(1, Math.max(0, (level - RAIL_MIN) / (RAIL_MAX - RAIL_MIN)));

/** Five glyphs, filled to `n`. */
export const LevelStars: React.FC<{ n: number; size?: number; max?: number; gap?: number }> = ({
  n,
  size = 13,
  max = 5,
  gap = 1.5,
}) => (
  <div style={{ display: 'flex', flexDirection: 'row', gap }}>
    {Array.from({ length: max }, (_, i) => (
      <Icon
        key={i}
        name={i < n ? 'star-fill' : 'star'}
        size={size}
        color={i < n ? color.blue : color.railTrack}
      />
    ))}
  </div>
);

/** The compact form: one star glyph and the range. */
export const StarRange: React.FC<{ lo: number; hi: number; size?: number; c?: string }> = ({
  lo,
  hi,
  size = 11,
  c = color.ink,
}) => (
  <Row gap={4}>
    <Icon name="star-fill" size={size} color={color.blue} />
    <Txt f="bold" size={size} c={c}>
      {lo === hi ? String(lo) : `${lo}–${hi}`}
    </Txt>
  </Row>
);

/**
 * Where you sit in a game's level band.
 *
 * The app animates the marker in with a landing spring on mount; `settle` is
 * that same 0–1, handed in so the film can land it on a beat.
 */
export const LevelRail: React.FC<{ min: number; max: number; you: number; settle?: number }> = ({
  min,
  max,
  you,
  settle = 1,
}) => (
  <div style={{ position: 'relative', flexGrow: 1, flexShrink: 1, height: 16, minWidth: 0 }}>
    <div
      style={{
        position: 'absolute',
        top: 6,
        left: 0,
        right: 0,
        height: 4,
        borderRadius: radius.pill,
        backgroundColor: color.lineOnPaper,
      }}
    />
    <div
      style={{
        position: 'absolute',
        top: 6,
        left: `${railPct(min) * 100}%`,
        width: `${(railPct(max) - railPct(min)) * 100}%`,
        height: 4,
        borderRadius: radius.pill,
        backgroundColor: color.blue,
      }}
    />
    {/* orange core inside a 3px white ring — the source's box-shadow */}
    <div
      style={{
        position: 'absolute',
        top: 0,
        left: `calc(${railPct(you) * settle * 100}% - 8.5px)`,
        width: 17,
        height: 17,
        borderRadius: radius.pill,
        backgroundColor: color.orange,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        opacity: settle,
      }}
    >
      <div
        style={{
          width: 14,
          height: 14,
          borderRadius: radius.pill,
          border: `3px solid ${color.surface}`,
          backgroundColor: color.orange,
          boxSizing: 'border-box',
        }}
      />
    </div>
  </div>
);

/** The circular controls over a hero photo. */
export const RoundButton: React.FC<{ icon: IconName; size?: number; d?: number }> = ({
  icon,
  size = 18,
  d = 40,
}) => (
  <div
    style={{
      width: d,
      height: d,
      borderRadius: radius.pill,
      backgroundColor: color.surface,
      border: `1px solid ${color.lineOnPaper}`,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      boxSizing: 'border-box',
      flexShrink: 0,
    }}
  >
    <Icon name={icon} size={size} color={color.ink} />
  </div>
);
