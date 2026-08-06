import { router } from 'expo-router';
import { ArrowLeft, History } from 'lucide-react-native';
import { Alert, StyleSheet, View } from 'react-native';

import { ErrorState, LoadingState } from '@/components/feedback';
import { AppText, IconButton, Screen } from '@/components/ui';
import { MoodCheckInForm, useSaveMoodMutation, useTodayMoodQuery } from '@/features/mood';
import { useAuth } from '@/hooks/use-auth';
import { formatDateKey, getDateKey } from '@/lib/local-date';
import { spacing } from '@/theme';

export default function MoodCheckInScreen() {
  const { profile, user } = useAuth();
  const userId = user?.id ?? '';
  const date = getDateKey(new Date(), profile?.timezone);
  const query = useTodayMoodQuery(userId, date);
  const mutation = useSaveMoodMutation(userId);
  return (
    <Screen scrollProps={{ keyboardDismissMode: 'interactive' }}>
      <View style={styles.header}>
        <IconButton icon={ArrowLeft} label="Go back" onPress={() => router.back()} />
        <View style={styles.heading}>
          <AppText accessibilityRole="header" variant="heading2">Daily mood</AppText>
          <AppText tone="secondary" variant="bodySmall">{formatDateKey(date, { day: 'numeric', month: 'long', weekday: 'long' })}</AppText>
        </View>
        <IconButton icon={History} label="View mood history" onPress={() => router.push('/mood/history')} />
      </View>
      {query.isLoading ? <LoadingState label="Loading today’s mood…" /> : null}
      {query.error ? <ErrorState description="Today’s mood could not be loaded." onRetry={() => void query.refetch()} title="Mood unavailable" /> : null}
      {!query.isLoading && !query.error ? (
        <MoodCheckInForm date={date} initialMood={query.data ?? null} onSaved={(mood) => Alert.alert('Mood saved', `Today’s mood is ${mood.mood}.`)} onSubmit={(values) => mutation.mutateAsync(values)} />
      ) : null}
    </Screen>
  );
}

const styles = StyleSheet.create({ header: { alignItems: 'center', flexDirection: 'row', gap: spacing.sm, marginBottom: spacing.lg }, heading: { flex: 1, gap: spacing.xxs } });
