import { addLocalDays, getHabitDateKey, isHabitScheduled, parseHabitDateKey } from './habit-date-utils';
import type { HabitFrequency, HabitStats } from './habit-types';

type LogLike = { completed_count: number; log_date: string };
type StatsInput = {
  frequencyType: HabitFrequency;
  logs: LogLike[];
  targetCount: number;
  today?: Date;
  weekdays: number[];
};

export function calculateHabitStats({
  frequencyType,
  logs,
  targetCount,
  today = new Date(),
  weekdays,
}: StatsInput): HabitStats {
  const completed = new Set(
    logs.filter((log) => log.completed_count >= targetCount).map((log) => log.log_date),
  );
  const localToday = new Date(today.getFullYear(), today.getMonth(), today.getDate(), 12);
  const earliest = logs
    .map((log) => parseHabitDateKey(log.log_date))
    .filter((date): date is Date => Boolean(date))
    .sort((a, b) => a.getTime() - b.getTime())[0];

  let bestStreak = 0;
  let run = 0;
  if (earliest) {
    for (let cursor = earliest; cursor <= localToday; cursor = addLocalDays(cursor, 1)) {
      if (!isHabitScheduled(frequencyType, weekdays, cursor)) continue;
      if (completed.has(getHabitDateKey(cursor))) {
        run += 1;
        bestStreak = Math.max(bestStreak, run);
      } else {
        run = 0;
      }
    }
  }

  let cursor = localToday;
  if (isHabitScheduled(frequencyType, weekdays, cursor) && !completed.has(getHabitDateKey(cursor))) {
    cursor = addLocalDays(cursor, -1);
  }
  let currentStreak = 0;
  for (let checked = 0; checked < 36600; checked += 1, cursor = addLocalDays(cursor, -1)) {
    if (!isHabitScheduled(frequencyType, weekdays, cursor)) continue;
    if (!completed.has(getHabitDateKey(cursor))) break;
    currentStreak += 1;
  }

  let required = 0;
  let completedRecent = 0;
  for (let offset = 0; offset < 30; offset += 1) {
    const date = addLocalDays(localToday, -offset);
    if (!isHabitScheduled(frequencyType, weekdays, date)) continue;
    required += 1;
    if (completed.has(getHabitDateKey(date))) completedRecent += 1;
  }

  return {
    bestStreak,
    completionRate: required === 0 ? 0 : completedRecent / required,
    currentStreak,
  };
}
