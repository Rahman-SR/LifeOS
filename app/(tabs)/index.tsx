import * as Haptics from 'expo-haptics';
import { router } from 'expo-router';
import { useCallback, useMemo, useState } from 'react';
import { Alert, RefreshControl, ScrollView, StyleSheet, View } from 'react-native';

import { EmptyState, ErrorState, LoadingState } from '@/components/feedback';
import { AppText, Button, Screen } from '@/components/ui';
import {
  DailyProgressCard,
  DashboardSection,
  GoalPreviewCard,
  JournalShortcutCard,
  MoodShortcutCard,
  NotePreviewCard,
  QuickAddButton,
  QuickAddSheet,
  type QuickAddAction,
} from '@/features/dashboard/components';
import { usePrimaryGoalQuery } from '@/features/goals';
import {
  HabitCard,
  useAdjustHabitCompletionMutation,
  useHabitListData,
  type HabitWithProgress,
} from '@/features/habits';
import { useRecentNoteQuery } from '@/features/notes';
import { useTodayMoodQuery } from '@/features/mood';
import { useTodayJournalQuery } from '@/features/journal';
import {
  TaskCard,
  TaskEmptyState,
  useTodayTaskSummary,
  useToggleTaskMutation,
} from '@/features/tasks';
import { useAppTheme } from '@/hooks/use-app-theme';
import { useAuth } from '@/hooks/use-auth';
import { formatDateKey, getDateKey } from '@/lib/local-date';
import { spacing } from '@/theme';

