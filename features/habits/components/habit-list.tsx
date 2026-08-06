import { useCallback } from 'react';
import { FlatList, RefreshControl, StyleSheet } from 'react-native';
import type { ListRenderItem } from 'react-native';

import { ErrorState, LoadingState } from '@/components/feedback';
import { useAppTheme } from '@/hooks/use-app-theme';
import { spacing } from '@/theme';

import type { HabitFilter, HabitWithProgress } from '../habit-types';
import { HabitCard } from './habit-card';
import { HabitEmptyState } from './habit-empty-state';

type HabitListProps = {
  data: HabitWithProgress[];
  disabled?: boolean;
  error: string | null;
  filter: HabitFilter;
  isLoading: boolean;
  onCreate: () => void;
  onDecrement: (habit: HabitWithProgress) => void;
  onIncrement: (habit: HabitWithProgress) => void;
  onOpen: (id: string) => void;
  onRefresh: () => void;
  onRetry: () => void;
  refreshing: boolean;
};

export function HabitList({
  data,
  disabled,
  error,
  filter,
  isLoading,
  onCreate,
  onDecrement,
  onIncrement,
  onOpen,
  onRefresh,
  onRetry,
  refreshing,
}: HabitListProps) {
  const { colors } = useAppTheme();
  const renderHabit = useCallback<ListRenderItem<HabitWithProgress>>(
    ({ item }) => (
      <HabitCard
        disabled={disabled}
        habit={item}
        onDecrement={onDecrement}
        onIncrement={onIncrement}
        onOpen={onOpen}
      />
    ),
    [disabled, onDecrement, onIncrement, onOpen],
  );

  if (isLoading) return <LoadingState label="Loading habits…" />;
  if (error) {
    return <ErrorState description={error} onRetry={onRetry} title="Habits could not be loaded" />;
  }

  return (
    <FlatList
      contentContainerStyle={[styles.content, data.length === 0 && styles.empty]}
      data={data}
      keyExtractor={(item) => item.id}
      ListEmptyComponent={<HabitEmptyState filter={filter} onCreate={onCreate} />}
      refreshControl={
        <RefreshControl
          accessibilityLabel="Refresh habits"
          colors={[colors.primary]}
          onRefresh={onRefresh}
          refreshing={refreshing}
          tintColor={colors.primary}
        />
      }
      renderItem={renderHabit}
      showsVerticalScrollIndicator={false}
    />
  );
}

const styles = StyleSheet.create({
  content: { gap: spacing.sm, paddingBottom: spacing.giant },
  empty: { flexGrow: 1, justifyContent: 'center' },
});
