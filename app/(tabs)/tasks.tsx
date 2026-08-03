import * as Haptics from 'expo-haptics';
import { router } from 'expo-router';
import { Plus } from 'lucide-react-native';
import { useState } from 'react';
import { Alert, StyleSheet, View } from 'react-native';

import { AppHeader, IconButton, Screen } from '@/components/ui';
import {
  TaskFilterTabs,
  TaskList,
  useTaskCategories,
  useTasks,
  useToggleTaskMutation,
  type TaskFilter,
} from '@/features/tasks';
import { useAuth } from '@/hooks/use-auth';
import { spacing } from '@/theme';

export default function TasksScreen() {
  const { user } = useAuth();
  const userId = user!.id;
  const [filter, setFilter] = useState<TaskFilter>('today');
  const tasksQuery = useTasks(userId, filter);
  const categoriesQuery = useTaskCategories(userId);
  const toggleMutation = useToggleTaskMutation(userId);

  const toggleTask = async (taskId: string, completed: boolean) => {
    void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => undefined);
    try {
      const result = await toggleMutation.mutateAsync({ completed, taskId });
      if (result.reminderWarning) Alert.alert('Reminder update', result.reminderWarning);
    } catch (error) {
      Alert.alert(
        'Task was not updated',
        error instanceof Error ? error.message : 'Please try again.',
      );
    }
  };

  const refresh = async () => {
    await Promise.all([tasksQuery.refetch(), categoriesQuery.refetch()]);
  };

  return (
    <Screen contentContainerStyle={styles.screen} scroll={false}>
      <AppHeader
        action={<IconButton icon={Plus} label="Create task" onPress={() => router.push('/tasks/create')} />}
        eyebrow="PLAN"
        subtitle="Keep the next action clear and manageable."
        title="Tasks"
      />
      <TaskFilterTabs onChange={setFilter} value={filter} />
      <View style={styles.list}>
        <TaskList
          error={
            tasksQuery.error
              ? tasksQuery.error instanceof Error
                ? tasksQuery.error.message
                : 'Tasks could not be loaded.'
              : null
          }
          filter={filter}
          isLoading={tasksQuery.isLoading}
          onCreate={() => router.push('/tasks/create')}
          onOpen={(taskId) => router.push(`/tasks/${taskId}`)}
          onRefresh={() => void refresh()}
          onRetry={() => void tasksQuery.refetch()}
          onToggle={(taskId, completed) => void toggleTask(taskId, completed)}
          refreshing={tasksQuery.isRefetching}
          tasks={tasksQuery.data ?? []}
        />
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  list: {
    flex: 1,
  },
  screen: {
    flex: 1,
    gap: spacing.md,
  },
});
