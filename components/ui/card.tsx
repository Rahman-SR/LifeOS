import type { PropsWithChildren } from 'react';
import { StyleSheet, View, type StyleProp, type ViewStyle } from 'react-native';

import { useAppTheme } from '@/hooks/use-app-theme';
import { radii, shadows, sizing, spacing } from '@/theme';

type CardProps = PropsWithChildren<{
  style?: StyleProp<ViewStyle>;
}>;

export function Card({ children, style }: CardProps) {
  const { colors, isDark } = useAppTheme();

  return (
    <View
      style={[
        styles.card,
        {
          backgroundColor: colors.surface,
          borderColor: colors.border,
          shadowColor: colors.textPrimary,
        },
        isDark && styles.darkCard,
        style,
      ]}
    >
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: radii.large,
    borderWidth: sizing.border,
    padding: spacing.md,
    ...shadows.card,
  },
  darkCard: {
    elevation: 0,
    shadowOpacity: 0,
  },
});
