import { BellRing } from 'lucide-react-native';
import { StyleSheet, Switch, View } from 'react-native';

import { AppText, Card } from '@/components/ui';
import { useAppTheme } from '@/hooks/use-app-theme';
import { sizing, spacing } from '@/theme';

type ReminderFieldProps = {
  error?: string;
  guidance?: string;
  onChange: (enabled: boolean) => void;
  value: boolean;
};

export function ReminderField({ error, guidance, onChange, value }: ReminderFieldProps) {
  const { colors } = useAppTheme();

  return (
    <View style={styles.field}>
      <Card style={styles.card}>
        <BellRing color={colors.primary} size={sizing.icon} />
        <View style={styles.copy}>
          <AppText variant="title">Remind me</AppText>
          <AppText tone="secondary" variant="bodySmall">
            Send a local notification at the task&apos;s due time.
          </AppText>
        </View>
        <Switch
          accessibilityLabel="Enable task reminder"
          accessibilityState={{ checked: value }}
          onValueChange={onChange}
          thumbColor={value ? colors.onPrimary : colors.textMuted}
          trackColor={{ false: colors.surfaceSecondary, true: colors.primary }}
          value={value}
        />
      </Card>
      {error ? (
        <AppText accessibilityRole="alert" tone="danger" variant="bodySmall">
          {error}
        </AppText>
      ) : guidance ? (
        <AppText accessibilityLiveRegion="polite" tone="secondary" variant="bodySmall">
          {guidance}
        </AppText>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: spacing.sm,
  },
  copy: {
    flex: 1,
    gap: spacing.xxs,
  },
  field: {
    gap: spacing.xs,
  },
});
