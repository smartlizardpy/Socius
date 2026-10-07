import React from 'react';
import { View, type StyleProp, type ViewStyle } from 'react-native';
import { color, radius, blueGlow } from '../../theme';
import { Icon, type IconName } from '../Icon';
import { Txt } from '../Txt';
import { PressScale } from '../motion';

/* ---------------------------------------------------------------- buttons -- */

export function PrimaryButton({
  label,
  onPress,
  height = 54,
  size = 16,
  icon = 'arrow-right',
  iconSize = 18,
  /** a trailing arrow points onward; a brand mark belongs before the verb */
  iconLeading = false,
  glow = false,
  disabled = false,
  style,
}: {
  label: string;
  onPress?: () => void;
  height?: number;
  size?: number;
  icon?: IconName | null;
  iconSize?: number;
  iconLeading?: boolean;
  glow?: boolean;
  disabled?: boolean;
  style?: StyleProp<ViewStyle>;
}) {
  const mark = icon ? <Icon name={icon} size={iconSize} color={color.onBlue} /> : null;
  return (
    <PressScale
      onPress={disabled ? undefined : onPress}
      haptic="light"
      accessibilityRole="button"
      accessibilityLabel={label}
      accessibilityState={{ disabled }}
      style={[
        {
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 8,
          height,
          borderRadius: radius.pill,
          backgroundColor: color.blue,
          opacity: disabled ? 0.4 : 1,
        },
        glow && !disabled ? blueGlow : null,
        style,
      ]}
    >
      {iconLeading ? mark : null}
      {/* blue fills always carry white text — ink on blue is banned */}
      <Txt f="semibold" size={size} em={-0.01} c={color.onBlue}>
        {label}
      </Txt>
      {iconLeading ? null : mark}
    </PressScale>
  );
}

/** The outlined twin of PrimaryButton — Invite, Leave, secondary actions. */
export function GhostButton({
  label,
  onPress,
  icon,
  iconSize = 18,
  leading,
  height = 52,
  size = 16,
  tone = 'ink',
  style,
}: {
  label: string;
  onPress?: () => void;
  icon?: IconName | null;
  iconSize?: number;
  /** a drawn mark instead of a Phosphor glyph — brand logos are not in the set */
  leading?: React.ReactNode;
  height?: number;
  size?: number;
  tone?: 'ink' | 'muted';
  style?: StyleProp<ViewStyle>;
}) {
  const c = tone === 'ink' ? color.ink : color.inkMuted;
  return (
    <PressScale
      onPress={onPress}
      haptic="light"
      accessibilityRole="button"
      accessibilityLabel={label}
      style={[
        {
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 8,
          height,
          borderRadius: radius.pill,
          backgroundColor: color.surface,
          borderWidth: tone === 'ink' ? 1.5 : 1,
          borderColor: tone === 'ink' ? color.ink : color.lineOnPaper,
        },
        style,
      ]}
    >
      {leading ?? (icon ? <Icon name={icon} size={iconSize} color={c} /> : null)}
      <Txt f="semibold" size={size} c={c}>
        {label}
      </Txt>
    </PressScale>
  );
}

/** 44px circular control — back, close, bell. */
export function RoundButton({
  icon,
  size = 20,
  onPress,
  onSurface = false,
  shadow = false,
  label,
  tone = color.ink,
  children,
}: {
  icon: IconName;
  size?: number;
  onPress?: () => void;
  /** true when it sits on a white card rather than paper */
  onSurface?: boolean;
  shadow?: boolean;
  label?: string;
  tone?: string;
  children?: React.ReactNode;
}) {
  return (
    <PressScale
      onPress={onPress}
      to={0.94}
      accessibilityRole="button"
      accessibilityLabel={label}
      style={[
        {
          width: 44,
          height: 44,
          borderRadius: radius.pill,
          backgroundColor: color.surface,
          alignItems: 'center',
          justifyContent: 'center',
        },
        shadow
          ? {
              shadowColor: '#101A2B',
              shadowOffset: { width: 0, height: 4 },
              shadowOpacity: 0.22,
              shadowRadius: 8,
              elevation: 4,
            }
          : { borderWidth: 1, borderColor: onSurface ? color.lineOnSurface : color.lineOnPaper },
      ]}
    >
      <Icon name={icon} size={size} color={tone} />
      {children}
    </PressScale>
  );
}

/** The bell, with the unread dot the mockups draw over it. */
export function BellButton({ unread, onPress }: { unread: boolean; onPress?: () => void }) {
  return (
    <RoundButton icon={unread ? 'bell-ringing' : 'bell'} size={19} onPress={onPress} label="Notifications">
      {unread ? (
        <View
          style={{
            position: 'absolute',
            top: 9,
            right: 10,
            width: 8,
            height: 8,
            borderRadius: radius.pill,
            backgroundColor: color.orange,
            borderWidth: 2,
            borderColor: color.surface,
          }}
        />
      ) : null}
    </RoundButton>
  );
}
