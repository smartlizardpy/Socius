import React, { useEffect, useRef } from 'react';
import { View, Pressable, StyleSheet, type StyleProp, type ViewStyle } from 'react-native';
import { withSequence } from 'react-native-reanimated';
import { color, gutter } from '../../theme';
import { Icon } from '../Icon';
import { Txt, SectionHead } from '../Txt';
import { Animated, ease, useSharedValue, useAnimatedStyle, useReducedMotion, withSpring, withTiming } from '../motion';
import * as Haptics from 'expo-haptics';
import { Card } from './card';

/* ------------------------------------------------------------------ data -- */

/**
 * The attendance strip on a profile: one bar per game, the no-show taller and
 * orange. The style lock's rule — a data mark carries its value in height, never
 * in a lighter tint.
 */
export function ReliabilityStrip({ games, noShowAt }: { games: number; noShowAt: number }) {
  const bars = Math.min(games, 41);

  /*
   * One tick per game, always.
   *
   * A "nothing missed" case used to replace the ticks with a single filled rail
   * carrying the streak in white text — which read as a progress bar sitting at
   * 100%, or as a button, and was neither. The reasoning behind it was that a
   * row of identical ticks is a chart shape carrying no information. It is not:
   * the ticks are countable, and with the since/today axis under them they say
   * how many games over what span. The rail is what threw that away, and it left
   * the axis dating nothing.
   */
  return (
    <View
      style={{
        flexDirection: 'row',
        alignItems: 'flex-end',
        justifyContent: 'space-between',
        height: 26,
      }}
      accessibilityRole="image"
      accessibilityLabel={`${bars - (noShowAt >= 0 ? 1 : 0)}/${bars}`}
    >
      {Array.from({ length: bars }, (_, i) => {
        const miss = i === noShowAt;
        return (
          <View
            key={i}
            style={{
              // a dozen games get a tick you can count; forty get a texture
              // that still shows the span, which is all the axis is claiming.
              // The row is justified across the full card either way, because
              // the since/today axis under it spans the card.
              width: bars > 24 ? 5 : bars > 16 ? 9 : 14,
              height: miss ? 26 : 17,
              borderRadius: 2.5,
              backgroundColor: miss ? color.orange : color.blue,
            }}
          />
        );
      })}
    </View>
  );
}

/** The "plays on" week chart. */
export function WeekBars({ values, days }: { values: number[]; days: string[] }) {
  const max = Math.max(...values, 1);
  return (
    <View style={{ flexDirection: 'row', alignItems: 'flex-end', justifyContent: 'space-between', height: 46 }}>
      {values.map((v, i) => (
        <View key={i} style={{ alignItems: 'center', gap: 6 }}>
          <View
            style={{
              width: 13,
              height: Math.max(4, (v / max) * 30),
              borderRadius: 4,
              backgroundColor: color.blue,
            }}
          />
          <Txt f="semibold" size={10} c={color.inkMuted}>
            {days[i]}
          </Txt>
        </View>
      ))}
    </View>
  );
}

/**
 * Level, as stars. Blue, always — orange stars mean a rating, and the two must
 * never be mistaken for each other. Empty stars keep the count readable at a
 * glance without a number beside it.
 */
export function LevelStars({
  n,
  size = 13,
  max = 5,
  tone = color.blue,
  dim = false,
  gap = 1.5,
}: {
  n: number;
  size?: number;
  max?: number;
  tone?: string;
  /** greyed, for a row that is not the chosen one */
  dim?: boolean;
  gap?: number;
}) {
  return (
    <View
      style={{ flexDirection: 'row', gap }}
      accessibilityRole="image"
      accessibilityLabel={`${n} of ${max} stars`}
    >
      {Array.from({ length: max }, (_, i) => (
        <Icon
          key={i}
          name={i < n ? 'star-fill' : 'star'}
          size={size}
          color={i < n ? (dim ? color.inkMuted : tone) : color.railTrack}
        />
      ))}
    </View>
  );
}

/**
 * The compact form: one star glyph and the range, for places where five drawn
 * stars (or ten, for a range) would swamp the row — list pills, meta lines.
 */
export function StarRange({
  lo,
  hi,
  size = 11,
  c = color.ink,
}: {
  lo: number;
  hi: number;
  size?: number;
  c?: string;
}) {
  return (
    <View
      style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}
      accessibilityRole="text"
      accessibilityLabel={lo === hi ? `${lo} stars` : `${lo} to ${hi} stars`}
    >
      <Icon name="star-fill" size={size} color={color.blue} />
      <Txt f="bold" size={size} c={c}>
        {lo === hi ? String(lo) : `${lo}\u2013${hi}`}
      </Txt>
    </View>
  );
}

