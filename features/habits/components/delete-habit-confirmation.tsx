import { Trash2, X } from 'lucide-react-native';
import { Modal, Pressable, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { AppText, Button, IconButton } from '@/components/ui';
import { useAppTheme } from '@/hooks/use-app-theme';
import { radii, sizing, spacing } from '@/theme';

export function DeleteHabitConfirmation({ loading, name, onCancel, onConfirm, visible }: { loading: boolean; name: string; onCancel: () => void; onConfirm: () => void; visible: boolean }) {
  const { colors } = useAppTheme();
  return <Modal animationType="fade" onRequestClose={onCancel} statusBarTranslucent transparent visible={visible}>
    <View style={styles.modal}>
      <Pressable accessibilityLabel="Cancel habit deletion" accessibilityRole="button" onPress={onCancel} style={StyleSheet.absoluteFill}><View style={[StyleSheet.absoluteFill, { backgroundColor: colors.textPrimary, opacity: 0.45 }]} /></Pressable>
      <SafeAreaView accessibilityRole="alert" accessibilityViewIsModal edges={['left', 'right']} style={[styles.dialog, { backgroundColor: colors.surface, borderColor: colors.border }]}>
        <View style={styles.header}><Trash2 color={colors.danger} size={sizing.icon} /><AppText style={styles.title} variant="heading3">Delete habit?</AppText><IconButton disabled={loading} icon={X} label="Cancel deletion" onPress={onCancel} /></View>
        <AppText tone="secondary">“{name}” and all of its completion history will be permanently deleted.</AppText>
        <View style={styles.actions}><Button disabled={loading} label="Cancel" onPress={onCancel} variant="secondary" /><Button label="Delete permanently" loading={loading} onPress={onConfirm} variant="destructive" /></View>
      </SafeAreaView>
    </View>
  </Modal>;
}
const styles = StyleSheet.create({ actions: { gap: spacing.sm }, dialog: { borderRadius: radii.large, borderWidth: sizing.border, gap: spacing.md, marginHorizontal: spacing.lg, padding: spacing.lg }, header: { alignItems: 'center', flexDirection: 'row', gap: spacing.sm }, modal: { flex: 1, justifyContent: 'center' }, title: { flex: 1 } });
