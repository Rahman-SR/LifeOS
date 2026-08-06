import type { PropsWithChildren } from 'react';
import { StyleSheet, View, type StyleProp, type ViewStyle } from 'react-native';

import { useAppTheme } from '@/hooks/use-app-theme';
import { radii, shadows, sizing, spacing } from '@/theme';

type AppListCardProps = PropsWithChildren<{
  accentColor?: string;
  completed?: boolean;
  style?: StyleProp<ViewStyle>;
}>;

export function AppListCard({ accentColor, children, completed = false, style }: AppListCardProps) {
  const { colors, isDark } = useAppTheme();
  return (
    <View
      style={[
        styles.card,
        {
          backgroundColor: colors.surface,
          borderColor: colors.border,
          borderLeftColor: accentColor ?? colors.border,
          shadowColor: colors.textPrimary,
        },
        accentColor && styles.accent,
        completed && styles.completed,
        isDark && styles.dark,
        style,
      ]}
    >
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  accent: { borderLeftWidth: sizing.accentBorder },
  card: {
    borderRadius: radii.large,
    borderWidth: sizing.border,
    padding: spacing.sm,
    ...shadows.listCard,
  },
  completed: { opacity: 0.72 },
  dark: { elevation: 0, shadowOpacity: 0 },
});
