import type { TaskFilter } from './task-types';

export const taskKeys = {
  all: (userId: string) => ['tasks', userId] as const,
  categories: (userId: string) => ['task-categories', userId] as const,
  detail: (userId: string, taskId: string) => [...taskKeys.details(userId), taskId] as const,
  details: (userId: string) => [...taskKeys.all(userId), 'detail'] as const,
  list: (userId: string, filter: TaskFilter) => [...taskKeys.lists(userId), filter] as const,
  lists: (userId: string) => [...taskKeys.all(userId), 'list'] as const,
  todaySummary: (userId: string) => [...taskKeys.all(userId), 'today-summary'] as const,
};
