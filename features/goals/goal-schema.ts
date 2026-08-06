import { z } from 'zod';

import { isGoalTargetDateAllowed } from './goal-date-utils';
import type { GoalMutationValues } from './goal-types';

const milestoneSchema = z.object({
  completedAt: z.string().nullable().optional(),
  id: z.string().uuid().optional(),
  isCompleted: z.boolean(),
  title: z.string().trim().min(1, 'Milestone title is required.').max(240, 'Milestone title must be 240 characters or fewer.'),
});

const goalFormBaseSchema = z.object({
  description: z.string(),
  milestones: z.array(milestoneSchema),
  progress: z.number().int('Progress must be a whole number.').min(0, 'Progress cannot be below 0%.').max(100, 'Progress cannot exceed 100%.'),
  status: z.enum(['active', 'completed', 'paused', 'archived']),
  targetDate: z.string(),
  title: z.string().trim().min(1, 'Goal title is required.').max(240, 'Goal title must be 240 characters or fewer.'),
});

export type GoalFormValues = z.infer<typeof goalFormBaseSchema>;

export function createGoalFormSchema(options: {
  initialTargetDate?: string | null;
  mode: 'create' | 'edit';
  todayDate: string;
}) {
  return goalFormBaseSchema.superRefine((values, context) => {
    if (!isGoalTargetDateAllowed({
      initialTargetDate: options.initialTargetDate,
      mode: options.mode,
      targetDate: values.targetDate,
      todayDate: options.todayDate,
    })) {
      context.addIssue({
        code: 'custom',
        message: options.mode === 'edit' && options.initialTargetDate && options.initialTargetDate < options.todayDate
          ? 'Use a valid calendar date.'
          : 'Target date must be today or later.',
        path: ['targetDate'],
      });
    }
  });
}

export function toGoalMutationValues(
  values: GoalFormValues,
  existingCompletedAt: string | null = null,
): GoalMutationValues {
  const completedAt = values.status === 'completed'
    ? existingCompletedAt ?? new Date().toISOString()
    : values.status === 'archived'
      ? existingCompletedAt
      : null;
  return {
    completed_at: completedAt,
    description: values.description.trim() || null,
    milestones: values.milestones.map((milestone) => ({
      completedAt: milestone.completedAt ?? null,
      id: milestone.id,
      isCompleted: milestone.isCompleted,
      title: milestone.title.trim(),
    })),
    progress: values.status === 'completed' ? 100 : values.progress,
    status: values.status,
    target_date: values.targetDate || null,
    title: values.title.trim(),
  };
}
