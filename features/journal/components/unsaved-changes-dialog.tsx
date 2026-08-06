import { AlertTriangle } from 'lucide-react-native';
import { Modal, Pressable, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { AppText, Button } from '@/components/ui';
import { useAppTheme } from '@/hooks/use-app-theme';
import { radii, sizing, spacing } from '@/theme';

export function UnsavedChangesDialog({ onDiscard, onKeepEditing, visible }: { onDiscard: () => void; onKeepEditing: () => void; visible: boolean }) {
  const { colors } = useAppTheme();
  return <Modal animationType="fade" onRequestClose={onKeepEditing} statusBarTranslucent transparent visible={visible}>
    <View style={styles.modal}>
      <Pressable accessibilityLabel="Keep editing journal" accessibilityRole="button" onPress={onKeepEditing} style={StyleSheet.absoluteFill}><View style={[StyleSheet.absoluteFill, { backgroundColor: colors.textPrimary, opacity: 0.45 }]} /></Pressable>
      <SafeAreaView accessibilityViewIsModal edges={['left', 'right']} style={[styles.dialog, { backgroundColor: colors.surface, borderColor: colors.border }]}>
        <View style={styles.header}><AlertTriangle color={colors.warning} size={sizing.icon} /><AppText variant="heading3">Discard unsaved changes?</AppText></View>
        <AppText tone="secondary">Your journal changes have not been saved.</AppText>
        <Button label="Keep editing" onPress={onKeepEditing} variant="secondary" />
        <Button label="Discard changes" onPress={onDiscard} variant="destructive" />
      </SafeAreaView>
    </View>
  </Modal>;
}

const styles = StyleSheet.create({ dialog: { borderRadius: radii.large, borderWidth: sizing.border, gap: spacing.md, marginHorizontal: spacing.lg, padding: spacing.lg }, header: { alignItems: 'center', flexDirection: 'row', gap: spacing.sm }, modal: { flex: 1, justifyContent: 'center' } });
