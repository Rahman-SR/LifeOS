import type { PropsWithChildren, ReactNode } from 'react';
import { KeyboardAvoidingView, Platform, StyleSheet, View } from 'react-native';

import { AppHeader, Card, Screen } from '@/components/ui';
import { spacing } from '@/theme';

type AuthScreenProps = PropsWithChildren<{
  footer?: ReactNode;
  subtitle: string;
  title: string;
}>;

export function AuthScreen({ children, footer, subtitle, title }: AuthScreenProps) {
  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      keyboardVerticalOffset={spacing.md}
      style={styles.keyboardView}
    >
      <Screen
        contentContainerStyle={styles.screen}
        scrollProps={{ keyboardDismissMode: Platform.OS === 'ios' ? 'interactive' : 'on-drag' }}
      >
        <AppHeader eyebrow="LIFEOS" subtitle={subtitle} title={title} />
        <Card style={styles.card}>
          <View style={styles.fields}>{children}</View>
        </Card>
        {footer ? <View style={styles.footer}>{footer}</View> : null}
      </Screen>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  card: {
    gap: spacing.md,
  },
  fields: {
    gap: spacing.md,
  },
  footer: {
    gap: spacing.sm,
  },
  keyboardView: {
    flex: 1,
  },
  screen: {
    gap: spacing.xl,
    justifyContent: 'center',
  },
});
