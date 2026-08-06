import { Circle, RotateCcw } from 'lucide-react-native';
import { memo } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';

import { AppListCard, AppText, MetadataRow } from '@/components/ui';
import { useAppTheme } from '@/hooks/use-app-theme';
import { radii, sizing, spacing } from '@/theme';

import type { TaskPriority, TaskWithCategory } from '../task-types';
import { CategoryChip } from './category-chip';
import { DueDateLabel } from './due-date-label';
import { PriorityBadge } from './priority-badge';

type TaskCardProps = {
  compact?: boolean;
  onOpen: (taskId: string) => void;
  onToggle: (taskId: string, completed: boolean) => void;
  task: TaskWithCategory;
};

function TaskCardComponent({ compact = false, onOpen, onToggle, task }: TaskCardProps) {
  const { colors } = useAppTheme();
  const priority = task.priority as TaskPriority;
  const priorityColor = { high: colors.danger, low: colors.info, medium: colors.warning }[priority];

  return (
    <AppListCard accentColor={priorityColor} completed={task.is_completed} style={styles.card}>
      <Pressable
        accessibilityLabel={task.is_completed ? `Restore task: ${task.title}` : `Complete task: ${task.title}`}
        accessibilityRole="checkbox"
        accessibilityState={{ checked: task.is_completed }}
        onPress={() => onToggle(task.id, !task.is_completed)}
        style={({ pressed }) => [styles.completionTarget, pressed && styles.pressed]}
      >
        <View
          style={[
            styles.completionVisual,
            {
              backgroundColor: task.is_completed ? colors.success : colors.surface,
              borderColor: task.is_completed ? colors.success : colors.border,
            },
          ]}
        >
          {task.is_completed ? (
            <RotateCcw color={colors.onPrimary} size={sizing.iconSmall} strokeWidth={2.5} />
          ) : (
            <Circle color={colors.textMuted} size={sizing.iconSmall} />
          )}
        </View>
      </Pressable>

      <Pressable
        accessibilityHint="Opens task details"
        accessibilityLabel={`Open task: ${task.title}`}
        accessibilityRole="button"
        onPress={() => onOpen(task.id)}
        style={({ pressed }) => [styles.copy, pressed && styles.pressed]}
      >
        <AppText
          numberOfLines={compact ? 1 : 2}
          style={task.is_completed ? styles.completedTitle : undefined}
          variant="bodyLarge"
        >
          {task.title}
        </AppText>
        <View style={styles.metadataStack}>
          <DueDateLabel dueDate={task.due_date} dueTime={task.due_time} isCompleted={task.is_completed} />
          <MetadataRow>
            <PriorityBadge priority={priority} />
            {task.task_categories ? (
              <CategoryChip color={task.task_categories.color} label={task.task_categories.name} />
            ) : null}
          </MetadataRow>
        </View>
      </Pressable>
    </AppListCard>
  );
}

export const TaskCard = memo(TaskCardComponent);

const styles = StyleSheet.create({
  card: { alignItems: 'center', flexDirection: 'row', gap: spacing.xs },
  completedTitle: { textDecorationLine: 'line-through' },
  completionTarget: {
    alignItems: 'center',
    height: sizing.touchTarget,
    justifyContent: 'center',
    width: sizing.touchTarget,
  },
  completionVisual: {
    alignItems: 'center',
    borderRadius: radii.pill,
    borderWidth: sizing.border,
    height: sizing.badgeHeight,
    justifyContent: 'center',
    width: sizing.badgeHeight,
  },
  copy: { flex: 1, gap: spacing.xs, minHeight: sizing.touchTarget, justifyContent: 'center' },
  metadataStack: { gap: spacing.xxs },
  pressed: { opacity: 0.7 },
});
