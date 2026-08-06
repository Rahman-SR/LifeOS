import * as Haptics from 'expo-haptics';
import { router } from 'expo-router';
import { ArrowLeft, PenLine } from 'lucide-react-native';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { Alert, StyleSheet, View } from 'react-native';

import { ErrorState, LoadingState } from '@/components/feedback';
import { AppHeader, IconButton, Screen } from '@/components/ui';
import { DeleteJournalConfirmation, JournalList, JournalSearchBar, filterJournalEntries, getJournalTitle, useDeleteJournalMutation, useJournalHistoryQuery, type JournalEntry } from '@/features/journal';
import { useAuth } from '@/hooks/use-auth';
import { spacing } from '@/theme';

const searchDebounceMs = 300;

export default function JournalHistoryScreen() {
  const { user } = useAuth();
  const userId = user?.id ?? '';
  const query = useJournalHistoryQuery(userId);
  const deletion = useDeleteJournalMutation(userId);
  const [search, setSearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [entryToDelete, setEntryToDelete] = useState<JournalEntry | null>(null);
  useEffect(() => { const timeout = setTimeout(() => setDebouncedSearch(search), searchDebounceMs); return () => clearTimeout(timeout); }, [search]);
  const entries = useMemo(() => filterJournalEntries(query.data ?? [], debouncedSearch), [debouncedSearch, query.data]);
  const openToday = useCallback(() => router.push('/journal'), []);
  const openEntry = useCallback((id: string) => router.push(`/journal/${id}`), []);
  const confirmDelete = async () => {
    if (!entryToDelete) return;
    void Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning).catch(() => undefined);
    try { await deletion.mutateAsync(entryToDelete); setEntryToDelete(null); Alert.alert('Journal deleted'); }
    catch (error) { Alert.alert('Journal was not deleted', error instanceof Error ? error.message : 'Please try again.'); }
  };
  return <Screen contentContainerStyle={styles.screen} scroll={false}>
    <View style={styles.header}><IconButton icon={ArrowLeft} label="Go back" onPress={() => router.back()} /><View style={styles.headerCopy}><AppHeader action={<IconButton icon={PenLine} label="Write today’s journal" onPress={openToday} />} subtitle="Search and revisit your private reflections." title="Journal history" /></View></View>
    <JournalSearchBar onChangeText={setSearch} value={search} />
    {query.isLoading ? <LoadingState label="Loading journal history…" /> : null}
    {query.error ? <ErrorState description="Your journal history could not be loaded." onRetry={() => void query.refetch()} title="History unavailable" /> : null}
    {!query.isLoading && !query.error ? <View style={styles.list}><JournalList data={entries} isSearch={Boolean(debouncedSearch.trim())} onCreate={openToday} onDelete={setEntryToDelete} onOpen={openEntry} onRefresh={() => void query.refetch()} refreshing={query.isRefetching && !query.isLoading} /></View> : null}
    <DeleteJournalConfirmation loading={deletion.isPending} name={entryToDelete ? getJournalTitle(entryToDelete) : 'This entry'} onCancel={() => setEntryToDelete(null)} onConfirm={() => void confirmDelete()} visible={Boolean(entryToDelete)} />
  </Screen>;
}

const styles = StyleSheet.create({ header: { alignItems: 'flex-start', flexDirection: 'row', gap: spacing.xs }, headerCopy: { flex: 1 }, list: { flex: 1 }, screen: { flex: 1, gap: spacing.md } });
