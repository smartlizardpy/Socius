import React from 'react';
import { View, type StyleProp, type ViewStyle } from 'react-native';
import { color, radius, elevation } from '../../theme';
import { PressScale } from '../motion';

/* ------------------------------------------------------------------ cards -- */

export function Card({
  children,
  style,
  raised = false,
  r = radius.card,
}: {
  children: React.ReactNode;
  style?: StyleProp<ViewStyle>;
  raised?: boolean;
  r?: number;
}) {
  return (
    <View
      style={[
        {
          backgroundColor: color.surface,
          borderWidth: 1,
          borderColor: color.lineOnSurface,
          borderRadius: r,
        },
        raised ? elevation : null,
        style,
      ]}
    >
      {children}
    </View>
  );
}

/** A pressable card — same shell, with the press spring. */
export function TapCard({
  children,
  onPress,
  style,
  raised = false,
  r = radius.card,
  label,
}: {
  children: React.ReactNode;
  onPress?: () => void;
  style?: StyleProp<ViewStyle>;
  raised?: boolean;
  r?: number;
  label?: string;
}) {
  return (
    <PressScale
      onPress={onPress}
      to={0.985}
      haptic="none"
      accessibilityRole="button"
      accessibilityLabel={label}
      style={[
        {
          backgroundColor: color.surface,
          borderWidth: 1,
          borderColor: color.lineOnSurface,
          borderRadius: r,
        },
        raised ? elevation : null,
        style,
      ]}
    >
      {children}
    </PressScale>
  );
}
