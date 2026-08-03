import { router, useLocalSearchParams } from 'expo-router';
import { ArrowLeft } from 'lucide-react-native';
import { Alert, StyleSheet } from 'react-native';

import { ErrorState, LoadingState } from '@/components/feedback';
import { AppHeader, IconButton, Screen } from '@/components/ui';
import {
  TaskForm,
  fromDatabaseTime,
  useTask,
  useTaskCategories,
  useUpdateTaskMutation,
  type TaskFormValues,
  type TaskPriority,
} from '@/features/tasks';
import { useAuth } from '@/hooks/use-auth';
import { spacing } from '@/theme';

export default function EditTaskScreen() {
  const { user } = useAuth();
  const params = useLocalSearchParams<{ id?: string }>();
  const taskId = typeof params.id === 'string' ? params.id : undefined;
  const userId = user!.id;
  const taskQuery = useTask(userId, taskId);
  const categoriesQuery = useTaskCategories(userId);
  const updateMutation = useUpdateTaskMutation(userId, taskId ?? 'missing');
  const task = taskQuery.data;

  const initialValues: TaskFormValues | undefined = task
    ? {
        categoryId: task.category_id ?? '',
        description: task.description ?? '',
        dueDate: task.due_date ?? '',
        dueTime: fromDatabaseTime(task.due_time),
        priority: task.priority as TaskPriority,
        reminderEnabled: Boolean(
          task.reminder_at &&
            !task.is_completed &&
            new Date(task.reminder_at).getTime() > Date.now(),
        ),
        title: task.title,
      }
    : undefined;

  const loading = taskQuery.isLoading || categoriesQuery.isLoading;
  const error = taskQuery.error || categoriesQuery.error;

  return (
    <Screen contentContainerStyle={styles.screen} scroll={false}>
      <AppHeader
        action={<IconButton icon={ArrowLeft} label="Go back" onPress={() => router.back()} />}
        eyebrow="TASK"
        subtitle="Update the details that help you follow through."
        title="Edit task"
      />
      {loading ? <LoadingState label="Loading task…" /> : null}
      {error ? (
        <ErrorState
          description="This task could not be loaded. It may not exist or may belong to another account."
          onRetry={() => void Promise.all([taskQuery.refetch(), categoriesQuery.refetch()])}
          title="Task unavailable"
        />
      ) : null}
      {task && initialValues && categoriesQuery.data ? (
        <TaskForm
          categories={categoriesQuery.data}
          initialValues={initialValues}
          onCancel={() => router.back()}
          onSubmit={async (values) => {
            const result = await updateMutation.mutateAsync(values);
            Alert.alert(
              'Task updated',
              result.reminderWarning
                ? `Your changes were saved. ${result.reminderWarning}`
                : 'Your changes were saved.',
              [{ onPress: () => router.back(), text: 'Done' }],
            );
          }}
          submitLabel="Save changes"
        />
      ) : null}
    </Screen>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    gap: spacing.md,
  },
});
