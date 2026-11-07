import { useEffect, useState } from 'react';
import { FlatList, StyleSheet, Text, TextInput, View } from 'react-native';
import { useRouter } from 'expo-router';
import RouteCard from '../components/RouteCard';
import ScreenContainer from '../components/ScreenContainer';
import StatusMessage from '../components/StatusMessage';
import TopNavBar from '../components/TopNavBar';
import { colors, fontSize, radius, spacing } from '../constants/theme';
import { getRoutes } from '../services/api';

// Screen 2: saved routes loaded from the API, shown in a FlatList with
// search, plus loading, error and empty states.
export default function ImportScreen() {
  const router = useRouter();
  const [routes, setRoutes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState('');

  const loadRoutes = async () => {
    setLoading(true);
    setError(null);
    try {
      setRoutes(await getRoutes());
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadRoutes();
  }, []);

  // Filter by route name or team number.
  const query = search.trim().toLowerCase();
  const visible = routes.filter(
    (r) => r.name.toLowerCase().includes(query) || String(r.team).toLowerCase().includes(query)
  );

  const openRoute = (route) =>
    router.push({ pathname: '/planner', params: { routeId: String(route.id) } });

  return (
    <ScreenContainer>
      <View style={styles.header}>
        <TopNavBar />
        <Text style={styles.title}>Import a route</Text>
        <TextInput
          accessibilityLabel="Search routes"
          value={search}
          onChangeText={setSearch}
          placeholder="Search by name or team"
          placeholderTextColor={colors.textMuted}
          autoCapitalize="none"
          autoCorrect={false}
          style={styles.search}
        />
      </View>

      {loading ? (
        <View style={styles.padded}><StatusMessage type="loading" message="Loading routes..." /></View>
      ) : error ? (
        <View style={styles.padded}>
          <StatusMessage type="error" message={error} actionLabel="Try again" onAction={loadRoutes} />
        </View>
      ) : (
        <FlatList
          data={visible}
          keyExtractor={(item) => String(item.id)}
          renderItem={({ item }) => <RouteCard route={item} onPress={openRoute} />}
          contentContainerStyle={styles.list}
          keyboardShouldPersistTaps="handled"
          ListEmptyComponent={<StatusMessage type="empty" message="No routes found." />}
        />
      )}
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  header: { padding: spacing.lg, gap: spacing.md },
  title: { color: colors.text, fontSize: fontSize.h1, fontWeight: '800' },
  search: {
    backgroundColor: colors.surfaceAlt,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.md,
    color: colors.text,
    fontSize: fontSize.body,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
  },
  list: { paddingHorizontal: spacing.lg, paddingBottom: spacing.xl, gap: spacing.md },
  padded: { paddingHorizontal: spacing.lg },
});