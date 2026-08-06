import { formatDateKey, parseDateKey } from '@/lib/local-date';

import type { GoalStatus } from './goal-types';

export function isGoalTargetDateAllowed({
  initialTargetDate,
  mode,
  targetDate,
  todayDate,
}: {
  initialTargetDate?: string | null;
  mode: 'create' | 'edit';
  targetDate: string;
  todayDate: string;
}): boolean {
  if (!targetDate) return true;
  if (!parseDateKey(targetDate)) return false;
  if (targetDate >= todayDate) return true;
  return mode === 'edit' && Boolean(initialTargetDate && targetDate === initialTargetDate);
}

export function isGoalOverdue(goal: { status: GoalStatus | string; target_date: string | null }, todayDate: string): boolean {
  return goal.status === 'active' && Boolean(goal.target_date && goal.target_date < todayDate);
}

export function formatGoalTargetDate(targetDate: string | null): string {
  return targetDate
    ? formatDateKey(targetDate, { day: 'numeric', month: 'short', year: 'numeric' })
    : 'No target date';
}
