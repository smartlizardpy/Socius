import React from 'react';
import { View, type StyleProp, type ViewStyle } from 'react-native';
import { color, radius } from '../../theme';
import { Icon, type IconName } from '../../Icon';
import { Txt } from '../Txt';
import { PressScale } from '../motion';
import { PrimaryButton } from './buttons';

/* --------------------------------------------------------------- list row -- */

/** The When / Where / Format row, and the settings rows on the profile. */
export function ListRow({
  icon,
  label,
  value,
  onPress,
  last = false,
  tone = 'blue',
  right,
  danger = false,
}: {
  icon?: IconName;
  label: string;
  value?: string;
  onPress?: () => void;
  last?: boolean;
  tone?: 'blue' | 'muted';
  right?: React.ReactNode;
  danger?: boolean;
}) {
  const body = (
    <>
      {icon ? (
        <Icon
          name={icon}
          size={19}
          color={danger ? color.orangeDeep : tone === 'blue' ? color.blue : color.inkMuted}
        />
      ) : null}
      <Txt
        f="semibold"
        size={13}
        c={danger ? color.orangeDeep : color.inkMuted}
        style={{ flexGrow: 1, flexShrink: 1 }}
      >
        {label}
      </Txt>
      {value ? (
        <Txt f="bold" size={14.5} em={-0.01} numberOfLines={1} style={{ flexShrink: 1 }}>
          {value}
        </Txt>
      ) : null}
      {right ?? (onPress ? <Icon name="caret-right" size={16} color={color.inkMuted} /> : null)}
    </>
  );

  const shell: ViewStyle = {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    minHeight: 52,
    paddingVertical: 12,
    paddingHorizontal: 16,
    ...(last ? null : { borderBottomWidth: 1, borderBottomColor: color.lineOnSurface }),
  };

  if (!onPress) return <View style={shell}>{body}</View>;
  return (
    <PressScale
      onPress={onPress}
      to={0.99}
      accessibilityRole="button"
      accessibilityLabel={`${label}${value ? `, ${value}` : ''}`}
      style={shell}
    >
      {body}
    </PressScale>
  );
}

/** A group of ListRows in one white card. */
export function RowGroup({ children, style }: { children: React.ReactNode; style?: StyleProp<ViewStyle> }) {
  return (
    <View
      style={[
        {
          backgroundColor: color.surface,
          borderWidth: 1,
          borderColor: color.lineOnSurface,
          borderRadius: radius.card,
          overflow: 'hidden',
        },
        style,
      ]}
    >
      {children}
    </View>
  );
}

/* ------------------------------------------------------------------ notes -- */

/** The blue-tint reassurance note used on Activity, Create, Pay and Course. */
export function Note({
  icon = 'shield-check',
  children,
  align = 'center',
}: {
  icon?: IconName;
  children: React.ReactNode;
  align?: 'center' | 'top';
}) {
  return (
    <View
      style={{
        flexDirection: 'row',
        alignItems: align === 'center' ? 'center' : 'flex-start',
        gap: 11,
        paddingVertical: 13,
        paddingHorizontal: 15,
        borderRadius: radius.mediaLarge,
        backgroundColor: color.blueTint,
      }}
    >
      <Icon name={icon} size={19} color={color.blue} />
      <Txt f="medium" size={12.5} lh={1.45} c={color.blueDeep} style={{ flexShrink: 1 }}>
        {children}
      </Txt>
    </View>
  );
}

/* ------------------------------------------------------------ empty state -- */

export function EmptyState({
  icon,
  title,
  body,
  action,
  onAction,
}: {
  icon: IconName;
  title: string;
  body: string;
  action?: string;
  onAction?: () => void;
}) {
  return (
    <View style={{ alignItems: 'center', paddingVertical: 44, paddingHorizontal: 26 }}>
      <View
        style={{
          width: 64,
          height: 64,
          borderRadius: radius.pill,
          backgroundColor: color.surface,
          borderWidth: 1,
          borderColor: color.lineOnPaper,
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Icon name={icon} size={28} color={color.inkMuted} />
      </View>
      <Txt f="bold" size={17} em={-0.015} align="center" style={{ marginTop: 16 }}>
        {title}
      </Txt>
      <Txt
        f="medium"
        size={13.5}
        lh={1.45}
        c={color.inkMuted}
        align="center"
        style={{ marginTop: 7, maxWidth: 280 }}
      >
        {body}
      </Txt>
      {action && onAction ? (
        <PrimaryButton
          label={action}
          onPress={onAction}
          height={46}
          size={14.5}
          style={{ marginTop: 18, paddingHorizontal: 22 }}
        />
      ) : null}
    </View>
  );
}
