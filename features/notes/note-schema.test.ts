import assert from 'node:assert/strict';
import test from 'node:test';

import { noteFormSchema, toNoteMutationValues } from './note-schema';

test('requires at least a title or content', () => {
  const result = noteFormSchema.safeParse({ content: '   ', isPinned: false, title: '  ' });
  assert.equal(result.success, false);
});

test('accepts title-only and content-only notes', () => {
  assert.equal(noteFormSchema.safeParse({ content: '', isPinned: false, title: 'Idea' }).success, true);
  assert.equal(noteFormSchema.safeParse({ content: 'Remember this', isPinned: true, title: '' }).success, true);
});

test('trims values before persistence', () => {
  assert.deepEqual(
    toNoteMutationValues({ content: '  Details\n', isPinned: true, title: '  Plan  ' }),
    { content: 'Details', is_pinned: true, title: 'Plan' },
  );
});
