import { memo } from 'react';
import { Pressable, StyleSheet, type LayoutChangeEvent } from 'react-native';

import { useAppTheme } from '@/hooks/use-app-theme';
import { radii, shadows, sizing, spacing } from '@/theme';

import { AppText } from './app-text';

type FilterChipProps = {
  label: string;
  onLayout?: (event: LayoutChangeEvent) => void;
  onPress: () => void;
  selected: boolean;
};

function FilterChipComponent({ label, onLayout, onPress, selected }: FilterChipProps) {
  const { colors, isDark } = useAppTheme();
  return (
    <Pressable
      accessibilityRole="tab"
      accessibilityState={{ selected }}
      onLayout={onLayout}
      onPress={onPress}
      style={({ pressed }) => [
        styles.chip,
        {
          backgroundColor: selected ? colors.primary : colors.surface,
          borderColor: selected ? colors.primary : colors.border,
          shadowColor: colors.primary,
        },
        selected && !isDark && styles.selected,
        pressed && styles.pressed,
      ]}
    >
      <AppText numberOfLines={1} tone={selected ? 'inverse' : 'secondary'} variant="button">
        {label}
      </AppText>
    </Pressable>
  );
}

export const FilterChip = memo(FilterChipComponent);

const styles = StyleSheet.create({
  chip: {
    alignItems: 'center',
    borderRadius: radii.pill,
    borderWidth: sizing.border,
    height: sizing.filterChipHeight,
    justifyContent: 'center',
    paddingHorizontal: spacing.md,
  },
  pressed: { opacity: 0.75 },
  selected: { ...shadows.listCard },
});
