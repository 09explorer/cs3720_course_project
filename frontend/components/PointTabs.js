import { Pressable, ScrollView, StyleSheet, Text } from 'react-native';
import { colors, fontSize, radius, spacing } from '../constants/theme';

// Vertical tab list from the mockup (Point A / Point B / Point C / +).
// Props:
//  - points:    [{ id, label }]
//  - selectedId
//  - onSelect:  (id) => void
//  - onAdd:     () => void
export default function PointTabs({ points = [], selectedId, onSelect, onAdd }) {
  return (
    <ScrollView style={styles.list} contentContainerStyle={styles.content} nestedScrollEnabled>
      {points.map((p) => {
        const selected = p.id === selectedId;
        return (
          <Pressable
            key={p.id}
            accessibilityRole="tab"
            accessibilityState={{ selected }}
            onPress={() => onSelect?.(p.id)}
            style={[styles.tab, selected && styles.tabSelected]}
          >
            <Text style={[styles.tabText, selected && styles.tabTextSelected]}>Point {p.label}</Text>
          </Pressable>
        );
      })}
      <Pressable
        accessibilityRole="button"
        accessibilityLabel="Add point"
        onPress={onAdd}
        style={[styles.tab, styles.addTab]}
      >
        <Text style={styles.addText}>+</Text>
      </Pressable>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  list: { width: 96, maxHeight: 190 },
  content: { gap: spacing.xs },
  tab: {
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.sm,
    borderRadius: radius.sm,
    backgroundColor: colors.surfaceAlt,
    alignItems: 'center',
  },
  tabSelected: { backgroundColor: colors.primary },
  tabText: { color: colors.textMuted, fontSize: fontSize.small + 1, fontWeight: '700' },
  tabTextSelected: { color: colors.text },
  addTab: { borderWidth: 1, borderColor: colors.border, backgroundColor: colors.surface },
  addText: { color: colors.primary, fontSize: fontSize.h2, fontWeight: '700' },
});
