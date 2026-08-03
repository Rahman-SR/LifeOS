import { zodResolver } from '@hookform/resolvers/zod';
import { router } from 'expo-router';
import { Controller, useForm } from 'react-hook-form';
import { useState } from 'react';

import { AppText, Button, TextField } from '@/components/ui';
import { registerSchema, type RegisterValues } from '@/features/auth/auth-schemas';
import { getAuthErrorMessage, registerWithEmail } from '@/features/auth/auth-service';
import { AuthScreen, PasswordField } from '@/features/auth/components';

export default function RegisterScreen() {
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RegisterValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      displayName: '',
      email: '',
      password: '',
      confirmPassword: '',
    },
    mode: 'onBlur',
  });

  const onSubmit = async (values: RegisterValues) => {
    setSubmitError(null);
    setSuccessMessage(null);

    try {
      const session = await registerWithEmail(values.displayName, values.email, values.password);
      if (!session) {
        setSuccessMessage('Account created. Return to sign in to continue.');
      }
    } catch (error) {
      setSubmitError(getAuthErrorMessage(error));
    }
  };

  return (
    <AuthScreen
      footer={
        <Button
          disabled={isSubmitting}
          label="Already have an account? Sign in"
          onPress={() => router.replace('/login')}
          variant="secondary"
        />
      }
      subtitle="Use email and a strong password to create your private workspace."
      title="Create your account"
    >
      <Controller
        control={control}
        name="displayName"
        render={({ field: { onBlur, onChange, value } }) => (
          <TextField
            autoCapitalize="words"
            autoComplete="name"
            error={errors.displayName?.message}
            label="Display name"
            onBlur={onBlur}
            onChangeText={onChange}
            placeholder="Your name"
            returnKeyType="next"
            textContentType="name"
            value={value}
          />
        )}
      />
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
            placeholder="you@example.com"
            returnKeyType="next"
            textContentType="emailAddress"
            value={value}
          />
        )}
      />
      <Controller
        control={control}
        name="password"
        render={({ field: { onBlur, onChange, value } }) => (
          <PasswordField
            autoComplete="new-password"
            error={errors.password?.message}
            helperText="Use at least 8 characters."
            label="Password"
            onBlur={onBlur}
            onChangeText={onChange}
            placeholder="Create a password"
            returnKeyType="next"
            textContentType="newPassword"
            value={value}
          />
        )}
      />
      <Controller
        control={control}
        name="confirmPassword"
        render={({ field: { onBlur, onChange, value } }) => (
          <PasswordField
            autoComplete="new-password"
            error={errors.confirmPassword?.message}
            label="Confirm password"
            onBlur={onBlur}
            onChangeText={onChange}
            onSubmitEditing={() => void handleSubmit(onSubmit)()}
            placeholder="Repeat your password"
            returnKeyType="done"
            textContentType="newPassword"
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
        accessibilityLabel="Create LifeOS account"
        label="Create account"
        loading={isSubmitting}
        onPress={() => void handleSubmit(onSubmit)()}
      />
    </AuthScreen>
  );
}
