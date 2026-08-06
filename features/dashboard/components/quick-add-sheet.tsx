import {
  BookHeart,
  ListPlus,
  NotebookPen,
  PlusCircle,
  Repeat2,
  Smile,
  Target,
  X,
  type LucideIcon,
} from 'lucide-react-native';
import { Modal, Pressable, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { AppText, IconButton } from '@/components/ui';
import { useAppTheme } from '@/hooks/use-app-theme';
import { radii, sizing, spacing } from '@/theme';

export type QuickAddAction = 'goal' | 'habit' | 'journal' | 'mood' | 'note' | 'task';

type ActionItem = {
  icon: LucideIcon;
  id: QuickAddAction;
  label: string;
};

const actions: ActionItem[] = [
  { icon: ListPlus, id: 'task', label: 'Add Task' },
  { icon: Repeat2, id: 'habit', label: 'Add Habit' },
  { icon: NotebookPen, id: 'note', label: 'Add Note' },
  { icon: Smile, id: 'mood', label: 'Record Mood' },
  { icon: BookHeart, id: 'journal', label: 'Write Journal' },
  { icon: Target, id: 'goal', label: 'Add Goal' },
];

type QuickAddSheetProps = {
  onClose: () => void;
  onSelect: (action: QuickAddAction, label: string) => void;
  visible: boolean;
};

export function QuickAddSheet({ onClose, onSelect, visible }: QuickAddSheetProps) {
  const { colors } = useAppTheme();

  return (
    <Modal
      animationType="slide"
      onRequestClose={onClose}
      statusBarTranslucent
      transparent
      visible={visible}
    >
      <View style={styles.modal}>
        <Pressable
          accessibilityLabel="Close quick add"
          accessibilityRole="button"
          onPress={onClose}
          style={StyleSheet.absoluteFill}
        >
          <View style={[StyleSheet.absoluteFill, { backgroundColor: colors.textPrimary, opacity: 0.45 }]} />
        </Pressable>
        <SafeAreaView
          accessibilityViewIsModal
          edges={['bottom', 'left', 'right']}
          style={[styles.sheet, { backgroundColor: colors.surface, borderColor: colors.border }]}
        >
          <View style={styles.header}>
            <View style={styles.titleRow}>
              <PlusCircle color={colors.primary} size={sizing.icon} />
              <View style={styles.copy}>
                <AppText accessibilityRole="header" variant="heading3">
                  Quick add
                </AppText>
                <AppText tone="secondary" variant="bodySmall">
                  Choose what you want to capture.
                </AppText>
              </View>
            </View>
            <IconButton icon={X} label="Close quick add" onPress={onClose} />
          </View>

          <View style={styles.actions}>
            {actions.map(({ icon: Icon, id, label }) => (
              <Pressable
                accessibilityHint={`Open ${label}`}
                accessibilityLabel={label}
                accessibilityRole="button"
                key={id}
                onPress={() => onSelect(id, label)}
                style={({ pressed }) => [
                  styles.action,
                  {
                    backgroundColor: pressed ? colors.surfaceSecondary : colors.surface,
                    borderColor: colors.border,
                  },
                ]}
              >
                <View style={[styles.actionIcon, { backgroundColor: colors.surfaceSecondary }]}>
                  <Icon color={colors.primary} size={sizing.icon} />
                </View>
                <AppText style={styles.actionLabel} variant="bodyLarge">
                  {label}
                </AppText>
              </Pressable>
            ))}
          </View>
        </SafeAreaView>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  action: {
    alignItems: 'center',
    borderBottomWidth: sizing.border,
    flexDirection: 'row',
    gap: spacing.sm,
    minHeight: spacing.giant,
    paddingVertical: spacing.xs,
  },
  actionIcon: {
    alignItems: 'center',
    borderRadius: radii.medium,
    height: sizing.touchTarget,
    justifyContent: 'center',
    width: sizing.touchTarget,
  },
  actionLabel: {
    flex: 1,
  },
  actions: {
    gap: spacing.xxs,
  },
  copy: {
    flex: 1,
    gap: spacing.xxs,
  },
  header: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: spacing.sm,
    justifyContent: 'space-between',
  },
  modal: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  sheet: {
    borderTopLeftRadius: radii.xl,
    borderTopRightRadius: radii.xl,
    borderWidth: sizing.border,
    gap: spacing.lg,
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.lg,
  },
  titleRow: {
    alignItems: 'center',
    flex: 1,
    flexDirection: 'row',
    gap: spacing.sm,
  },
});
