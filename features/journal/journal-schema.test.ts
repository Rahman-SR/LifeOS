import assert from 'node:assert/strict';
import test from 'node:test';

import { journalFormSchema, toJournalMutationValues } from './journal-schema';

test('journal requires at least one non-whitespace field', () => {
  assert.equal(journalFormSchema.safeParse({ content: ' ', improveTomorrow: '', title: '', wasDifficult: '', wentWell: '' }).success, false);
  assert.equal(journalFormSchema.safeParse({ content: '', improveTomorrow: '', title: '', wasDifficult: '', wentWell: 'A calm walk' }).success, true);
});

test('journal values are trimmed before persistence', () => {
  assert.deepEqual(toJournalMutationValues({ content: ' body ', improveTomorrow: ' ', title: ' title ', wasDifficult: '', wentWell: ' win ' }, '2026-08-04'), { content: 'body', entry_date: '2026-08-04', improve_tomorrow: null, title: 'title', was_difficult: null, went_well: 'win' });
});
