import { Smile } from 'lucide-react-native';
import { Pressable, StyleSheet, View } from 'react-native';

import { AppText, Card } from '@/components/ui';
import { useAppTheme } from '@/hooks/use-app-theme';
import { radii, sizing, spacing } from '@/theme';
import { getMoodOption, type MoodLog, type MoodValue } from '@/features/mood';

type MoodShortcutCardProps = {
  error?: boolean;
  loading?: boolean;
  mood?: MoodLog | null;
  onPress: () => void;
};

export function MoodShortcutCard({ error, loading, mood, onPress }: MoodShortcutCardProps) {
  const { colors } = useAppTheme();
  const option = mood ? getMoodOption(mood.mood as MoodValue) : null;
  const Icon = option?.icon ?? Smile;

  return (
    <Pressable
      accessibilityHint={mood ? "Edit today's mood" : "Record today's mood"}
      accessibilityLabel="Record today's mood"
      accessibilityRole="button"
      onPress={onPress}
      style={({ pressed }) => [styles.pressable, pressed && styles.pressed]}
    >
      <Card style={styles.card}>
        <View style={[styles.iconWrap, { backgroundColor: colors.surfaceSecondary }]}>
          <Icon color={option?.color ?? colors.success} size={sizing.icon} />
        </View>
        <View style={styles.copy}>
          <AppText variant="title">{option?.label ?? 'How are you?'}</AppText>
          <AppText numberOfLines={2} tone="secondary" variant="bodySmall">
            {loading ? 'Loading today’s mood…' : error ? 'Status unavailable · tap to retry' : mood ? (mood.note || 'Today’s mood is recorded') : 'Record today’s mood'}
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
