import { BookOpen, Check, Circle, Droplets, Dumbbell, Flame, Moon } from 'lucide-react-native';
import { Pressable, StyleSheet, View } from 'react-native';

import { AppText, Card } from '@/components/ui';
import type { MockHabit, MockHabitIcon } from '@/features/dashboard/dashboard-mock-data';
import { useAppTheme } from '@/hooks/use-app-theme';
import { radii, sizing, spacing } from '@/theme';

const habitIcons = {
  book: BookOpen,
  droplets: Droplets,
  dumbbell: Dumbbell,
  moon: Moon,
} satisfies Record<MockHabitIcon, typeof BookOpen>;

type HabitPreviewCardProps = {
  habit: MockHabit;
  onToggle: (habitId: string) => void;
};

export function HabitPreviewCard({ habit, onToggle }: HabitPreviewCardProps) {
  const { colors } = useAppTheme();
  const HabitIcon = habitIcons[habit.icon];

  return (
    <Card style={styles.card}>
      <View style={[styles.iconWrap, { backgroundColor: colors.surfaceSecondary }]}>
        <HabitIcon color={colors.primary} size={sizing.icon} />
      </View>

      <View style={styles.copy}>
        <AppText variant="bodyLarge">{habit.name}</AppText>
        <View style={styles.streak}>
          <Flame color={colors.warning} size={sizing.iconSmall} />
          <AppText tone="secondary" variant="caption">
            {habit.streak} day streak
          </AppText>
        </View>
      </View>

      <Pressable
        accessibilityLabel={`${habit.completed ? 'Mark incomplete' : 'Complete'}: ${habit.name}`}
        accessibilityRole="checkbox"
        accessibilityState={{ checked: habit.completed }}
        hitSlop={spacing.xs}
        onPress={() => onToggle(habit.id)}
        style={({ pressed }) => [
          styles.completion,
          {
            backgroundColor: habit.completed ? colors.success : colors.surface,
            borderColor: habit.completed ? colors.success : colors.border,
            opacity: pressed ? 0.7 : 1,
          },
        ]}
      >
        {habit.completed ? (
          <Check color={colors.onPrimary} size={sizing.iconSmall} strokeWidth={3} />
        ) : (
          <Circle color={colors.textMuted} size={sizing.iconSmall} />
        )}
      </Pressable>
    </Card>
  );
}

const styles = StyleSheet.create({
  card: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: spacing.sm,
  },
  completion: {
    alignItems: 'center',
    borderRadius: radii.pill,
    borderWidth: sizing.border,
    height: sizing.touchTarget,
    justifyContent: 'center',
    width: sizing.touchTarget,
  },
  copy: {
    flex: 1,
    gap: spacing.xxs,
  },
  iconWrap: {
    alignItems: 'center',
    borderRadius: radii.medium,
    height: sizing.touchTarget,
    justifyContent: 'center',
    width: sizing.touchTarget,
  },
  streak: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: spacing.xxs,
  },
});
