import { router } from 'expo-router';
import { Plus } from 'lucide-react-native';
import { useCallback, useState } from 'react';
import { Alert, StyleSheet, View } from 'react-native';

import { AppHeader, IconButton, Screen } from '@/components/ui';
import {
  HabitFilterTabs,
  HabitList,
  useAdjustHabitCompletionMutation,
  useHabitListData,
  type HabitFilter,
  type HabitWithProgress,
} from '@/features/habits';
import { useAuth } from '@/hooks/use-auth';
import { spacing } from '@/theme';

export default function HabitsScreen() {
  const { user } = useAuth();
  const userId = user?.id ?? '';
  const [filter, setFilter] = useState<HabitFilter>('today');
  const { data, habitsQuery, logsQuery } = useHabitListData(userId, filter);
  const completion = useAdjustHabitCompletionMutation(userId);
  const adjustAsync = completion.mutateAsync;
  const refetchHabits = habitsQuery.refetch;
  const refetchLogs = logsQuery.refetch;

  const adjust = useCallback(async (habit: HabitWithProgress, delta: -1 | 1) => {
    try {
      await adjustAsync({ delta, habit });
    } catch (error) {
      Alert.alert('Habit was not updated', error instanceof Error ? error.message : 'Please try again.');
    }
  }, [adjustAsync]);
  const decrement = useCallback((habit: HabitWithProgress) => { void adjust(habit, -1); }, [adjust]);
  const increment = useCallback((habit: HabitWithProgress) => { void adjust(habit, 1); }, [adjust]);
  const createHabit = useCallback(() => router.push('/habits/create'), []);
  const openHabit = useCallback((id: string) => router.push(`/habits/${id}`), []);
  const refresh = useCallback(() => {
    void Promise.all([refetchHabits(), refetchLogs()]);
  }, [refetchHabits, refetchLogs]);
  const error = habitsQuery.error || logsQuery.error;

  return (
    <Screen contentContainerStyle={styles.screen} scroll={false}>
      <AppHeader
        action={<IconButton icon={Plus} label="Create habit" onPress={createHabit} />}
        eyebrow="CONSISTENCY"
        subtitle="Small steps, repeated on the right days."
        title="Habits"
      />
      <HabitFilterTabs onChange={setFilter} value={filter} />
      <View style={styles.list}>
        <HabitList
          data={data}
          disabled={completion.isPending || filter === 'archived'}
          error={error instanceof Error ? error.message : error ? 'Habits could not be loaded.' : null}
          filter={filter}
          isLoading={habitsQuery.isLoading || logsQuery.isLoading}
          onCreate={createHabit}
          onDecrement={decrement}
          onIncrement={increment}
          onOpen={openHabit}
          onRefresh={refresh}
          onRetry={refresh}
          refreshing={(habitsQuery.isRefetching || logsQuery.isRefetching) && !(habitsQuery.isLoading || logsQuery.isLoading)}
        />
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  list: { flex: 1 },
  screen: { flex: 1, gap: spacing.md },
});
