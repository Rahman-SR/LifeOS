import { z } from 'zod';

import { habitColorOptions, habitIcons, type HabitColorToken } from './habit-options';
import { toHabitDatabaseTime } from './habit-date-utils';
import type { HabitMutationValues } from './habit-types';

export const habitFormSchema = z.object({
  colorToken: z.enum(['primary', 'success', 'warning', 'info', 'danger']),
  description: z.string().trim().max(2000, 'Description must be 2,000 characters or fewer.'),
  frequencyType: z.enum(['daily', 'weekly']),
  icon: z.enum(habitIcons),
  name: z.string().trim().min(1, 'Habit name is required.').max(160, 'Habit name must be 160 characters or fewer.'),
  reminderEnabled: z.boolean(),
  reminderTime: z.string().regex(/^$|^([01]\d|2[0-3]):[0-5]\d$/, 'Choose a valid reminder time.'),
  targetCount: z.string().regex(/^\d+$/, 'Target count must be a whole number.').refine((value) => Number(value) >= 1, 'Target count must be at least 1.'),
  weekdays: z.array(z.number().int().min(0).max(6)),
}).superRefine((values, context) => {
  if (values.frequencyType === 'weekly' && values.weekdays.length === 0) {
    context.addIssue({ code: 'custom', message: 'Select at least one weekday.', path: ['weekdays'] });
  }
  if (values.reminderEnabled && !values.reminderTime) {
    context.addIssue({ code: 'custom', message: 'Choose a reminder time.', path: ['reminderTime'] });
  }
});

export type HabitFormValues = z.infer<typeof habitFormSchema>;

export function toHabitMutationValues(values: HabitFormValues): HabitMutationValues {
  const color = habitColorOptions.find((item) => item.token === (values.colorToken as HabitColorToken))?.color
    ?? habitColorOptions[0]!.color;
  return {
    color,
    days_of_week: values.frequencyType === 'weekly' ? [...new Set(values.weekdays)].sort() : [],
    description: values.description.trim() || null,
    frequency_type: values.frequencyType,
    icon: values.icon,
    name: values.name.trim(),
    reminder_time: values.reminderEnabled ? toHabitDatabaseTime(values.reminderTime) : null,
    target_count: Number(values.targetCount),
  };
}
