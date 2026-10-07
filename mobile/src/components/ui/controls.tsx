import { useEffect } from 'react';
import { View, Pressable } from 'react-native';
import { color, radius } from '../../theme';
import { Icon } from '../../Icon';
import { Txt } from '../Txt';
import { Animated, PressScale, useSharedValue, useAnimatedStyle, useReducedMotion, withSpring } from '../motion';

/* ------------------------------------------------------------- segmented -- */

/** The Upcoming / Played control on the Games screen. */
export function Segmented({
  options,
  value,
  onChange,
}: {
  options: { key: string; label: string }[];
  value: string;
  onChange: (key: string) => void;
}) {
  return (
    <View
      style={{
        flexDirection: 'row',
        gap: 3,
        padding: 4,
        backgroundColor: color.surface,
        borderWidth: 1,
        borderColor: color.lineOnPaper,
        borderRadius: radius.pill,
      }}
    >
      {options.map((o) => {
        const active = o.key === value;
        return (
          <PressScale
            key={o.key}
            onPress={() => onChange(o.key)}
            to={0.98}
            accessibilityRole="tab"
            accessibilityState={{ selected: active }}
            accessibilityLabel={o.label}
            style={{ flexGrow: 1, flexBasis: 0, paddingVertical: 3, marginVertical: -3 }}
          >
            <View
              style={{
                alignItems: 'center',
                justifyContent: 'center',
                height: 38,
                borderRadius: radius.pill,
                backgroundColor: active ? color.ink : 'transparent',
              }}
            >
              <Txt f={active ? 'bold' : 'semibold'} size={14} c={active ? color.surface : color.inkMuted}>
                {o.label}
              </Txt>
            </View>
          </PressScale>
        );
      })}
    </View>
  );
}

/* ---------------------------------------------------------------- toggle -- */

export function Toggle({
  on,
  onChange,
  label,
}: {
  on: boolean;
  onChange: (v: boolean) => void;
  label?: string;
}) {
  const reduced = useReducedMotion();
  const x = useSharedValue(on ? 18 : 0);

  useEffect(() => {
    x.value = reduced ? (on ? 18 : 0) : withSpring(on ? 18 : 0, { damping: 20, stiffness: 300 });
  }, [on, reduced]);

  const knob = useAnimatedStyle(() => ({ transform: [{ translateX: x.value }] }));

  return (
    <Pressable
      onPress={() => onChange(!on)}
      accessibilityRole="switch"
      accessibilityState={{ checked: on }}
      accessibilityLabel={label}
      // the track stays 46x28 as drawn; the target around it clears 44.
      // react-native-web ignores hitSlop, so the box has to be real
      style={{ paddingVertical: 8, marginVertical: -8 }}
    >
      <View
        style={{
          width: 46,
          height: 28,
          borderRadius: radius.pill,
          padding: 3,
          backgroundColor: on ? color.blue : color.railTrack,
          justifyContent: 'center',
        }}
      >
        <Animated.View
          style={[
            { width: 22, height: 22, borderRadius: radius.pill, backgroundColor: color.surface },
            knob,
          ]}
        />
      </View>
    </Pressable>
  );
}

/* --------------------------------------------------------------- stepper -- */

/** The − 4 + control on the Create screen. */
export function Stepper({
  value,
  min = 2,
  max = 24,
  onChange,
  label,
}: {
  value: number;
  min?: number;
  max?: number;
  onChange: (v: number) => void;
  label?: string;
}) {
  const atMin = value <= min;
  const atMax = value >= max;
  return (
    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 14 }}>
      <PressScale
        onPress={() => !atMin && onChange(value - 1)}
        to={0.9}
        accessibilityRole="button"
        accessibilityLabel={`${label ?? 'Value'} down`}
        accessibilityState={{ disabled: atMin }}
        style={{ padding: 7, margin: -7, opacity: atMin ? 0.4 : 1 }}
      >
        <View
          style={{
            width: 30,
            height: 30,
            borderRadius: radius.pill,
            borderWidth: 1.5,
          borderColor: color.controlRing,
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Icon name="minus" size={15} color={color.inkMuted} />
        </View>
      </PressScale>

      <Txt f="display" size={19} em={-0.02} align="center" style={{ minWidth: 22 }}>
        {String(value)}
      </Txt>

      <PressScale
        onPress={() => !atMax && onChange(value + 1)}
        to={0.9}
        accessibilityRole="button"
        accessibilityLabel={`${label ?? 'Value'} up`}
        accessibilityState={{ disabled: atMax }}
        style={{ padding: 7, margin: -7, opacity: atMax ? 0.4 : 1 }}
      >
        <View
          style={{
            width: 30,
            height: 30,
            borderRadius: radius.pill,
            backgroundColor: color.ink,
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Icon name="plus" size={15} color={color.surface} />
        </View>
      </PressScale>
    </View>
  );
}
