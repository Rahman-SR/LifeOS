import * as Haptics from 'expo-haptics';
import { router } from 'expo-router';
import { Plus } from 'lucide-react-native';
import { useCallback, useState } from 'react';
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
  const toggleTaskAsync = toggleMutation.mutateAsync;
  const refetchTasks = tasksQuery.refetch;
  const refetchCategories = categoriesQuery.refetch;

  const toggleTask = useCallback(async (taskId: string, completed: boolean) => {
    void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => undefined);
    try {
      const result = await toggleTaskAsync({ completed, taskId });
      if (result.reminderWarning) Alert.alert('Reminder update', result.reminderWarning);
    } catch (error) {
      Alert.alert(
        'Task was not updated',
        error instanceof Error ? error.message : 'Please try again.',
      );
    }
  }, [toggleTaskAsync]);

  const refresh = useCallback(async () => {
    await Promise.all([refetchTasks(), refetchCategories()]);
  }, [refetchCategories, refetchTasks]);
  const createTask = useCallback(() => router.push('/tasks/create'), []);
  const openTask = useCallback((taskId: string) => router.push(`/tasks/${taskId}`), []);
  const retryTasks = useCallback(() => { void refetchTasks(); }, [refetchTasks]);

  return (
    <Screen contentContainerStyle={styles.screen} scroll={false}>
      <AppHeader
        action={<IconButton icon={Plus} label="Create task" onPress={createTask} />}
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
          onCreate={createTask}
          onOpen={openTask}
          onRefresh={refresh}
          onRetry={retryTasks}
          onToggle={toggleTask}
          refreshing={tasksQuery.isRefetching && !tasksQuery.isLoading}
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
