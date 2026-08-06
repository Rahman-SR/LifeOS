import { useCallback } from 'react';
import { FlatList, RefreshControl, StyleSheet } from 'react-native';
import type { ListRenderItem } from 'react-native';

import { ErrorState, LoadingState } from '@/components/feedback';
import { useAppTheme } from '@/hooks/use-app-theme';
import { spacing } from '@/theme';

import type { TaskFilter, TaskWithCategory } from '../task-types';
import { TaskCard } from './task-card';
import { TaskEmptyState } from './task-empty-state';

type TaskListProps = {
  error: string | null;
  filter: TaskFilter;
  isLoading: boolean;
  onCreate: () => void;
  onOpen: (taskId: string) => void;
  onRefresh: () => void;
  onRetry: () => void;
  onToggle: (taskId: string, completed: boolean) => void;
  refreshing: boolean;
  tasks: TaskWithCategory[];
};

export function TaskList({
  error,
  filter,
  isLoading,
  onCreate,
  onOpen,
  onRefresh,
  onRetry,
  onToggle,
  refreshing,
  tasks,
}: TaskListProps) {
  const { colors } = useAppTheme();
  const renderTask = useCallback<ListRenderItem<TaskWithCategory>>(
    ({ item }) => <TaskCard onOpen={onOpen} onToggle={onToggle} task={item} />,
    [onOpen, onToggle],
  );

  if (isLoading) return <LoadingState label="Loading tasks…" />;
  if (error) return <ErrorState description={error} onRetry={onRetry} title="Tasks could not be loaded" />;

  return (
    <FlatList
      contentContainerStyle={[styles.content, tasks.length === 0 && styles.emptyContent]}
      data={tasks}
      keyExtractor={(task) => task.id}
      ListEmptyComponent={<TaskEmptyState filter={filter} onCreate={onCreate} />}
      refreshControl={
        <RefreshControl
          accessibilityLabel="Refresh task list"
          colors={[colors.primary]}
          onRefresh={onRefresh}
          refreshing={refreshing}
          tintColor={colors.primary}
        />
      }
      renderItem={renderTask}
      showsVerticalScrollIndicator={false}
      style={styles.list}
    />
  );
}

const styles = StyleSheet.create({
  content: {
    gap: spacing.sm,
    paddingBottom: spacing.giant,
  },
  emptyContent: {
    flexGrow: 1,
    justifyContent: 'center',
  },
  list: {
    flex: 1,
  },
});
