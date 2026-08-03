import type { Tables, TablesInsert, TablesUpdate } from '@/types/database';

export type TaskPriority = 'low' | 'medium' | 'high';
export type TaskFilter = 'today' | 'upcoming' | 'overdue' | 'completed';
export type Task = Tables<'tasks'>;
export type TaskCategory = Tables<'task_categories'>;
export type TaskInsert = TablesInsert<'tasks'>;
export type TaskUpdate = TablesUpdate<'tasks'>;

export type TaskWithCategory = Task & {
  task_categories: Pick<TaskCategory, 'color' | 'icon' | 'id' | 'name'> | null;
};

export type TaskMutationValues = {
  category_id: string | null;
  description: string | null;
  due_date: string | null;
  due_time: string | null;
  priority: TaskPriority;
  reminder_at: string | null;
  title: string;
};

export type TaskMutationResult = {
  reminderWarning: string | null;
  task: TaskWithCategory;
};
