import { zodResolver } from '@hookform/resolvers/zod';
import { router } from 'expo-router';
import { Controller, useForm } from 'react-hook-form';
import { useState } from 'react';

import { AppText, Button, TextField } from '@/components/ui';
import { loginSchema, type LoginValues } from '@/features/auth/auth-schemas';
import { getAuthErrorMessage, signInWithEmail } from '@/features/auth/auth-service';
import { AuthScreen, PasswordField } from '@/features/auth/components';

export default function LoginScreen() {
  const [submitError, setSubmitError] = useState<string | null>(null);
  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: '', password: '' },
    mode: 'onBlur',
  });

  const onSubmit = async (values: LoginValues) => {
    setSubmitError(null);
    try {
      await signInWithEmail(values.email, values.password);
    } catch (error) {
      setSubmitError(getAuthErrorMessage(error));
    }
  };

  return (
    <AuthScreen
      footer={
        <>
          <Button
            disabled={isSubmitting}
            label="Create an account"
            onPress={() => router.push('/register')}
            variant="secondary"
          />
          <Button
            disabled={isSubmitting}
            label="Forgot password?"
            onPress={() => router.push('/forgot-password')}
            variant="secondary"
          />
        </>
      }
      subtitle="Sign in to continue planning your day."
      title="Welcome back"
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
            autoComplete="current-password"
            error={errors.password?.message}
            label="Password"
            onBlur={onBlur}
            onChangeText={onChange}
            onSubmitEditing={() => void handleSubmit(onSubmit)()}
            placeholder="Enter your password"
            returnKeyType="done"
            textContentType="password"
            value={value}
          />
        )}
      />
      {submitError ? (
        <AppText accessibilityLiveRegion="polite" accessibilityRole="alert" tone="danger">
          {submitError}
        </AppText>
      ) : null}
      <Button
        accessibilityLabel="Sign in to LifeOS"
        label="Sign in"
        loading={isSubmitting}
        onPress={() => void handleSubmit(onSubmit)()}
      />
    </AuthScreen>
  );
}
