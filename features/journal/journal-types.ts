import type { Tables } from '@/types/database';

export type JournalEntry = Omit<Tables<'journal_entries'>, 'mood_score'>;
export type JournalMutationValues = {
  content: string;
  entry_date: string;
  improve_tomorrow: string | null;
  title: string | null;
  was_difficult: string | null;
  went_well: string | null;
};
