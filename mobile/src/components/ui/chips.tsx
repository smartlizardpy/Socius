import React from 'react';
import { View, type StyleProp, type ViewStyle } from 'react-native';
import { color, radius } from '../../theme';
import { Icon, type IconName } from '../../Icon';
import { Txt } from '../Txt';
import { PressScale } from '../motion';

/* ------------------------------------------------------------------ chips -- */

/**
 * The one pill in the system. Ink fill when on, white with a hairline when off —
 * used for sport filters, search facets, profile sports and the create form.
 */
export function Chip({
  label,
  icon,
  active = false,
  onPress,
  height = 36,
  size = 13,
  trailing,
  tone = 'ink',
  style,
}: {
  label: string;
  icon?: IconName | null;
  active?: boolean;
  onPress?: () => void;
  height?: number;
  size?: number;
  trailing?: React.ReactNode;
  /** 'ink' fills with ink when active; 'blue' fills with the blue tint */
  tone?: 'ink' | 'blue';
  style?: StyleProp<ViewStyle>;
}) {
  const bg = active ? (tone === 'ink' ? color.ink : color.blueTint) : color.surface;
  const fg = active ? (tone === 'ink' ? color.surface : color.blueDeep) : color.ink;
  const iconColor = active ? fg : color.blue;

  const body = (
    <>
      {icon ? <Icon name={icon} size={Math.round(size * 1.22)} color={iconColor} /> : null}
      <Txt f={active ? 'bold' : 'semibold'} size={size} c={fg}>
        {label}
      </Txt>
      {trailing}
    </>
  );

  const shell: ViewStyle = {
    flexDirection: 'row',
    alignItems: 'center',
    gap: icon || trailing ? 7 : 0,
    height,
    paddingHorizontal: 13,
    borderRadius: radius.pill,
    backgroundColor: bg,
    ...(active ? null : { borderWidth: 1, borderColor: color.lineOnPaper }),
  };

  if (!onPress) return <View style={[shell, style]}>{body}</View>;

  // The deck draws chips at 36–38; the lock puts the touch floor at 44. Both hold:
  // the pill keeps its drawn height and the pressable pads out around it. Padding
  // rather than hitSlop because react-native-web ignores hitSlop entirely.
  const pad = Math.max(0, (44 - height) / 2);

  return (
    <PressScale
      onPress={onPress}
      to={0.96}
      accessibilityRole="button"
      accessibilityState={{ selected: active }}
      accessibilityLabel={label}
      style={[{ paddingVertical: pad, marginVertical: -pad }, style]}
    >
      <View style={shell}>{body}</View>
    </PressScale>
  );
}

/** Orange pills always carry ink text — white on orange fails contrast. */
export function UrgencyPill({
  label,
  height = 26,
  size = 11,
}: {
  label: string;
  height?: number;
  size?: number;
}) {
  return (
    <View
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        height,
        paddingHorizontal: height >= 26 ? 10 : 7,
        borderRadius: radius.pill,
        backgroundColor: color.orange,
      }}
    >
      <Txt f="bold" size={size} em={0.06} c={color.ink}>
        {label}
      </Txt>
    </View>
  );
}

/** The blue-tint "YOU'RE IN" / "PLAYED" state pill. */
export function StatePill({
  label,
  height = 26,
  size = 11,
  tone = 'blue',
}: {
  label: string;
  height?: number;
  size?: number;
  tone?: 'blue' | 'orangeTint' | 'plain';
}) {
  const bg =
    tone === 'blue' ? color.blueTint : tone === 'orangeTint' ? color.orangeTint : color.paper;
  const fg = tone === 'blue' ? color.blueDeep : color.ink;
  return (
    <View
      style={{
        height,
        paddingHorizontal: 10,
        borderRadius: radius.pill,
        backgroundColor: bg,
        alignItems: 'center',
        justifyContent: 'center',
        ...(tone === 'plain' ? { borderWidth: 1, borderColor: color.lineOnSurface } : null),
      }}
    >
      <Txt f="bold" size={size} em={0.05} c={fg}>
        {label}
      </Txt>
    </View>
  );
}

/** The small neutral fact pill on list cards — "Levels 4.0–6.0". */
export function MetaPill({ label, tone = 'plain' }: { label: string; tone?: 'plain' | 'orange' }) {
  return (
    <View
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        height: 24,
        paddingHorizontal: 9,
        borderRadius: radius.pill,
        backgroundColor: tone === 'orange' ? color.orangeTint : color.paper,
        ...(tone === 'orange' ? null : { borderWidth: 1, borderColor: color.lineOnSurface }),
      }}
    >
      <Txt f={tone === 'orange' ? 'bold' : 'semibold'} size={11} c={color.ink}>
        {label}
      </Txt>
    </View>
  );
}
