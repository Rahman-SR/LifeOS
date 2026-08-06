import * as Haptics from 'expo-haptics';
import { router, useLocalSearchParams } from 'expo-router';
import { useState } from 'react';
import { Alert, StyleSheet } from 'react-native';

import { ErrorState, LoadingState } from '@/components/feedback';
import { Screen } from '@/components/ui';
import {
  DeleteNoteConfirmation,
  NoteEditor,
  getNoteErrorMessage,
  getNoteTitle,
  useArchiveNoteMutation,
  useDeleteNoteMutation,
  useNoteDetails,
  useUpdateNoteMutation,
  type NoteFormValues,
} from '@/features/notes';
import { useAuth } from '@/hooks/use-auth';
import { spacing } from '@/theme';

export default function EditNoteScreen() {
  const { user } = useAuth();
  const { id } = useLocalSearchParams<{ id?: string }>();
  const noteId = typeof id === 'string' ? id : undefined;
  const userId = user?.id ?? '';
  const noteQuery = useNoteDetails(userId, noteId);
  const updateMutation = useUpdateNoteMutation(userId, noteId ?? 'missing');
  const archiveMutation = useArchiveNoteMutation(userId);
  const deleteMutation = useDeleteNoteMutation(userId);
  const [showDelete, setShowDelete] = useState(false);
  const note = noteQuery.data;
  const initialValues: NoteFormValues | undefined = note
    ? { content: note.content, isPinned: note.is_pinned, title: note.title }
    : undefined;

  const toggleArchive = async () => {
    if (!note) return;
    void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => undefined);
    try {
      const archived = !note.archived_at;
      await archiveMutation.mutateAsync({ archived, note });
      router.replace('/notes');
      Alert.alert(archived ? 'Note archived' : 'Note restored');
    } catch (error) {
      Alert.alert('Note was not updated', getNoteErrorMessage(error));
    }
  };

  const confirmDelete = async () => {
    if (!note) return;
    void Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning).catch(() => undefined);
    try {
      await deleteMutation.mutateAsync(note);
      setShowDelete(false);
      router.replace('/notes');
      Alert.alert('Note deleted', 'The note was permanently deleted.');
    } catch (error) {
      Alert.alert('Note was not deleted', getNoteErrorMessage(error));
    }
  };

  return (
    <Screen contentContainerStyle={styles.screen} scroll={false}>
      {noteQuery.isLoading ? <LoadingState label="Loading note…" /> : null}
      {noteQuery.error ? (
        <ErrorState
          description="This note could not be loaded. It may belong to another account."
          onRetry={() => void noteQuery.refetch()}
          title="Note unavailable"
        />
      ) : null}
      {note && initialValues ? (
        <NoteEditor
          archived={Boolean(note.archived_at)}
          archiveLoading={archiveMutation.isPending}
          deleteLoading={deleteMutation.isPending}
          initialValues={initialValues}
          mode="edit"
          onArchive={() => void toggleArchive()}
          onCancel={() => router.back()}
          onDelete={() => setShowDelete(true)}
          onSaved={(savedNote) => {
            router.replace(`/notes/${savedNote.id}`);
            Alert.alert('Note updated', 'Your changes were saved.');
          }}
          onSubmit={(values) => updateMutation.mutateAsync(values)}
        />
      ) : null}
      <DeleteNoteConfirmation
        loading={deleteMutation.isPending}
        name={note ? getNoteTitle(note) : 'This note'}
        onCancel={() => setShowDelete(false)}
        onConfirm={() => void confirmDelete()}
        visible={showDelete}
      />
    </Screen>
  );
}

const styles = StyleSheet.create({ screen: { flex: 1, gap: spacing.md, paddingTop: spacing.xs } });
