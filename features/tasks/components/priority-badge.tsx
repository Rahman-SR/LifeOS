import { Flag } from 'lucide-react-native';
import { Pressable, StyleSheet, View } from 'react-native';

import { AppText } from '@/components/ui';
import { useAppTheme } from '@/hooks/use-app-theme';
import { radii, sizing, spacing } from '@/theme';

import type { TaskPriority } from '../task-types';

type PriorityBadgeProps = {
  onPress?: () => void;
  priority: TaskPriority;
  selected?: boolean;
};

export function PriorityBadge({ onPress, priority, selected = false }: PriorityBadgeProps) {
  const { colors } = useAppTheme();
  const priorityColor = {
    high: colors.danger,
    low: colors.info,
    medium: colors.warning,
  }[priority];
  const label = { high: 'High', low: 'Low', medium: 'Medium' }[priority];
  const content = (
    <>
      <Flag color={priorityColor} size={sizing.iconSmall} />
      <AppText style={{ color: priorityColor }} variant="caption">
        {label}
      </AppText>
    </>
  );
  const style = [
    styles.badge,
    onPress ? styles.touchBadge : styles.compactBadge,
    {
      backgroundColor: selected ? colors.surfaceSecondary : colors.surface,
      borderColor: selected ? priorityColor : colors.border,
    },
  ];

  if (!onPress) return <View style={style}>{content}</View>;

  return (
    <Pressable
      accessibilityLabel={`${label} priority`}
      accessibilityRole="radio"
      accessibilityState={{ selected }}
      onPress={onPress}
      style={({ pressed }) => [style, pressed && styles.pressed]}
    >
      {content}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  badge: {
    alignItems: 'center',
    alignSelf: 'flex-start',
    borderRadius: radii.pill,
    borderWidth: sizing.border,
    flexDirection: 'row',
    gap: spacing.xxs,
    paddingHorizontal: spacing.sm,
  },
  compactBadge: {
    paddingVertical: spacing.xxs,
  },
  pressed: {
    opacity: 0.7,
  },
  touchBadge: {
    minHeight: sizing.touchTarget,
  },
});
