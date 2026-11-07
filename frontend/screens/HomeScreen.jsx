import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import AppButton from '../components/AppButton';
import FieldBackdrop from '../components/FieldBackdrop';
import ScreenContainer from '../components/ScreenContainer';
import { colors, fontSize, radius, spacing } from '../constants/theme';

// Screen 1: title, welcome message, navigation, team and course info.
// All text is hardcoded here. Edit it directly.
export default function HomeScreen() {
  const router = useRouter();

  return (
    <ScreenContainer>
      <FieldBackdrop />
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.hero}>
          <View style={styles.logo}>
            <Ionicons name="navigate" size={40} color={colors.text} />
          </View>
          <Text style={styles.title}>VEX Autonomous Path Planner</Text>
          <Text style={styles.welcome}>
            Welcome! Plan your robot's autonomous route and see where it will go before you ever run it.
          </Text>
        </View>

        <View style={styles.actions}>
          <AppButton title="New Route" subtitle="Start on a blank field" onPress={() => router.push('/planner')} />
          <AppButton title="Import Route" subtitle="Open a saved route" onPress={() => router.push('/import')} />
          <AppButton title="Settings" variant="ghost" onPress={() => router.push('/settings')} />
        </View>

        <View style={styles.infoCard}>
          <Text style={styles.infoTitle}>CS 3720: Mobile Application Development</Text>
          <Text style={styles.infoText}>Fall 2026</Text>
          <Text style={styles.infoText}>Dominic Young, Matthew Backman</Text>
        </View>
      </ScrollView>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  content: { padding: spacing.xl, paddingTop: spacing.xxl * 2, gap: spacing.xl, flexGrow: 1 },
  hero: { alignItems: 'center', gap: spacing.md },
  logo: {
    width: 80,
    height: 80,
    borderRadius: radius.pill,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: { color: colors.text, fontSize: fontSize.title, fontWeight: '900', textAlign: 'center' },
  welcome: { color: colors.textMuted, fontSize: fontSize.body, textAlign: 'center', lineHeight: 23 },
  actions: { gap: spacing.md },
  infoCard: {
    marginTop: 'auto',
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.lg,
    padding: spacing.lg,
    gap: spacing.xs,
  },
  infoTitle: { color: colors.text, fontSize: fontSize.body, fontWeight: '700' },
  infoText: { color: colors.textMuted, fontSize: fontSize.small + 1 },
});