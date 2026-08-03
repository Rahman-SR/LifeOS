import { Tag } from 'lucide-react-native';
import { Pressable, StyleSheet, View } from 'react-native';

import { AppText } from '@/components/ui';
import { useAppTheme } from '@/hooks/use-app-theme';
import { radii, sizing, spacing } from '@/theme';

type CategoryChipProps = {
  color?: string;
  label: string;
  onPress?: () => void;
  selected?: boolean;
};

export function CategoryChip({ color, label, onPress, selected = false }: CategoryChipProps) {
  const { colors } = useAppTheme();
  const accent = color ?? colors.textMuted;
  const content = (
    <>
      <Tag color={accent} size={sizing.iconSmall} />
      <AppText variant="caption">{label}</AppText>
    </>
  );
  const style = [
    styles.chip,
    onPress ? styles.touchChip : styles.compactChip,
    {
      backgroundColor: selected ? colors.surfaceSecondary : colors.surface,
      borderColor: selected ? accent : colors.border,
    },
  ];

  if (!onPress) return <View style={style}>{content}</View>;

  return (
    <Pressable
      accessibilityLabel={`${label} category`}
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
  chip: {
    alignItems: 'center',
    alignSelf: 'flex-start',
    borderRadius: radii.pill,
    borderWidth: sizing.border,
    flexDirection: 'row',
    gap: spacing.xxs,
    paddingHorizontal: spacing.sm,
  },
  compactChip: {
    paddingVertical: spacing.xxs,
  },
  pressed: {
    opacity: 0.7,
  },
  touchChip: {
    minHeight: sizing.touchTarget,
  },
});
