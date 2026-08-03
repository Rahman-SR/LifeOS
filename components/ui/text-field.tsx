import { useState, type ReactNode } from 'react';
import { StyleSheet, TextInput, View, type TextInputProps } from 'react-native';

import { useAppTheme } from '@/hooks/use-app-theme';
import { radii, sizing, spacing, typography } from '@/theme';

import { AppText } from './app-text';

type TextFieldProps = TextInputProps & {
  error?: string;
  helperText?: string;
  label: string;
  rightAccessory?: ReactNode;
};

export function TextField({
  editable = true,
  error,
  helperText,
  label,
  onBlur,
  onFocus,
  rightAccessory,
  style,
  ...props
}: TextFieldProps) {
  const { colors } = useAppTheme();
  const [isFocused, setIsFocused] = useState(false);

  return (
    <View style={styles.container}>
      <AppText variant="bodySmall">{label}</AppText>
      <View
        style={[
          styles.inputContainer,
          {
            backgroundColor: editable ? colors.surface : colors.surfaceSecondary,
            borderColor: error ? colors.danger : isFocused ? colors.primary : colors.border,
          },
        ]}
      >
        <TextInput
          accessibilityLabel={label}
          accessibilityState={{ disabled: !editable }}
          editable={editable}
          onBlur={(event) => {
            setIsFocused(false);
            onBlur?.(event);
          }}
          onFocus={(event) => {
            setIsFocused(true);
            onFocus?.(event);
          }}
          placeholderTextColor={colors.textMuted}
          style={[styles.input, typography.body, { color: colors.textPrimary }, style]}
          {...props}
        />
        {rightAccessory ? <View style={styles.accessory}>{rightAccessory}</View> : null}
      </View>
      {error ? (
        <AppText accessibilityRole="alert" tone="danger" variant="bodySmall">
          {error}
        </AppText>
      ) : helperText ? (
        <AppText tone="secondary" variant="bodySmall">
          {helperText}
        </AppText>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: spacing.xs,
  },
  accessory: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  input: {
    flex: 1,
    minHeight: sizing.controlHeight - sizing.border * 2,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
  },
  inputContainer: {
    alignItems: 'center',
    borderRadius: radii.medium,
    borderWidth: sizing.border,
    flexDirection: 'row',
    minHeight: sizing.controlHeight,
  },
});
