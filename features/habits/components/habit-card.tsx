import { memo } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';

import { AppListCard, AppText } from '@/components/ui';
import { useAppTheme } from '@/hooks/use-app-theme';
import { radii, sizing, spacing } from '@/theme';

import type { HabitWithProgress } from '../habit-types';
import { HabitCompletionControl } from './habit-completion-control';
import { HabitProgress } from './habit-progress';
import { habitIconMap } from './habit-icon';
import { StreakBadge } from './streak-badge';

type Props = {
  compact?: boolean;
  disabled?: boolean;
  habit: HabitWithProgress;
  onDecrement: (habit: HabitWithProgress) => void;
  onIncrement: (habit: HabitWithProgress) => void;
  onOpen: (id: string) => void;
};

function HabitCardComponent({ disabled, habit, onDecrement, onIncrement, onOpen }: Props) {
  const { colors } = useAppTheme();
  const Icon = habitIconMap[habit.icon as keyof typeof habitIconMap] ?? habitIconMap['heart-pulse'];
  const completed = habit.scheduledToday && habit.completedToday;
  return (
    <AppListCard accentColor={completed ? colors.success : habit.color || colors.primary} style={styles.card}>
      <View style={styles.topRow}>
        <Pressable
          accessibilityLabel={`Open habit ${habit.name}`}
          accessibilityRole="button"
          onPress={() => onOpen(habit.id)}
          style={({ pressed }) => [styles.main, pressed && styles.pressed]}
        >
          <View style={[styles.icon, { backgroundColor: colors.surfaceSecondary }]}>
            <Icon color={habit.color || colors.primary} size={sizing.iconSmall} />
          </View>
          <View style={styles.copy}>
            <AppText numberOfLines={2} variant="bodyLarge">{habit.name}</AppText>
            <StreakBadge streak={habit.currentStreak} />
          </View>
        </Pressable>
        {habit.scheduledToday ? (
          <HabitCompletionControl
            count={habit.todayCount}
            disabled={disabled}
            name={habit.name}
            onDecrement={() => onDecrement(habit)}
            onIncrement={() => onIncrement(habit)}
            target={habit.target_count}
          />
        ) : (
          <AppText tone="muted" variant="caption">Not today</AppText>
        )}
      </View>
      {habit.scheduledToday ? <HabitProgress count={habit.todayCount} target={habit.target_count} /> : null}
    </AppListCard>
  );
}

export const HabitCard = memo(HabitCardComponent);

const styles = StyleSheet.create({
  card: { gap: spacing.xs },
  copy: { flex: 1, gap: spacing.xxs },
  icon: {
    alignItems: 'center',
    borderRadius: radii.medium,
    height: sizing.compactIconContainer,
    justifyContent: 'center',
    width: sizing.compactIconContainer,
  },
  main: { alignItems: 'center', flex: 1, flexDirection: 'row', gap: spacing.xs, minHeight: sizing.touchTarget },
  pressed: { opacity: 0.7 },
  topRow: { alignItems: 'center', flexDirection: 'row', gap: spacing.xs },
});
