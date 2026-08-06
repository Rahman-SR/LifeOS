import { router } from 'expo-router';
import { ArrowLeft } from 'lucide-react-native';
import { Alert, StyleSheet } from 'react-native';
import { AppHeader, IconButton, Screen } from '@/components/ui';
import { HabitForm, useCreateHabitMutation } from '@/features/habits';
import { useAuth } from '@/hooks/use-auth';
import { spacing } from '@/theme';
export default function CreateHabitScreen() { const { user } = useAuth(); const mutation = useCreateHabitMutation(user?.id ?? ''); return <Screen contentContainerStyle={styles.screen} scroll={false}><AppHeader action={<IconButton icon={ArrowLeft} label="Go back" onPress={() => router.back()} />} eyebrow="NEW HABIT" subtitle="Choose a schedule you can repeat." title="Create habit" /><HabitForm onCancel={() => router.back()} onSubmit={async (values) => { const result = await mutation.mutateAsync(values); Alert.alert('Habit created', result.reminderWarning ? `Habit saved, but the reminder could not be scheduled. ${result.reminderWarning}` : 'Your habit is ready.', [{ onPress: () => router.back(), text: 'Done' }]); }} submitLabel="Create habit" /></Screen>; }
const styles = StyleSheet.create({ screen: { flex: 1, gap: spacing.md } });
