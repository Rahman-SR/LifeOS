import assert from 'node:assert/strict';
import test from 'node:test';

import {
  getLocalDateKey,
  isLocalDateTimeInFuture,
  parseLocalDateTime,
} from './task-date-utils';

test('local date-time parsing does not shift the selected calendar date', () => {
  const parsed = parseLocalDateTime('2026-08-04', '18:00');
  assert.ok(parsed);
  assert.equal(getLocalDateKey(parsed), '2026-08-04');
  assert.equal(parsed.getHours(), 18);
});

test('future validation compares the local date and time together', () => {
  const now = new Date(2026, 7, 4, 15, 0, 0, 0);
  assert.equal(isLocalDateTimeInFuture('2026-08-04', '18:00', now), true);
  assert.equal(isLocalDateTimeInFuture('2026-08-04', '13:00', now), false);
  assert.equal(isLocalDateTimeInFuture('2026-08-05', '00:00', now), true);
});
