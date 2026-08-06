import assert from 'node:assert/strict';
import test from 'node:test';

import { getDateKey, parseDateKey, shiftDateKey, startOfMonthDateKey, startOfWeekDateKey } from './local-date';

test('uses the requested profile timezone for date boundaries', () => {
  const instant = new Date('2026-08-03T20:00:00.000Z');
  assert.equal(getDateKey(instant, 'Asia/Kolkata'), '2026-08-04');
  assert.equal(getDateKey(instant, 'America/New_York'), '2026-08-03');
});

test('parses date-only values without shifting the day', () => {
  assert.equal(getDateKey(parseDateKey('2026-08-04')!), '2026-08-04');
  assert.equal(parseDateKey('2026-02-30'), null);
});

test('calculates week and month boundaries with date keys', () => {
  assert.equal(startOfWeekDateKey('2026-08-04', 1), '2026-08-03');
  assert.equal(startOfMonthDateKey('2026-08-04'), '2026-08-01');
  assert.equal(shiftDateKey('2026-08-01', -1), '2026-07-31');
});
