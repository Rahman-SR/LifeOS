import type { Tables } from '@/types/database';

export type GoalStatus = 'active' | 'archived' | 'completed' | 'paused';
export type GoalFilter = GoalStatus;

export type Goal = Omit<Tables<'goals'>, 'status'> & { status: GoalStatus };
export type GoalMilestone = Tables<'goal_milestones'>;
export type GoalWithMilestones = Goal & { goal_milestones: GoalMilestone[] };

export type GoalFormMilestone = {
  completedAt?: string | null;
  id?: string;
  isCompleted: boolean;
  title: string;
};

export type GoalMutationValues = {
  completed_at: string | null;
  description: string | null;
  milestones: GoalFormMilestone[];
  progress: number;
  status: GoalStatus;
  target_date: string | null;
  title: string;
};

export type GoalSummaryRow = Pick<Goal, 'completed_at' | 'progress' | 'status' | 'target_date'>;

export type GoalSummary = {
  activeCount: number;
  averageProgress: number;
  completedCount: number;
  completedThisMonth: number;
  overdueActiveCount: number;
};
