import { Pin } from 'lucide-react-native';
import { Pressable, StyleSheet, View } from 'react-native';

import { AppText } from '@/components/ui';
import { useAppTheme } from '@/hooks/use-app-theme';
import { radii, sizing, spacing } from '@/theme';

export function PinToggle({ disabled, onChange, value }: { disabled?: boolean; onChange: (value: boolean) => void; value: boolean }) {
  const { colors } = useAppTheme();
  return (
    <Pressable
      accessibilityLabel={value ? 'Unpin note' : 'Pin note'}
      accessibilityRole="switch"
      accessibilityState={{ checked: value, disabled }}
      disabled={disabled}
      onPress={() => onChange(!value)}
      style={({ pressed }) => [
        styles.control,
        {
          backgroundColor: value ? colors.primary : colors.surface,
          borderColor: value ? colors.primary : colors.border,
          opacity: disabled ? 0.5 : pressed ? 0.75 : 1,
        },
      ]}
    >
      <View style={styles.copy}>
        <Pin color={value ? colors.onPrimary : colors.textSecondary} size={sizing.iconSmall} />
        <AppText tone={value ? 'inverse' : 'secondary'} variant="button">
          {value ? 'Pinned' : 'Pin note'}
        </AppText>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  control: {
    alignItems: 'center',
    alignSelf: 'flex-start',
    borderRadius: radii.pill,
    borderWidth: sizing.border,
    justifyContent: 'center',
    minHeight: sizing.touchTarget,
    paddingHorizontal: spacing.md,
  },
  copy: { alignItems: 'center', flexDirection: 'row', gap: spacing.xs },
});