/**
 * The star control you set your level with — the same tap-a-star interaction the
 * Rate screen uses to score a player, in blue instead of orange because this is a
 * level, not a rating. Each star pops as it fills and taps once, like a ratchet.
 */
export function StarPicker({
  value,
  max = 5,
  size = 40,
  onChange,
  label,
}: {
  value: number;
  max?: number;
  size?: number;
  onChange: (n: number) => void;
  label?: string;
}) {
  return (
    <View
      style={{ flexDirection: 'row', gap: 10 }}
      accessibilityRole="radiogroup"
      accessibilityLabel={label}
    >
      {Array.from({ length: max }, (_, i) => i + 1).map((n) => (
        <PickerStar
          key={n}
          n={n}
          filled={n <= value}
          size={size}
          onPress={() => {
            // one light tap per star as it fills
            const added = n - value;
            const taps = added > 0 ? added : 1;
            for (let i = 0; i < taps; i++) {
              setTimeout(() => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light), i * 45);
            }
            onChange(n);
          }}
        />
      ))}
    </View>
  );
}

function PickerStar({
  n,
  filled,
  size,
  onPress,
}: {
  n: number;
  filled: boolean;
  size: number;
  onPress: () => void;
}) {
  const reduced = useReducedMotion();
  const scale = useSharedValue(1);
  const was = useRef(filled);

  useEffect(() => {
    if (filled && !was.current && !reduced) {
      scale.value = withSequence(
        withTiming(1.25, { duration: 90, easing: ease }),
        withSpring(1, { damping: 18, stiffness: 320, mass: 0.6 }),
      );
    }
    was.current = filled;
  }, [filled, reduced]);

  const animated = useAnimatedStyle(() => ({ transform: [{ scale: scale.value }] }));

  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="radio"
      accessibilityState={{ selected: filled }}
      accessibilityLabel={`${n}`}
      style={{ padding: 3, margin: -3 }}
    >
      <Animated.View style={animated}>
        <Icon
          name={filled ? 'star-fill' : 'star'}
          size={size}
          color={filled ? color.blue : color.railTrack}
        />
      </Animated.View>
    </Pressable>
  );
}

/** "Padel ★★★★" — a sport with its level, used on chips and player cards. */
export function SportLevel({
  label,
  stars,
  size = 13,
  starSize = 12,
  c = color.ink,
  dim = false,
}: {
  label: string;
  stars: number | null;
  size?: number;
  starSize?: number;
  c?: string;
  dim?: boolean;
}) {
  return (
    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
      <Txt f="semibold" size={size} c={c}>
        {label}
      </Txt>
      {stars != null ? <LevelStars n={stars} size={starSize} dim={dim} /> : null}
    </View>
  );
}

/** Five stars at a small size — the rating readout, not the rating control. */
export function StarRow({ value, size = 13 }: { value: number; size?: number }) {
  return (
    <View style={{ flexDirection: 'row', gap: 1 }}>
      {[1, 2, 3, 4, 5].map((n) => (
        <Icon
          key={n}
          name={n <= Math.round(value) ? 'star-fill' : 'star'}
          size={size}
          color={n <= Math.round(value) ? color.orange : color.controlRing}
        />
      ))}
    </View>
  );
}

/** The half-width figure card used in pairs on the profile. */
export function StatCard({
  head,
  children,
  style,
}: {
  head: string;
  children: React.ReactNode;
  style?: StyleProp<ViewStyle>;
}) {
  return (
    // No flex here on purpose: this card is dropped into a row inside an
    // animated wrapper, and a flexBasis set here lands on the wrapper's vertical
    // axis and collapses the card to nothing. The caller sizes it.
    <Card r={22} style={[{ paddingVertical: 14, paddingHorizontal: 16 }, style]}>
      <SectionHead>{head}</SectionHead>
      {children}
    </Card>
  );
}

/** The section head plus an optional action on its right. */
export function SectionRow({
  head,
  action,
  onAction,
  top = 20,
}: {
  head: string;
  action?: string;
  onAction?: () => void;
  top?: number;
}) {
  return (
    <View
      style={{
        flexDirection: 'row',
        alignItems: 'baseline',
        justifyContent: 'space-between',
        gap: 12,
        paddingTop: top,
        paddingHorizontal: gutter,
      }}
    >
      <SectionHead>{head}</SectionHead>
      {action ? (
        <Pressable
          onPress={onAction}
          accessibilityRole="button"
          accessibilityLabel={action}
          // the link reads as 16px of text; the target underneath it is 44
          style={{
            paddingVertical: 14,
            marginVertical: -14,
            paddingHorizontal: 10,
            marginHorizontal: -10,
            justifyContent: 'center',
          }}
        >
          <Txt f="semibold" size={13} c={color.blue}>
            {action}
          </Txt>
        </Pressable>
      ) : null}
    </View>
  );
}

export const hairline = StyleSheet.hairlineWidth;
