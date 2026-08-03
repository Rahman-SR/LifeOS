import { router } from 'expo-router';
import { ArrowLeft } from 'lucide-react-native';
import { Alert, StyleSheet } from 'react-native';

import { ErrorState, LoadingState } from '@/components/feedback';
import { AppHeader, IconButton, Screen } from '@/components/ui';
import { TaskForm, useCreateTaskMutation, useTaskCategories } from '@/features/tasks';
import { useAuth } from '@/hooks/use-auth';
import { spacing } from '@/theme';

export default function CreateTaskScreen() {
  const { user } = useAuth();
  const userId = user!.id;
  const categoriesQuery = useTaskCategories(userId);
  const createMutation = useCreateTaskMutation(userId);

  return (
    <Screen contentContainerStyle={styles.screen} scroll={false}>
      <AppHeader
        action={<IconButton icon={ArrowLeft} label="Go back" onPress={() => router.back()} />}
        eyebrow="NEW TASK"
        subtitle="Add only the details that help you act."
        title="Create task"
      />
      {categoriesQuery.isLoading ? <LoadingState label="Preparing task categories…" /> : null}
      {categoriesQuery.error ? (
        <ErrorState
          description="Task categories could not be loaded."
          onRetry={() => void categoriesQuery.refetch()}
        />
      ) : null}
      {categoriesQuery.data ? (
        <TaskForm
          categories={categoriesQuery.data}
          onCancel={() => router.back()}
          onSubmit={async (values) => {
            const result = await createMutation.mutateAsync(values);
            Alert.alert(
              'Task created',
              result.reminderWarning
                ? `The task was saved. ${result.reminderWarning}`
                : 'Your task is ready.',
              [{ onPress: () => router.back(), text: 'Done' }],
            );
          }}
          submitLabel="Create task"
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
