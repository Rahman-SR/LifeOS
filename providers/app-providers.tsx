import { ThemeProvider as NavigationThemeProvider } from '@react-navigation/native';
import { QueryClientProvider } from '@tanstack/react-query';
import type { PropsWithChildren } from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';

import { useAppTheme } from '@/hooks/use-app-theme';
import { queryClient } from '@/lib/query-client';

import { AuthProvider } from './auth-provider';

function ThemedProviders({ children }: PropsWithChildren) {
  const { isDark, navigationTheme } = useAppTheme();

  return (
    <NavigationThemeProvider value={navigationTheme}>
      <StatusBar style={isDark ? 'light' : 'dark'} />
      {children}
    </NavigationThemeProvider>
  );
}

export function AppProviders({ children }: PropsWithChildren) {
  return (
    <SafeAreaProvider>
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <ThemedProviders>{children}</ThemedProviders>
        </AuthProvider>
      </QueryClientProvider>
    </SafeAreaProvider>
  );
}
