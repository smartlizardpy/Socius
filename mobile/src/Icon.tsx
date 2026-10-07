import React from 'react';
import Svg, { Path } from 'react-native-svg';
import { ICON_PATHS, type IconName } from './icons.gen';
import { color as tokens } from './theme';

export type { IconName };

type Props = {
  name: IconName;
  size: number;
  color?: string;
};

/**
 * Phosphor icons, drawn from the same SVG files the mockups used.
 * One set throughout — do not add an icon library.
 */
export function Icon({ name, size, color = tokens.ink }: Props) {
  const paths = ICON_PATHS[name];
  return (
    <Svg width={size} height={size} viewBox="0 0 256 256">
      {paths.map((d, i) => (
        <Path key={i} d={d} fill={color} />
      ))}
    </Svg>
  );
}
