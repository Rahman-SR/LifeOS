import assert from 'node:assert/strict';
import test from 'node:test';

import { moodFormSchema, toMoodMutationValues } from './mood-schema';
import { summarizeMoods } from './mood-summary';
import type { MoodLog } from './mood-types';

test('mood validation accepts only supported values', () => {
  assert.equal(moodFormSchema.safeParse({ mood: 'good', note: '' }).success, true);
  assert.equal(moodFormSchema.safeParse({ mood: 'unknown', note: '' }).success, false);
});

test('mood values trim an optional reason', () => {
  assert.deepEqual(toMoodMutationValues({ mood: 'okay', note: '  busy day  ' }, '2026-08-04'), { mood: 'okay', mood_date: '2026-08-04', note: 'busy day' });
});

test('mood summary uses the documented one-to-five visualization score', () => {
  const base = { created_at: '', id: '', mood_date: '2026-08-04', note: null, updated_at: '', user_id: '' };
  const summary = summarizeMoods([{ ...base, id: '1', mood: 'bad' }, { ...base, id: '2', mood: 'excellent' }] as MoodLog[]);
  assert.equal(summary.average, 3);
  assert.equal(summary.counts.bad, 1);
  assert.equal(summary.counts.excellent, 1);
});
