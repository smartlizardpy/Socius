import { View, Image, type StyleProp, type ImageStyle, type ImageSourcePropType } from 'react-native';
import { color, radius } from '../../theme';
import { Icon } from '../Icon';

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
