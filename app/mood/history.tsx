import { router } from 'expo-router';
import { ArrowLeft } from 'lucide-react-native';
import { useMemo } from 'react';
import { StyleSheet, View } from 'react-native';

import { ErrorState, LoadingState } from '@/components/feedback';
import { AppText, IconButton, Screen } from '@/components/ui';
import { MoodHistoryList, MoodSummaryCard, summarizeMoods, useMoodHistoryQuery } from '@/features/mood';
import { useAuth } from '@/hooks/use-auth';
import { getDateKey, startOfMonthDateKey, startOfWeekDateKey } from '@/lib/local-date';
import { spacing } from '@/theme';

export default function MoodHistoryScreen() {
  const { profile, user } = useAuth();
  const query = useMoodHistoryQuery(user?.id);
  const today = getDateKey(new Date(), profile?.timezone);
  const weekStart = startOfWeekDateKey(today, profile?.week_starts_on ?? 1);
  const monthStart = startOfMonthDateKey(today);
  const weekly = useMemo(() => summarizeMoods((query.data ?? []).filter((item) => item.mood_date >= weekStart && item.mood_date <= today)), [query.data, today, weekStart]);
  const monthly = useMemo(() => summarizeMoods((query.data ?? []).filter((item) => item.mood_date >= monthStart && item.mood_date <= today)), [monthStart, query.data, today]);
  const header = (
    <View style={styles.headerContent}>
      <View style={styles.headerRow}><IconButton icon={ArrowLeft} label="Go back" onPress={() => router.back()} /><View style={styles.headerCopy}><AppText accessibilityRole="header" variant="heading1">Mood history</AppText><AppText tone="secondary">See recent patterns without judging the day.</AppText></View></View>
      <MoodSummaryCard {...weekly} label="This week" />
      <MoodSummaryCard {...monthly} label="This month" />
    </View>
  );

  return (
    <Screen scroll={false}>
      {query.isLoading ? <LoadingState label="Loading mood history…" /> : null}
      {query.error ? <ErrorState description="Your mood history could not be loaded." onRetry={() => void query.refetch()} title="History unavailable" /> : null}
      {!query.isLoading && !query.error ? <MoodHistoryList data={query.data ?? []} header={header} onRefresh={() => void query.refetch()} refreshing={query.isRefetching && !query.isLoading} /> : null}
    </Screen>
  );
}

const styles = StyleSheet.create({ headerContent: { gap: spacing.lg, paddingBottom: spacing.sm }, headerCopy: { flex: 1, gap: spacing.xxs }, headerRow: { alignItems: 'flex-start', flexDirection: 'row', gap: spacing.xs } });
