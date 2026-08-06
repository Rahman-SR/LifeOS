import { MoreVertical, X } from 'lucide-react-native';
import { memo, useState } from 'react';
import { Modal, Pressable, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { AppListCard, AppText, Button, IconButton } from '@/components/ui';
import { useAppTheme } from '@/hooks/use-app-theme';
import { radii, sizing, spacing } from '@/theme';

import type { Note } from '../note-types';
import { getNotePreview, getNoteTitle } from '../note-utils';
import { NoteMetadata } from './note-metadata';

type NoteCardProps = {
  disabled?: boolean;
  note: Note;
  onArchive: (note: Note) => void;
  onDelete: (note: Note) => void;
  onOpen: (noteId: string) => void;
  onPin: (note: Note, pinned: boolean) => void;
};

function NoteCardComponent({ disabled, note, onArchive, onDelete, onOpen, onPin }: NoteCardProps) {
  const { colors } = useAppTheme();
  const title = getNoteTitle(note);
  const preview = getNotePreview(note);
  const archived = Boolean(note.archived_at);
  const [menuVisible, setMenuVisible] = useState(false);

  const chooseAction = (action: () => void) => {
    setMenuVisible(false);
    action();
  };

  return (
    <AppListCard accentColor={note.is_pinned ? colors.primary : undefined} style={styles.card}>
      <Pressable
        accessibilityHint="Opens note details"
        accessibilityLabel={`Open note: ${title}`}
        accessibilityRole="button"
        disabled={disabled}
        onPress={() => onOpen(note.id)}
        style={({ pressed }) => [styles.copy, pressed && styles.pressed]}
      >
        <AppText numberOfLines={1} variant="bodyLarge">{title}</AppText>
        {preview ? <AppText numberOfLines={2} tone="secondary">{preview}</AppText> : null}
        <NoteMetadata archived={archived} isPinned={note.is_pinned} updatedAt={note.updated_at} />
      </Pressable>
      <IconButton disabled={disabled} icon={MoreVertical} label={`More actions for ${title}`} onPress={() => setMenuVisible(true)} />
      <Modal animationType="slide" onRequestClose={() => setMenuVisible(false)} statusBarTranslucent transparent visible={menuVisible}>
        <View style={styles.modal}>
          <Pressable accessibilityLabel="Close note actions" accessibilityRole="button" onPress={() => setMenuVisible(false)} style={StyleSheet.absoluteFill}>
            <View style={[StyleSheet.absoluteFill, { backgroundColor: colors.textPrimary, opacity: 0.45 }]} />
          </Pressable>
          <SafeAreaView accessibilityViewIsModal edges={['bottom', 'left', 'right']} style={[styles.sheet, { backgroundColor: colors.surface, borderColor: colors.border }]}>
            <View style={styles.menuHeader}>
              <AppText numberOfLines={2} style={styles.menuTitle} variant="heading3">{title}</AppText>
              <IconButton icon={X} label="Close note actions" onPress={() => setMenuVisible(false)} />
            </View>
            <Button label={note.is_pinned ? 'Unpin note' : 'Pin note'} onPress={() => chooseAction(() => onPin(note, !note.is_pinned))} variant="secondary" />
            <Button label={archived ? 'Restore note' : 'Archive note'} onPress={() => chooseAction(() => onArchive(note))} variant="secondary" />
            <Button label="Delete note" onPress={() => chooseAction(() => onDelete(note))} variant="destructive" />
          </SafeAreaView>
        </View>
      </Modal>
    </AppListCard>
  );
}

export const NoteCard = memo(NoteCardComponent);

const styles = StyleSheet.create({
  card: { alignItems: 'flex-start', flexDirection: 'row', gap: spacing.xs },
  copy: { flex: 1, gap: spacing.xxs, minHeight: sizing.touchTarget, justifyContent: 'center' },
  menuHeader: { alignItems: 'center', flexDirection: 'row', gap: spacing.sm },
  menuTitle: { flex: 1 },
  modal: { flex: 1, justifyContent: 'flex-end' },
  pressed: { opacity: 0.7 },
  sheet: { borderTopLeftRadius: radii.xl, borderTopRightRadius: radii.xl, borderWidth: sizing.border, gap: spacing.sm, padding: spacing.lg },
});
