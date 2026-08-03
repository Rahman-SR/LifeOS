import { Circle, RotateCcw } from 'lucide-react-native';
import { Pressable, StyleSheet, View } from 'react-native';

import { AppText, Card } from '@/components/ui';
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

export function TaskCard({ compact = false, onOpen, onToggle, task }: TaskCardProps) {
  const { colors } = useAppTheme();
  const nextCompleted = !task.is_completed;

  return (
    <Card style={styles.card}>
      <Pressable
        accessibilityLabel={
          task.is_completed ? `Restore task: ${task.title}` : `Complete task: ${task.title}`
        }
        accessibilityRole="checkbox"
        accessibilityState={{ checked: task.is_completed }}
        hitSlop={spacing.xs}
        onPress={() => onToggle(task.id, nextCompleted)}
        style={({ pressed }) => [
          styles.completion,
          {
            backgroundColor: task.is_completed ? colors.success : colors.surface,
            borderColor: task.is_completed ? colors.success : colors.border,
            opacity: pressed ? 0.7 : 1,
          },
        ]}
      >
        {task.is_completed ? (
          <RotateCcw color={colors.onPrimary} size={sizing.iconSmall} strokeWidth={2.5} />
        ) : (
          <Circle color={colors.textMuted} size={sizing.iconSmall} />
        )}
      </Pressable>

      <Pressable
        accessibilityHint="Opens task details"
        accessibilityLabel={`Open task: ${task.title}`}
        accessibilityRole="button"
        onPress={() => onOpen(task.id)}
        style={({ pressed }) => [styles.copy, pressed && styles.pressed]}
      >
        <AppText
          numberOfLines={compact ? 2 : 3}
          style={task.is_completed ? [styles.completedTitle, { color: colors.textMuted }] : undefined}
          variant="bodyLarge"
        >
          {task.title}
        </AppText>
        <View style={styles.metadata}>
          <DueDateLabel
            dueDate={task.due_date}
            dueTime={task.due_time}
            isCompleted={task.is_completed}
          />
          <PriorityBadge priority={task.priority as TaskPriority} />
          {task.task_categories ? (
            <CategoryChip color={task.task_categories.color} label={task.task_categories.name} />
          ) : null}
        </View>
      </Pressable>
    </Card>
  );
}

const styles = StyleSheet.create({
  card: {
    alignItems: 'flex-start',
    flexDirection: 'row',
    gap: spacing.sm,
  },
  completedTitle: {
    textDecorationLine: 'line-through',
  },
  completion: {
    alignItems: 'center',
    borderRadius: radii.pill,
    borderWidth: sizing.border,
    height: sizing.touchTarget,
    justifyContent: 'center',
    width: sizing.touchTarget,
  },
  copy: {
    flex: 1,
    gap: spacing.xs,
    minHeight: sizing.touchTarget,
  },
  metadata: {
    alignItems: 'center',
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.xs,
  },
  pressed: {
    opacity: 0.7,
  },
});
