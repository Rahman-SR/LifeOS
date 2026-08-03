import { zodResolver } from '@hookform/resolvers/zod';
import { router } from 'expo-router';
import { Controller, useForm } from 'react-hook-form';
import { useState } from 'react';

import { AppText, Button, TextField } from '@/components/ui';
import {
  forgotPasswordSchema,
  type ForgotPasswordValues,
} from '@/features/auth/auth-schemas';
import { getAuthErrorMessage, sendPasswordReset } from '@/features/auth/auth-service';
import { AuthScreen } from '@/features/auth/components';

export default function ForgotPasswordScreen() {
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ForgotPasswordValues>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: { email: '' },
    mode: 'onBlur',
  });

  const onSubmit = async (values: ForgotPasswordValues) => {
    setSubmitError(null);
    setSuccessMessage(null);

    try {
      await sendPasswordReset(values.email);
      setSuccessMessage(
        'If an account exists for that email, a password reset message is on its way.',
      );
    } catch (error) {
      setSubmitError(getAuthErrorMessage(error));
    }
  };

  return (
    <AuthScreen
      footer={
        <Button
          disabled={isSubmitting}
          label="Return to sign in"
          onPress={() => router.replace('/login')}
          variant="secondary"
        />
      }
      subtitle="Enter your account email and we’ll send reset instructions."
      title="Reset your password"
    >
      <Controller
        control={control}
        name="email"
        render={({ field: { onBlur, onChange, value } }) => (
          <TextField
            autoCapitalize="none"
            autoComplete="email"
            autoCorrect={false}
            error={errors.email?.message}
            inputMode="email"
            keyboardType="email-address"
            label="Email"
            onBlur={onBlur}
            onChangeText={onChange}
            onSubmitEditing={() => void handleSubmit(onSubmit)()}
            placeholder="you@example.com"
            returnKeyType="send"
            textContentType="emailAddress"
            value={value}
          />
        )}
      />
      {submitError ? (
        <AppText accessibilityLiveRegion="polite" accessibilityRole="alert" tone="danger">
          {submitError}
        </AppText>
      ) : null}
      {successMessage ? (
        <AppText accessibilityLiveRegion="polite" accessibilityRole="alert" tone="brand">
          {successMessage}
        </AppText>
      ) : null}
      <Button
        accessibilityLabel="Send password reset email"
        label="Send reset email"
        loading={isSubmitting}
        onPress={() => void handleSubmit(onSubmit)()}
      />
    </AuthScreen>
  );
}
