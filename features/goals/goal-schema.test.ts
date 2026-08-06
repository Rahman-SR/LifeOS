import assert from 'node:assert/strict';
import test from 'node:test';
import { createGoalFormSchema, toGoalMutationValues } from './goal-schema';

const schema = createGoalFormSchema({ mode: 'create', todayDate: '2026-08-06' });
const base = { description: '', milestones: [], progress: 25, status: 'active' as const, targetDate: '2026-08-06', title: 'Ship LifeOS' };

test('goal requires a title and bounded integer progress', () => {
  assert.equal(schema.safeParse(base).success, true);
  assert.equal(schema.safeParse({ ...base, title: ' ' }).success, false);
  assert.equal(schema.safeParse({ ...base, progress: 101 }).success, false);
  assert.equal(schema.safeParse({ ...base, progress: 4.5 }).success, false);
});

test('milestone titles cannot be blank', () => {
  assert.equal(schema.safeParse({ ...base, milestones: [{ isCompleted: false, title: ' ' }] }).success, false);
});

test('completed goals persist at 100 percent with completion time', () => {
  const values = toGoalMutationValues({ ...base, status: 'completed' });
  assert.equal(values.progress, 100);
  assert.ok(values.completed_at);
});
