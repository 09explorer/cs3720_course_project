import { useState } from "react";
import { Pressable, StyleSheet, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { colors, radius, spacing } from "../constants/theme";
import SavePathModal from "./SavePathModal";

// The pill-shaped icon bar from the editor mockup: Home, Import, Save, Settings, Back.
// Each icon navigates by default. Pass onHome / onImport / onSettings / onBack
// to override (e.g. to confirm unsaved changes before leaving the planner).
// Pass `points` ([{ id, label, x, y, h }]) to show the Save button, which opens
// a popup that stores the route in AsyncStorage. Screens that don't pass
// `points` get the original four icons.
export default function TopNavBar({
  onHome,
  onImport,
  onSettings,
  onBack,
  points,
}) {
  const router = useRouter();
  const [saveOpen, setSaveOpen] = useState(false);

  const items = [
    {
      key: "home",
      icon: "home-outline",
      label: "Home",
      onPress: onHome ?? (() => router.navigate("/")),
    },
    {
      key: "import",
      icon: "download-outline",
      label: "Import route",
      onPress: onImport ?? (() => router.push("/import")),
    },
    ...(points
      ? [
          {
            key: "save",
            icon: "save-outline",
            label: "Save route",
            onPress: () => setSaveOpen(true),
          },
        ]
      : []),
    {
      key: "settings",
      icon: "settings-outline",
      label: "Settings",
      onPress: onSettings ?? (() => router.push("/settings")),
    },
    {
      key: "back",
      icon: "caret-back-outline",
      label: "Go back",
      onPress:
        onBack ??
        (() => (router.canGoBack() ? router.back() : router.navigate("/"))),
    },
  ];

  return (
    <>
      <View style={styles.bar}>
        {items.map((item) => (
          <Pressable
            key={item.key}
            accessibilityRole="button"
            accessibilityLabel={item.label}
            onPress={item.onPress}
            hitSlop={8}
            style={({ pressed }) => [
              styles.item,
              pressed && styles.itemPressed,
            ]}
          >
            <Ionicons name={item.icon} size={28} color={colors.primary} />
          </Pressable>
        ))}
      </View>
      {/* Mounted only while open so every popup starts with empty fields. */}
      {saveOpen && (
        <SavePathModal points={points} onClose={() => setSaveOpen(false)} />
      )}
    </>
  );
}

const styles = StyleSheet.create({
  bar: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.pill,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
  },
  item: { padding: spacing.sm, borderRadius: radius.pill },
  itemPressed: { backgroundColor: colors.surfaceAlt },
});
