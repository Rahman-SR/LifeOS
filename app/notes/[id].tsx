import * as Haptics from 'expo-haptics';
import { router, useLocalSearchParams } from 'expo-router';
import { ArrowLeft, Pencil } from 'lucide-react-native';
import { useState } from 'react';
import { Alert, ScrollView, StyleSheet, View } from 'react-native';

import { ErrorState, LoadingState } from '@/components/feedback';
import { AppHeader, AppText, Button, Card, IconButton, Screen } from '@/components/ui';
import {
  ArchiveNoteAction,
  DeleteNoteConfirmation,
  NoteMetadata,
  PinToggle,
  getNoteErrorMessage,
  getNoteTitle,
  useArchiveNoteMutation,
  useDeleteNoteMutation,
  useNoteDetails,
  usePinNoteMutation,
} from '@/features/notes';
import { useAuth } from '@/hooks/use-auth';
import { spacing } from '@/theme';

export default function NoteDetailsScreen() {
  const { user } = useAuth();
  const { id } = useLocalSearchParams<{ id?: string }>();
  const noteId = typeof id === 'string' ? id : undefined;
  const userId = user?.id ?? '';
  const noteQuery = useNoteDetails(userId, noteId);
  const pinMutation = usePinNoteMutation(userId);
  const archiveMutation = useArchiveNoteMutation(userId);
  const deleteMutation = useDeleteNoteMutation(userId);
  const [showDelete, setShowDelete] = useState(false);
  const note = noteQuery.data;

  const togglePin = async (pinned: boolean) => {
    if (!note) return;
    void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => undefined);
    try {
      await pinMutation.mutateAsync({ note, pinned });
    } catch (error) {
      Alert.alert('Note was not updated', getNoteErrorMessage(error));
    }
  };

  const toggleArchive = async () => {
    if (!note) return;
    void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => undefined);
    try {
      const archived = !note.archived_at;
      await archiveMutation.mutateAsync({ archived, note });
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

  const pending = pinMutation.isPending || archiveMutation.isPending || deleteMutation.isPending;

  return (
    <Screen contentContainerStyle={styles.screen} scroll={false}>
      <View style={styles.topRow}>
        <IconButton icon={ArrowLeft} label="Go back" onPress={() => router.back()} />
        {note ? <IconButton icon={Pencil} label="Edit note" onPress={() => router.push(`/notes/edit/${note.id}`)} /> : null}
      </View>
      {noteQuery.isLoading ? <LoadingState label="Loading note…" /> : null}
      {noteQuery.error ? (
        <ErrorState
          description="This note could not be loaded. It may belong to another account."
          onRetry={() => void noteQuery.refetch()}
          title="Note unavailable"
        />
      ) : null}
      {note ? (
        <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
          <AppHeader eyebrow={note.archived_at ? 'ARCHIVED NOTE' : 'NOTE'} title={getNoteTitle(note)} />
          <NoteMetadata archived={Boolean(note.archived_at)} isPinned={note.is_pinned} updatedAt={note.updated_at} />
          <Card style={styles.noteCard}>
            <AppText selectable style={styles.noteContent} variant="bodyLarge">
              {note.content || note.title}
            </AppText>
          </Card>
          <View style={styles.actions}>
            <PinToggle disabled={pending} onChange={(value) => void togglePin(value)} value={note.is_pinned} />
            <ArchiveNoteAction archived={Boolean(note.archived_at)} disabled={pinMutation.isPending || deleteMutation.isPending} loading={archiveMutation.isPending} onPress={() => void toggleArchive()} />
            <DeleteNoteConfirmation
              loading={deleteMutation.isPending}
              name={getNoteTitle(note)}
              onCancel={() => setShowDelete(false)}
              onConfirm={() => void confirmDelete()}
              visible={showDelete}
            />
            <Button disabled={pinMutation.isPending || archiveMutation.isPending} label="Delete note" onPress={() => setShowDelete(true)} variant="destructive" />
          </View>
        </ScrollView>
      ) : null}
    </Screen>
  );
}

const styles = StyleSheet.create({
  actions: { gap: spacing.md },
  content: { gap: spacing.lg, paddingBottom: spacing.giant },
  noteCard: { minHeight: spacing.giant * 3 },
  noteContent: { flex: 1 },
  screen: { flex: 1, gap: spacing.md },
  topRow: { flexDirection: 'row', justifyContent: 'space-between' },
});
