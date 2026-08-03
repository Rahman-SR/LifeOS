import * as Haptics from 'expo-haptics';
import { router, useLocalSearchParams } from 'expo-router';
import { ArrowLeft, BellRing, Pencil, Trash2 } from 'lucide-react-native';
import { useState } from 'react';
import { Alert, StyleSheet, View } from 'react-native';

import { ErrorState, LoadingState } from '@/components/feedback';
import { AppHeader, AppText, Button, Card, IconButton, Screen } from '@/components/ui';
import {
  CategoryChip,
  DeleteConfirmation,
  DueDateLabel,
  PriorityBadge,
  useDeleteTaskMutation,
  useTask,
  useToggleTaskMutation,
  type TaskPriority,
} from '@/features/tasks';
import { useAppTheme } from '@/hooks/use-app-theme';
import { useAuth } from '@/hooks/use-auth';
import { sizing, spacing } from '@/theme';

export default function TaskDetailsScreen() {
  const { colors } = useAppTheme();
  const { user } = useAuth();
  const params = useLocalSearchParams<{ id?: string }>();
  const taskId = typeof params.id === 'string' ? params.id : undefined;
  const userId = user!.id;
  const taskQuery = useTask(userId, taskId);
  const toggleMutation = useToggleTaskMutation(userId);
  const deleteMutation = useDeleteTaskMutation(userId);
  const [showDelete, setShowDelete] = useState(false);
  const task = taskQuery.data;

  const toggleTask = async () => {
    if (!task) return;
    void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => undefined);
    try {
      const result = await toggleMutation.mutateAsync({
        completed: !task.is_completed,
        taskId: task.id,
      });
      if (result.reminderWarning) Alert.alert('Reminder update', result.reminderWarning);
    } catch (error) {
      Alert.alert('Task was not updated', error instanceof Error ? error.message : 'Please try again.');
    }
  };

  const confirmDelete = async () => {
    if (!task) return;
    void Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning).catch(() => undefined);
    try {
      const result = await deleteMutation.mutateAsync(task.id);
      setShowDelete(false);
      Alert.alert(
        'Task deleted',
        result.reminderWarning
          ? `The task was deleted. ${result.reminderWarning}`
          : 'The task was permanently deleted.',
        [{ onPress: () => router.replace('/tasks'), text: 'Done' }],
      );
    } catch (error) {
      Alert.alert('Task was not deleted', error instanceof Error ? error.message : 'Please try again.');
    }
  };

  return (
    <Screen contentContainerStyle={styles.screen}>
      <IconButton icon={ArrowLeft} label="Go back" onPress={() => router.back()} />
      {taskQuery.isLoading ? <LoadingState label="Loading task…" /> : null}
      {taskQuery.error ? (
        <ErrorState
          description="This task could not be loaded. It may not exist or may belong to another account."
          onRetry={() => void taskQuery.refetch()}
          title="Task unavailable"
        />
      ) : null}
      {task ? (
        <>
          <AppHeader
            action={
              <View style={styles.headerActions}>
                <IconButton
                  icon={Pencil}
                  label="Edit task"
                  onPress={() => router.push(`/tasks/edit/${task.id}`)}
                />
                <IconButton icon={Trash2} label="Delete task" onPress={() => setShowDelete(true)} />
              </View>
            }
            eyebrow={task.is_completed ? 'COMPLETED' : 'TASK DETAILS'}
            title={task.title}
          />

          <Card style={styles.card}>
            <View style={styles.metadata}>
              <PriorityBadge priority={task.priority as TaskPriority} />
              {task.task_categories ? (
                <CategoryChip color={task.task_categories.color} label={task.task_categories.name} />
              ) : null}
            </View>
            <DueDateLabel
              dueDate={task.due_date}
              dueTime={task.due_time}
              isCompleted={task.is_completed}
            />
            {task.reminder_at ? (
              <View style={styles.reminder}>
                <BellRing color={colors.primary} size={sizing.iconSmall} />
                <AppText tone="secondary" variant="bodySmall">
                  Reminder {new Intl.DateTimeFormat(undefined, { dateStyle: 'medium', timeStyle: 'short' }).format(new Date(task.reminder_at))}
                </AppText>
              </View>
            ) : null}
          </Card>

          <Card style={styles.card}>
            <AppText variant="title">Description</AppText>
            <AppText tone={task.description ? 'secondary' : 'muted'}>
              {task.description || 'No description was added.'}
            </AppText>
          </Card>

          <Button
            label={task.is_completed ? 'Restore task' : 'Mark complete'}
            loading={toggleMutation.isPending}
            onPress={() => void toggleTask()}
            variant={task.is_completed ? 'secondary' : 'primary'}
          />

          <DeleteConfirmation
            loading={deleteMutation.isPending}
            onCancel={() => setShowDelete(false)}
            onConfirm={() => void confirmDelete()}
            taskTitle={task.title}
            visible={showDelete}
          />
        </>
      ) : null}
    </Screen>
  );
}

const styles = StyleSheet.create({
  card: {
    gap: spacing.md,
  },
  headerActions: {
    flexDirection: 'row',
    gap: spacing.xs,
  },
  metadata: {
    alignItems: 'center',
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.xs,
  },
  reminder: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: spacing.xs,
  },
  screen: {
    gap: spacing.lg,
  },
});
