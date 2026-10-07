import React from 'react';
import { Text, type TextProps, type TextStyle, type StyleProp } from 'react-native';
import { color, font, tracking } from '../theme';

type FontKey = keyof typeof font;

type Props = TextProps & {
  /** which face — 'display' is Bricolage 700, everything else is Instrument Sans */
  f?: FontKey;
  size?: number;
  /** letter-spacing straight from the CSS, in em; converted to points here */
  em?: number;
  /** line-height as a multiplier, as the CSS states it */
  lh?: number;
  c?: string;
  align?: TextStyle['textAlign'];
  style?: StyleProp<TextStyle>;
};

/**
 * Every string in this app goes through <Txt>. React Native crashes on bare text
 * nodes, and the HTML source is full of them — this is the safety net.
 */
export function Txt({
  f = 'medium',
  size = 14,
  em,
  lh,
  c = color.ink,
  align,
  style,
  children,
  ...rest
}: Props) {
  return (
    <Text
      {...rest}
      style={[
        {
          fontFamily: font[f],
          fontSize: size,
          color: c,
          ...(em != null ? { letterSpacing: tracking(size, em) } : null),
          ...(lh != null ? { lineHeight: Math.round(size * lh) } : null),
          ...(align ? { textAlign: align } : null),
        },
        style,
      ]}
    >
      {children}
    </Text>
  );
}

/** 11px / 700 / 0.09em uppercase, ink-muted — the one section-head mechanism. */
export function SectionHead({
  children,
  size = 11,
  c = color.inkMuted,
  style,
}: {
  children: React.ReactNode;
  size?: number;
  c?: string;
  style?: StyleProp<TextStyle>;
}) {
  return (
    <Txt f="bold" size={size} em={0.09} c={c} style={style}>
      {children}
    </Txt>
  );
}
