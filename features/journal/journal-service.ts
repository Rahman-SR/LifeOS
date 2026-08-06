import { getSupabaseClient } from '@/lib/supabase';

import type { JournalEntry, JournalMutationValues } from './journal-types';

const columns = 'id,user_id,entry_date,title,content,went_well,was_difficult,improve_tomorrow,created_at,updated_at';

function requireUser(userId: string) {
  if (!userId) throw new Error('Your session is not ready. Please sign in again.');
}

export async function fetchJournalForDate(userId: string, date: string): Promise<JournalEntry | null> {
  requireUser(userId);
  const { data, error } = await getSupabaseClient().from('journal_entries').select(columns).eq('user_id', userId).eq('entry_date', date).maybeSingle();
  if (error) throw error;
  return data as JournalEntry | null;
}

export async function fetchJournalHistory(userId: string): Promise<JournalEntry[]> {
  requireUser(userId);
  const { data, error } = await getSupabaseClient().from('journal_entries').select(columns).eq('user_id', userId).order('entry_date', { ascending: false }).limit(200);
  if (error) throw error;
  return data as JournalEntry[];
}

export async function fetchJournalEntry(userId: string, id: string): Promise<JournalEntry> {
  requireUser(userId);
  const { data, error } = await getSupabaseClient().from('journal_entries').select(columns).eq('user_id', userId).eq('id', id).single();
  if (error) throw error;
  return data as JournalEntry;
}

export async function saveJournalForDate(userId: string, values: JournalMutationValues): Promise<JournalEntry> {
  requireUser(userId);
  const { data, error } = await getSupabaseClient().from('journal_entries').upsert({ ...values, user_id: userId }, { onConflict: 'user_id,entry_date' }).select(columns).single();
  if (error) throw error;
  return data as JournalEntry;
}

export async function updateJournalEntry(userId: string, id: string, values: Omit<JournalMutationValues, 'entry_date'>): Promise<JournalEntry> {
  requireUser(userId);
  const { data, error } = await getSupabaseClient().from('journal_entries').update(values).eq('user_id', userId).eq('id', id).select(columns).single();
  if (error) throw error;
  return data as JournalEntry;
}

export async function deleteJournalEntry(userId: string, id: string): Promise<void> {
  requireUser(userId);
  const { data, error } = await getSupabaseClient().from('journal_entries').delete().eq('user_id', userId).eq('id', id).select('id').single();
  if (error) throw error;
  if (!data) throw new Error('Journal entry not found or you do not have permission to delete it.');
}
