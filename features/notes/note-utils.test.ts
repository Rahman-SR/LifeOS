import assert from 'node:assert/strict';
import test from 'node:test';

import { getNoteTitle, sortNotes } from './note-utils';
import type { Note } from './note-types';

function note(id: string, pinned: boolean, updatedAt: string): Note {
  return {
    archived_at: null,
    color: null,
    content: `Content ${id}`,
    created_at: updatedAt,
    id,
    is_pinned: pinned,
    title: '',
    updated_at: updatedAt,
    user_id: 'user',
  };
}

test('uses content as the title when the title is empty', () => {
  assert.equal(getNoteTitle(note('one', false, '2026-08-01T00:00:00Z')), 'Content one');
});

test('sorts pinned notes first in normal views', () => {
  const result = sortNotes([
    note('new', false, '2026-08-03T00:00:00Z'),
    note('pinned', true, '2026-08-01T00:00:00Z'),
  ], 'all');
  assert.deepEqual(result.map((item) => item.id), ['pinned', 'new']);
});

test('sorts archived notes only by most recent update', () => {
  const result = sortNotes([
    note('old-pinned', true, '2026-08-01T00:00:00Z'),
    note('new', false, '2026-08-03T00:00:00Z'),
  ], 'archived');
  assert.deepEqual(result.map((item) => item.id), ['new', 'old-pinned']);
});
