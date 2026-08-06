import { Clock3, NotebookPen } from 'lucide-react-native';
import { Pressable, StyleSheet, View } from 'react-native';

import { AppText, Card } from '@/components/ui';
import { formatNoteUpdatedAt, getNotePreview, getNoteTitle, type Note } from '@/features/notes';
import { useAppTheme } from '@/hooks/use-app-theme';
import { radii, sizing, spacing } from '@/theme';

type NotePreviewCardProps = {
  note: Note;
  onPress: () => void;
};

export function NotePreviewCard({ note, onPress }: NotePreviewCardProps) {
  const { colors } = useAppTheme();
  const title = getNoteTitle(note);

  return (
    <Pressable
      accessibilityHint="Opens note details"
      accessibilityLabel={`Open recent note: ${title}`}
      accessibilityRole="button"
      onPress={onPress}
      style={({ pressed }) => pressed && styles.pressed}
    >
      <Card style={styles.card}>
        <View style={[styles.iconWrap, { backgroundColor: colors.surfaceSecondary }]}>
          <NotebookPen color={colors.info} size={sizing.icon} />
        </View>
        <View style={styles.copy}>
          <AppText variant="title">{title}</AppText>
          <AppText numberOfLines={3} tone="secondary">
            {getNotePreview(note)}
          </AppText>
          <View style={styles.metadata}>
            <Clock3 color={colors.textMuted} size={sizing.iconSmall} />
            <AppText tone="muted" variant="caption">
              {formatNoteUpdatedAt(note.updated_at)}
            </AppText>
          </View>
        </View>
      </Card>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    alignItems: 'flex-start',
    flexDirection: 'row',
    gap: spacing.sm,
  },
  copy: {
    flex: 1,
    gap: spacing.xs,
  },
  iconWrap: {
    alignItems: 'center',
    borderRadius: radii.medium,
    height: sizing.touchTarget,
    justifyContent: 'center',
    width: sizing.touchTarget,
  },
  metadata: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: spacing.xxs,
  },
  pressed: {
    opacity: 0.75,
  },
});
