import { router } from 'expo-router';
import { ArrowLeft, Plus } from 'lucide-react-native';
import { useState } from 'react';
import { RefreshControl, ScrollView, StyleSheet, View } from 'react-native';

import { ErrorState, LoadingState } from '@/components/feedback';
import { AppText, Button, IconButton, Screen } from '@/components/ui';
import {
  GoalEmptyState,
  GoalFilterTabs,
  GoalList,
  useGoalsQuery,
  useGoalSummary,
  type GoalFilter,
} from '@/features/goals';
import { useAppTheme } from '@/hooks/use-app-theme';
import { useAuth } from '@/hooks/use-auth';
import { getDateKey } from '@/lib/local-date';
import { sizing, spacing } from '@/theme';

function returnToToday() {
  if (router.canGoBack()) router.back();
  else router.replace('/(tabs)');
}

export default function GoalsScreen() {
  const { colors } = useAppTheme();
  const { profile, user } = useAuth();
  const userId = user!.id;
  const [filter, setFilter] = useState<GoalFilter>('active');
  const query = useGoalsQuery(userId, filter);
  const summary = useGoalSummary(userId);
  const todayDate = getDateKey(new Date(), profile?.timezone);

  return (
    <Screen padded={false} scroll={false}>
      <ScrollView
        contentContainerStyle={styles.content}
        refreshControl={(
          <RefreshControl
            colors={[colors.primary]}
            onRefresh={() => void Promise.all([query.refetch(), summary.refetch()])}
            refreshing={query.isRefetching || summary.isRefetching}
            tintColor={colors.primary}
          />
        )}
      >
        <View style={styles.header}>
          <IconButton icon={ArrowLeft} label="Back to Today" onPress={returnToToday} />
          <View style={styles.copy}>
            <AppText accessibilityRole="header" variant="heading1">Goals</AppText>
            <AppText tone="secondary">Turn meaningful outcomes into steady progress.</AppText>
          </View>
          <Button
            fullWidth={false}
            label="New goal"
            leftIcon={<Plus color={colors.onPrimary} size={sizing.iconSmall} />}
            onPress={() => router.push('/goals/create')}
          />
        </View>
        <View style={styles.summary}>
          <AppText variant="bodySmall">{summary.summary.activeCount} active</AppText>
          <AppText variant="bodySmall">{summary.summary.completedThisMonth} completed this month</AppText>
          <AppText variant="bodySmall">{summary.summary.averageProgress}% average progress</AppText>
        </View>
        <GoalFilterTabs onChange={setFilter} value={filter} />
        {query.isLoading ? <LoadingState label="Loading goals…" /> : null}
        {query.error ? (
          <ErrorState
            description="Your goals could not be loaded."
            onRetry={() => void query.refetch()}
            title="Goals unavailable"
          />
        ) : null}
        {!query.isLoading && !query.error && query.data?.length ? (
          <GoalList
            goals={query.data}
            onPress={(id) => router.push(`/goals/${id}`)}
            todayDate={todayDate}
          />
        ) : null}
        {!query.isLoading && !query.error && !query.data?.length ? (
          <GoalEmptyState filter={filter} onCreate={() => router.push('/goals/create')} />
        ) : null}
      </ScrollView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  content: { gap: spacing.lg, padding: spacing.lg, paddingBottom: spacing.giant },
  copy: { flex: 1, gap: spacing.xxs },
  header: { alignItems: 'center', flexDirection: 'row', gap: spacing.sm },
  summary: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.md },
});
