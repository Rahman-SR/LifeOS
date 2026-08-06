import { z } from 'zod';

import {
  isLocalDateTimeInFuture,
  parseLocalDate,
  parseLocalDateTime,
} from './task-date-utils';
import { toDatabaseTime } from './task-date-utils';
import type { TaskMutationValues } from './task-types';

export function createTaskFormSchema(now: () => Date = () => new Date()) {
  return z.object({
    categoryId: z.string(),
    description: z.string().trim().max(2000, 'Description must be 2,000 characters or fewer.'),
    dueDate: z.string().refine((value) => !value || Boolean(parseLocalDate(value)), 'Choose a valid date.'),
    dueTime: z.string().regex(/^$|^\d{2}:\d{2}$/, 'Choose a valid time.'),
    priority: z.enum(['low', 'medium', 'high']),
    reminderEnabled: z.boolean(),
    title: z
      .string()
      .trim()
      .min(1, 'Task title is required.')
      .max(240, 'Task title must be 240 characters or fewer.'),
  }).superRefine((values, context) => {
    if (values.dueTime && !values.dueDate) {
      context.addIssue({
        code: 'custom',
        message: 'Choose a due date before adding a time.',
        path: ['dueDate'],
      });
    }

    if (!values.reminderEnabled) return;

    if (!values.dueDate || !values.dueTime) {
      context.addIssue({
        code: 'custom',
        message: 'Choose a date and time for the reminder.',
        path: ['reminderEnabled'],
      });
      return;
    }

    if (!isLocalDateTimeInFuture(values.dueDate, values.dueTime, now())) {
      context.addIssue({
        code: 'custom',
        message: 'Reminder time must be in the future.',
        path: ['reminderEnabled'],
      });
    }
  });
}

export const taskFormSchema = createTaskFormSchema();

export type TaskFormValues = z.infer<typeof taskFormSchema>;

export function toTaskMutationValues(values: TaskFormValues): TaskMutationValues {
  const reminderDate =
    values.reminderEnabled && values.dueDate && values.dueTime
      ? parseLocalDateTime(values.dueDate, values.dueTime)
      : null;

  return {
    category_id: values.categoryId || null,
    description: values.description.trim() || null,
    due_date: values.dueDate || null,
    due_time: toDatabaseTime(values.dueTime),
    priority: values.priority,
    reminder_at: reminderDate?.toISOString() ?? null,
    title: values.title.trim(),
  };
}
