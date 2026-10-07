import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
  View,
  Image,
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  PanResponder,
  type StyleProp,
  type ViewStyle,
  type ImageStyle,
  type ImageSourcePropType,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import * as Haptics from 'expo-haptics';
import { withSequence } from 'react-native-reanimated';
import { color, radius, gutter, elevation, blueGlow, motion, tabBarHeight } from '../theme';
import { Icon, type IconName } from '../Icon';
import { Txt, SectionHead } from './Txt';
import {
  Animated,
  PressScale,
  Swap,
  landSpring,
  ease,
  useSharedValue,
  useAnimatedStyle,
  useReducedMotion,
  withSpring,
  withTiming,
} from './motion';

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

/* ---------------------------------------------------------------- avatars -- */

export function Avatar({
  source,
  size,
  ring,
  style,
}: {
  source: ImageSourcePropType;
  size: number;
  /** the 2px ring the mockups draw in the page background colour */
  ring?: string;
  style?: StyleProp<ImageStyle>;
}) {
  return (
    <Image
      source={source}
      // borderRadius goes on the Image itself — overflow:hidden with rounded
      // corners is unreliable on Android
      style={[
        {
          width: size,
          height: size,
          borderRadius: radius.pill,
          ...(ring ? { borderWidth: 2, borderColor: ring } : null),
        },
        style,
      ]}
    />
  );
}

/** Overlapping avatar row. The mockups overlap by 10–11px at 32–34px. */
export function AvatarStack({
  faces,
  size,
  ring,
  overlap,
}: {
  faces: ImageSourcePropType[];
  size: number;
  ring: string;
  overlap: number;
}) {
  return (
    <View style={{ flexDirection: 'row' }}>
      {faces.map((f, i) => (
        <Avatar
          key={i}
          source={f}
          size={size}
          ring={ring}
          style={i > 0 ? { marginLeft: -overlap } : null}
        />
      ))}
    </View>
  );
}

/** The stand-in for you, wherever the design ships no avatar of your own. */
export function YouAvatar({ size, ring }: { size: number; ring?: string }) {
  return (
    <View
      style={{
        width: size,
        height: size,
        borderRadius: radius.pill,
        backgroundColor: color.ink,
        alignItems: 'center',
        justifyContent: 'center',
        ...(ring ? { borderWidth: 2, borderColor: ring } : null),
      }}
    >
      <Icon name="user-fill" size={size * 0.5} color={color.surface} />
    </View>
  );
}

/* --------------------------------------------------------------- progress -- */

/** The onboarding step rail: bars, filled up to `step`. */
export function ProgressSteps({ step, of = 3 }: { step: number; of?: number }) {
  return (
    // flexBasis 0 + minWidth 0: with basis auto the rail sizes from content and
    // overruns the row, pushing the Skip control off the screen edge.
    <View style={{ flexDirection: 'row', flex: 1, flexBasis: 0, minWidth: 0, gap: 5 }}>
      {Array.from({ length: of }, (_, i) => (
        <ProgressBar key={i} filled={i < step} />
      ))}
    </View>
  );
}

function ProgressBar({ filled }: { filled: boolean }) {
  const reduced = useReducedMotion();
  const w = useSharedValue(filled ? 1 : 0);

  useEffect(() => {
    w.value = withTiming(filled ? 1 : 0, {
      duration: reduced ? motion.reduced : motion.spatial,
      easing: ease,
    });
  }, [filled, reduced]);

  const fill = useAnimatedStyle(() => ({ width: `${w.value * 100}%` }));

  return (
    <View
      style={{
        flex: 1,
        flexBasis: 0,
        minWidth: 0,
        height: 5,
        borderRadius: radius.pill,
        backgroundColor: color.railTrack,
        overflow: 'hidden',
      }}
    >
      <Animated.View
        style={[{ height: 5, borderRadius: radius.pill, backgroundColor: color.ink }, fill]}
      />
    </View>
  );
}

/* ------------------------------------------------------------- level rail -- */

/**
 * The rail spans levels 1.0–7.0: in the source the 4.0–6.0 range sits at
 * left 50% width 33.3% and the 5.0 marker at 66.6%, which is exactly that scale.
 */
export const RAIL_MIN = 1;
export const RAIL_MAX = 7;
export const railPct = (level: number) =>
  Math.min(1, Math.max(0, (level - RAIL_MIN) / (RAIL_MAX - RAIL_MIN)));

