import { useEffect, useState } from 'react';
import { KeyboardAvoidingView, Platform, ScrollView, StyleSheet, View } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import FieldCanvas from '../components/FieldCanvas';
import PointEditor from '../components/PointEditor';
import PointTabs from '../components/PointTabs';
import ScreenContainer from '../components/ScreenContainer';
import StatusMessage from '../components/StatusMessage';
import TopNavBar from '../components/TopNavBar';
import { spacing } from '../constants/theme';
import { getRoute } from '../services/api';
import { createPoint, fromApiPoints } from '../utils/points';

// Route editor. Opened empty by "New Route", or with ?routeId=... from Import.
// Only UI state lives here.
export default function PlannerScreen() {
  const { routeId } = useLocalSearchParams();
  const [points, setPoints] = useState([]); // [{ id, label, x, y, h }] (strings)
  const [selectedId, setSelectedId] = useState(null);
  const [error, setError] = useState(null);

  // Load a saved route when opened from the Import screen.
  useEffect(() => {
    if (!routeId) return;
    (async () => {
      try {
        const route = await getRoute(routeId);
        const loaded = fromApiPoints(route.points);
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

  const handleAddPoint = () => {
    const next = createPoint(points.length);
    setPoints([...points, next]);
    setSelectedId(next.id);
  };

  const handleChangeField = (field, value) => {
    setPoints(points.map((p) => (p.id === selectedId ? { ...p, [field]: value } : p)));
  };

  return (
    <ScreenContainer>
      <KeyboardAvoidingView style={styles.flex} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
          <TopNavBar />
          {error && <StatusMessage type="error" message={error} />}
          <FieldCanvas points={points} selectedId={selectedId} />
          <View style={styles.bottomRow}>
            <PointTabs points={points} selectedId={selectedId} onSelect={setSelectedId} onAdd={handleAddPoint} />
            <PointEditor point={selectedPoint} onChangeField={handleChangeField} />
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  content: { padding: spacing.lg, gap: spacing.md },
  bottomRow: { flexDirection: 'row', gap: spacing.md, alignItems: 'flex-start' },
});