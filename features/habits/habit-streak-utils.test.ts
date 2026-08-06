import assert from 'node:assert/strict';
import test from 'node:test';

import { calculateHabitStats } from './habit-streak-utils';

const log = (log_date: string, completed_count = 1) => ({ completed_count, log_date });

test('daily streak ignores an unfinished current day', () => {
  const stats = calculateHabitStats({ frequencyType: 'daily', logs: [log('2026-08-03'), log('2026-08-02')], targetCount: 1, today: new Date(2026, 7, 4, 9), weekdays: [] });
  assert.equal(stats.currentStreak, 2);
  assert.equal(stats.bestStreak, 2);
});

test('weekday streak skips non-scheduled days', () => {
  const stats = calculateHabitStats({ frequencyType: 'weekly', logs: [log('2026-08-03'), log('2026-07-31')], targetCount: 1, today: new Date(2026, 7, 4, 9), weekdays: [1, 5] });
  assert.equal(stats.currentStreak, 2);
});

test('counts a day only when the target is reached', () => {
  const stats = calculateHabitStats({ frequencyType: 'daily', logs: [log('2026-08-03', 1)], targetCount: 2, today: new Date(2026, 7, 4, 9), weekdays: [] });
  assert.equal(stats.currentStreak, 0);
});
