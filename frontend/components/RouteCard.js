import { Image, Pressable, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, fontSize, radius, spacing } from '../constants/theme';

const FALLBACK_THUMB = require('../assets/images/field-thumb.png');

// One saved route in the Import list.
// route: { id, name, team, updatedAt, thumbnailUrl, points }
// If the API supplies `thumbnailUrl` it is shown, otherwise the local field image.
export default function RouteCard({ route, onPress }) {
  const updated = route.updatedAt ? new Date(route.updatedAt).toLocaleDateString() : 'Unknown date';
  const pointCount = route.points?.length ?? 0;

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={`Open route ${route.name}`}
      onPress={() => onPress?.(route)}
      style={({ pressed }) => [styles.card, pressed && styles.pressed]}
    >
      <Image
        source={route.thumbnailUrl ? { uri: route.thumbnailUrl } : FALLBACK_THUMB}
        style={styles.thumb}
        resizeMode="cover"
      />
      <View style={styles.body}>
        <Text style={styles.name} numberOfLines={1}>{route.name}</Text>
        <Text style={styles.meta}>Team {route.team}</Text>
        <Text style={styles.meta}>{pointCount} {pointCount === 1 ? 'point' : 'points'}, edited {updated}</Text>
      </View>
      <Ionicons name="chevron-forward" size={22} color={colors.textMuted} />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    padding: spacing.md,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.md,
  },
  pressed: { backgroundColor: colors.surfaceAlt },
  thumb: { width: 72, height: 72, borderRadius: radius.sm, backgroundColor: colors.fieldTile },
  body: { flex: 1, gap: 2 },
  name: { color: colors.text, fontSize: fontSize.body + 1, fontWeight: '700' },
  meta: { color: colors.textMuted, fontSize: fontSize.small },
});
