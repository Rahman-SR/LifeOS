import { Pressable, StyleSheet, View } from 'react-native';

import { AppText } from '@/components/ui';
import { useAppTheme } from '@/hooks/use-app-theme';
import { radii, sizing, spacing } from '@/theme';

import type { MoodOptionDefinition } from '../mood-options';

export function MoodOption({ disabled, onPress, option, selected }: { disabled?: boolean; onPress: () => void; option: MoodOptionDefinition; selected: boolean }) {
  const { colors } = useAppTheme();
  const Icon = option.icon;
  return (
    <Pressable
      accessibilityLabel={option.label}
      accessibilityRole="radio"
      accessibilityState={{ disabled, selected }}
      disabled={disabled}
      onPress={onPress}
      style={({ pressed }) => [
        styles.option,
        { backgroundColor: selected ? colors.surfaceSecondary : colors.surface, borderColor: selected ? option.color : colors.border },
        pressed && styles.pressed,
      ]}
    >
      <View style={[styles.icon, { backgroundColor: colors.surfaceSecondary }]}>
        <Icon color={option.color} size={sizing.icon} strokeWidth={selected ? 2.8 : 2} />
      </View>
      <AppText numberOfLines={1} style={selected ? { color: option.color, fontWeight: '600' } : undefined} variant="bodySmall">
        {option.label}
      </AppText>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  icon: { alignItems: 'center', borderRadius: radii.pill, height: sizing.compactIconContainer, justifyContent: 'center', width: sizing.compactIconContainer },
  option: { alignItems: 'center', borderRadius: radii.large, borderWidth: sizing.border, flex: 1, gap: spacing.xs, minHeight: spacing.giant + spacing.xl, minWidth: spacing.giant + spacing.sm, padding: spacing.xs },
  pressed: { opacity: 0.72 },
});
