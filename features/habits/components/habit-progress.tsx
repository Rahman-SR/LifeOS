import { StyleSheet, View } from 'react-native';

import { AppText, ProgressBar } from '@/components/ui';
import { useAppTheme } from '@/hooks/use-app-theme';
import { spacing } from '@/theme';

export function HabitProgress({ count, target }: { count: number; target: number }) {
  const { colors } = useAppTheme();
  const progress = Math.min(1, count / target);
  const completed = count >= target;
  return (
    <View style={styles.wrap}>
      <AppText style={completed ? { color: colors.success } : undefined} tone="secondary" variant="caption">
        {count} of {target} today{completed ? ' · Complete' : ''}
      </AppText>
      <ProgressBar accessibilityLabel={`${count} of ${target} completed today`} progress={progress} variant="compact" />
    </View>
  );
}

const styles = StyleSheet.create({ wrap: { gap: spacing.xxs } });
