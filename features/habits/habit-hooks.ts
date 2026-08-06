import { useMutation, useQuery, useQueryClient, type QueryKey } from '@tanstack/react-query';
import { useMemo } from 'react';

import { cancelHabitReminders, scheduleHabitReminders } from '@/lib/notifications';

import { getHabitDateKey, isHabitScheduled } from './habit-date-utils';
import { habitKeys } from './habit-query-keys';
import {
  adjustHabitCompletion,
  createHabit,
  deleteHabit,
  fetchHabit,
  fetchHabitLogs,
  fetchHabits,
  updateHabit,
} from './habit-service';
import { calculateHabitStats } from './habit-streak-utils';
import type { Habit, HabitFilter, HabitLog, HabitMutationResult, HabitMutationValues, HabitWithProgress } from './habit-types';

function message(error: unknown): string {
  return error instanceof Error ? error.message : 'Something went wrong. Please try again.';
}

function withProgress(habits: Habit[], logs: HabitLog[], today = new Date()): HabitWithProgress[] {
  const todayKey = getHabitDateKey(today);
  const logsByHabit = new Map<string, HabitLog[]>();
  logs.forEach((log) => {
    const habitLogs = logsByHabit.get(log.habit_id);
    if (habitLogs) habitLogs.push(log);
    else logsByHabit.set(log.habit_id, [log]);
  });
  return habits.map((habit) => {
    const habitLogs = logsByHabit.get(habit.id) ?? [];
    const todayCount = habitLogs.find((log) => log.log_date === todayKey)?.completed_count ?? 0;
    return {
      ...habit,
      ...calculateHabitStats({
        frequencyType: habit.frequency_type === 'daily' ? 'daily' : 'weekly',
        logs: habitLogs,
        targetCount: habit.target_count,
        today,
        weekdays: habit.days_of_week,
      }),
      completedToday: todayCount >= habit.target_count,
      scheduledToday: isHabitScheduled(habit.frequency_type, habit.days_of_week, today),
      todayCount,
    };
  });
}

async function syncHabitReminder(habit: Habit): Promise<string | null> {
  try {
    if (!habit.is_active || !habit.reminder_time) await cancelHabitReminders(habit.id);
    else await scheduleHabitReminders(
      habit.id,
      habit.name,
      habit.frequency_type === 'daily' ? 'daily' : 'weekly',
      habit.days_of_week,
      habit.reminder_time,
    );
    return null;
  } catch (error) {
    return message(error);
  }
}

export function useHabitListData(userId: string | undefined, filter: HabitFilter) {
  const habitsQuery = useQuery({
    enabled: Boolean(userId),
    queryFn: () => fetchHabits(userId!, filter),
    queryKey: [...habitKeys.lists(userId ?? 'signed-out'), filter],
  });
  const logsQuery = useQuery({
    enabled: Boolean(userId),
    queryFn: () => fetchHabitLogs(userId!),
    queryKey: habitKeys.logs(userId ?? 'signed-out'),
  });
  const data = useMemo(() => {
    const habits = withProgress(habitsQuery.data ?? [], logsQuery.data ?? []);
    return filter === 'today' ? habits.filter((habit) => habit.scheduledToday) : habits;
  }, [filter, habitsQuery.data, logsQuery.data]);
  return { data, habitsQuery, logsQuery };
}

export function useHabitDetails(userId: string | undefined, habitId: string | undefined) {
  const habitQuery = useQuery({ enabled: Boolean(userId && habitId), queryFn: () => fetchHabit(userId!, habitId!), queryKey: habitKeys.detail(userId ?? 'signed-out', habitId ?? 'missing') });
  const logsQuery = useQuery({ enabled: Boolean(userId && habitId), queryFn: () => fetchHabitLogs(userId!, habitId!), queryKey: [...habitKeys.detail(userId ?? 'signed-out', habitId ?? 'missing'), 'logs'] });
  const habit = useMemo(
    () => habitQuery.data ? withProgress([habitQuery.data], logsQuery.data ?? [])[0] : undefined,
    [habitQuery.data, logsQuery.data],
  );
  return { habit, habitQuery, logs: logsQuery.data ?? [], logsQuery };
}

export function useCreateHabitMutation(userId: string) {
  const client = useQueryClient();
  return useMutation<HabitMutationResult, Error, HabitMutationValues>({ mutationFn: async (values) => {
    const habit = await createHabit(userId, values);
    const result = { habit, reminderWarning: await syncHabitReminder(habit) };
    await client.invalidateQueries({ queryKey: habitKeys.all(userId) }).catch(() => undefined);
    return result;
  }});
}

export function useUpdateHabitMutation(userId: string, habitId: string) {
  const client = useQueryClient();
  return useMutation<HabitMutationResult, Error, HabitMutationValues>({ mutationFn: async (values) => {
    const habit = await updateHabit(userId, habitId, values);
    const result = { habit, reminderWarning: await syncHabitReminder(habit) };
    await client.invalidateQueries({ queryKey: habitKeys.all(userId) }).catch(() => undefined);
    return result;
  }});
}

export function useArchiveHabitMutation(userId: string) {
  const client = useQueryClient();
  return useMutation({ mutationFn: async ({ habitId, isActive }: { habitId: string; isActive: boolean }) => {
    const habit = await updateHabit(userId, habitId, { is_active: isActive });
    const reminderWarning = isActive ? await syncHabitReminder(habit) : await cancelHabitReminders(habitId).then(() => null, message);
    return { habit, reminderWarning };
  }, onSuccess: () => { void client.invalidateQueries({ queryKey: habitKeys.all(userId) }); } });
}

export function useDeleteHabitMutation(userId: string) {
  const client = useQueryClient();
  return useMutation({ mutationFn: async (habitId: string) => {
    await deleteHabit(userId, habitId);
    const reminderWarning = await cancelHabitReminders(habitId).then(() => null, message);
    return { habitId, reminderWarning };
  }, onSuccess: () => { void client.invalidateQueries({ queryKey: habitKeys.all(userId) }); } });
}

type CompletionContext = { snapshots: Array<[QueryKey, unknown]> };
export function useAdjustHabitCompletionMutation(userId: string) {
  const client = useQueryClient();
  return useMutation<number, Error, { delta: -1 | 1; habit: HabitWithProgress }, CompletionContext>({
    mutationFn: ({ delta, habit }) => adjustHabitCompletion(userId, habit.id, delta),
    onMutate: async ({ delta, habit }) => {
      await client.cancelQueries({ queryKey: habitKeys.all(userId) });
      const snapshots = client.getQueriesData({ queryKey: habitKeys.all(userId) });
      const nextCount = Math.max(0, Math.min(habit.target_count, habit.todayCount + delta));
      const today = getHabitDateKey();
      client.setQueryData<HabitLog[]>(habitKeys.logs(userId), (current = []) => {
        const rest = current.filter((log) => !(log.habit_id === habit.id && log.log_date === today));
        if (nextCount === 0) return rest;
        return [{ id: `optimistic-${habit.id}`, user_id: userId, habit_id: habit.id, log_date: today, completed_count: nextCount, note: null, created_at: new Date().toISOString(), updated_at: new Date().toISOString() }, ...rest];
      });
      return { snapshots };
    },
    onError: (_error, _variables, context) => context?.snapshots.forEach(([key, value]) => client.setQueryData(key, value)),
    onSettled: () => { void client.invalidateQueries({ queryKey: habitKeys.all(userId) }); },
  });
}
