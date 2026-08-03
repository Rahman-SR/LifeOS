import { CheckCircle2, Repeat2 } from 'lucide-react-native';
import { StyleSheet, View } from 'react-native';

import { AppText, Card, ProgressBar } from '@/components/ui';
import { useAppTheme } from '@/hooks/use-app-theme';
import { radii, sizing, spacing } from '@/theme';

type DailyProgressCardProps = {
  completedHabits: number;
  completedTasks: number;
  totalHabits: number;
  totalTasks: number;
};

export function DailyProgressCard({
  completedHabits,
  completedTasks,
  totalHabits,
  totalTasks,
}: DailyProgressCardProps) {
  const { colors } = useAppTheme();
  const completed = completedTasks + completedHabits;
  const total = totalTasks + totalHabits;
  const progress = total === 0 ? 0 : completed / total;
  const percentage = Math.round(progress * 100);

  return (
    <Card style={styles.card}>
      <View style={styles.header}>
        <View style={styles.headingCopy}>
          <AppText variant="title">Daily progress</AppText>
          <AppText tone="secondary" variant="bodySmall">
            A steady day is built one check-in at a time.
          </AppText>
        </View>
        <View style={[styles.percentage, { backgroundColor: colors.surfaceSecondary }]}>
          <AppText style={{ color: colors.primary }} variant="title">
            {percentage}%
          </AppText>
        </View>
      </View>

      <ProgressBar accessibilityLabel={`${percentage}% of today's plan complete`} progress={progress} />

      <View style={styles.metrics}>
        <View style={styles.metric}>
          <CheckCircle2 color={colors.success} size={sizing.icon} />
          <View>
            <AppText variant="title">
              {completedTasks}/{totalTasks}
            </AppText>
            <AppText tone="secondary" variant="bodySmall">
              Tasks completed
            </AppText>
          </View>
        </View>
        <View style={styles.metric}>
          <Repeat2 color={colors.primary} size={sizing.icon} />
          <View>
            <AppText variant="title">
              {completedHabits}/{totalHabits}
            </AppText>
            <AppText tone="secondary" variant="bodySmall">
              Habits completed
            </AppText>
          </View>
        </View>
      </View>
    </Card>
  );
}

const styles = StyleSheet.create({
  card: {
    gap: spacing.md,
  },
  header: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: spacing.sm,
    justifyContent: 'space-between',
  },
  headingCopy: {
    flex: 1,
    gap: spacing.xxs,
  },
  metric: {
    alignItems: 'center',
    flex: 1,
    flexDirection: 'row',
    gap: spacing.xs,
  },
  metrics: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  percentage: {
    alignItems: 'center',
    borderRadius: radii.pill,
    justifyContent: 'center',
    minHeight: sizing.touchTarget,
    minWidth: spacing.giant,
    paddingHorizontal: spacing.sm,
  },
});
