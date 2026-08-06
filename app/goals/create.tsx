import { router } from 'expo-router';
import { Alert, StyleSheet } from 'react-native';
import { Screen } from '@/components/ui';
import { GoalForm, useSaveGoalMutation } from '@/features/goals';
import { useAuth } from '@/hooks/use-auth';
import { getDateKey } from '@/lib/local-date';
import { spacing } from '@/theme';
export default function CreateGoalScreen() { const { profile, user } = useAuth(); const mutation = useSaveGoalMutation(user!.id); return <Screen contentContainerStyle={styles.screen} scroll={false}><GoalForm mode="create" onCancel={() => router.back()} onSaved={(goal) => { router.replace(`/goals/${goal.id}`); Alert.alert('Goal created', 'Your goal and milestones were saved.'); }} onSubmit={mutation.mutateAsync} todayDate={getDateKey(new Date(), profile?.timezone)} /></Screen>; }
const styles = StyleSheet.create({ screen: { flex: 1, paddingTop: spacing.xs } });
