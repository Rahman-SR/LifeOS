import { router } from 'expo-router';
import { Alert, StyleSheet } from 'react-native';

import { Screen } from '@/components/ui';
import { NoteEditor, useCreateNoteMutation } from '@/features/notes';
import { useAuth } from '@/hooks/use-auth';
import { spacing } from '@/theme';

export default function CreateNoteScreen() {
  const { user } = useAuth();
  const mutation = useCreateNoteMutation(user?.id ?? '');
  return (
    <Screen contentContainerStyle={styles.screen} scroll={false}>
      <NoteEditor
        mode="create"
        onCancel={() => router.back()}
        onSaved={(note) => {
          router.replace(`/notes/${note.id}`);
          Alert.alert('Note created', 'Your note was saved.');
        }}
        onSubmit={(values) => mutation.mutateAsync(values)}
      />
    </Screen>
  );
}

const styles = StyleSheet.create({ screen: { flex: 1, paddingTop: spacing.xs } });
