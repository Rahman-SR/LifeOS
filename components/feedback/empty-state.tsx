import type { LucideIcon } from 'lucide-react-native';
import { Inbox } from 'lucide-react-native';
import { StyleSheet, View } from 'react-native';

import { useAppTheme } from '@/hooks/use-app-theme';
import { radii, sizing, spacing } from '@/theme';

import { AppText, Button } from '../ui';

type EmptyStateProps = {
  actionLabel?: string;
  description: string;
  icon?: LucideIcon;
  onAction?: () => void;
  title: string;
};

export function EmptyState({
  actionLabel,
  description,
  icon: Icon = Inbox,
  onAction,
  title,
}: EmptyStateProps) {
  const { colors } = useAppTheme();

  return (
    <View style={styles.container}>
      <View style={[styles.iconContainer, { backgroundColor: colors.surfaceSecondary }]}>
        <Icon color={colors.primary} size={sizing.iconLarge} strokeWidth={1.8} />
      </View>
      <View style={styles.copy}>
        <AppText align="center" variant="title">
          {title}
        </AppText>
        <AppText align="center" tone="secondary">
          {description}
        </AppText>
      </View>
      {actionLabel && onAction ? (
        <Button fullWidth={false} label={actionLabel} onPress={onAction} />
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
  iconContainer: {
    alignItems: 'center',
    borderRadius: radii.pill,
    height: spacing.giant,
    justifyContent: 'center',
    width: spacing.giant,
  },
});
