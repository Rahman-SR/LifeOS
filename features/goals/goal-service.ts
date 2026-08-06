import { getSupabaseClient } from '@/lib/supabase';

import type {
  Goal,
  GoalFilter,
  GoalMilestone,
  GoalMutationValues,
  GoalStatus,
  GoalSummaryRow,
  GoalWithMilestones,
} from './goal-types';

const goalColumns = 'id,user_id,title,description,target_date,status,progress,color,completed_at,created_at,updated_at';
const milestoneColumns = 'id,user_id,goal_id,title,is_completed,completed_at,position,created_at,updated_at';
const goalWithMilestonesColumns = `${goalColumns},goal_milestones(${milestoneColumns})`;

function requireUser(userId: string) {
  if (!userId) throw new Error('Your session is not ready. Please sign in again.');
}

function normalizeGoal(goal: GoalWithMilestones): GoalWithMilestones {
  return {
    ...goal,
    goal_milestones: [...(goal.goal_milestones ?? [])].sort(
      (left, right) => left.position - right.position || left.created_at.localeCompare(right.created_at),
    ),
  };
}

export async function fetchGoals(userId: string, filter: GoalFilter): Promise<GoalWithMilestones[]> {
  requireUser(userId);
  let query = getSupabaseClient()
    .from('goals')
    .select(goalWithMilestonesColumns)
    .eq('user_id', userId)
    .eq('status', filter);

  if (filter === 'active') {
    query = query
      .order('target_date', { ascending: true, nullsFirst: false })
      .order('updated_at', { ascending: false });
  } else if (filter === 'completed') {
    query = query
      .order('completed_at', { ascending: false, nullsFirst: false })
      .order('updated_at', { ascending: false });
  } else {
    query = query.order('updated_at', { ascending: false });
  }

  const { data, error } = await query;
  if (error) throw error;
  return (data as unknown as GoalWithMilestones[]).map(normalizeGoal);
}

export async function fetchGoal(userId: string, goalId: string): Promise<GoalWithMilestones> {
  requireUser(userId);
  const { data, error } = await getSupabaseClient()
    .from('goals')
    .select(goalWithMilestonesColumns)
    .eq('user_id', userId)
    .eq('id', goalId)
    .single();
  if (error) throw error;
  return normalizeGoal(data as unknown as GoalWithMilestones);
}

export async function fetchPrimaryGoal(userId: string): Promise<GoalWithMilestones | null> {
  requireUser(userId);
  const { data, error } = await getSupabaseClient()
    .from('goals')
    .select(goalWithMilestonesColumns)
    .eq('user_id', userId)
    .eq('status', 'active')
    .order('target_date', { ascending: true, nullsFirst: false })
    .order('updated_at', { ascending: false })
    .limit(1)
    .maybeSingle();
  if (error) throw error;
  return data ? normalizeGoal(data as unknown as GoalWithMilestones) : null;
}

export async function fetchGoalSummaryRows(userId: string): Promise<GoalSummaryRow[]> {
  requireUser(userId);
  const { data, error } = await getSupabaseClient()
    .from('goals')
    .select('status,progress,target_date,completed_at')
    .eq('user_id', userId);
  if (error) throw error;
  return data as GoalSummaryRow[];
}

export async function saveGoalWithMilestones(
  userId: string,
  goalId: string | null,
  values: GoalMutationValues,
): Promise<GoalWithMilestones> {
  requireUser(userId);
  const { data, error } = await getSupabaseClient()
    .rpc('save_goal_with_milestones', {
      p_completed_at: values.completed_at,
      p_description: values.description,
      p_goal_id: goalId,
      p_milestones: values.milestones.map((milestone) => ({
        completed_at: milestone.completedAt ?? null,
        id: milestone.id ?? null,
        is_completed: milestone.isCompleted,
        title: milestone.title,
      })),
      p_progress: values.progress,
      p_status: values.status,
      p_target_date: values.target_date,
      p_title: values.title,
    });
  if (error) throw error;
  if (!data || data.user_id !== userId) throw new Error('The goal could not be saved for this account.');
  return fetchGoal(userId, data.id);
}

export async function updateGoalStatus(
  userId: string,
  goal: Goal,
  status: GoalStatus,
): Promise<Goal> {
  requireUser(userId);
  const values = status === 'completed'
    ? { completed_at: new Date().toISOString(), progress: 100, status }
    : status === 'archived'
      ? { completed_at: goal.completed_at, status }
      : { completed_at: null, status };
  const { data, error } = await getSupabaseClient()
    .from('goals')
    .update(values)
    .eq('user_id', userId)
    .eq('id', goal.id)
    .select(goalColumns)
    .single();
  if (error) throw error;
  return data as Goal;
}

export async function updateGoalProgress(userId: string, goalId: string, progress: number): Promise<Goal> {
  requireUser(userId);
  const { data, error } = await getSupabaseClient()
    .from('goals')
    .update({ progress: Math.min(100, Math.max(0, Math.round(progress))) })
    .eq('user_id', userId)
    .eq('id', goalId)
    .select(goalColumns)
    .single();
  if (error) throw error;
  return data as Goal;
}

export async function deleteGoal(userId: string, goalId: string): Promise<void> {
  requireUser(userId);
  const { data, error } = await getSupabaseClient()
    .from('goals')
    .delete()
    .eq('user_id', userId)
    .eq('id', goalId)
    .select('id')
    .single();
  if (error) throw error;
  if (!data) throw new Error('Goal not found or you do not have permission to delete it.');
}

export async function createMilestone(
  userId: string,
  goalId: string,
  title: string,
  position: number,
): Promise<GoalMilestone> {
  requireUser(userId);
  const { data, error } = await getSupabaseClient()
    .from('goal_milestones')
    .insert({ goal_id: goalId, position, title: title.trim(), user_id: userId })
    .select(milestoneColumns)
    .single();
  if (error) throw error;
  return data;
}

export async function updateMilestone(
  userId: string,
  goalId: string,
  milestoneId: string,
  values: Partial<Pick<GoalMilestone, 'completed_at' | 'is_completed' | 'position' | 'title'>>,
): Promise<GoalMilestone> {
  requireUser(userId);
  const { data, error } = await getSupabaseClient()
    .from('goal_milestones')
    .update(values)
    .eq('user_id', userId)
    .eq('goal_id', goalId)
    .eq('id', milestoneId)
    .select(milestoneColumns)
    .single();
  if (error) throw error;
  return data;
}

export async function deleteMilestone(userId: string, goalId: string, milestoneId: string): Promise<void> {
  requireUser(userId);
  const { data, error } = await getSupabaseClient()
    .from('goal_milestones')
    .delete()
    .eq('user_id', userId)
    .eq('goal_id', goalId)
    .eq('id', milestoneId)
    .select('id')
    .single();
  if (error) throw error;
  if (!data) throw new Error('Milestone not found or you do not have permission to delete it.');
}

export async function reorderMilestones(
  userId: string,
  goalId: string,
  milestones: GoalMilestone[],
): Promise<GoalMilestone[]> {
  requireUser(userId);
  const rows = milestones.map((milestone, position) => ({
    completed_at: milestone.completed_at,
    goal_id: goalId,
    id: milestone.id,
    is_completed: milestone.is_completed,
    position,
    title: milestone.title,
    user_id: userId,
  }));
  const { data, error } = await getSupabaseClient()
    .from('goal_milestones')
    .upsert(rows, { onConflict: 'id' })
    .select(milestoneColumns);
  if (error) throw error;
  return [...data].sort((left, right) => left.position - right.position);
}
