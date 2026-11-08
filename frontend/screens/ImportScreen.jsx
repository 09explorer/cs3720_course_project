import { useCallback, useState } from "react";
import {
  FlatList,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useFocusEffect, useRouter } from "expo-router";
import RouteCard from "../components/RouteCard";
import ScreenContainer from "../components/ScreenContainer";
import StatusMessage from "../components/StatusMessage";
import TopNavBar from "../components/TopNavBar";
import { colors, fontSize, radius, spacing } from "../constants/theme";
import { deletePath, getPaths } from "../services/pathStorage";

const DANGER = colors.danger ?? "#E5484D";

// Screen 2: saved routes loaded from AsyncStorage, shown in a FlatList with
// search, plus loading, error and empty states.
export default function ImportScreen() {
  const router = useRouter();
  const [routes, setRoutes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState("");

  const loadRoutes = async () => {
    setLoading(true);
    setError(null);
    try {
      const paths = await getPaths();
      // Map the stored format onto the route shape the screen and RouteCard use.
      // Path names are unique, so the name doubles as the id.
      const mapped = paths
        .map((p) => ({
          id: p["Path Name"],
          name: p["Path Name"],
          team: p["Team number"],
          lastEdit: p["Last Edit"],
          points: p.Points,
        }))
        .sort((a, b) => b.lastEdit - a.lastEdit); // most recently edited first
      setRoutes(mapped);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Reload every time the screen is focused so newly saved paths show up.
  useFocusEffect(
    useCallback(() => {
      loadRoutes();
    }, []),
  );

  // Filter by route name or team number.
  const query = search.trim().toLowerCase();
  const visible = routes.filter(
    (r) =>
      r.name.toLowerCase().includes(query) ||
      String(r.team).toLowerCase().includes(query),
  );

  const openRoute = (route) =>
    router.push({
      pathname: "/planner",
      params: { routeId: String(route.id) },
    });

  const handleDelete = async (route) => {
    try {
      await deletePath(route.name);
      setRoutes((prev) => prev.filter((r) => r.id !== route.id));
    } catch (err) {
      setError(err.message);
    }
  };

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
        <View style={styles.padded}>
          <StatusMessage type="loading" message="Loading routes..." />
        </View>
      ) : error ? (
        <View style={styles.padded}>
          <StatusMessage
            type="error"
            message={error}
            actionLabel="Try again"
            onAction={loadRoutes}
          />
        </View>
      ) : (
        <FlatList
          data={visible}
          keyExtractor={(item) => String(item.id)}
          renderItem={({ item }) => (
            <View style={styles.row}>
              <View style={styles.cardWrap}>
                <RouteCard route={item} onPress={openRoute} />
              </View>
              <Pressable
                accessibilityRole="button"
                accessibilityLabel={`Delete route ${item.name}`}
                onPress={() => handleDelete(item)}
                style={({ pressed }) => [
                  styles.deleteButton,
                  pressed && styles.deletePressed,
                ]}
              >
                <Ionicons name="trash-outline" size={24} color={DANGER} />
              </Pressable>
            </View>
          )}
          contentContainerStyle={styles.list}
          keyboardShouldPersistTaps="handled"
          ListEmptyComponent={
            <StatusMessage type="empty" message="No routes found." />
          }
        />
      )}
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  header: { padding: spacing.lg, gap: spacing.md },
  title: { color: colors.text, fontSize: fontSize.h1, fontWeight: "800" },
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
  list: {
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.xl,
    gap: spacing.md,
  },
  padded: { paddingHorizontal: spacing.lg },
  row: { flexDirection: "row", alignItems: "stretch", gap: spacing.sm },
  cardWrap: { flex: 1 },
  deleteButton: {
    paddingHorizontal: spacing.md,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: DANGER,
    borderRadius: radius.md,
  },
  deletePressed: { opacity: 0.6 },
});
