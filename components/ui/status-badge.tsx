import type { LucideIcon } from 'lucide-react-native';
import { Pressable, StyleSheet, View } from 'react-native';

import { useAppTheme } from '@/hooks/use-app-theme';
import { radii, sizing, spacing } from '@/theme';

import { AppText } from './app-text';

type StatusBadgeProps = {
  color?: string;
  icon?: LucideIcon;
  label: string;
  onPress?: () => void;
  selected?: boolean;
};

export function StatusBadge({ color, icon: Icon, label, onPress, selected = false }: StatusBadgeProps) {
  const { colors } = useAppTheme();
  const accent = color ?? colors.textSecondary;
  const content = (
    <>
      {Icon ? <Icon color={accent} size={sizing.iconSmall} /> : null}
      <AppText numberOfLines={1} style={{ color: accent }} variant="caption">{label}</AppText>
    </>
  );
  const badgeStyle = [
    styles.badge,
    onPress ? styles.touchable : styles.compact,
    {
      backgroundColor: selected ? colors.surfaceSecondary : colors.surface,
      borderColor: selected ? accent : colors.border,
    },
  ];

  if (!onPress) return <View style={badgeStyle}>{content}</View>;
  return (
    <Pressable
      accessibilityLabel={label}
      accessibilityRole="radio"
      accessibilityState={{ selected }}
      onPress={onPress}
      style={({ pressed }) => [badgeStyle, pressed && styles.pressed]}
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
    paddingHorizontal: spacing.xs,
  },
  compact: { minHeight: sizing.badgeHeight },
  pressed: { opacity: 0.7 },
  touchable: { minHeight: sizing.touchTarget, paddingHorizontal: spacing.sm },
});
