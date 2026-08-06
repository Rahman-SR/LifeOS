import * as Haptics from 'expo-haptics';
import { router } from 'expo-router';
import { Plus } from 'lucide-react-native';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { Alert, StyleSheet, View } from 'react-native';

import { AppHeader, IconButton, Screen } from '@/components/ui';
import {
  DeleteNoteConfirmation,
  NoteFilterTabs,
  NoteList,
  NoteSearchBar,
  getNoteErrorMessage,
  getNoteTitle,
  useArchiveNoteMutation,
  useDeleteNoteMutation,
  useNotesQuery,
  usePinNoteMutation,
  type Note,
  type NoteFilter,
} from '@/features/notes';
import { useAuth } from '@/hooks/use-auth';
import { spacing } from '@/theme';

const searchDebounceMs = 300;

export default function NotesScreen() {
  const { user } = useAuth();
  const userId = user?.id ?? '';
  const [filter, setFilter] = useState<NoteFilter>('all');
  const [search, setSearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [noteToDelete, setNoteToDelete] = useState<Note | null>(null);
  const notesQuery = useNotesQuery(userId, filter);
  const pinMutation = usePinNoteMutation(userId);
  const archiveMutation = useArchiveNoteMutation(userId);
  const deleteMutation = useDeleteNoteMutation(userId);
  const pinNoteAsync = pinMutation.mutateAsync;
  const archiveNoteAsync = archiveMutation.mutateAsync;
  const deleteNoteAsync = deleteMutation.mutateAsync;
  const refetchNotes = notesQuery.refetch;

  useEffect(() => {
    const timeout = setTimeout(() => setDebouncedSearch(search.trim().toLocaleLowerCase()), searchDebounceMs);
    return () => clearTimeout(timeout);
  }, [search]);

  const notes = useMemo(() => {
    if (!debouncedSearch) return notesQuery.data ?? [];
    return (notesQuery.data ?? []).filter((note) =>
      `${note.title}\n${note.content}`.toLocaleLowerCase().includes(debouncedSearch),
    );
  }, [debouncedSearch, notesQuery.data]);

  const haptic = useCallback(() => {
    void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => undefined);
  }, []);

  const pinNote = useCallback(async (note: Note, pinned: boolean) => {
    haptic();
    try {
      await pinNoteAsync({ note, pinned });
    } catch (error) {
      Alert.alert('Note was not updated', getNoteErrorMessage(error));
    }
  }, [haptic, pinNoteAsync]);

  const archiveNote = useCallback(async (note: Note) => {
    haptic();
    const archived = !note.archived_at;
    try {
      await archiveNoteAsync({ archived, note });
      Alert.alert(archived ? 'Note archived' : 'Note restored');
    } catch (error) {
      Alert.alert('Note was not updated', getNoteErrorMessage(error));
    }
  }, [archiveNoteAsync, haptic]);

  const confirmDelete = useCallback(async () => {
    if (!noteToDelete) return;
    void Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning).catch(() => undefined);
    try {
      await deleteNoteAsync(noteToDelete);
      setNoteToDelete(null);
      Alert.alert('Note deleted', 'The note was permanently deleted.');
    } catch (error) {
      Alert.alert('Note was not deleted', getNoteErrorMessage(error));
    }
  }, [deleteNoteAsync, noteToDelete]);

  const createNote = useCallback(() => router.push('/notes/create'), []);
  const openNote = useCallback((noteId: string) => router.push(`/notes/${noteId}`), []);
  const refreshNotes = useCallback(() => { void refetchNotes(); }, [refetchNotes]);
  const handleArchive = useCallback((note: Note) => { void archiveNote(note); }, [archiveNote]);
  const handlePin = useCallback((note: Note, pinned: boolean) => { void pinNote(note, pinned); }, [pinNote]);

  const mutationPending = pinMutation.isPending || archiveMutation.isPending || deleteMutation.isPending;

  return (
    <Screen contentContainerStyle={styles.screen} scroll={false}>
      <AppHeader
        action={<IconButton icon={Plus} label="Create note" onPress={createNote} />}
        eyebrow="NOTES"
        subtitle="Capture what matters and find it quickly."
        title="Your notes"
      />
      <NoteSearchBar onChangeText={setSearch} value={search} />
      <NoteFilterTabs onChange={setFilter} value={filter} />
      <View style={styles.list}>
        <NoteList
          data={notes}
          disabled={mutationPending}
          error={notesQuery.error ? getNoteErrorMessage(notesQuery.error) : null}
          filter={filter}
          isLoading={notesQuery.isLoading}
          isSearch={Boolean(debouncedSearch)}
          onArchive={handleArchive}
          onCreate={createNote}
          onDelete={setNoteToDelete}
          onOpen={openNote}
          onPin={handlePin}
          onRefresh={refreshNotes}
          onRetry={refreshNotes}
          refreshing={notesQuery.isRefetching && !notesQuery.isLoading}
        />
      </View>
      <DeleteNoteConfirmation
        loading={deleteMutation.isPending}
        name={noteToDelete ? getNoteTitle(noteToDelete) : 'This note'}
        onCancel={() => setNoteToDelete(null)}
        onConfirm={() => void confirmDelete()}
        visible={Boolean(noteToDelete)}
      />
    </Screen>
  );
}

const styles = StyleSheet.create({
  list: { flex: 1 },
  screen: { flex: 1, gap: spacing.md },
});
