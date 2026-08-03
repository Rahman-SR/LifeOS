import { ActivityIndicator, StyleSheet, View } from 'react-native';

import { useAppTheme } from '@/hooks/use-app-theme';
import { sizing, spacing } from '@/theme';

import { AppText } from '../ui';

type LoadingStateProps = {
  label?: string;
};

export function LoadingState({ label = 'Loading…' }: LoadingStateProps) {
  const { colors } = useAppTheme();

  return (
    <View accessibilityLiveRegion="polite" style={styles.container}>
      <ActivityIndicator color={colors.primary} size={sizing.icon} />
      <AppText tone="secondary">{label}</AppText>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    gap: spacing.sm,
    justifyContent: 'center',
    paddingVertical: spacing.xxl,
  },
});
