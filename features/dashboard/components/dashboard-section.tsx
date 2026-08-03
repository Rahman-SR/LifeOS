import type { PropsWithChildren } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';

import { AppText, SectionHeader } from '@/components/ui';
import { useAppTheme } from '@/hooks/use-app-theme';
import { sizing, spacing } from '@/theme';

type DashboardSectionProps = PropsWithChildren<{
  actionLabel?: string;
  onAction?: () => void;
  subtitle?: string;
  title: string;
}>;

export function DashboardSection({
  actionLabel,
  children,
  onAction,
  subtitle,
  title,
}: DashboardSectionProps) {
  const { colors } = useAppTheme();

  return (
    <View style={styles.section}>
      <SectionHeader
        action={
          actionLabel && onAction ? (
            <Pressable
              accessibilityLabel={actionLabel}
              accessibilityRole="button"
              onPress={onAction}
              style={({ pressed }) => [styles.action, pressed && { opacity: 0.65 }]}
            >
              <AppText style={{ color: colors.primary }} variant="button">
                {actionLabel}
              </AppText>
            </Pressable>
          ) : undefined
        }
        subtitle={subtitle}
        title={title}
      />
      <View style={styles.content}>{children}</View>
    </View>
  );
}

const styles = StyleSheet.create({
  action: {
    justifyContent: 'center',
    minHeight: sizing.touchTarget,
    paddingHorizontal: spacing.xs,
  },
  content: {
    gap: spacing.sm,
  },
  section: {
    gap: spacing.xs,
  },
});
