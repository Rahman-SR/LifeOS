import type { Tables } from '@/types/database';

export type Note = Tables<'notes'>;

export type NoteFilter = 'all' | 'pinned' | 'recent' | 'archived';

export type NoteMutationValues = {
  content: string;
  is_pinned: boolean;
  title: string;
};
