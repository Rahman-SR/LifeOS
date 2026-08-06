import type { GoalFilter } from './goal-types';

export const goalKeys = {
  all: (userId: string) => ['goals', userId] as const,
  dashboardPrimary: (userId: string) => [...goalKeys.all(userId), 'dashboard-primary'] as const,
  detail: (userId: string, goalId: string) => [...goalKeys.details(userId), goalId] as const,
  details: (userId: string) => [...goalKeys.all(userId), 'detail'] as const,
  list: (userId: string, filter: GoalFilter) => [...goalKeys.lists(userId), filter] as const,
  lists: (userId: string) => [...goalKeys.all(userId), 'list'] as const,
  summary: (userId: string) => [...goalKeys.all(userId), 'summary'] as const,
};
