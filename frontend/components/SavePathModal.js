import { useState } from 'react';
import {
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { colors, fontSize, radius, spacing } from '../constants/theme';
import { pathExists, savePath } from '../services/pathStorage';

const DANGER = colors.danger ?? '#E5484D';

// Popup that asks for a path name and team number, then saves the route.
// Step 1 ("form"): name + team fields with Save / Cancel.
// Step 2 ("confirm"): shown only if the name is already taken.
// Props:
//  - points:   [{ id, label, x, y, h }] to save
//  - onClose:  () => void  called after saving or when cancelled
export default function SavePathModal({ points, onClose }) {
  const [name, setName] = useState('');
  const [team, setTeam] = useState('');
  const [step, setStep] = useState('form'); // 'form' | 'confirm'
  const [error, setError] = useState(null);
  const [busy, setBusy] = useState(false);

  const write = async () => {
    setBusy(true);
    try {
      await savePath({ name, team, points });
      onClose();
    } catch {
      setError('Could not save the path. Please try again.');
      setStep('form');
      setBusy(false);
    }
  };

  const handleSave = async () => {
    if (name.trim() === '') {
      setError('Path name is required.');
      return;
    }
    setError(null);
    setBusy(true);
    try {
      if (await pathExists(name)) {
        setStep('confirm');
        setBusy(false);
      } else {
        await write();
      }
    } catch {
      setError('Could not save the path. Please try again.');
      setBusy(false);
    }
  };

  return (
    <Modal transparent animationType="fade" visible onRequestClose={onClose}>
      <KeyboardAvoidingView
        style={styles.backdrop}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <View style={styles.card}>
          {step === 'form' ? (
            <>
              <Text style={styles.title}>Save path</Text>

              <Text style={styles.label}>Path name</Text>
              <TextInput
                accessibilityLabel="Path name"
                value={name}
                onChangeText={(t) => {
                  setName(t);
                  if (error) setError(null);
                }}
                placeholder="e.g. Auto left side"
                placeholderTextColor={colors.textMuted}
                autoFocus
                style={[styles.input, error && styles.inputError]}
              />
              {error && <Text style={styles.errorText}>{error}</Text>}

              <Text style={styles.label}>Team number (optional)</Text>
              <TextInput
                accessibilityLabel="Team number"
                value={team}
                onChangeText={setTeam}
                placeholder="e.g. 12345"
                placeholderTextColor={colors.textMuted}
                style={styles.input}
              />

              <View style={styles.buttons}>
                <Pressable
                  accessibilityRole="button"
                  onPress={onClose}
                  disabled={busy}
                  style={[styles.button, styles.cancelButton]}
                >
                  <Text style={styles.cancelText}>Cancel</Text>
                </Pressable>
                <Pressable
                  accessibilityRole="button"
                  onPress={handleSave}
                  disabled={busy}
                  style={[styles.button, styles.saveButton, busy && styles.disabled]}
                >
                  <Text style={styles.saveText}>Save</Text>
                </Pressable>
              </View>
            </>
          ) : (
            <>
              <Text style={styles.title}>Overwrite path?</Text>
              <Text style={styles.message}>
                A path named "{name.trim()}" already exists. Do you want to overwrite it?
              </Text>
              <View style={styles.buttons}>
                <Pressable
                  accessibilityRole="button"
                  onPress={() => setStep('form')}
                  disabled={busy}
                  style={[styles.button, styles.cancelButton]}
                >
                  <Text style={styles.cancelText}>No</Text>
                </Pressable>
                <Pressable
                  accessibilityRole="button"
                  onPress={write}
                  disabled={busy}
                  style={[styles.button, styles.saveButton, busy && styles.disabled]}
                >
                  <Text style={styles.saveText}>Yes, overwrite</Text>
                </Pressable>
              </View>
            </>
          )}
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.6)',
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing.lg,
  },
  card: {
    width: '100%',
    maxWidth: 420,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.md,
    padding: spacing.lg,
    gap: spacing.sm,
  },
  title: { color: colors.text, fontSize: fontSize.h2, fontWeight: '700' },
  message: { color: colors.text, fontSize: fontSize.body },
  label: { color: colors.textMuted, fontSize: fontSize.small, fontWeight: '700' },
  input: {
    backgroundColor: colors.surfaceAlt,
    borderRadius: radius.sm,
    borderWidth: 1,
    borderColor: colors.border,
    color: colors.text,
    fontSize: fontSize.body,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
  },
  inputError: { borderColor: DANGER },
  errorText: { color: DANGER, fontSize: fontSize.small },
  buttons: { flexDirection: 'row', gap: spacing.md, marginTop: spacing.sm },
  button: {
    flex: 1,
    paddingVertical: spacing.sm,
    borderRadius: radius.sm,
    alignItems: 'center',
  },
  cancelButton: { borderWidth: 1, borderColor: colors.border, backgroundColor: colors.surfaceAlt },
  cancelText: { color: colors.text, fontSize: fontSize.body, fontWeight: '700' },
  saveButton: { backgroundColor: colors.primary },
  saveText: { color: colors.text, fontSize: fontSize.body, fontWeight: '700' },
  disabled: { opacity: 0.6 },
});
