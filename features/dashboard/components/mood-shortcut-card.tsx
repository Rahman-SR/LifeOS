import { Smile } from 'lucide-react-native';
import { Pressable, StyleSheet, View } from 'react-native';

import { AppText, Card } from '@/components/ui';
import { useAppTheme } from '@/hooks/use-app-theme';
import { radii, sizing, spacing } from '@/theme';

type MoodShortcutCardProps = {
  onPress: () => void;
};

export function MoodShortcutCard({ onPress }: MoodShortcutCardProps) {
  const { colors } = useAppTheme();

  return (
    <Pressable
      accessibilityHint="Mood recording will be available in a later phase"
      accessibilityLabel="Record today's mood"
      accessibilityRole="button"
      onPress={onPress}
      style={({ pressed }) => [styles.pressable, pressed && styles.pressed]}
    >
      <Card style={styles.card}>
        <View style={[styles.iconWrap, { backgroundColor: colors.surfaceSecondary }]}>
          <Smile color={colors.success} size={sizing.icon} />
        </View>
        <View style={styles.copy}>
          <AppText variant="title">How are you?</AppText>
          <AppText tone="secondary" variant="bodySmall">
            Record today&apos;s mood
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
