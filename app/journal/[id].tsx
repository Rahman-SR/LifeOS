import * as Haptics from 'expo-haptics';
import { router, useLocalSearchParams } from 'expo-router';
import { useMemo, useState } from 'react';
import { Alert, StyleSheet } from 'react-native';

import { ErrorState, LoadingState } from '@/components/feedback';
import { Screen } from '@/components/ui';
import { DeleteJournalConfirmation, JournalEditor, getJournalTitle, toJournalFormValues, useDeleteJournalMutation, useJournalEntryQuery, useUpdateJournalMutation } from '@/features/journal';
import { useAuth } from '@/hooks/use-auth';
import { spacing } from '@/theme';

export default function JournalEntryScreen() {
  const { id } = useLocalSearchParams<{ id?: string }>();
  const entryId = typeof id === 'string' ? id : undefined;
  const { user } = useAuth();
  const userId = user?.id ?? '';
  const query = useJournalEntryQuery(userId, entryId);
  const update = useUpdateJournalMutation(userId, entryId ?? 'missing');
  const deletion = useDeleteJournalMutation(userId);
  const [showDelete, setShowDelete] = useState(false);
  const initialValues = useMemo(() => query.data ? toJournalFormValues(query.data) : undefined, [query.data]);
  const confirmDelete = async () => {
    if (!query.data) return;
    void Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning).catch(() => undefined);
    try { await deletion.mutateAsync(query.data); setShowDelete(false); router.replace('/journal/history'); Alert.alert('Journal deleted'); }
    catch (error) { Alert.alert('Journal was not deleted', error instanceof Error ? error.message : 'Please try again.'); }
  };
  return <Screen contentContainerStyle={styles.screen} scroll={false}>
    {query.isLoading ? <LoadingState label="Loading journal entry…" /> : null}
    {query.error ? <ErrorState description="This journal entry could not be loaded. It may belong to another account." onRetry={() => void query.refetch()} title="Entry unavailable" /> : null}
    {query.data && initialValues ? <JournalEditor entryDate={query.data.entry_date} initialValues={initialValues} mode="edit" onCancel={() => router.back()} onDelete={() => setShowDelete(true)} onSaved={() => Alert.alert('Journal saved', 'Your changes were saved.')} onSubmit={async ({ entry_date: _entryDate, ...values }) => update.mutateAsync({ entryDate: query.data!.entry_date, values })} /> : null}
    <DeleteJournalConfirmation loading={deletion.isPending} name={query.data ? getJournalTitle(query.data) : 'This entry'} onCancel={() => setShowDelete(false)} onConfirm={() => void confirmDelete()} visible={showDelete} />
  </Screen>;
}

const styles = StyleSheet.create({ screen: { flex: 1, paddingTop: spacing.xs } });
