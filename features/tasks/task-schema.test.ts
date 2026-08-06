import assert from 'node:assert/strict';
import test from 'node:test';

import { createTaskFormSchema } from './task-schema';

const base = {
  categoryId: '',
  description: '',
  dueDate: '2026-08-04',
  priority: 'medium' as const,
  title: 'Plan the day',
};
const schema = createTaskFormSchema(() => new Date(2026, 7, 4, 15, 0, 0, 0));

test('today is valid without a due time', () => {
  assert.equal(schema.safeParse({ ...base, dueTime: '', reminderEnabled: false }).success, true);
});

test('today with a future reminder time is valid', () => {
  assert.equal(schema.safeParse({ ...base, dueTime: '18:00', reminderEnabled: true }).success, true);
});

test('today with a past time is valid when reminders are disabled', () => {
  assert.equal(schema.safeParse({ ...base, dueTime: '13:00', reminderEnabled: false }).success, true);
});

test('today with a past reminder time is rejected', () => {
  const result = schema.safeParse({ ...base, dueTime: '13:00', reminderEnabled: true });
  assert.equal(result.success, false);
});

test('an enabled reminder requires both local date and time', () => {
  const result = schema.safeParse({ ...base, dueDate: '', dueTime: '', reminderEnabled: true });
  assert.equal(result.success, false);
  if (!result.success) {
    assert.ok(result.error.issues.some((issue) => issue.message === 'Choose a date and time for the reminder.'));
  }
});
