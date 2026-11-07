import { StyleSheet, Text, View } from 'react-native';
import { colors, fontSize, radius } from '../constants/theme';

// BLANK PLACEHOLDER for the planning grid (<Canvas> in the mockup).
// Draw the field, route path and points inside this View.
//
// Props available for wiring:
//  - points:     [{ id, label, x, y, h }]  (x/y/h are strings)
//  - selectedId: id of the selected point
export default function FieldCanvas({ points = [], selectedId }) {
  return (
    <View style={styles.wrap}>
      <Text style={styles.label}>Field goes here</Text>
      <Text style={styles.label}>{'<Canvas>'}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    width: '100%',
    aspectRatio: 1, // the field is square
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.surface,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.border,
  },
  label: { color: colors.textMuted, fontSize: fontSize.small },
});