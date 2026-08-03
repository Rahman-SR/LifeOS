import { Eye, EyeOff } from 'lucide-react-native';
import { useState } from 'react';
import { Pressable, StyleSheet } from 'react-native';

import { TextField } from '@/components/ui';
import { useAppTheme } from '@/hooks/use-app-theme';
import { sizing, spacing } from '@/theme';

type PasswordFieldProps = Omit<React.ComponentProps<typeof TextField>, 'rightAccessory' | 'secureTextEntry'>;

export function PasswordField(props: PasswordFieldProps) {
  const { colors } = useAppTheme();
  const [isVisible, setIsVisible] = useState(false);
  const Icon = isVisible ? EyeOff : Eye;
  const label = isVisible ? `Hide ${props.label.toLowerCase()}` : `Show ${props.label.toLowerCase()}`;

  return (
    <TextField
      {...props}
      autoCapitalize="none"
      autoCorrect={false}
      rightAccessory={
        <Pressable
          accessibilityLabel={label}
          accessibilityRole="button"
          onPress={() => setIsVisible((visible) => !visible)}
          style={styles.toggle}
        >
          <Icon color={colors.textSecondary} size={sizing.icon} />
        </Pressable>
      }
      secureTextEntry={!isVisible}
    />
  );
}

const styles = StyleSheet.create({
  toggle: {
    alignItems: 'center',
    height: sizing.touchTarget,
    justifyContent: 'center',
    marginRight: spacing.xxs,
    width: sizing.touchTarget,
  },
});
