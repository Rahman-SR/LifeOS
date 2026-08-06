import type { GoalFilter, GoalStatus } from './goal-types';

export const goalFilterOptions: ReadonlyArray<{ label: string; value: GoalFilter }> = [
  { label: 'Active', value: 'active' },
  { label: 'Completed', value: 'completed' },
  { label: 'Paused', value: 'paused' },
  { label: 'Archived', value: 'archived' },
];

export const goalStatusOptions: ReadonlyArray<{ label: string; value: GoalStatus }> = [
  { label: 'Active', value: 'active' },
  { label: 'Paused', value: 'paused' },
  { label: 'Completed', value: 'completed' },
  { label: 'Archived', value: 'archived' },
];

export function getGoalStatusLabel(status: GoalStatus): string {
  return goalStatusOptions.find((option) => option.value === status)?.label ?? status;
}
