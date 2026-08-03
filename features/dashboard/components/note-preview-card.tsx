import { Clock3, NotebookPen } from 'lucide-react-native';
import { Pressable, StyleSheet, View } from 'react-native';

import { AppText, Card } from '@/components/ui';
import type { MockNote } from '@/features/dashboard/dashboard-mock-data';
import { useAppTheme } from '@/hooks/use-app-theme';
import { radii, sizing, spacing } from '@/theme';

type NotePreviewCardProps = {
  note: MockNote;
  onPress: () => void;
};

export function NotePreviewCard({ note, onPress }: NotePreviewCardProps) {
  const { colors } = useAppTheme();

  return (
    <Pressable
      accessibilityHint="Note editing will be available in a later phase"
      accessibilityLabel={`Open recent note: ${note.title}`}
      accessibilityRole="button"
      onPress={onPress}
      style={({ pressed }) => pressed && styles.pressed}
    >
      <Card style={styles.card}>
        <View style={[styles.iconWrap, { backgroundColor: colors.surfaceSecondary }]}>
          <NotebookPen color={colors.info} size={sizing.icon} />
        </View>
        <View style={styles.copy}>
          <AppText variant="title">{note.title}</AppText>
          <AppText numberOfLines={3} tone="secondary">
            {note.excerpt}
          </AppText>
          <View style={styles.metadata}>
            <Clock3 color={colors.textMuted} size={sizing.iconSmall} />
            <AppText tone="muted" variant="caption">
              {note.updatedLabel}
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
