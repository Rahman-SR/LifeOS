import type { ReactNode } from 'react';
import { StyleSheet, View } from 'react-native';

import { spacing } from '@/theme';

import { AppText } from './app-text';

type SectionHeaderProps = {
  action?: ReactNode;
  subtitle?: string;
  title: string;
};

export function SectionHeader({ action, subtitle, title }: SectionHeaderProps) {
  return (
    <View style={styles.container}>
      <View style={styles.copy}>
        <AppText accessibilityRole="header" variant="title">
          {title}
        </AppText>
        {subtitle ? (
          <AppText tone="secondary" variant="bodySmall">
            {subtitle}
          </AppText>
        ) : null}
      </View>
      {action}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: spacing.sm,
    justifyContent: 'space-between',
  },
  copy: {
    flex: 1,
    gap: spacing.xxs,
  },
});
