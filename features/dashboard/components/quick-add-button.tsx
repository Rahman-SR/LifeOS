import { Plus } from 'lucide-react-native';
import { Pressable, StyleSheet, type StyleProp, type ViewStyle } from 'react-native';

import { useAppTheme } from '@/hooks/use-app-theme';
import { radii, shadows, sizing, spacing } from '@/theme';

type QuickAddButtonProps = {
  onPress: () => void;
  style?: StyleProp<ViewStyle>;
};

export function QuickAddButton({ onPress, style }: QuickAddButtonProps) {
  const { colors } = useAppTheme();

  return (
    <Pressable
      accessibilityHint="Opens quick actions"
      accessibilityLabel="Quick add"
      accessibilityRole="button"
      onPress={onPress}
      style={({ pressed }) => [
        styles.button,
        {
          backgroundColor: pressed ? colors.primaryPressed : colors.primary,
          shadowColor: colors.textPrimary,
        },
        style,
      ]}
    >
      <Plus color={colors.onPrimary} size={sizing.iconLarge} strokeWidth={2} />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    alignItems: 'center',
    borderRadius: radii.pill,
    height: spacing.giant,
    justifyContent: 'center',
    width: spacing.giant,
    ...shadows.card,
  },
});
