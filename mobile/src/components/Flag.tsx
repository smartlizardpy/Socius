import React from 'react';
import Svg, { Rect, Circle, Path } from 'react-native-svg';

/** The two flags drawn inline in Welcome.body.html, ported path for path. */

export function FlagEN({ w = 22, h = 15 }: { w?: number; h?: number }) {
  return (
    <Svg width={w} height={h} viewBox="0 0 22 15">
      <Rect width={22} height={15} rx={3} fill="#FFFFFF" />
      <Rect y={0} width={22} height={2.14} fill="#B22234" />
      <Rect y={4.29} width={22} height={2.14} fill="#B22234" />
      <Rect y={8.57} width={22} height={2.14} fill="#B22234" />
      <Rect y={12.86} width={22} height={2.14} fill="#B22234" />
      <Rect width={9.24} height={8.1} fill="#3C3B6E" />
      {[1.7, 4.1, 6.5].map((cy) =>
        [1.6, 4.2, 6.8].map((cx) => (
          <Circle key={`${cx}-${cy}`} cx={cx} cy={cy} r={0.62} fill="#FFFFFF" />
        )),
      )}
    </Svg>
  );
}

export function FlagTR({ w = 22, h = 15 }: { w?: number; h?: number }) {
  return (
    <Svg width={w} height={h} viewBox="0 0 22 15">
      <Rect width={22} height={15} rx={3} fill="#E30A17" />
      <Circle cx={8.6} cy={7.5} r={3.7} fill="#FFFFFF" />
      <Circle cx={10.1} cy={7.5} r={2.9} fill="#E30A17" />
      <Path
        d="M13.9 4.9 L14.7 7 L16.9 7 L15.1 8.3 L15.8 10.4 L13.9 9.1 L12.1 10.4 L12.8 8.3 L11 7 L13.2 7 Z"
        fill="#FFFFFF"
      />
    </Svg>
  );
}
