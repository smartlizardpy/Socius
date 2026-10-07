import React, { useEffect, useRef, useState } from 'react';
import { color, radius, gutter, motion } from '../../theme';
import { Icon, type IconName } from '../../Icon';
import { Txt } from '../Txt';
import { Animated, landSpring, ease, useSharedValue, useAnimatedStyle, useReducedMotion, withSpring, withTiming } from '../motion';

/* ----------------------------------------------------------------- toast -- */

/**
 * The one transient confirmation. Ink pill, 44px tall, sits above the tab bar and
 * clears itself — it never blocks a control, so it needs no dismiss.
 */
export function Toast({
  message,
  icon = 'check',
  bottom,
}: {
  message: string | null;
  icon?: IconName;
  bottom: number;
}) {
  const reduced = useReducedMotion();
  const opacity = useSharedValue(0);
  const y = useSharedValue(10);

  useEffect(() => {
    if (message) {
      opacity.value = withTiming(1, { duration: reduced ? motion.reduced : motion.feedback, easing: ease });
      y.value = reduced ? 0 : withSpring(0, landSpring);
    } else {
      opacity.value = withTiming(0, { duration: motion.feedback, easing: ease });
      y.value = withTiming(10, { duration: motion.feedback, easing: ease });
    }
  }, [message, reduced]);

  const animated = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [{ translateY: y.value }],
  }));

  if (!message) return null;

  return (
    <Animated.View
      pointerEvents="none"
      accessibilityLiveRegion="polite"
      style={[
        {
          position: 'absolute',
          left: gutter,
          right: gutter,
          bottom,
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 9,
          minHeight: 44,
          paddingHorizontal: 18,
          paddingVertical: 11,
          borderRadius: radius.pill,
          backgroundColor: color.ink,
          shadowColor: '#101A2B',
          shadowOffset: { width: 0, height: 10 },
          shadowOpacity: 0.28,
          shadowRadius: 18,
          elevation: 10,
        },
        animated,
      ]}
    >
      <Icon name={icon} size={17} color={color.surface} />
      <Txt f="semibold" size={14} c={color.surface} style={{ flexShrink: 1 }}>
        {message}
      </Txt>
    </Animated.View>
  );
}

/** Drives a Toast: `const [msg, show] = useToast()`. */
export function useToast(ms = 2200) {
  const [message, setMessage] = useState<string | null>(null);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const show = React.useCallback(
    (m: string) => {
      if (timer.current) clearTimeout(timer.current);
      setMessage(m);
      timer.current = setTimeout(() => setMessage(null), ms);
    },
    [ms],
  );

  useEffect(() => () => { if (timer.current) clearTimeout(timer.current); }, []);

  return [message, show] as const;
}
