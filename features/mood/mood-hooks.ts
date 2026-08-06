import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { moodKeys } from './mood-query-keys';
import { fetchMoodForDate, fetchMoodHistory, saveDailyMood } from './mood-service';
import type { MoodLog, MoodMutationValues } from './mood-types';

export function useTodayMoodQuery(userId: string | undefined, date: string) {
  return useQuery({
    enabled: Boolean(userId),
    queryFn: () => fetchMoodForDate(userId!, date),
    queryKey: moodKeys.today(userId ?? 'signed-out', date),
  });
}

export function useMoodHistoryQuery(userId: string | undefined) {
  return useQuery({
    enabled: Boolean(userId),
    queryFn: () => fetchMoodHistory(userId!),
    queryKey: moodKeys.history(userId ?? 'signed-out'),
  });
}

export function useSaveMoodMutation(userId: string) {
  const client = useQueryClient();
  return useMutation<MoodLog, Error, MoodMutationValues>({
    mutationFn: (values) => saveDailyMood(userId, values),
    onSuccess: (mood) => {
      try {
        client.setQueryData(moodKeys.today(userId, mood.mood_date), mood);
        void client.invalidateQueries({ queryKey: moodKeys.history(userId) }).catch(() => undefined);
      } catch {
        // The row is saved; cache maintenance must not turn success into failure.
      }
    },
  });
}

export function getMoodErrorMessage(error: unknown) {
  return error instanceof Error ? error.message : 'Mood data could not be loaded.';
}
