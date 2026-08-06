import { getSupabaseClient } from '@/lib/supabase';

import type { MoodLog, MoodMutationValues } from './mood-types';

const columns = 'id,user_id,mood_date,mood,note,created_at,updated_at';

function requireUser(userId: string) {
  if (!userId) throw new Error('Your session is not ready. Please sign in again.');
}

export async function fetchMoodForDate(userId: string, moodDate: string): Promise<MoodLog | null> {
  requireUser(userId);
  const { data, error } = await getSupabaseClient()
    .from('mood_logs')
    .select(columns)
    .eq('user_id', userId)
    .eq('mood_date', moodDate)
    .maybeSingle();
  if (error) throw error;
  return data as MoodLog | null;
}

export async function fetchMoodHistory(userId: string): Promise<MoodLog[]> {
  requireUser(userId);
  const { data, error } = await getSupabaseClient()
    .from('mood_logs')
    .select(columns)
    .eq('user_id', userId)
    .order('mood_date', { ascending: false })
    .limit(120);
  if (error) throw error;
  return data as MoodLog[];
}

export async function saveDailyMood(userId: string, values: MoodMutationValues): Promise<MoodLog> {
  requireUser(userId);
  const { data, error } = await getSupabaseClient()
    .from('mood_logs')
    .upsert({ ...values, user_id: userId }, { onConflict: 'user_id,mood_date' })
    .select(columns)
    .single();
  if (error) throw error;
  return data as MoodLog;
}
