import type { ReactNode } from 'react';
import {
  ActivityIndicator,
  Pressable,
  StyleSheet,
  View,
  type PressableProps,
  type StyleProp,
  type ViewStyle,
} from 'react-native';

import { useAppTheme } from '@/hooks/use-app-theme';
import { radii, sizing, spacing } from '@/theme';

import { AppText } from './app-text';

type ButtonVariant = 'primary' | 'secondary' | 'destructive';

type ButtonProps = Omit<PressableProps, 'children' | 'style'> & {
  fullWidth?: boolean;
  label: string;
  leftIcon?: ReactNode;
  loading?: boolean;
  style?: StyleProp<ViewStyle>;
  variant?: ButtonVariant;
};

export function Button({
  disabled,
  fullWidth = true,
  label,
  leftIcon,
  loading = false,
  style,
  variant = 'primary',
  ...props
}: ButtonProps) {
  const { colors } = useAppTheme();
  const isDisabled = disabled || loading;
  const backgroundColor =
    variant === 'primary'
      ? colors.primary
      : variant === 'destructive'
        ? colors.danger
        : colors.surface;
  const pressedColor =
    variant === 'primary'
      ? colors.primaryPressed
      : variant === 'destructive'
        ? colors.danger
        : colors.surfaceSecondary;
  const textColor = variant === 'secondary' ? colors.primary : colors.onPrimary;

  return (
    <Pressable
      accessibilityRole="button"
      disabled={isDisabled}
      style={({ pressed }) => [
        styles.base,
        fullWidth && styles.fullWidth,
        {
          backgroundColor: pressed ? pressedColor : backgroundColor,
          borderColor: variant === 'secondary' ? colors.border : backgroundColor,
        },
        isDisabled && styles.disabled,
        style,
      ]}
      {...props}
    >
      {loading ? (
        <ActivityIndicator color={textColor} />
      ) : (
        <View style={styles.content}>
          {leftIcon}
          <AppText style={{ color: textColor }} variant="button">
            {label}
          </AppText>
        </View>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: {
    alignItems: 'center',
    borderRadius: radii.medium,
    borderWidth: sizing.border,
    justifyContent: 'center',
    minHeight: sizing.controlHeight,
    paddingHorizontal: spacing.lg,
  },
  content: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: spacing.xs,
    justifyContent: 'center',
  },
  disabled: {
    opacity: 0.5,
  },
  fullWidth: {
    alignSelf: 'stretch',
  },
});