export default function TodayScreen() {
  const { colors } = useAppTheme();
  const { profile, profileError, refreshProfile, user } = useAuth();
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isQuickAddOpen, setIsQuickAddOpen] = useState(false);
  const userId = user!.id;
  const todayTasksQuery = useTodayTaskSummary(userId);
  const toggleTaskMutation = useToggleTaskMutation(userId);
  const todayHabits = useHabitListData(userId, 'today');
  const habitCompletionMutation = useAdjustHabitCompletionMutation(userId);
  const recentNoteQuery = useRecentNoteQuery(userId);
  const todayDate = getDateKey(new Date(), profile?.timezone);
  const todayMoodQuery = useTodayMoodQuery(userId, todayDate);
  const todayJournalQuery = useTodayJournalQuery(userId, todayDate);
  const primaryGoalQuery = usePrimaryGoalQuery(userId);
  const { mutateAsync: toggleTaskAsync } = toggleTaskMutation;
  const { isPending: isHabitCompletionPending, mutateAsync: adjustHabitAsync } = habitCompletionMutation;
  const { refetch: refetchTasks } = todayTasksQuery;
  const { refetch: refetchHabits } = todayHabits.habitsQuery;
  const { refetch: refetchHabitLogs } = todayHabits.logsQuery;
  const { refetch: refetchRecentNote } = recentNoteQuery;
  const { refetch: refetchMood } = todayMoodQuery;
  const { refetch: refetchJournal } = todayJournalQuery;
  const { refetch: refetchPrimaryGoal } = primaryGoalQuery;

  const firstName = useMemo(() => {
    const profileName = profile?.display_name.trim();
    if (profileName) return profileName.split(/\s+/)[0];
    return user?.email?.split('@')[0] || 'there';
  }, [profile?.display_name, user?.email]);

  const greeting = useMemo(() => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 18) return 'Good afternoon';
    return 'Good evening';
  }, []);

  const currentDate = formatDateKey(todayDate, { day: 'numeric', month: 'long', weekday: 'long' });

  const todayTasks = useMemo(() => todayTasksQuery.data ?? [], [todayTasksQuery.data]);
  const activeTodayTasks = useMemo(
    () => todayTasks.filter((task) => !task.is_completed),
    [todayTasks],
  );
  const completedTasks = todayTasks.length - activeTodayTasks.length;
  const completedHabits = todayHabits.data.filter((habit) => habit.completedToday).length;
  const hasDashboardContent = Boolean(todayTasks.length || todayHabits.data.length || primaryGoalQuery.data || recentNoteQuery.data || todayMoodQuery.data || todayJournalQuery.data);

  const triggerLightHaptic = useCallback(() => {
    void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => undefined);
  }, []);

  const toggleTask = useCallback(async (taskId: string, completed: boolean) => {
    triggerLightHaptic();
    try {
      const result = await toggleTaskAsync({ completed, taskId });
      if (result.reminderWarning) Alert.alert('Reminder update', result.reminderWarning);
    } catch (error) {
      Alert.alert('Task was not updated', error instanceof Error ? error.message : 'Please try again.');
    }
  }, [toggleTaskAsync, triggerLightHaptic]);

  const adjustHabit = useCallback(async (habit: HabitWithProgress, delta: -1 | 1) => {
    try {
      await adjustHabitAsync({ delta, habit });
    } catch (error) {
      Alert.alert('Habit was not updated', error instanceof Error ? error.message : 'Please try again.');
    }
  }, [adjustHabitAsync]);

  const openQuickAdd = useCallback(() => {
    triggerLightHaptic();
    setIsQuickAddOpen(true);
  }, [triggerLightHaptic]);

  const selectQuickAddAction = useCallback((action: QuickAddAction, label: string) => {
    setIsQuickAddOpen(false);
    if (action === 'task') {
      router.push('/tasks/create');
      return;
    }
    if (action === 'habit') {
      router.push('/habits/create');
      return;
    }
    if (action === 'note') {
      router.push('/notes/create');
      return;
    }
    if (action === 'mood') {
      router.push('/mood');
      return;
    }
    if (action === 'journal') {
      router.push('/journal');
      return;
    }
    if (action === 'goal') {
      router.push('/goals/create');
      return;
    }
    Alert.alert(label, 'This action is unavailable.');
  }, []);

  const refreshDashboard = useCallback(async () => {
    if (isRefreshing) return;
    setIsRefreshing(true);
    try {
      await Promise.all([
        refreshProfile(),
        refetchTasks(),
        refetchHabits(),
        refetchHabitLogs(),
        refetchRecentNote(),
        refetchMood(),
        refetchJournal(),
        refetchPrimaryGoal(),
      ]);
    } finally {
      setIsRefreshing(false);
    }
  }, [
    isRefreshing,
    refetchHabitLogs,
    refetchHabits,
    refetchRecentNote,
    refetchMood,
    refetchJournal,
    refetchPrimaryGoal,
    refetchTasks,
    refreshProfile,
  ]);

  const openTask = useCallback((taskId: string) => router.push(`/tasks/${taskId}`), []);
  const openHabit = useCallback((habitId: string) => router.push(`/habits/${habitId}`), []);
  const openMood = useCallback(() => router.push('/mood'), []);
  const openJournal = useCallback(() => router.push('/journal'), []);
  const incrementHabit = useCallback(
    (habit: HabitWithProgress) => void adjustHabit(habit, 1),
    [adjustHabit],
  );
  const decrementHabit = useCallback(
    (habit: HabitWithProgress) => void adjustHabit(habit, -1),
    [adjustHabit],
  );

  const renderDashboard = () => {
    if (todayTasksQuery.isLoading || todayHabits.habitsQuery.isLoading || todayHabits.logsQuery.isLoading) {
      return <LoadingState label="Preparing your day…" />;
    }

    if (profileError) {
      return (
        <ErrorState
          description={profileError}
          onRetry={() => void refreshDashboard()}
          title="Your dashboard needs a refresh"
        />
      );
    }

    if (!hasDashboardContent) {
      return (
        <EmptyState
          actionLabel="Quick add"
          description="Your day is clear. Add something when you are ready."
          onAction={openQuickAdd}
          title="Nothing planned yet"
        />
      );
    }

    return (
      <>
        <DailyProgressCard
          completedHabits={completedHabits}
          completedTasks={completedTasks}
          totalHabits={todayHabits.data.length}
          totalTasks={todayTasks.length}
        />

        <DashboardSection
          actionLabel="View all tasks"
          onAction={() => router.push('/tasks')}
          title="Today&apos;s tasks"
        >
          {todayTasksQuery.error ? (
            <ErrorState
              description="Today&apos;s tasks could not be loaded."
              onRetry={() => void todayTasksQuery.refetch()}
              title="Tasks unavailable"
            />
          ) : null}
          {!todayTasksQuery.error && activeTodayTasks.length === 0 ? (
            <TaskEmptyState filter="today" onCreate={() => router.push('/tasks/create')} />
          ) : null}
          {activeTodayTasks.slice(0, 3).map((task) => (
              <TaskCard
                compact
                key={task.id}
                onOpen={openTask}
                onToggle={toggleTask}
                task={task}
              />
          ))}
        </DashboardSection>

        <DashboardSection
          actionLabel="View all habits"
          onAction={() => router.push('/habits')}
          title="Today&apos;s habits"
        >
          {todayHabits.habitsQuery.error || todayHabits.logsQuery.error ? (
            <ErrorState description="Today&apos;s habits could not be loaded." onRetry={() => void Promise.all([todayHabits.habitsQuery.refetch(), todayHabits.logsQuery.refetch()])} title="Habits unavailable" />
          ) : null}
          {!todayHabits.habitsQuery.error && !todayHabits.logsQuery.error && todayHabits.data.length === 0 ? (
            <EmptyState actionLabel="Create habit" description="No active habits are scheduled for today." onAction={() => router.push('/habits/create')} title="No habits today" />
          ) : null}
          {todayHabits.data.slice(0, 4).map((habit) => (
            <HabitCard compact disabled={isHabitCompletionPending} habit={habit} key={habit.id} onDecrement={decrementHabit} onIncrement={incrementHabit} onOpen={openHabit} />
          ))}
        </DashboardSection>

        <DashboardSection title="Check in and reflect">
          <View style={styles.shortcutRow}>
            <MoodShortcutCard error={Boolean(todayMoodQuery.error)} loading={todayMoodQuery.isLoading} mood={todayMoodQuery.data} onPress={openMood} />
            <JournalShortcutCard entry={todayJournalQuery.data} error={Boolean(todayJournalQuery.error)} loading={todayJournalQuery.isLoading} onPress={openJournal} />
          </View>
        </DashboardSection>

        <DashboardSection title="Active goal">
          {primaryGoalQuery.isLoading ? <LoadingState label="Loading active goal…" /> : null}
          {primaryGoalQuery.error ? <ErrorState description="Your active goal could not be loaded." onRetry={() => void primaryGoalQuery.refetch()} title="Goal unavailable" /> : null}
          {!primaryGoalQuery.isLoading && !primaryGoalQuery.error && !primaryGoalQuery.data ? <EmptyState actionLabel="Create goal" description="Choose an outcome worth moving toward." onAction={() => router.push('/goals/create')} title="No active goal" /> : null}
          {primaryGoalQuery.data ? <GoalPreviewCard goal={primaryGoalQuery.data} onPress={() => router.push(`/goals/${primaryGoalQuery.data!.id}`)} /> : null}
          <Button label="View all goals" onPress={() => router.push('/goals')} variant="secondary" />
        </DashboardSection>

        <DashboardSection title="Recent note">
          {recentNoteQuery.isLoading ? <LoadingState label="Loading recent note…" /> : null}
          {recentNoteQuery.error ? (
            <ErrorState
              description="Your recent note could not be loaded."
              onRetry={() => void recentNoteQuery.refetch()}
              title="Note unavailable"
            />
          ) : null}
          {!recentNoteQuery.isLoading && !recentNoteQuery.error && !recentNoteQuery.data ? (
            <EmptyState
              actionLabel="Create note"
              description="Capture an idea, reminder, or important thought."
              onAction={() => router.push('/notes/create')}
              title="No recent note"
            />
          ) : null}
          {recentNoteQuery.data ? (
            <NotePreviewCard note={recentNoteQuery.data} onPress={() => router.push(`/notes/${recentNoteQuery.data!.id}`)} />
          ) : null}
        </DashboardSection>
      </>
    );
  };

  return (
    <Screen padded={false} scroll={false}>
      <ScrollView
        contentContainerStyle={styles.content}
        refreshControl={
          <RefreshControl
            accessibilityLabel="Refresh Today dashboard"
            colors={[colors.primary]}
            onRefresh={() => void refreshDashboard()}
            refreshing={isRefreshing}
            tintColor={colors.primary}
          />
        }
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.greeting}>
          <AppText accessibilityRole="header" variant="heading1">
            {greeting}, {firstName}
          </AppText>
          <AppText tone="secondary">{currentDate}</AppText>
        </View>
        {renderDashboard()}
      </ScrollView>

      <QuickAddButton onPress={openQuickAdd} style={styles.quickAddButton} />
      <QuickAddSheet
        onClose={() => setIsQuickAddOpen(false)}
        onSelect={selectQuickAddAction}
        visible={isQuickAddOpen}
      />
    </Screen>
  );
}

const styles = StyleSheet.create({
  content: {
    gap: spacing.xl,
    paddingBottom: spacing.giant + spacing.xxl,
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.md,
  },
  greeting: {
    gap: spacing.xxs,
  },
  quickAddButton: {
    bottom: spacing.lg,
    position: 'absolute',
    right: spacing.lg,
  },
  shortcutRow: {
    alignItems: 'stretch',
    flexDirection: 'row',
    gap: spacing.sm,
  },
});
