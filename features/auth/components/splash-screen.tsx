import { ActivityIndicator, StyleSheet, View } from 'react-native';
import { ShieldCheck } from 'lucide-react-native';

import { AppText, Screen } from '@/components/ui';
import { useAppTheme } from '@/hooks/use-app-theme';
import { sizing, spacing } from '@/theme';

export function SplashScreen() {
  const { colors } = useAppTheme();

  return (
    <Screen contentContainerStyle={styles.screen} scroll={false}>
      <View accessibilityLabel="LifeOS is loading your secure session" style={styles.content}>
        <ShieldCheck color={colors.primary} size={sizing.iconLarge} />
        <AppText variant="heading1">LifeOS</AppText>
        <AppText align="center" tone="secondary">
          Loading your secure session…
        </AppText>
        <ActivityIndicator accessibilityLabel="Loading" color={colors.primary} size="small" />
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  content: {
    alignItems: 'center',
    gap: spacing.md,
  },
  screen: {
    alignItems: 'center',
    justifyContent: 'center',
  },
});
