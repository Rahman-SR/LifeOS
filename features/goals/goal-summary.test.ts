import assert from 'node:assert/strict';
import test from 'node:test';
import { calculateGoalSummary } from './goal-summary';

test('summary separates active, completed, archived, overdue and monthly completion', () => {
  const summary = calculateGoalSummary([
    { completed_at: null, progress: 40, status: 'active', target_date: '2026-08-05' },
    { completed_at: '2026-08-02T20:00:00.000Z', progress: 100, status: 'completed', target_date: null },
    { completed_at: null, progress: 70, status: 'paused', target_date: null },
    { completed_at: null, progress: 10, status: 'archived', target_date: null },
  ], '2026-08-06', 'Asia/Calcutta');
  assert.deepEqual(summary, { activeCount: 1, averageProgress: 70, completedCount: 1, completedThisMonth: 1, overdueActiveCount: 1 });
});
