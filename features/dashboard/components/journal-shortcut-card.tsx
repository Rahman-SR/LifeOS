import { BookHeart } from 'lucide-react-native';
import { Pressable, StyleSheet, View } from 'react-native';

import { AppText, Card } from '@/components/ui';
import { useAppTheme } from '@/hooks/use-app-theme';
import { radii, sizing, spacing } from '@/theme';
import { getJournalPreview, type JournalEntry } from '@/features/journal';

type JournalShortcutCardProps = {
  error?: boolean;
  entry?: JournalEntry | null;
  loading?: boolean;
  onPress: () => void;
};

export function JournalShortcutCard({ entry, error, loading, onPress }: JournalShortcutCardProps) {
  const { colors } = useAppTheme();

  return (
    <Pressable
      accessibilityHint={entry ? "Edit today's journal" : "Write today's journal"}
      accessibilityLabel="Write today's journal"
      accessibilityRole="button"
      onPress={onPress}
      style={({ pressed }) => [styles.pressable, pressed && styles.pressed]}
    >
      <Card style={styles.card}>
        <View style={[styles.iconWrap, { backgroundColor: colors.surfaceSecondary }]}>
          <BookHeart color={colors.primary} size={sizing.icon} />
        </View>
        <View style={styles.copy}>
          <AppText variant="title">{entry ? 'Reflection complete' : 'Daily reflection'}</AppText>
          <AppText numberOfLines={2} tone="secondary" variant="bodySmall">
            {loading ? 'Loading today’s journal…' : error ? 'Status unavailable · tap to retry' : entry ? (getJournalPreview(entry) || 'Today’s journal is saved') : 'Write a few quiet lines'}
          </AppText>
        </View>
      </Card>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    flex: 1,
    gap: spacing.sm,
    minHeight: spacing.giant * 2,
  },
  copy: {
    gap: spacing.xxs,
  },
  iconWrap: {
    alignItems: 'center',
    borderRadius: radii.medium,
    height: sizing.touchTarget,
    justifyContent: 'center',
    width: sizing.touchTarget,
  },
  pressable: {
    flex: 1,
  },
  pressed: {
    opacity: 0.75,
  },
});
