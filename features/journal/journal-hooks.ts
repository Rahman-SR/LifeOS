import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { journalKeys } from './journal-query-keys';
import { deleteJournalEntry, fetchJournalEntry, fetchJournalForDate, fetchJournalHistory, saveJournalForDate, updateJournalEntry } from './journal-service';
import type { JournalEntry, JournalMutationValues } from './journal-types';

function refreshJournal(client: ReturnType<typeof useQueryClient>, userId: string) {
  void client.invalidateQueries({ queryKey: journalKeys.history(userId) }).catch(() => undefined);
}

export function useTodayJournalQuery(userId: string | undefined, date: string) {
  return useQuery({ enabled: Boolean(userId), queryFn: () => fetchJournalForDate(userId!, date), queryKey: journalKeys.today(userId ?? 'signed-out', date) });
}

export function useJournalHistoryQuery(userId: string | undefined) {
  return useQuery({ enabled: Boolean(userId), queryFn: () => fetchJournalHistory(userId!), queryKey: journalKeys.history(userId ?? 'signed-out') });
}

export function useJournalEntryQuery(userId: string | undefined, id: string | undefined) {
  return useQuery({ enabled: Boolean(userId && id), queryFn: () => fetchJournalEntry(userId!, id!), queryKey: journalKeys.detail(userId ?? 'signed-out', id ?? 'missing') });
}

export function useSaveTodayJournalMutation(userId: string) {
  const client = useQueryClient();
  return useMutation<JournalEntry, Error, JournalMutationValues>({ mutationFn: (values) => saveJournalForDate(userId, values), onSuccess: (entry) => {
    try { client.setQueryData(journalKeys.today(userId, entry.entry_date), entry); client.setQueryData(journalKeys.detail(userId, entry.id), entry); refreshJournal(client, userId); } catch { /* Save already succeeded. */ }
  } });
}

export function useUpdateJournalMutation(userId: string, id: string) {
  const client = useQueryClient();
  return useMutation<JournalEntry, Error, { entryDate: string; values: Omit<JournalMutationValues, 'entry_date'> }>({ mutationFn: ({ values }) => updateJournalEntry(userId, id, values), onSuccess: (entry) => {
    try { client.setQueryData(journalKeys.detail(userId, entry.id), entry); client.setQueryData(journalKeys.today(userId, entry.entry_date), entry); refreshJournal(client, userId); } catch { /* Save already succeeded. */ }
  } });
}

export function useDeleteJournalMutation(userId: string) {
  const client = useQueryClient();
  return useMutation<void, Error, JournalEntry>({ mutationFn: (entry) => deleteJournalEntry(userId, entry.id), onSuccess: (_data, entry) => {
    client.removeQueries({ exact: true, queryKey: journalKeys.detail(userId, entry.id) });
    client.setQueryData(journalKeys.today(userId, entry.entry_date), null);
    refreshJournal(client, userId);
  } });
}

export function getJournalErrorMessage(error: unknown) {
  return error instanceof Error ? error.message : 'Journal data could not be loaded.';
}
