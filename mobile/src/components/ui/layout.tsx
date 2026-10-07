import React from 'react';
import { View, type StyleProp, type ViewStyle } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { color, gutter, tabBarHeight } from '../../theme';
import { type IconName } from '../../Icon';
import { Txt } from '../Txt';
import { RoundButton } from './buttons';

/* ------------------------------------------------------------ safe areas -- */

/**
 * The style lock reserves 44px above every screen: "It is the floor, not a
 * spacing choice: below 44px the header collides with the status bar."
 *
 * insets.top already covers that on a notched phone (59 on an iPhone 16 Pro), but
 * it is 0 on the web preview and on flat-top Android, where the header then sits
 * flush against the very top edge. Taking the larger of the two honours both.
 */
export function useTopPad() {
  const insets = useSafeAreaInsets();
  return Math.max(insets.top, 44);
}

/**
 * The mockups end every screen with 26px of clear space below the action bar and
 * draw no home indicator. On device the OS draws one inside insets.bottom, so the
 * reserve becomes the inset plus a little air, with the mockup's 26 as the floor.
 */
export function useBottomPad() {
  const insets = useSafeAreaInsets();
  return Math.max(26, insets.bottom + 12);
}

/**
 * Height of the tab bar. A tab screen's own content box already ends above it,
 * so this is only for something that deliberately overlays the bar — never as
 * extra bottom padding inside a tab screen, which double-counts it.
 */
export function useTabBarPad() {
  const insets = useSafeAreaInsets();
  return tabBarHeight + insets.bottom;
}

/* ------------------------------------------------------------- bottom bar -- */

export function BottomBar({
  children,
  bg = color.paper,
  top = 16,
  border = false,
  style,
}: {
  children: React.ReactNode;
  bg?: string;
  top?: number;
  border?: boolean;
  style?: StyleProp<ViewStyle>;
}) {
  const pad = useBottomPad();
  return (
    <View
      style={[
        { paddingTop: top, paddingHorizontal: gutter, paddingBottom: pad, backgroundColor: bg },
        border
          ? {
              borderTopWidth: 1,
              borderTopColor: color.lineOnSurface,
              shadowColor: '#101A2B',
              shadowOffset: { width: 0, height: -8 },
              shadowOpacity: 0.06,
              shadowRadius: 16,
              elevation: 12,
            }
          : null,
        style,
      ]}
    >
      {children}
    </View>
  );
}

/* ---------------------------------------------------------------- headers -- */

/**
 * The header every non-hero screen opens with: a 44px round control, an optional
 * display title, and a right-hand slot. One place so the 44px top reserve and the
 * 48px row height cannot drift between screens.
 */
export function ScreenHeader({
  onBack,
  backIcon = 'caret-left',
  title,
  titleSize = 19,
  right,
  center = false,
  style,
}: {
  onBack?: () => void;
  backIcon?: IconName;
  title?: string;
  titleSize?: number;
  right?: React.ReactNode;
  /** true centres the title between two 44px slots, as the Create screen draws it */
  center?: boolean;
  style?: StyleProp<ViewStyle>;
}) {
  const top = useTopPad();
  return (
    <View
      style={[
        {
          flexDirection: 'row',
          alignItems: 'center',
          gap: 14,
          paddingTop: top,
          paddingHorizontal: gutter,
          minHeight: top + 48,
        },
        style,
      ]}
    >
      {onBack ? (
        <RoundButton icon={backIcon} onPress={onBack} label="Back" />
      ) : center ? (
        <View style={{ width: 44 }} />
      ) : null}

      {title ? (
        <Txt
          f="display"
          size={titleSize}
          em={-0.03}
          numberOfLines={1}
          align={center ? 'center' : undefined}
          style={{ flexGrow: 1, flexShrink: 1 }}
        >
          {title}
        </Txt>
      ) : (
        <View style={{ flexGrow: 1 }} />
      )}

      {right ?? (center ? <View style={{ width: 44 }} /> : null)}
    </View>
  );
}
