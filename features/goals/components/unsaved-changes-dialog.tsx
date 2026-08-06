import { AlertTriangle } from 'lucide-react-native';
import { Modal, StyleSheet, View } from 'react-native';

import { AppText, Button } from '@/components/ui';
import { useAppTheme } from '@/hooks/use-app-theme';
import { radii, sizing, spacing } from '@/theme';

export function UnsavedChangesDialog({ onDiscard, onKeepEditing, visible }: { onDiscard: () => void; onKeepEditing: () => void; visible: boolean }) {
  const { colors } = useAppTheme();
  return <Modal animationType="fade" onRequestClose={onKeepEditing} transparent visible={visible}><View style={styles.overlay}><View accessibilityViewIsModal style={[styles.dialog, { backgroundColor: colors.surface, borderColor: colors.border }]}><View style={styles.row}><AlertTriangle color={colors.warning} size={sizing.icon} /><AppText variant="heading3">Discard goal changes?</AppText></View><AppText tone="secondary">Your unsaved goal and milestone changes will be lost.</AppText><Button label="Keep editing" onPress={onKeepEditing} variant="secondary" /><Button label="Discard changes" onPress={onDiscard} variant="destructive" /></View></View></Modal>;
}
const styles = StyleSheet.create({ dialog: { borderRadius: radii.large, borderWidth: sizing.border, gap: spacing.md, margin: spacing.lg, padding: spacing.lg }, overlay: { backgroundColor: 'rgba(0,0,0,0.45)', flex: 1, justifyContent: 'center' }, row: { alignItems: 'center', flexDirection: 'row', gap: spacing.sm } });