export function LevelRail({
  min,
  max,
  you,
  track = color.lineOnPaper,
}: {
  min: number;
  max: number;
  you: number;
  track?: string;
}) {
  const reduced = useReducedMotion();
  const [w, setW] = useState(0);
  const progress = useSharedValue(0);
  const opacity = useSharedValue(0);
  const target = railPct(you) * w;
  const x = useSharedValue(0);

  useEffect(() => {
    if (!w) return;
    if (reduced) {
      progress.value = 1;
      opacity.value = withTiming(1, { duration: motion.reduced });
      x.value = target;
      return;
    }
    opacity.value = withTiming(1, { duration: motion.feedback, easing: ease });
    progress.value = withSpring(1, landSpring);
    x.value = withSpring(target, landSpring);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [w]);

  // the marker follows a level change after mount, so the rail reads as live
  useEffect(() => {
    if (!w) return;
    x.value = reduced ? target : withSpring(target, landSpring);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [target]);

  const marker = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [{ translateX: x.value * progress.value }],
  }));

  return (
    <View
      style={{ position: 'relative', flexGrow: 1, flexShrink: 1, height: 16 }}
      onLayout={(e) => setW(e.nativeEvent.layout.width)}
    >
      <View
        style={{
          position: 'absolute',
          top: 6,
          left: 0,
          right: 0,
          height: 4,
          borderRadius: radius.pill,
          backgroundColor: track,
        }}
      />
      <View
        style={{
          position: 'absolute',
          top: 6,
          left: `${railPct(min) * 100}%`,
          width: `${(railPct(max) - railPct(min)) * 100}%`,
          height: 4,
          borderRadius: radius.pill,
          backgroundColor: color.blue,
        }}
      />
      {/* orange core, 3px white ring, 1.5px orange ring — the source's box-shadow */}
      <Animated.View
        style={[
          {
            position: 'absolute',
            top: 0,
            left: -8.5,
            width: 17,
            height: 17,
            borderRadius: radius.pill,
            backgroundColor: color.orange,
            alignItems: 'center',
            justifyContent: 'center',
          },
          marker,
        ]}
      >
        <View
          style={{
            width: 14,
            height: 14,
            borderRadius: radius.pill,
            borderWidth: 3,
            borderColor: color.surface,
            backgroundColor: color.orange,
          }}
        />
      </Animated.View>
    </View>
  );
}

/**
 * The two-thumb range on the Create screen. Both thumbs drag; the rail also
 * accepts a tap, which moves whichever thumb is nearer. Values snap to 0.5.
 */
export function RangeRail({
  min,
  max,
  onChange,
  step = 0.5,
}: {
  min: number;
  max: number;
  onChange: (min: number, max: number) => void;
  step?: number;
}) {
  const [w, setW] = useState(0);
  const widthRef = useRef(0);
  const live = useRef({ min, max });
  live.current = { min, max };

  const snap = (v: number) => {
    const clamped = Math.min(RAIL_MAX, Math.max(RAIL_MIN, v));
    return Math.round(clamped / step) * step;
  };
  const valueAt = (x: number) =>
    snap(RAIL_MIN + (x / Math.max(1, widthRef.current)) * (RAIL_MAX - RAIL_MIN));

  const makeResponder = (which: 'min' | 'max') =>
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: () => true,
      onPanResponderMove: (_e, g) => {
        const base = railPct(which === 'min' ? live.current.min : live.current.max) * widthRef.current;
        const v = valueAt(base + g.dx);
        if (which === 'min') onChange(Math.min(v, live.current.max - step), live.current.max);
        else onChange(live.current.min, Math.max(v, live.current.min + step));
      },
    });

  const minPan = useMemo(() => makeResponder('min'), []);
  const maxPan = useMemo(() => makeResponder('max'), []);

  return (
    <View
      style={{ height: 24, justifyContent: 'center' }}
      onLayout={(e) => {
        const width = e.nativeEvent.layout.width;
        widthRef.current = width;
        setW(width);
      }}
    >
      <Pressable
        onPress={(e) => {
          const v = valueAt(e.nativeEvent.locationX);
          const dMin = Math.abs(v - live.current.min);
          const dMax = Math.abs(v - live.current.max);
          if (dMin <= dMax) onChange(Math.min(v, live.current.max - step), live.current.max);
          else onChange(live.current.min, Math.max(v, live.current.min + step));
        }}
        style={{ position: 'absolute', left: 0, right: 0, top: 0, bottom: 0, justifyContent: 'center' }}
      >
        <View style={{ height: 4, borderRadius: radius.pill, backgroundColor: color.railTrack }} />
      </Pressable>

      <View
        pointerEvents="none"
        style={{
          position: 'absolute',
          left: `${railPct(min) * 100}%`,
          width: `${(railPct(max) - railPct(min)) * 100}%`,
          height: 4,
          borderRadius: radius.pill,
          backgroundColor: color.blue,
        }}
      />

      {w > 0 ? (
        <>
          <Thumb x={railPct(min) * w} responder={minPan} label="Lowest level" />
          <Thumb x={railPct(max) * w} responder={maxPan} label="Highest level" />
        </>
      ) : null}
    </View>
  );
}

