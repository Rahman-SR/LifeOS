import { useCallback } from 'react';
import { FlatList, RefreshControl, StyleSheet } from 'react-native';
import type { ListRenderItem } from 'react-native';

import { ErrorState, LoadingState } from '@/components/feedback';
import { useAppTheme } from '@/hooks/use-app-theme';
import { spacing } from '@/theme';

import type { Note, NoteFilter } from '../note-types';
import { NoteCard } from './note-card';
import { NoteEmptyState } from './note-empty-state';

type NoteListProps = {
  data: Note[];
  disabled?: boolean;
  error: string | null;
  filter: NoteFilter;
  isLoading: boolean;
  isSearch: boolean;
  onArchive: (note: Note) => void;
  onCreate: () => void;
  onDelete: (note: Note) => void;
  onOpen: (noteId: string) => void;
  onPin: (note: Note, pinned: boolean) => void;
  onRefresh: () => void;
  onRetry: () => void;
  refreshing: boolean;
};

export function NoteList(props: NoteListProps) {
  const { colors } = useAppTheme();
  const renderNote = useCallback<ListRenderItem<Note>>(
    ({ item }) => (
      <NoteCard
        disabled={props.disabled}
        note={item}
        onArchive={props.onArchive}
        onDelete={props.onDelete}
        onOpen={props.onOpen}
        onPin={props.onPin}
      />
    ),
    [props.disabled, props.onArchive, props.onDelete, props.onOpen, props.onPin],
  );
  if (props.isLoading) return <LoadingState label="Loading notes…" />;
  if (props.error) {
    return <ErrorState description={props.error} onRetry={props.onRetry} title="Notes could not be loaded" />;
  }
  return (
    <FlatList
      contentContainerStyle={[styles.content, props.data.length === 0 && styles.empty]}
      data={props.data}
      keyboardShouldPersistTaps="handled"
      keyExtractor={(item) => item.id}
      ListEmptyComponent={<NoteEmptyState filter={props.filter} isSearch={props.isSearch} onCreate={props.onCreate} />}
      refreshControl={
        <RefreshControl
          accessibilityLabel="Refresh notes"
          colors={[colors.primary]}
          onRefresh={props.onRefresh}
          refreshing={props.refreshing}
          tintColor={colors.primary}
        />
      }
      renderItem={renderNote}
      showsVerticalScrollIndicator={false}
    />
  );
}

const styles = StyleSheet.create({
  content: { gap: spacing.sm, paddingBottom: spacing.giant },
  empty: { flexGrow: 1, justifyContent: 'center' },
});
