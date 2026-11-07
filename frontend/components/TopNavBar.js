import { Pressable, StyleSheet, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { colors, radius, spacing } from '../constants/theme';

// The pill-shaped icon bar from the editor mockup: Home, Import, Settings, Back.
// Each icon navigates by default. Pass onHome / onImport / onSettings / onBack
// to override (e.g. to confirm unsaved changes before leaving the planner).
export default function TopNavBar({ onHome, onImport, onSettings, onBack }) {
  const router = useRouter();

  const items = [
    { key: 'home', icon: 'home-outline', label: 'Home', onPress: onHome ?? (() => router.navigate('/')) },
    { key: 'import', icon: 'download-outline', label: 'Import route', onPress: onImport ?? (() => router.push('/import')) },
    { key: 'settings', icon: 'settings-outline', label: 'Settings', onPress: onSettings ?? (() => router.push('/settings')) },
    {
      key: 'back',
      icon: 'caret-back-outline',
      label: 'Go back',
      onPress: onBack ?? (() => (router.canGoBack() ? router.back() : router.navigate('/'))),
    },
  ];

  return (
    <View style={styles.bar}>
      {items.map((item) => (
        <Pressable
          key={item.key}
          accessibilityRole="button"
          accessibilityLabel={item.label}
          onPress={item.onPress}
          hitSlop={8}
          style={({ pressed }) => [styles.item, pressed && styles.itemPressed]}
        >
          <Ionicons name={item.icon} size={28} color={colors.primary} />
        </Pressable>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  bar: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.pill,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
  },
  item: { padding: spacing.sm, borderRadius: radius.pill },
  itemPressed: { backgroundColor: colors.surfaceAlt },
});