function Thumb({
  x,
  responder,
  label,
}: {
  x: number;
  responder: ReturnType<typeof PanResponder.create>;
  label: string;
}) {
  return (
    <View
      {...responder.panHandlers}
      accessibilityRole="adjustable"
      accessibilityLabel={label}
      // the 22px hit pad around a 20px thumb keeps the target at 44
      style={{
        position: 'absolute',
        left: x - 22,
        top: -10,
        width: 44,
        height: 44,
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <View
        style={{
          width: 20,
          height: 20,
          borderRadius: radius.pill,
          backgroundColor: color.surface,
          borderWidth: 3,
          borderColor: color.blue,
        }}
      />
    </View>
  );
}

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

/* ----------------------------------------------------------------- sheet -- */

/**
 * The bottom sheet behind every picker. One implementation so the grabber, the
 * radius and the dismiss behaviour cannot drift between screens.
 */
export function Sheet({
  open,
  onClose,
  title,
  children,
  maxHeight = 560,
}: {
  open: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  maxHeight?: number;
}) {
  const pad = useBottomPad();
  return (
    <Modal visible={open} transparent animationType="slide" onRequestClose={onClose}>
      {/* The scrim is a sibling behind the sheet, not its parent: nesting the body
          inside a pressable scrim makes a button inside a button. */}
      <View style={{ flex: 1, justifyContent: 'flex-end' }}>
        <Pressable
          onPress={onClose}
          accessibilityRole="button"
          accessibilityLabel="Close"
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(16,26,43,0.42)',
          }}
        />
        <View
          style={{
            backgroundColor: color.paper,
            borderTopLeftRadius: 28,
            borderTopRightRadius: 28,
            paddingBottom: pad,
            maxHeight,
          }}
        >
          <View style={{ alignItems: 'center', paddingTop: 10 }}>
            <View
              style={{ width: 40, height: 4, borderRadius: radius.pill, backgroundColor: color.railTrack }}
            />
          </View>

          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between',
              paddingTop: 14,
              paddingHorizontal: gutter,
            }}
          >
            <Txt f="display" size={19} em={-0.03}>
              {title}
            </Txt>
            <RoundButton icon="x" size={18} onPress={onClose} label="Close" />
          </View>

          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ paddingHorizontal: gutter, paddingTop: 14, paddingBottom: 8 }}
          >
            {children}
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
}

/** A selectable row inside a Sheet. */
export function SheetOption({
  label,
  sub,
  selected,
  onPress,
}: {
  label: string;
  sub?: string;
  selected: boolean;
  onPress: () => void;
}) {
  return (
    <PressScale
      onPress={onPress}
      to={0.99}
      accessibilityRole="radio"
      accessibilityState={{ selected }}
      accessibilityLabel={label}
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
        marginBottom: 8,
        paddingVertical: 14,
        paddingHorizontal: 16,
        backgroundColor: color.surface,
        borderRadius: 18,
        borderWidth: selected ? 2 : 1,
        borderColor: selected ? color.blue : color.lineOnSurface,
      }}
    >
      <View style={{ flexGrow: 1, flexShrink: 1 }}>
        <Txt f="bold" size={15} em={-0.01}>
          {label}
        </Txt>
        {sub ? (
          <Txt f="medium" size={12.5} c={color.inkMuted} style={{ marginTop: 3 }}>
            {sub}
          </Txt>
        ) : null}
      </View>
      {selected ? (
        <CheckDot size={24} icon={15} />
      ) : (
        <View
          style={{
            width: 24,
            height: 24,
            borderRadius: radius.pill,
            borderWidth: 2,
            borderColor: color.controlRing,
          }}
        />
      )}
    </PressScale>
  );
}

