import { Stack } from 'expo-router';
import { colors } from '../constants/theme';

// Root navigator. Headers are hidden because each screen renders its own
// <TopNavBar /> (matching the mockups). Files in /app only define URLs;
// the real UI lives in /screens.
export default function RootLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: colors.bg },
      }}
    />
  );
}
