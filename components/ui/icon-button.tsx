import type { LucideIcon } from 'lucide-react-native';
import { Pressable, StyleSheet, type PressableProps } from 'react-native';

import { useAppTheme } from '@/hooks/use-app-theme';
import { radii, sizing } from '@/theme';

type IconButtonProps = Omit<PressableProps, 'children'> & {
  icon: LucideIcon;
  label: string;
};

export function IconButton({ icon: Icon, label, ...props }: IconButtonProps) {
  const { colors } = useAppTheme();

  return (
    <Pressable
      accessibilityLabel={label}
      accessibilityRole="button"
      hitSlop={sizing.border * 4}
      style={({ pressed }) => [
        styles.button,
        { backgroundColor: pressed ? colors.surfaceSecondary : colors.surface },
      ]}
      {...props}
    >
      <Icon color={colors.textPrimary} size={sizing.icon} strokeWidth={2} />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    alignItems: 'center',
    borderRadius: radii.medium,
    height: sizing.touchTarget,
    justifyContent: 'center',
    width: sizing.touchTarget,
  },
});
