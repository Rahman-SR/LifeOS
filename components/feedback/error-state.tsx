import { CircleAlert } from 'lucide-react-native';
import { StyleSheet, View } from 'react-native';

import { useAppTheme } from '@/hooks/use-app-theme';
import { sizing, spacing } from '@/theme';

import { AppText, Button } from '../ui';

type ErrorStateProps = {
  description: string;
  onRetry?: () => void;
  retryLabel?: string;
  title?: string;
};

export function ErrorState({
  description,
  onRetry,
  retryLabel = 'Try again',
  title = 'Something went wrong',
}: ErrorStateProps) {
  const { colors } = useAppTheme();

  return (
    <View accessibilityRole="alert" style={styles.container}>
      <CircleAlert color={colors.danger} size={sizing.iconLarge} strokeWidth={1.8} />
      <View style={styles.copy}>
        <AppText align="center" variant="title">
          {title}
        </AppText>
        <AppText align="center" tone="secondary">
          {description}
        </AppText>
      </View>
      {onRetry ? (
        <Button fullWidth={false} label={retryLabel} onPress={onRetry} variant="secondary" />
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    gap: spacing.md,
    paddingVertical: spacing.xxl,
  },
  copy: {
    gap: spacing.xs,
    maxWidth: 320,
  },
});
