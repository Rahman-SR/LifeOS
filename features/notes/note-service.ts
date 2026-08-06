import { getSupabaseClient } from '@/lib/supabase';

import type { Note, NoteFilter, NoteMutationValues } from './note-types';

const noteColumns = 'id,user_id,title,content,color,is_pinned,archived_at,created_at,updated_at';

function requireUser(userId: string) {
  if (!userId) throw new Error('Your session is not ready. Please sign in again.');
}

export async function fetchNotes(userId: string, filter: NoteFilter): Promise<Note[]> {
  requireUser(userId);
  let query = getSupabaseClient().from('notes').select(noteColumns).eq('user_id', userId);

  if (filter === 'archived') {
    query = query.not('archived_at', 'is', null);
  } else {
    query = query.is('archived_at', null);
    if (filter === 'pinned') query = query.eq('is_pinned', true);
    query = query.order('is_pinned', { ascending: false });
  }

  query = query.order('updated_at', { ascending: false });
  if (filter === 'recent') query = query.limit(20);

  const { data, error } = await query;
  if (error) throw error;
  return data;
}

export async function fetchRecentNote(userId: string): Promise<Note | null> {
  requireUser(userId);
  const { data, error } = await getSupabaseClient()
    .from('notes')
    .select(noteColumns)
    .eq('user_id', userId)
    .is('archived_at', null)
    .order('updated_at', { ascending: false })
    .limit(1)
    .maybeSingle();
  if (error) throw error;
  return data;
}

export async function fetchNote(userId: string, noteId: string): Promise<Note> {
  requireUser(userId);
  const { data, error } = await getSupabaseClient()
    .from('notes')
    .select(noteColumns)
    .eq('user_id', userId)
    .eq('id', noteId)
    .single();
  if (error) throw error;
  return data;
}

export async function createNote(userId: string, values: NoteMutationValues): Promise<Note> {
  requireUser(userId);
  const { data, error } = await getSupabaseClient()
    .from('notes')
    .insert({ ...values, user_id: userId })
    .select(noteColumns)
    .single();
  if (error) throw error;
  return data;
}

export async function updateNote(
  userId: string,
  noteId: string,
  values: Partial<NoteMutationValues> & { archived_at?: string | null },
): Promise<Note> {
  requireUser(userId);
  const { data, error } = await getSupabaseClient()
    .from('notes')
    .update(values)
    .eq('user_id', userId)
    .eq('id', noteId)
    .select(noteColumns)
    .single();
  if (error) throw error;
  return data;
}

export async function deleteNote(userId: string, noteId: string): Promise<void> {
  requireUser(userId);
  const { data, error } = await getSupabaseClient()
    .from('notes')
    .delete()
    .eq('user_id', userId)
    .eq('id', noteId)
    .select('id')
    .single();
  if (error) throw error;
  if (!data) throw new Error('Note not found or you do not have permission to delete it.');
}
