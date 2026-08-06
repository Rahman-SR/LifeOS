import { getDateKey, startOfMonthDateKey } from '@/lib/local-date';

import type { GoalSummary, GoalSummaryRow } from './goal-types';

export function calculateGoalSummary(
  goals: GoalSummaryRow[],
  todayDate: string,
  timeZone?: string | null,
): GoalSummary {
  const visibleGoals = goals.filter((goal) => goal.status !== 'archived');
  const monthStart = startOfMonthDateKey(todayDate);
  const active = goals.filter((goal) => goal.status === 'active');
  const completed = goals.filter((goal) => goal.status === 'completed');
  const totalProgress = visibleGoals.reduce((sum, goal) => sum + goal.progress, 0);

  return {
    activeCount: active.length,
    averageProgress: visibleGoals.length ? Math.round(totalProgress / visibleGoals.length) : 0,
    completedCount: completed.length,
    completedThisMonth: goals.filter((goal) => {
      if (!goal.completed_at) return false;
      const completionDate = getDateKey(new Date(goal.completed_at), timeZone);
      return completionDate >= monthStart && completionDate <= todayDate;
    }).length,
    overdueActiveCount: active.filter((goal) => Boolean(goal.target_date && goal.target_date < todayDate)).length,
  };
}
