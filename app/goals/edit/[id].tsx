import { router, useLocalSearchParams } from 'expo-router';
import { Alert, StyleSheet } from 'react-native';

import { ErrorState, LoadingState } from '@/components/feedback';
import { Screen } from '@/components/ui';
import { GoalForm, goalToFormValues, useGoalDetails, useSaveGoalMutation } from '@/features/goals';
import { useAuth } from '@/hooks/use-auth';
import { getDateKey } from '@/lib/local-date';
import { spacing } from '@/theme';

export default function EditGoalScreen() {
  const params = useLocalSearchParams<{ id: string }>();
  const { profile, user } = useAuth();
  const id = Array.isArray(params.id) ? params.id[0] : params.id;
  const query = useGoalDetails(user!.id, id);
  const mutation = useSaveGoalMutation(user!.id, id ?? null);

  if (query.isLoading) return <Screen><LoadingState label="Loading goal…" /></Screen>;
  if (!query.data || query.error) return <Screen><ErrorState description="This goal could not be loaded." onRetry={() => void query.refetch()} title="Goal unavailable" /></Screen>;

  return <Screen contentContainerStyle={styles.screen} scroll={false}><GoalForm existingCompletedAt={query.data.completed_at} initialValues={goalToFormValues(query.data)} mode="edit" onCancel={() => router.back()} onSaved={(goal) => { router.replace(`/goals/${goal.id}`); Alert.alert('Goal updated', 'Your changes were saved.'); }} onSubmit={mutation.mutateAsync} todayDate={getDateKey(new Date(), profile?.timezone)} /></Screen>;
}
const styles = StyleSheet.create({ screen: { flex: 1, paddingTop: spacing.xs } });
