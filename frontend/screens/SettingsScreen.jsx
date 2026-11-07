import { ScrollView, StyleSheet, Text, View } from 'react-native';
import ScreenContainer from '../components/ScreenContainer';
import TopNavBar from '../components/TopNavBar';
import { colors, fontSize, radius, spacing } from '../constants/theme';
import { API_BASE_URL, USE_MOCK_DATA } from '../services/api';

// Settings placeholder. For now it only shows where the app gets its data.
// Add real options here later (units, default heading, ...).
export default function SettingsScreen() {
  return (
    <ScreenContainer>
      <ScrollView contentContainerStyle={styles.content}>
        <TopNavBar />
        <Text style={styles.title}>Settings</Text>
        <View style={styles.card}>
          <Text style={styles.label}>Server address</Text>
          <Text style={styles.value}>{API_BASE_URL}</Text>
          <Text style={styles.label}>Data source</Text>
          <Text style={styles.value}>{USE_MOCK_DATA ? 'Sample data' : 'FastAPI backend'}</Text>
        </View>
      </ScrollView>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  content: { padding: spacing.lg, gap: spacing.lg },
  title: { color: colors.text, fontSize: fontSize.h1, fontWeight: '800' },
  card: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.md,
    padding: spacing.lg,
    gap: spacing.xs,
  },
  label: { color: colors.textMuted, fontSize: fontSize.small, marginTop: spacing.sm },
  value: { color: colors.text, fontSize: fontSize.body, fontWeight: '600' },
});