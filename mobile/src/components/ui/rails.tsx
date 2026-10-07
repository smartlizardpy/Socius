import { useEffect, useMemo, useRef, useState } from 'react';
import { View, Pressable, PanResponder } from 'react-native';
import { color, radius, motion } from '../../theme';
import { Animated, landSpring, ease, useSharedValue, useAnimatedStyle, useReducedMotion, withSpring, withTiming } from '../motion';

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
