import * as Haptics from 'expo-haptics';
import { router, useLocalSearchParams } from 'expo-router';
import { ArrowLeft, Pencil, Trash2 } from 'lucide-react-native';
import { useState } from 'react';
import { Alert, StyleSheet, View } from 'react-native';

import { ErrorState, LoadingState } from '@/components/feedback';
import { AppHeader, AppText, Button, Card, IconButton, Screen } from '@/components/ui';
import {
  DeleteHabitConfirmation,
  HabitCompletionControl,
  HabitHistory,
  HabitProgress,
  StreakBadge,
  useAdjustHabitCompletionMutation,
  useArchiveHabitMutation,
  useDeleteHabitMutation,
  useHabitDetails,
} from '@/features/habits';
import { useAuth } from '@/hooks/use-auth';
import { spacing } from '@/theme';

export default function HabitDetailsScreen() {
  const { user } = useAuth();
  const { id } = useLocalSearchParams<{ id?: string }>();
  const habitId = typeof id === 'string' ? id : undefined;
  const userId = user?.id ?? '';
  const details = useHabitDetails(userId, habitId);
  const completion = useAdjustHabitCompletionMutation(userId);
  const archive = useArchiveHabitMutation(userId);
  const deletion = useDeleteHabitMutation(userId);
  const [showDelete, setShowDelete] = useState(false);
  const habit = details.habit;

  const adjust = async (delta: -1 | 1) => {
    if (!habit) return;
    try {
      await completion.mutateAsync({ delta, habit });
    } catch (error) {
      Alert.alert('Habit was not updated', error instanceof Error ? error.message : 'Please try again.');
    }
  };

  const toggleArchive = async () => {
    if (!habit) return;
    try {
      const result = await archive.mutateAsync({ habitId: habit.id, isActive: !habit.is_active });
      if (result.reminderWarning) Alert.alert('Reminder update', result.reminderWarning);
      else Alert.alert(habit.is_active ? 'Habit archived' : 'Habit restored');
    } catch (error) {
      Alert.alert('Habit was not updated', error instanceof Error ? error.message : 'Please try again.');
    }
  };

  const confirmDelete = async () => {
    if (!habit) return;
    void Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning).catch(() => undefined);
    try {
      const result = await deletion.mutateAsync(habit.id);
      setShowDelete(false);
      Alert.alert(
        'Habit deleted',
        result.reminderWarning
          ? `The habit was deleted. ${result.reminderWarning}`
          : 'The habit and its history were permanently deleted.',
        [{ onPress: () => router.replace('/habits'), text: 'Done' }],
      );
    } catch (error) {
      Alert.alert('Habit was not deleted', error instanceof Error ? error.message : 'Please try again.');
    }
  };

  return (
    <Screen contentContainerStyle={styles.screen}>
      <IconButton icon={ArrowLeft} label="Go back" onPress={() => router.back()} />
      {details.habitQuery.isLoading || details.logsQuery.isLoading ? <LoadingState label="Loading habit…" /> : null}
      {details.habitQuery.error ? (
        <ErrorState description="This habit could not be loaded. It may belong to another account." onRetry={() => void details.habitQuery.refetch()} title="Habit unavailable" />
      ) : null}
      {habit ? (
        <>
          <AppHeader
            action={<View style={styles.row}><IconButton icon={Pencil} label="Edit habit" onPress={() => router.push(`/habits/edit/${habit.id}`)} /><IconButton icon={Trash2} label="Delete habit" onPress={() => setShowDelete(true)} /></View>}
            eyebrow={habit.is_active ? 'HABIT DETAILS' : 'ARCHIVED'}
            title={habit.name}
          />
          <Card style={styles.card}>
            <AppText tone="secondary">{habit.description || 'No description was added.'}</AppText>
            {habit.scheduledToday ? <HabitProgress count={habit.todayCount} target={habit.target_count} /> : <AppText tone="muted">Not scheduled today.</AppText>}
            {habit.is_active && habit.scheduledToday ? <HabitCompletionControl count={habit.todayCount} disabled={completion.isPending} name={habit.name} onDecrement={() => void adjust(-1)} onIncrement={() => void adjust(1)} target={habit.target_count} /> : null}
          </Card>
          <Card style={styles.card}>
            <AppText variant="title">Consistency</AppText>
            <View style={styles.stats}>
              <View><AppText variant="heading3">{habit.currentStreak}</AppText><AppText tone="secondary" variant="caption">Current streak</AppText></View>
              <View><AppText variant="heading3">{habit.bestStreak}</AppText><AppText tone="secondary" variant="caption">Best streak</AppText></View>
              <View><AppText variant="heading3">{Math.round(habit.completionRate * 100)}%</AppText><AppText tone="secondary" variant="caption">Last 30 days</AppText></View>
            </View>
            <StreakBadge streak={habit.currentStreak} />
          </Card>
          <Card style={styles.card}><AppText variant="title">Recent history</AppText><HabitHistory logs={details.logs} targetCount={habit.target_count} /></Card>
          <Button label={habit.is_active ? 'Archive habit' : 'Restore habit'} loading={archive.isPending} onPress={() => void toggleArchive()} variant="secondary" />
          <DeleteHabitConfirmation loading={deletion.isPending} name={habit.name} onCancel={() => setShowDelete(false)} onConfirm={() => void confirmDelete()} visible={showDelete} />
        </>
      ) : null}
    </Screen>
  );
}

const styles = StyleSheet.create({ card: { gap: spacing.md }, row: { flexDirection: 'row', gap: spacing.xs }, screen: { gap: spacing.lg }, stats: { flexDirection: 'row', gap: spacing.lg, justifyContent: 'space-between' } });
