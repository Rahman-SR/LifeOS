import type { ReactNode } from 'react';
import { StyleSheet, View } from 'react-native';

import { spacing } from '@/theme';

import { AppText } from './app-text';

type AppHeaderProps = {
  action?: ReactNode;
  eyebrow?: string;
  subtitle?: string;
  title: string;
};

export function AppHeader({ action, eyebrow, subtitle, title }: AppHeaderProps) {
  return (
    <View style={styles.container}>
      <View style={styles.copy}>
        {eyebrow ? (
          <AppText tone="brand" variant="caption">
            {eyebrow}
          </AppText>
        ) : null}
        <AppText accessibilityRole="header" variant="heading1">
          {title}
        </AppText>
        {subtitle ? <AppText tone="secondary">{subtitle}</AppText> : null}
      </View>
      {action ? <View>{action}</View> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'flex-start',
    flexDirection: 'row',
    gap: spacing.md,
    justifyContent: 'space-between',
  },
  copy: {
    flex: 1,
    gap: spacing.xxs,
  },
});
