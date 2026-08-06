import * as Haptics from 'expo-haptics';
import { router } from 'expo-router';
import { useMemo, useState } from 'react';
import { Alert, StyleSheet } from 'react-native';

import { ErrorState, LoadingState } from '@/components/feedback';
import { Screen } from '@/components/ui';
import { DeleteJournalConfirmation, JournalEditor, getJournalTitle, toJournalFormValues, useDeleteJournalMutation, useSaveTodayJournalMutation, useTodayJournalQuery } from '@/features/journal';
import { useAuth } from '@/hooks/use-auth';
import { getDateKey } from '@/lib/local-date';
import { spacing } from '@/theme';

export default function TodayJournalScreen() {
  const { profile, user } = useAuth();
  const userId = user?.id ?? '';
  const date = getDateKey(new Date(), profile?.timezone);
  const query = useTodayJournalQuery(userId, date);
  const saveMutation = useSaveTodayJournalMutation(userId);
  const deleteMutation = useDeleteJournalMutation(userId);
  const [showDelete, setShowDelete] = useState(false);
  const initialValues = useMemo(() => query.data ? toJournalFormValues(query.data) : undefined, [query.data]);

  const confirmDelete = async () => {
    if (!query.data) return;
    void Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning).catch(() => undefined);
    try { await deleteMutation.mutateAsync(query.data); setShowDelete(false); Alert.alert('Journal deleted'); }
    catch (error) { Alert.alert('Journal was not deleted', error instanceof Error ? error.message : 'Please try again.'); }
  };

  return <Screen contentContainerStyle={styles.screen} scroll={false}>
    {query.isLoading ? <LoadingState label="Loading today’s journal…" /> : null}
    {query.error ? <ErrorState description="Today’s journal could not be loaded." onRetry={() => void query.refetch()} title="Journal unavailable" /> : null}
    {!query.isLoading && !query.error ? <JournalEditor entryDate={date} initialValues={initialValues} mode={query.data ? 'edit' : 'create'} onCancel={() => router.back()} onDelete={query.data ? () => setShowDelete(true) : undefined} onHistory={() => router.push('/journal/history')} onSaved={() => Alert.alert('Journal saved', 'Today’s reflection was saved.')} onSubmit={(values) => saveMutation.mutateAsync(values)} /> : null}
    <DeleteJournalConfirmation loading={deleteMutation.isPending} name={query.data ? getJournalTitle(query.data) : 'Today’s journal'} onCancel={() => setShowDelete(false)} onConfirm={() => void confirmDelete()} visible={showDelete} />
  </Screen>;
}

const styles = StyleSheet.create({ screen: { flex: 1, paddingTop: spacing.xs } });
