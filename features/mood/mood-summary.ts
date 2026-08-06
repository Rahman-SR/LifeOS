import type { MoodCounts, MoodLog, MoodValue } from './mood-types';
const moodScores: Record<MoodValue, number> = { bad: 1, excellent: 5, good: 4, low: 2, okay: 3 };

export function summarizeMoods(logs: MoodLog[]) {
  const counts: MoodCounts = { bad: 0, excellent: 0, good: 0, low: 0, okay: 0 };
  let scoreTotal = 0;
  logs.forEach((log) => {
    const mood = log.mood as MoodValue;
    counts[mood] = (counts[mood] ?? 0) + 1;
    scoreTotal += moodScores[mood];
  });
  return { average: logs.length ? scoreTotal / logs.length : 0, counts, total: logs.length };
}
