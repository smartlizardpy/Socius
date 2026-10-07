import React from 'react';
import Svg, { Rect, Path, Circle } from 'react-native-svg';
import { color } from '../theme';

/**
 * The drawn venue map from Activity.body.html — ported shape for shape.
 * Illustration only: #EEF3E8 base with blue-tint blocks, white roads, an orange pin.
 */
export function VenueMap({ size = 76 }: { size?: number }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 76 76">
      <Rect width={76} height={76} rx={16} fill={color.mapBase} />
      <Rect x={4} y={6} width={22} height={18} rx={3} fill={color.blueTint} />
      <Rect x={52} y={2} width={26} height={22} rx={3} fill={color.blueTint} />
      <Rect x={2} y={46} width={20} height={26} rx={3} fill={color.blueTint} />
      <Rect x={56} y={50} width={22} height={22} rx={3} fill={color.blueTint} />
      <Path d="M0 34 H76" stroke={color.surface} strokeWidth={9} />
      <Path d="M40 0 V76" stroke={color.surface} strokeWidth={7} />
      <Path d="M0 62 H40" stroke={color.surface} strokeWidth={5} />
      <Circle cx={40} cy={34} r={13} fill={color.blue} opacity={0.14} />
      <Circle cx={40} cy={34} r={7} fill={color.orange} stroke={color.surface} strokeWidth={3} />
    </Svg>
  );
}
