import type { NoteFilter } from './note-types';

export const noteKeys = {
  all: (userId: string) => ['notes', userId] as const,
  dashboardRecent: (userId: string) => [...noteKeys.all(userId), 'dashboard-recent'] as const,
  detail: (userId: string, noteId: string) => [...noteKeys.details(userId), noteId] as const,
  details: (userId: string) => [...noteKeys.all(userId), 'detail'] as const,
  list: (userId: string, filter: NoteFilter) => [...noteKeys.lists(userId), filter] as const,
  lists: (userId: string) => [...noteKeys.all(userId), 'list'] as const,
};
