import { z } from 'zod';

import type { NoteMutationValues } from './note-types';

export const noteFormSchema = z
  .object({
    content: z.string(),
    isPinned: z.boolean(),
    title: z.string().max(240, 'Title must be 240 characters or fewer.'),
  })
  .superRefine((value, context) => {
    if (!value.title.trim() && !value.content.trim()) {
      context.addIssue({
        code: 'custom',
        message: 'Add a title or some note content.',
        path: ['content'],
      });
    }
  });

export type NoteFormValues = z.infer<typeof noteFormSchema>;

export function toNoteMutationValues(values: NoteFormValues): NoteMutationValues {
  return {
    content: values.content.trim(),
    is_pinned: values.isPinned,
    title: values.title.trim(),
  };
}
