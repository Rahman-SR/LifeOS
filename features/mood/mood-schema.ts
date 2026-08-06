import { z } from 'zod';

import type { MoodMutationValues } from './mood-types';

export const moodFormSchema = z.object({
  mood: z.enum(['excellent', 'good', 'okay', 'low', 'bad'], {
    message: 'Choose how you feel today.',
  }),
  note: z.string().max(500, 'Keep the reason to 500 characters or fewer.'),
});

export type MoodFormValues = z.infer<typeof moodFormSchema>;

export function toMoodMutationValues(values: MoodFormValues, moodDate: string): MoodMutationValues {
  return { mood: values.mood, mood_date: moodDate, note: values.note.trim() || null };
}
