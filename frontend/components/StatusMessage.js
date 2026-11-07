import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import AppButton from './AppButton';
import { colors, fontSize, radius, spacing } from '../constants/theme';

// One component for every non-data state.
// type: 'loading' | 'error' | 'success' | 'empty'
export default function StatusMessage({ type, message, actionLabel, onAction }) {
  const config = {
    loading: { icon: null, color: colors.textMuted },
    error: { icon: 'alert-circle-outline', color: colors.error },
    success: { icon: 'checkmark-circle-outline', color: colors.success },
    empty: { icon: 'file-tray-outline', color: colors.textMuted },
  }[type];

  return (
    <View style={[styles.box, { borderColor: config.color }]} accessibilityLiveRegion="polite">
      {type === 'loading' ? (
        <ActivityIndicator color={colors.primary} />
      ) : (
        <Ionicons name={config.icon} size={28} color={config.color} />
      )}
      <Text style={[styles.text, { color: type === 'loading' ? colors.textMuted : config.color }]}>
        {message}
      </Text>
      {actionLabel && onAction ? (
        <AppButton title={actionLabel} onPress={onAction} variant="ghost" style={styles.action} />
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  box: {
    alignItems: 'center',
    gap: spacing.sm,
    padding: spacing.lg,
    borderRadius: radius.md,
    borderWidth: 1,
    backgroundColor: colors.surface,
  },
  text: { fontSize: fontSize.body, textAlign: 'center' },
  action: { minHeight: 44, marginTop: spacing.sm },
});
