import { useMemo } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { useAuth } from '@/hooks/use-auth';
import { getDateKey } from '@/lib/local-date';

import { goalKeys } from './goal-query-keys';
import {
  createMilestone,
  deleteGoal,
  deleteMilestone,
  fetchGoal,
  fetchGoals,
  fetchGoalSummaryRows,
  fetchPrimaryGoal,
  reorderMilestones,
  saveGoalWithMilestones,
  updateGoalProgress,
  updateGoalStatus,
  updateMilestone,
} from './goal-service';
import { calculateGoalSummary } from './goal-summary';
import type { Goal, GoalFilter, GoalMilestone, GoalMutationValues, GoalStatus } from './goal-types';

function invalidateGoalViews(client: ReturnType<typeof useQueryClient>, userId: string) {
  void client.invalidateQueries({ queryKey: goalKeys.all(userId) });
}

export function useGoalsQuery(userId: string | undefined, filter: GoalFilter) {
  return useQuery({ enabled: Boolean(userId), queryFn: () => fetchGoals(userId!, filter), queryKey: goalKeys.list(userId ?? 'signed-out', filter) });
}

export function useGoalDetails(userId: string | undefined, goalId: string | undefined) {
  return useQuery({ enabled: Boolean(userId && goalId), queryFn: () => fetchGoal(userId!, goalId!), queryKey: goalKeys.detail(userId ?? 'signed-out', goalId ?? 'missing') });
}

export function usePrimaryGoalQuery(userId: string | undefined) {
  return useQuery({ enabled: Boolean(userId), queryFn: () => fetchPrimaryGoal(userId!), queryKey: goalKeys.dashboardPrimary(userId ?? 'signed-out') });
}

export function useGoalSummary(userId: string | undefined) {
  const { profile } = useAuth();
  const query = useQuery({ enabled: Boolean(userId), queryFn: () => fetchGoalSummaryRows(userId!), queryKey: goalKeys.summary(userId ?? 'signed-out') });
  const summary = useMemo(() => calculateGoalSummary(query.data ?? [], getDateKey(new Date(), profile?.timezone), profile?.timezone), [profile?.timezone, query.data]);
  return { ...query, summary };
}

export function useSaveGoalMutation(userId: string, goalId: string | null = null) {
  const client = useQueryClient();
  return useMutation({
    mutationFn: (values: GoalMutationValues) => saveGoalWithMilestones(userId, goalId, values),
    onSuccess: (goal) => {
      client.setQueryData(goalKeys.detail(userId, goal.id), goal);
      invalidateGoalViews(client, userId);
    },
  });
}

export function useGoalStatusMutation(userId: string) {
  const client = useQueryClient();
  return useMutation({ mutationFn: ({ goal, status }: { goal: Goal; status: GoalStatus }) => updateGoalStatus(userId, goal, status), onSettled: () => invalidateGoalViews(client, userId) });
}

export function useGoalProgressMutation(userId: string) {
  const client = useQueryClient();
  return useMutation({ mutationFn: ({ goalId, progress }: { goalId: string; progress: number }) => updateGoalProgress(userId, goalId, progress), onSettled: () => invalidateGoalViews(client, userId) });
}

export function useDeleteGoalMutation(userId: string) {
  const client = useQueryClient();
  return useMutation({ mutationFn: (goalId: string) => deleteGoal(userId, goalId), onSettled: () => invalidateGoalViews(client, userId) });
}

export function useMilestoneMutations(userId: string, goalId: string) {
  const client = useQueryClient();
  const done = () => invalidateGoalViews(client, userId);
  return {
    create: useMutation({ mutationFn: ({ position, title }: { position: number; title: string }) => createMilestone(userId, goalId, title, position), onSettled: done }),
    delete: useMutation({ mutationFn: (id: string) => deleteMilestone(userId, goalId, id), onSettled: done }),
    reorder: useMutation({ mutationFn: (items: GoalMilestone[]) => reorderMilestones(userId, goalId, items), onSettled: done }),
    update: useMutation({ mutationFn: ({ id, values }: { id: string; values: Partial<Pick<GoalMilestone, 'completed_at' | 'is_completed' | 'position' | 'title'>> }) => updateMilestone(userId, goalId, id, values), onSettled: done }),
  };
}
