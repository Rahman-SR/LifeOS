import assert from 'node:assert/strict';
import test from 'node:test';
import { isGoalOverdue, isGoalTargetDateAllowed } from './goal-date-utils';

test('create accepts today or a future target but rejects past dates', () => {
  assert.equal(isGoalTargetDateAllowed({ mode: 'create', targetDate: '2026-08-06', todayDate: '2026-08-06' }), true);
  assert.equal(isGoalTargetDateAllowed({ mode: 'create', targetDate: '2026-08-07', todayDate: '2026-08-06' }), true);
  assert.equal(isGoalTargetDateAllowed({ mode: 'create', targetDate: '2026-08-05', todayDate: '2026-08-06' }), false);
});

test('editing preserves an existing overdue target without accepting a different past target', () => {
  assert.equal(isGoalTargetDateAllowed({ initialTargetDate: '2026-08-01', mode: 'edit', targetDate: '2026-08-01', todayDate: '2026-08-06' }), true);
  assert.equal(isGoalTargetDateAllowed({ initialTargetDate: '2026-08-01', mode: 'edit', targetDate: '2026-08-02', todayDate: '2026-08-06' }), false);
});

test('only active goals are overdue', () => {
  assert.equal(isGoalOverdue({ status: 'active', target_date: '2026-08-05' }, '2026-08-06'), true);
  assert.equal(isGoalOverdue({ status: 'paused', target_date: '2026-08-05' }, '2026-08-06'), false);
});
