import type { PropsWithChildren } from 'react';
import { Text, type TextProps, type TextStyle } from 'react-native';

import { useAppTheme } from '@/hooks/use-app-theme';
import { typography } from '@/theme';

type TextVariant = keyof typeof typography;
type TextTone = 'primary' | 'secondary' | 'muted' | 'brand' | 'danger' | 'inverse';

type AppTextProps = PropsWithChildren<
  TextProps & {
    align?: TextStyle['textAlign'];
    tone?: TextTone;
    variant?: TextVariant;
  }
>;

export function AppText({
  align,
  children,
  style,
  tone = 'primary',
  variant = 'body',
  ...props
}: AppTextProps) {
  const { colors } = useAppTheme();
  const toneColors: Record<TextTone, string> = {
    primary: colors.textPrimary,
    secondary: colors.textSecondary,
    muted: colors.textMuted,
    brand: colors.primary,
    danger: colors.danger,
    inverse: colors.onPrimary,
  };

  return (
    <Text
      {...props}
      style={[typography[variant], { color: toneColors[tone], textAlign: align }, style]}
    >
      {children}
    </Text>
  );
}
