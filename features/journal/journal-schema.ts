import { z } from 'zod';

import type { JournalMutationValues } from './journal-types';

export const journalFormSchema = z.object({
  content: z.string(),
  improveTomorrow: z.string(),
  title: z.string().max(240, 'Title must be 240 characters or fewer.'),
  wasDifficult: z.string(),
  wentWell: z.string(),
}).superRefine((value, context) => {
  if (![value.title, value.content, value.wentWell, value.wasDifficult, value.improveTomorrow].some((field) => field.trim())) {
    context.addIssue({ code: 'custom', message: 'Write something in at least one journal field.', path: ['content'] });
  }
});

export type JournalFormValues = z.infer<typeof journalFormSchema>;

export const defaultJournalValues: JournalFormValues = { content: '', improveTomorrow: '', title: '', wasDifficult: '', wentWell: '' };

export function toJournalMutationValues(values: JournalFormValues, entryDate: string): JournalMutationValues {
  const nullable = (value: string) => value.trim() || null;
  return {
    content: values.content.trim(),
    entry_date: entryDate,
    improve_tomorrow: nullable(values.improveTomorrow),
    title: nullable(values.title),
    was_difficult: nullable(values.wasDifficult),
    went_well: nullable(values.wentWell),
  };
}

export function toJournalFormValues(entry: import('./journal-types').JournalEntry): JournalFormValues {
  return { content: entry.content, improveTomorrow: entry.improve_tomorrow ?? '', title: entry.title ?? '', wasDifficult: entry.was_difficult ?? '', wentWell: entry.went_well ?? '' };
}
