import { getSupabaseClient } from '@/lib/supabase';

import { getLocalDateKey } from './task-date-utils';
import type {
  TaskCategory,
  TaskFilter,
  TaskMutationValues,
  TaskUpdate,
  TaskWithCategory,
} from './task-types';

const taskSelect = `
  *,
  task_categories (
    id,
    name,
    color,
    icon
  )
`;

const defaultCategories = [
  { color: '#5B67F1', icon: 'user-round', name: 'Personal', position: 0 },
  { color: '#2E90FA', icon: 'briefcase-business', name: 'Work', position: 1 },
  { color: '#F79009', icon: 'book-open', name: 'Study', position: 2 },
  { color: '#12B76A', icon: 'heart-pulse', name: 'Health', position: 3 },
  { color: '#F04438', icon: 'shopping-bag', name: 'Shopping', position: 4 },
] as const;

export async function fetchTaskCategories(userId: string): Promise<TaskCategory[]> {
  const client = getSupabaseClient();
  const { data: existing, error: existingError } = await client
    .from('task_categories')
    .select('*')
    .eq('user_id', userId)
    .order('position', { ascending: true })
    .order('name', { ascending: true });

  if (existingError) throw existingError;
  if (existing.length > 0) return existing;

  const { error: seedError } = await client.from('task_categories').upsert(
    defaultCategories.map((category) => ({ ...category, user_id: userId })),
    { ignoreDuplicates: true, onConflict: 'user_id,name' },
  );

  if (seedError) throw seedError;

  const { data, error } = await client
    .from('task_categories')
    .select('*')
    .eq('user_id', userId)
    .order('position', { ascending: true })
    .order('name', { ascending: true });

  if (error) throw error;
  return data;
}

export async function fetchTasks(userId: string, filter: TaskFilter): Promise<TaskWithCategory[]> {
  const today = getLocalDateKey();
  let query = getSupabaseClient()
    .from('tasks')
    .select(taskSelect)
    .eq('user_id', userId)
    .is('archived_at', null);

  if (filter === 'completed') {
    query = query.eq('is_completed', true).order('completed_at', { ascending: false });
  } else {
    query = query.eq('is_completed', false);
    if (filter === 'today') query = query.eq('due_date', today);
    if (filter === 'upcoming') query = query.gt('due_date', today);
    if (filter === 'overdue') query = query.lt('due_date', today);
    query = query
      .order('due_time', { ascending: true, nullsFirst: false })
      .order('created_at', { ascending: true });
  }

  const { data, error } = await query;
  if (error) throw error;
  return data as unknown as TaskWithCategory[];
}

export async function fetchTodayTaskSummary(userId: string): Promise<TaskWithCategory[]> {
  const { data, error } = await getSupabaseClient()
    .from('tasks')
    .select(taskSelect)
    .eq('user_id', userId)
    .eq('due_date', getLocalDateKey())
    .is('archived_at', null)
    .order('due_time', { ascending: true, nullsFirst: false })
    .order('created_at', { ascending: true });

  if (error) throw error;
  return data as unknown as TaskWithCategory[];
}

export async function fetchTask(userId: string, taskId: string): Promise<TaskWithCategory> {
  const { data, error } = await getSupabaseClient()
    .from('tasks')
    .select(taskSelect)
    .eq('user_id', userId)
    .eq('id', taskId)
    .is('archived_at', null)
    .single();

  if (error) throw error;
  return data as unknown as TaskWithCategory;
}

export async function createTask(
  userId: string,
  values: TaskMutationValues,
): Promise<TaskWithCategory> {
  const { data, error } = await getSupabaseClient()
    .from('tasks')
    .insert({
      ...values,
      is_completed: false,
      position: 0,
      recurrence_rule: null,
      user_id: userId,
    })
    .select(taskSelect)
    .single();

  if (error) throw error;
  return data as unknown as TaskWithCategory;
}

export async function updateTask(
  userId: string,
  taskId: string,
  values: TaskUpdate,
): Promise<TaskWithCategory> {
  const { data, error } = await getSupabaseClient()
    .from('tasks')
    .update(values)
    .eq('user_id', userId)
    .eq('id', taskId)
    .select(taskSelect)
    .single();

  if (error) throw error;
  return data as unknown as TaskWithCategory;
}

export async function setTaskCompleted(
  userId: string,
  taskId: string,
  completed: boolean,
): Promise<TaskWithCategory> {
  return updateTask(userId, taskId, {
    completed_at: completed ? new Date().toISOString() : null,
    is_completed: completed,
  });
}

export async function deleteTask(userId: string, taskId: string): Promise<void> {
  const { data, error } = await getSupabaseClient()
    .from('tasks')
    .delete()
    .eq('user_id', userId)
    .eq('id', taskId)
    .select('id')
    .single();

  if (error) throw error;
  if (!data) throw new Error('Task not found or you do not have permission to delete it.');
}
