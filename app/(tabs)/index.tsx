import * as Haptics from 'expo-haptics';
import { router } from 'expo-router';
import { useEffect, useMemo, useState } from 'react';
import { Alert, RefreshControl, ScrollView, StyleSheet, View } from 'react-native';

import { EmptyState, ErrorState, LoadingState } from '@/components/feedback';
import { AppText, Screen } from '@/components/ui';
import {
  DailyProgressCard,
  DashboardSection,
  GoalPreviewCard,
  HabitPreviewCard,
  JournalShortcutCard,
  MoodShortcutCard,
  NotePreviewCard,
  QuickAddButton,
  QuickAddSheet,
  type QuickAddAction,
} from '@/features/dashboard/components';
import {
  mockGoal,
  mockNote,
  resetMockHabits,
} from '@/features/dashboard/dashboard-mock-data';
import {
  TaskCard,
  TaskEmptyState,
  useTodayTaskSummary,
  useToggleTaskMutation,
} from '@/features/tasks';
import { useAppTheme } from '@/hooks/use-app-theme';
import { useAuth } from '@/hooks/use-auth';
import { spacing } from '@/theme';

const initialLoadDelay = 200;
const refreshDelay = 500;

function wait(duration: number) {
  return new Promise<void>((resolve) => setTimeout(resolve, duration));
}

export default function TodayScreen() {
  const { colors } = useAppTheme();
  const { profile, profileError, refreshProfile, user } = useAuth();
  const [habits, setHabits] = useState(resetMockHabits);
  const [isDashboardLoading, setIsDashboardLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isQuickAddOpen, setIsQuickAddOpen] = useState(false);
  const userId = user!.id;
  const todayTasksQuery = useTodayTaskSummary(userId);
  const toggleTaskMutation = useToggleTaskMutation(userId);

  useEffect(() => {
    const timeout = setTimeout(() => setIsDashboardLoading(false), initialLoadDelay);
    return () => clearTimeout(timeout);
  }, []);

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

  const currentDate = useMemo(
    () =>
      new Intl.DateTimeFormat(undefined, {
        day: 'numeric',
        month: 'long',
        weekday: 'long',
      }).format(new Date()),
    [],
  );

  const todayTasks = todayTasksQuery.data ?? [];
  const completedTasks = todayTasks.filter((task) => task.is_completed).length;
  const completedHabits = habits.filter((habit) => habit.completed).length;
  const hasDashboardContent = Boolean(todayTasks.length || habits.length || mockGoal || mockNote);

  const triggerLightHaptic = () => {
    void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => undefined);
  };

  const toggleTask = async (taskId: string, completed: boolean) => {
    triggerLightHaptic();
    try {
      const result = await toggleTaskMutation.mutateAsync({ completed, taskId });
      if (result.reminderWarning) Alert.alert('Reminder update', result.reminderWarning);
    } catch (error) {
      Alert.alert('Task was not updated', error instanceof Error ? error.message : 'Please try again.');
    }
  };

  const toggleHabit = (habitId: string) => {
    triggerLightHaptic();
    setHabits((current) =>
      current.map((habit) =>
        habit.id === habitId ? { ...habit, completed: !habit.completed } : habit,
      ),
    );
  };

  const openQuickAdd = () => {
    triggerLightHaptic();
    setIsQuickAddOpen(true);
  };

  const showComingSoon = (label: string) => {
    Alert.alert(label, 'Coming in the next phase. This dashboard currently uses mock data only.');
  };

  const selectQuickAddAction = (action: QuickAddAction, label: string) => {
    setIsQuickAddOpen(false);
    if (action === 'task') {
      router.push('/tasks/create');
      return;
    }
    showComingSoon(label);
  };

  const refreshDashboard = async () => {
    if (isRefreshing) return;
    setIsRefreshing(true);
    try {
      await Promise.all([refreshProfile(), todayTasksQuery.refetch(), wait(refreshDelay)]);
      setHabits(resetMockHabits());
    } finally {
      setIsRefreshing(false);
    }
  };

  const renderDashboard = () => {
    if (isDashboardLoading || todayTasksQuery.isLoading) {
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
          totalHabits={habits.length}
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
          {!todayTasksQuery.error && todayTasks.filter((task) => !task.is_completed).length === 0 ? (
            <TaskEmptyState filter="today" onCreate={() => router.push('/tasks/create')} />
          ) : null}
          {todayTasks
            .filter((task) => !task.is_completed)
            .slice(0, 3)
            .map((task) => (
              <TaskCard
                compact
                key={task.id}
                onOpen={(taskId) => router.push(`/tasks/${taskId}`)}
                onToggle={(taskId, completed) => void toggleTask(taskId, completed)}
                task={task}
              />
            ))}
        </DashboardSection>

        <DashboardSection
          actionLabel="View all habits"
          onAction={() => router.push('/habits')}
          title="Today&apos;s habits"
        >
          {habits.slice(0, 4).map((habit) => (
            <HabitPreviewCard habit={habit} key={habit.id} onToggle={toggleHabit} />
          ))}
        </DashboardSection>

        <DashboardSection title="Check in and reflect">
          <View style={styles.shortcutRow}>
            <MoodShortcutCard onPress={() => showComingSoon('Record Mood')} />
            <JournalShortcutCard onPress={() => showComingSoon('Write Journal')} />
          </View>
        </DashboardSection>

        <DashboardSection title="Active goal">
          <GoalPreviewCard goal={mockGoal} onPress={() => showComingSoon('Goal details')} />
        </DashboardSection>

        <DashboardSection title="Recent note">
          <NotePreviewCard note={mockNote} onPress={() => showComingSoon('Note details')} />
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
