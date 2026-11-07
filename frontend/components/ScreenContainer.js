import { StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { colors } from '../constants/theme';

// Shared screen wrapper: background color, safe-area insets, light status bar.
export default function ScreenContainer({ children, style }) {
  return (
    <SafeAreaView style={[styles.root, style]}>
      <StatusBar style="light" />
      {children}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.bg },
});
