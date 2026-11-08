import { useEffect, useState } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  View,
} from "react-native";
import { useLocalSearchParams } from "expo-router";
import FieldCanvas from "../components/FieldCanvas";
import PointEditor from "../components/PointEditor";
import PointTabs from "../components/PointTabs";
import ScreenContainer from "../components/ScreenContainer";
import StatusMessage from "../components/StatusMessage";
import TopNavBar from "../components/TopNavBar";
import { spacing } from "../constants/theme";
import { getPathByName } from '../services/pathStorage';
import { createPoint, fromApiPoints } from "../utils/points";

// Route editor. Opened empty by "New Route", or with ?routeId=... from Import.
// Only UI state lives here.
export default function PlannerScreen() {
  const backgroundUrl =
    "https://content.vexrobotics.com/docs/2026-2027/override/online-manual/assets/image/TopView.png";
  const { routeId } = useLocalSearchParams();
  const [points, setPoints] = useState([]); // [{ id, label, x, y, h }] (strings)
  const [selectedId, setSelectedId] = useState(null);
  const [error, setError] = useState(null);

 // replaces the existing import of getRoute
useEffect(() => {
  if (!routeId) return;
  (async () => {
    try {
      const path = await getPathByName(routeId);
      if (!path) throw new Error('That path could not be found.');
      const loaded = path.Points; // already in { id, label, x, y, h } form
      setPoints(loaded);
      setSelectedId(loaded[0]?.id ?? null);
    } catch (err) {
      setError(err.message);
    }
  })();
}, [routeId]);

  // WIRING POINT: runs whenever points change. Send them to the backend here.
  useEffect(() => {
    // processPoints(points);
  }, [points]);

  const selectedPoint = points.find((p) => p.id === selectedId);

  // Determines the label for a new point based on its index
  const indexToLabel = (i) => {
  let n = Math.max(0, i);
  let s = '';
  do {
    s = String.fromCharCode(65 + (n % 26)) + s;
    n = Math.floor(n / 26) - 1;
  } while (n >= 0);
  return s;
};

  const handleAddPoint = () => {
    const next = createPoint(points.length);
    setPoints([...points, next]);
    setSelectedId(next.id);
  };

  const handleMovePoint = (id, { x, y }) => {
    setPoints((prev) => prev.map((p) => (p.id === id ? { ...p, x, y } : p)));
  };

  const handleDeletePoint = (id) => {
    const index = points.findIndex((p) => p.id === id);
    if (index === -1) return;

    const remaining = points.filter((p) => p.id !== id);
    setPoints(remaining);

    // Previous point if there is one, otherwise the point that followed the
    // deleted one (it has shifted into the same index), otherwise nothing.
    setSelectedId(remaining[index - 1]?.id ?? remaining[index]?.id ?? null);
  };

  const handleChangeField = (field, value) => {
    setPoints(
      points.map((p) => (p.id === selectedId ? { ...p, [field]: value } : p)),
    );
  };

  return (
    <ScreenContainer>
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <ScrollView
          contentContainerStyle={styles.content}
          keyboardShouldPersistTaps="handled"
        >
          <TopNavBar points={points} />
          {error && <StatusMessage type="error" message={error} />}
          <FieldCanvas
            points={points}
            selectedId={selectedId}
            background={backgroundUrl}
            onSelect={setSelectedId}
            onMovePoint={handleMovePoint}
          />
          <View style={styles.bottomRow}>
            <PointTabs
              points={points}
              selectedId={selectedId}
              onSelect={setSelectedId}
              onAdd={handleAddPoint}
            />
            <PointEditor
              point={selectedPoint}
              onChangeField={handleChangeField}
              onDelete={handleDeletePoint}
              defaultLabel={indexToLabel(points.findIndex((p) => p.id === selectedId))}
            />
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  content: { padding: spacing.lg, gap: spacing.md },
  bottomRow: {
    flexDirection: "row",
    gap: spacing.md,
    alignItems: "flex-start",
  },
});
