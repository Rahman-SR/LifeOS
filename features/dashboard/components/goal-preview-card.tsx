import { CalendarDays, Target } from 'lucide-react-native';
import { Pressable, StyleSheet, View } from 'react-native';

import { AppText, Card, ProgressBar } from '@/components/ui';
import type { MockGoal } from '@/features/dashboard/dashboard-mock-data';
import { useAppTheme } from '@/hooks/use-app-theme';
import { radii, sizing, spacing } from '@/theme';

type GoalPreviewCardProps = {
  goal: MockGoal;
  onPress: () => void;
};

export function GoalPreviewCard({ goal, onPress }: GoalPreviewCardProps) {
  const { colors } = useAppTheme();

  return (
    <Pressable
      accessibilityHint="Goal details will be available in a later phase"
      accessibilityLabel={`Open goal: ${goal.title}, ${goal.progress}% complete`}
      accessibilityRole="button"
      onPress={onPress}
      style={({ pressed }) => pressed && styles.pressed}
    >
      <Card style={styles.card}>
        <View style={styles.header}>
          <View style={[styles.iconWrap, { backgroundColor: colors.surfaceSecondary }]}>
            <Target color={colors.primary} size={sizing.icon} />
          </View>
          <View style={styles.copy}>
            <AppText variant="title">{goal.title}</AppText>
            <View style={styles.metadata}>
              <CalendarDays color={colors.textMuted} size={sizing.iconSmall} />
              <AppText tone="muted" variant="caption">
                {goal.targetLabel}
              </AppText>
            </View>
          </View>
          <AppText style={{ color: colors.primary }} variant="title">
            {goal.progress}%
          </AppText>
        </View>
        <ProgressBar accessibilityLabel={`${goal.title} progress`} progress={goal.progress / 100} />
      </Card>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    gap: spacing.md,
  },
  copy: {
    flex: 1,
    gap: spacing.xs,
  },
  header: {
    alignItems: 'flex-start',
    flexDirection: 'row',
    gap: spacing.sm,
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
