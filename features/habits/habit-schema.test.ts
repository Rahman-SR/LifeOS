import assert from 'node:assert/strict';
import test from 'node:test';

import { habitFormSchema } from './habit-schema';

const base = { colorToken: 'primary', description: '', frequencyType: 'daily', icon: 'droplets', name: 'Drink water', reminderEnabled: false, reminderTime: '', targetCount: '1', weekdays: [] } as const;

test('accepts a daily habit with optional fields omitted', () => {
  assert.equal(habitFormSchema.safeParse(base).success, true);
});

test('weekday habits require at least one Sunday-zero weekday', () => {
  assert.equal(habitFormSchema.safeParse({ ...base, frequencyType: 'weekly' }).success, false);
  assert.equal(habitFormSchema.safeParse({ ...base, frequencyType: 'weekly', weekdays: [0, 6] }).success, true);
});

test('enabled reminders require a valid time', () => {
  assert.equal(habitFormSchema.safeParse({ ...base, reminderEnabled: true }).success, false);
});
