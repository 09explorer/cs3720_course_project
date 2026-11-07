import { Platform, StyleSheet, Text, TextInput, View } from 'react-native';
import { colors, fontSize, radius, spacing } from '../constants/theme';

// iOS "decimal-pad" has no minus key, so use the punctuation pad there.
const NUMBER_KEYBOARD = Platform.select({ ios: 'numbers-and-punctuation', default: 'numeric' });

const ROWS = [
  { key: 'x', label: 'X', hint: 'inches' },
  { key: 'y', label: 'Y', hint: 'inches' },
  { key: 'h', label: 'H', hint: 'degrees' },
];

// The "Point C" panel from the mockup: a title and X / Y / H TextInputs.
// Props:
//  - point:          { id, label, x, y, h } or undefined (nothing selected)
//  - onChangeField:  (fieldKey: 'x'|'y'|'h', value: string) => void
export default function PointEditor({ point, onChangeField }) {
  if (!point) {
    return (
      <View style={[styles.panel, styles.emptyPanel]}>
        <Text style={styles.emptyText}>Tap + to add your first point.</Text>
      </View>
    );
  }

  return (
    <View style={styles.panel}>
      <Text style={styles.title}>Point {point.label}</Text>
      {ROWS.map((row) => (
        <View key={row.key} style={styles.row}>
          <Text style={styles.rowLabel}>{row.label}</Text>
          <TextInput
            accessibilityLabel={`${row.label} in ${row.hint}`}
            value={point[row.key]}
            onChangeText={(text) => onChangeField?.(row.key, text)}
            keyboardType={NUMBER_KEYBOARD}
            placeholder={row.hint}
            placeholderTextColor={colors.textMuted}
            selectTextOnFocus
            style={styles.input}
          />
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  panel: {
    flex: 1,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.md,
    padding: spacing.md,
    gap: spacing.sm,
  },
  emptyPanel: { alignItems: 'center', justifyContent: 'center' },
  emptyText: { color: colors.textMuted, fontSize: fontSize.body },
  title: { color: colors.text, fontSize: fontSize.h2, fontWeight: '700' },
  row: { flexDirection: 'row', alignItems: 'center', gap: spacing.md },
  rowLabel: { width: 20, color: colors.primary, fontSize: fontSize.body, fontWeight: '800' },
  input: {
    flex: 1,
    backgroundColor: colors.surfaceAlt,
    borderRadius: radius.sm,
    borderWidth: 1,
    borderColor: colors.border,
    color: colors.text,
    fontSize: fontSize.body,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
  },
});
