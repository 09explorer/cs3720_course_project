import { ActivityIndicator, Pressable, StyleSheet, Text } from 'react-native';
import { colors, fontSize, radius, spacing } from '../constants/theme';

// Reusable button. variant: 'primary' (filled blue) | 'ghost' (outlined).
// `subtitle` is the optional small second line seen in the mockup buttons.
export default function AppButton({
  title,
  subtitle,
  onPress,
  variant = 'primary',
  disabled = false,
  loading = false,
  style,
}) {
  const isPrimary = variant === 'primary';
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={title}
      onPress={onPress}
      disabled={disabled || loading}
      style={({ pressed }) => [
        styles.base,
        isPrimary ? styles.primary : styles.ghost,
        pressed && (isPrimary ? styles.primaryPressed : styles.ghostPressed),
        (disabled || loading) && styles.disabled,
        style,
      ]}
    >
      {loading ? (
        <ActivityIndicator color={colors.text} />
      ) : (
        <>
          <Text style={styles.title}>{title}</Text>
          {subtitle ? <Text style={styles.subtitle}>{subtitle}</Text> : null}
        </>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: {
    minHeight: 56,
    borderRadius: radius.md,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.xl,
    alignItems: 'center',
    justifyContent: 'center',
  },
  primary: { backgroundColor: colors.primary },
  primaryPressed: { backgroundColor: colors.primaryPressed },
  ghost: { borderWidth: 1, borderColor: colors.border, backgroundColor: colors.surface },
  ghostPressed: { backgroundColor: colors.surfaceAlt },
  disabled: { opacity: 0.5 },
  title: { color: colors.text, fontSize: fontSize.body + 2, fontWeight: '700' },
  subtitle: { color: colors.text, opacity: 0.8, fontSize: fontSize.small, marginTop: 2 },
});
