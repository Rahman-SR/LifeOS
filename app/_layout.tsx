import { Stack } from 'expo-router';

import { SplashScreen } from '@/features/auth/components';
import { useAuth } from '@/hooks/use-auth';
import { AppProviders } from '@/providers/app-providers';

function RootNavigator() {
  const { hasCompletedOnboarding, isLoading, session } = useAuth();

  if (isLoading) return <SplashScreen />;

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Protected guard={Boolean(session)}>
        <Stack.Screen name="(tabs)" />
        <Stack.Screen name="tasks" />
      </Stack.Protected>
      <Stack.Protected guard={!session && !hasCompletedOnboarding}>
        <Stack.Screen name="onboarding" />
      </Stack.Protected>
      <Stack.Protected guard={!session && hasCompletedOnboarding}>
        <Stack.Screen name="(auth)" />
      </Stack.Protected>
    </Stack>
  );
}

export default function RootLayout() {
  return (
    <AppProviders>
      <RootNavigator />
    </AppProviders>
  );
}
