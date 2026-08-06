import { getSupabaseClient } from '@/lib/supabase';

import { getHabitDateKey } from './habit-date-utils';
import type { Habit, HabitFilter, HabitLog, HabitMutationValues } from './habit-types';

export async function fetchHabits(userId: string, filter: HabitFilter): Promise<Habit[]> {
  let query = getSupabaseClient().from('habits').select('*').eq('user_id', userId);
  query = filter === 'archived' ? query.eq('is_active', false) : query.eq('is_active', true);
  const { data, error } = await query.order('position').order('created_at');
  if (error) throw error;
  return data;
}

export async function fetchHabit(userId: string, habitId: string): Promise<Habit> {
  const { data, error } = await getSupabaseClient().from('habits').select('*')
    .eq('user_id', userId).eq('id', habitId).single();
  if (error) throw error;
  return data;
}

export async function fetchHabitLogs(userId: string, habitId?: string): Promise<HabitLog[]> {
  let query = getSupabaseClient().from('habit_logs').select('*').eq('user_id', userId);
  if (habitId) query = query.eq('habit_id', habitId);
  const { data, error } = await query.order('log_date', { ascending: false });
  if (error) throw error;
  return data;
}

export async function createHabit(userId: string, values: HabitMutationValues): Promise<Habit> {
  if (!userId) throw new Error('Your session is not ready. Please sign in again.');
  const { data, error } = await getSupabaseClient().from('habits').insert({
    ...values, is_active: true, position: 0, user_id: userId,
  }).select('*').single();
  if (error) throw error;
  return data;
}

export async function updateHabit(userId: string, habitId: string, values: Partial<HabitMutationValues> & { is_active?: boolean }): Promise<Habit> {
  const { data, error } = await getSupabaseClient().from('habits').update(values)
    .eq('user_id', userId).eq('id', habitId).select('*').single();
  if (error) throw error;
  return data;
}

export async function deleteHabit(userId: string, habitId: string): Promise<void> {
  const { data, error } = await getSupabaseClient().from('habits').delete()
    .eq('user_id', userId).eq('id', habitId).select('id').single();
  if (error) throw error;
  if (!data) throw new Error('Habit not found or you do not have permission to delete it.');
}

export async function adjustHabitCompletion(userId: string, habitId: string, delta: -1 | 1): Promise<number> {
  if (!userId) throw new Error('Your session is not ready. Please sign in again.');
  const { data, error } = await getSupabaseClient().rpc('adjust_habit_completion', {
    p_delta: delta, p_habit_id: habitId, p_log_date: getHabitDateKey(),
  });
  if (error) throw error;
  return data;
}
