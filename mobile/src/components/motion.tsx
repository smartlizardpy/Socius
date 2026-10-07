import React, { useEffect } from 'react';
import { Pressable, View, type PressableProps, type StyleProp, type ViewStyle } from 'react-native';
import * as Haptics from 'expo-haptics';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  useReducedMotion,
  withSpring,
  withTiming,
  withDelay,
  Easing,
} from 'react-native-reanimated';
import { motion } from '../theme';

/** The standard ease for everything that is not physical. */
export const ease = Easing.bezier(0.2, 0, 0, 1);

/** Springs for the two things that should feel physical. */
export const pressSpring = { damping: 18, stiffness: 320, mass: 0.6 } as const;
export const landSpring = { damping: 14, stiffness: 180, mass: 0.9 } as const;

/**
 * Cards fade and rise 12px, staggered 45ms, capped at the first 6 items.
 * Entrance only — the shared values are seeded once and never re-run on re-render.
 * Under reduced motion this collapses to a 150ms crossfade, never to nothing.
 */
export function EnterUp({
  index = 0,
  children,
  style,
}: {
  index?: number;
  children: React.ReactNode;
  style?: StyleProp<ViewStyle>;
}) {
  const reduced = useReducedMotion();
  const opacity = useSharedValue(0);
  const y = useSharedValue(reduced ? 0 : 12);

  useEffect(() => {
    const delay = Math.min(index, motion.staggerCap) * motion.stagger;
    if (reduced) {
      opacity.value = withDelay(delay, withTiming(1, { duration: motion.reduced }));
      return;
    }
    opacity.value = withDelay(delay, withTiming(1, { duration: motion.spatial, easing: ease }));
    y.value = withDelay(delay, withTiming(0, { duration: motion.spatial, easing: ease }));
    // mount only
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const animated = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [{ translateY: y.value }],
  }));

  return <Animated.View style={[style, animated]}>{children}</Animated.View>;
}

/**
 * Crossfades whenever its child changes — used for the counters that move when you
 * join. Information-carrying, 180ms, no movement.
 */
export function Swap({ value, children }: { value: string | number; children: React.ReactNode }) {
  const reduced = useReducedMotion();
  const opacity = useSharedValue(1);
  const first = React.useRef(true);

  useEffect(() => {
    if (first.current) {
      first.current = false;
      return;
    }
    opacity.value = 0;
    opacity.value = withTiming(1, { duration: reduced ? motion.reduced : motion.feedback, easing: ease });
  }, [value]);

  const animated = useAnimatedStyle(() => ({ opacity: opacity.value }));
  return <Animated.View style={animated}>{children}</Animated.View>;
}

type PressScaleProps = PressableProps & {
  children: React.ReactNode;
  style?: StyleProp<ViewStyle>;
  /** press feedback strength — buttons go to 0.97, no overshoot */
  to?: number;
  haptic?: 'light' | 'medium' | 'selection' | 'none';
  /**
   * The height this control is *drawn* at, when that is under the 44px floor.
   * Given it, the press target pads out to 44 around the drawn box and pulls
   * itself back with a negative margin, so nothing on the screen moves.
   */
  drawnHeight?: number;
};

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

/**
 * Press scales to 0.97 on a spring. No overshoot on buttons — the spring is
 * critically damped enough that it settles rather than bounces.
 *
 * The style lands on the Pressable itself, not on an inner wrapper: the Pressable
 * is the flex child, so anything laid out with flex/width has to be styled here or
 * it collapses to its content width.
 */
/** The lock's touch floor. Anything drawn shorter pads out to meet it. */
export const TARGET_FLOOR = 44;

function fireHaptic(haptic: string) {
  if (haptic === 'light') Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  else if (haptic === 'medium') Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
  else if (haptic === 'selection') Haptics.selectionAsync();
}

export function PressScale({
  children,
  style,
  to = 0.97,
  haptic = 'selection',
  onPress,
  drawnHeight,
  ...rest
}: PressScaleProps) {
  const reduced = useReducedMotion();
  const scale = useSharedValue(1);

  const animated = useAnimatedStyle(() => ({ transform: [{ scale: scale.value }] }));

  // A control drawn shorter than the 44px floor keeps its drawn size and grows a
  // transparent target around it. Padding rather than hitSlop, which
  // react-native-web does not implement at all — the box has to be real.
  // Note: a negative margin is clipped by an ancestor with overflow hidden, so a
  // fixed-height scroll rail has to leave room for the full 44.
  const pad = drawnHeight ? Math.max(0, (TARGET_FLOOR - drawnHeight) / 2) : 0;

  if (pad > 0) {
    return (
      <AnimatedPressable
        {...rest}
        style={[{ paddingVertical: pad, marginVertical: -pad }, animated]}
        onPressIn={(e) => {
          if (!reduced) scale.value = withSpring(to, pressSpring);
          rest.onPressIn?.(e);
        }}
        onPressOut={(e) => {
          if (!reduced) scale.value = withSpring(1, pressSpring);
          rest.onPressOut?.(e);
        }}
        onPress={(e) => {
          fireHaptic(haptic);
          onPress?.(e);
        }}
      >
        <View style={style}>{children}</View>
      </AnimatedPressable>
    );
  }

  return (
    <AnimatedPressable
      {...rest}
      style={[style, animated]}
      onPressIn={(e) => {
        if (!reduced) scale.value = withSpring(to, pressSpring);
        rest.onPressIn?.(e);
      }}
      onPressOut={(e) => {
        if (!reduced) scale.value = withSpring(1, pressSpring);
        rest.onPressOut?.(e);
      }}
      onPress={(e) => {
        fireHaptic(haptic);
        onPress?.(e);
      }}
    >
      {children}
    </AnimatedPressable>
  );
}

export { Animated, useSharedValue, useAnimatedStyle, useReducedMotion, withSpring, withTiming, withDelay };
