import { useMutation, useQuery, useQueryClient, type QueryKey } from '@tanstack/react-query';

import { noteKeys } from './note-query-keys';
import { createNote, deleteNote, fetchNote, fetchNotes, fetchRecentNote, updateNote } from './note-service';
import { sortNotes } from './note-utils';
import type { Note, NoteFilter, NoteMutationValues } from './note-types';

type CacheContext = { snapshots: Array<[QueryKey, unknown]> };

function errorMessage(error: unknown): string {
  return error instanceof Error ? error.message : 'Something went wrong. Please try again.';
}

function restoreSnapshots(client: ReturnType<typeof useQueryClient>, context?: CacheContext) {
  context?.snapshots.forEach(([key, value]) => client.setQueryData(key, value));
}

function invalidateNoteViews(client: ReturnType<typeof useQueryClient>, userId: string) {
  void client.invalidateQueries({ queryKey: noteKeys.lists(userId) }).catch(() => undefined);
  void client.invalidateQueries({ queryKey: noteKeys.dashboardRecent(userId) }).catch(() => undefined);
}

export function useNotesQuery(userId: string | undefined, filter: NoteFilter) {
  return useQuery({
    enabled: Boolean(userId),
    queryFn: () => fetchNotes(userId!, filter),
    queryKey: noteKeys.list(userId ?? 'signed-out', filter),
  });
}

export function useRecentNoteQuery(userId: string | undefined) {
  return useQuery({
    enabled: Boolean(userId),
    queryFn: () => fetchRecentNote(userId!),
    queryKey: noteKeys.dashboardRecent(userId ?? 'signed-out'),
  });
}

export function useNoteDetails(userId: string | undefined, noteId: string | undefined) {
  return useQuery({
    enabled: Boolean(userId && noteId),
    queryFn: () => fetchNote(userId!, noteId!),
    queryKey: noteKeys.detail(userId ?? 'signed-out', noteId ?? 'missing'),
  });
}

export function useCreateNoteMutation(userId: string) {
  const client = useQueryClient();
  return useMutation<Note, Error, NoteMutationValues>({
    mutationFn: (values) => createNote(userId, values),
    onSuccess: (note) => {
      try {
        client.setQueryData(noteKeys.detail(userId, note.id), note);
        invalidateNoteViews(client, userId);
      } catch {
        // The database insert succeeded; cache maintenance is best-effort post-save work.
      }
    },
  });
}

export function useUpdateNoteMutation(userId: string, noteId: string) {
  const client = useQueryClient();
  return useMutation<Note, Error, NoteMutationValues>({
    mutationFn: (values) => updateNote(userId, noteId, values),
    onSuccess: (note) => {
      try {
        client.setQueryData(noteKeys.detail(userId, note.id), note);
        invalidateNoteViews(client, userId);
      } catch {
        // The database update succeeded; cache maintenance is best-effort post-save work.
      }
    },
  });
}

export function usePinNoteMutation(userId: string) {
  const client = useQueryClient();
  return useMutation<Note, Error, { note: Note; pinned: boolean }, CacheContext>({
    mutationFn: ({ note, pinned }) => updateNote(userId, note.id, { is_pinned: pinned }),
    onMutate: async ({ note, pinned }) => {
      await client.cancelQueries({ queryKey: noteKeys.all(userId) });
      const snapshots = client.getQueriesData({ queryKey: noteKeys.all(userId) });
      const optimistic = { ...note, is_pinned: pinned, updated_at: new Date().toISOString() };
      client.setQueryData(noteKeys.detail(userId, note.id), optimistic);
      snapshots.forEach(([key, value]) => {
        if (!Array.isArray(value)) return;
        const filter = (key[3] ?? 'all') as NoteFilter;
        const updated = value.map((item: Note) => item.id === note.id ? optimistic : item);
        const next = filter === 'pinned' && !pinned
          ? updated.filter((item: Note) => item.id !== note.id)
          : updated;
        client.setQueryData(key, sortNotes(next, filter));
      });
      return { snapshots };
    },
    onError: (_error, _variables, context) => restoreSnapshots(client, context),
    onSuccess: (note) => client.setQueryData(noteKeys.detail(userId, note.id), note),
    onSettled: () => invalidateNoteViews(client, userId),
  });
}

export function useArchiveNoteMutation(userId: string) {
  const client = useQueryClient();
  return useMutation<Note, Error, { archived: boolean; note: Note }, CacheContext>({
    mutationFn: ({ archived, note }) => updateNote(userId, note.id, {
      archived_at: archived ? new Date().toISOString() : null,
    }),
    onMutate: async ({ archived, note }) => {
      await client.cancelQueries({ queryKey: noteKeys.all(userId) });
      const snapshots = client.getQueriesData({ queryKey: noteKeys.all(userId) });
      const optimistic = {
        ...note,
        archived_at: archived ? new Date().toISOString() : null,
        updated_at: new Date().toISOString(),
      };
      client.setQueryData(noteKeys.detail(userId, note.id), optimistic);
      snapshots.forEach(([key, value]) => {
        if (!Array.isArray(value)) return;
        const filter = key[3] as NoteFilter | undefined;
        const shouldContain = archived ? filter === 'archived' : filter !== 'archived';
        const next = shouldContain
          ? value.map((item: Note) => item.id === note.id ? optimistic : item)
          : value.filter((item: Note) => item.id !== note.id);
        client.setQueryData(key, filter ? sortNotes(next, filter) : next);
      });
      return { snapshots };
    },
    onError: (_error, _variables, context) => restoreSnapshots(client, context),
    onSuccess: (note) => client.setQueryData(noteKeys.detail(userId, note.id), note),
    onSettled: () => invalidateNoteViews(client, userId),
  });
}

export function useDeleteNoteMutation(userId: string) {
  const client = useQueryClient();
  return useMutation<void, Error, Note, CacheContext>({
    mutationFn: (note) => deleteNote(userId, note.id),
    onMutate: async (note) => {
      await client.cancelQueries({ queryKey: noteKeys.all(userId) });
      const snapshots = client.getQueriesData({ queryKey: noteKeys.all(userId) });
      client.setQueriesData<Note[]>({ queryKey: noteKeys.lists(userId) }, (current) =>
        current?.filter((item) => item.id !== note.id),
      );
      client.removeQueries({ exact: true, queryKey: noteKeys.detail(userId, note.id) });
      return { snapshots };
    },
    onError: (_error, _variables, context) => restoreSnapshots(client, context),
    onSettled: (_data, _error, note) => {
      client.removeQueries({ exact: true, queryKey: noteKeys.detail(userId, note.id) });
      invalidateNoteViews(client, userId);
    },
  });
}

export { errorMessage as getNoteErrorMessage };