/** The blue tick disc, used wherever something is confirmed. */
export function CheckDot({ size = 26, icon = 16 }: { size?: number; icon?: number }) {
  return (
    <View
      style={{
        width: size,
        height: size,
        borderRadius: radius.pill,
        backgroundColor: color.blue,
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <Icon name="check" size={icon} color={color.onBlue} />
    </View>
  );
}

/* ---------------------------------------------------------------- amount -- */

/**
 * An amount you type, not one you step to.
 *
 * This was a stepper, which meant the value could only ever land on a multiple of
 * its step — a court that costs ₺666 could not be entered at all. Steppers are for
 * small bounded counts (four spots, five players); money is unbounded and exact,
 * so it takes a field.
 *
 * The row shows the number and opens the sheet. The sheet shows the consequence
 * of the number — what each player actually pays — updating as you type, because
 * the split is the thing the host is really deciding.
 */
export function AmountRow({
  label,
  value,
  onPress,
}: {
  label: string;
  value: number;
  onPress: () => void;
}) {
  return (
    <PressScale
      onPress={onPress}
      to={0.99}
      accessibilityRole="button"
      accessibilityLabel={`${label}, ₺${value}`}
      // 44 is the locked floor for a hit target; the row's own content is 23
      style={{ flexDirection: 'row', alignItems: 'center', gap: 12, minHeight: 44 }}
    >
      <Txt f="semibold" size={13} c={color.inkMuted} style={{ flexGrow: 1 }}>
        {label}
      </Txt>
      <Txt f="display" size={19} em={-0.02}>
        {`₺${value.toLocaleString('tr-TR')}`}
      </Txt>
      <Icon name="pencil-simple" size={16} color={color.blue} />
    </PressScale>
  );
}

export function AmountSheet({
  open,
  onClose,
  title,
  value,
  onChange,
  presets = [],
  /** rendered under the amount — the split, the per-person figure, whatever the
   *  number actually means to the person setting it */
  footnote,
  confirmLabel,
  max = 999999,
}: {
  open: boolean;
  onClose: () => void;
  title: string;
  value: number;
  onChange: (v: number) => void;
  presets?: number[];
  footnote?: (v: number) => string;
  confirmLabel: string;
  max?: number;
}) {
  const [draft, setDraft] = useState(String(value));

  // reopening starts from whatever is currently set
  useEffect(() => {
    if (open) setDraft(String(value));
  }, [open, value]);

  const parsed = Math.min(max, Number(draft) || 0);

  const press = (key: string) => {
    Haptics.selectionAsync();
    setDraft((d) => {
      if (key === 'del') return d.length <= 1 ? '0' : d.slice(0, -1);
      const next = d === '0' ? key : d + key;
      return next.length > 6 ? d : next;
    });
  };

  return (
    <Sheet open={open} onClose={onClose} title={title} maxHeight={680}>
      <View style={{ alignItems: 'center' }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 3 }}>
          {/*
            The symbol is set in the UI face, not the display one: Bricolage has
            no ₺ glyph, and alone in its own element there is no sibling text for
            the browser to fall back through, so it renders as a blank box.
          */}
          <Txt f="bold" size={28} lh={1.2} c={color.inkMuted}>
            ₺
          </Txt>
          <Txt f="display" size={42} em={-0.04} lh={1.15}>
            {parsed.toLocaleString('tr-TR')}
          </Txt>
        </View>

        {footnote ? (
          <Swap value={parsed}>
            <Txt f="semibold" size={13.5} c={color.inkMuted} align="center" style={{ marginTop: 8 }}>
              {footnote(parsed)}
            </Txt>
          </Swap>
        ) : null}
      </View>

      {presets.length ? (
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'center',
            flexWrap: 'wrap',
            gap: 8,
            marginTop: 16,
          }}
        >
          {presets.map((n) => (
            <Chip
              key={n}
              label={`₺${n.toLocaleString('tr-TR')}`}
              active={parsed === n}
              onPress={() => setDraft(String(n))}
              size={12.5}
              height={34}
            />
          ))}
        </View>
      ) : null}

      {/*
        The sheet carries its own keypad rather than raising the OS keyboard.
        A bottom-anchored sheet plus the system numeric pad left the amount, the
        split, the presets and the confirm button all hidden behind the keyboard
        — there is nowhere for a sheet this tall to go. Owning the input means
        the layout is never covered, on any platform.
      */}
      <View style={{ marginTop: 18 }}>
        {[
          ['1', '2', '3'],
          ['4', '5', '6'],
          ['7', '8', '9'],
          ['00', '0', 'del'],
        ].map((row) => (
          <View key={row.join()} style={{ flexDirection: 'row', gap: 8, marginBottom: 8 }}>
            {row.map((key) => (
              <PressScale
                key={key}
                onPress={() => press(key)}
                to={0.94}
                haptic="none"
                accessibilityRole="button"
                accessibilityLabel={key === 'del' ? 'Delete' : key}
                style={{
                  flexGrow: 1,
                  flexBasis: 0,
                  height: 52,
                  borderRadius: radius.mediaLarge,
                  backgroundColor: key === 'del' ? 'transparent' : color.surface,
                  borderWidth: key === 'del' ? 0 : 1,
                  borderColor: color.lineOnSurface,
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                {key === 'del' ? (
                  <Icon name="arrow-u-down-left" size={20} color={color.inkMuted} />
                ) : (
                  <Txt f="display" size={21} em={-0.02}>
                    {key}
                  </Txt>
                )}
              </PressScale>
            ))}
          </View>
        ))}
      </View>

      <PrimaryButton
        label={confirmLabel}
        icon={null}
        style={{ marginTop: 10 }}
        disabled={parsed <= 0}
        onPress={() => {
          onChange(parsed);
          onClose();
        }}
      />
    </Sheet>
  );
}

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
