import { useState } from "react";
import {
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { colors, fontSize, radius, spacing } from "../constants/theme";

// iOS "decimal-pad" has no minus key, so use the punctuation pad there.
const NUMBER_KEYBOARD = Platform.select({
  ios: "numbers-and-punctuation",
  default: "numeric",
});

// Falls back to a red if the theme has no danger color.
const DANGER = colors.danger ?? "#E5484D";

const ROWS = [
  { key: "x", label: "X", hint: "inches" },
  { key: "y", label: "Y", hint: "inches" },
  { key: "h", label: "H", hint: "degrees" },
];

// "Point " followed by an editable label. Keeps its own draft text so the
// label can be cleared while typing; the parent only ever receives non-empty
// labels. When the field loses focus (or Done is pressed) an empty label is
// replaced by `defaultLabel` (A, B, C, ...).
function PointTitle({ label, defaultLabel, onCommit }) {
  const [draft, setDraft] = useState(label);

  const handleChange = (text) => {
    setDraft(text);
    if (text.trim() !== "") onCommit(text);
  };

  const handleBlur = () => {
    const trimmed = draft.trim();
    const final = trimmed || defaultLabel || label;
    setDraft(final);
    onCommit(final);
  };

  return (
    <View style={styles.titleRow}>
      <Text style={styles.title}>Point: </Text>
      <TextInput
        accessibilityLabel="Point name"
        value={draft}
        onChangeText={handleChange}
        onBlur={handleBlur}
        placeholder={defaultLabel}
        placeholderTextColor={colors.textMuted}
        autoCapitalize="characters"
        autoCorrect={false}
        returnKeyType="done"
        selectTextOnFocus
        style={[styles.title, styles.titleInput]}
      />
    </View>
  );
}

// The "Point C" panel from the mockup: an editable title, X / Y / H TextInputs
// and a delete button.
// Props:
//  - point:          { id, label, x, y, h } or undefined (nothing selected)
//  - onChangeField:  (fieldKey: 'label'|'x'|'y'|'h', value: string) => void
//  - onDelete:       (id: number) => void  called when Delete is pressed
//  - defaultLabel:   label used when the name is cleared ("A", "B", ...)
export default function PointEditor({
  point,
  onChangeField,
  onDelete,
  defaultLabel,
}) {
  if (!point) {
    return (
      <View style={[styles.panel, styles.emptyPanel]}>
        <Text style={styles.emptyText}>Tap + to add your first point.</Text>
      </View>
    );
  }

  return (
    <View style={styles.panel}>
      {/* key resets the draft text whenever a different point is selected */}
      <PointTitle
        key={point.id}
        label={point.label}
        defaultLabel={defaultLabel}
        onCommit={(value) => onChangeField?.("label", value)}
      />
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
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={`Delete point ${point.label}`}
        onPress={() => onDelete?.(point.id)}
        style={({ pressed }) => [
          styles.deleteButton,
          pressed && styles.deletePressed,
        ]}
      >
        <Text style={styles.deleteText}>Delete</Text>
      </Pressable>
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
  emptyPanel: { alignItems: "center", justifyContent: "center" },
  emptyText: { color: colors.textMuted, fontSize: fontSize.body },
  titleRow: { flexDirection: "row", alignItems: "center" },
  title: { color: colors.text, fontSize: fontSize.h2, fontWeight: "700" },
  titleInput: {
    flex: 1,
    minWidth: 24,
    padding: 0, // match Text metrics
    borderBottomWidth: 1,
    borderBottomColor: colors.border, // underline hints that it's editable
  },
  row: { flexDirection: "row", alignItems: "center", gap: spacing.md },
  rowLabel: {
    width: 20,
    color: colors.primary,
    fontSize: fontSize.body,
    fontWeight: "800",
  },
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
  deleteButton: {
    marginTop: spacing.xs,
    paddingVertical: spacing.sm,
    borderRadius: radius.sm,
    borderWidth: 1,
    borderColor: DANGER,
    alignItems: "center",
  },
  deletePressed: { opacity: 0.6 },
  deleteText: { color: DANGER, fontSize: fontSize.body, fontWeight: "700" },
});
