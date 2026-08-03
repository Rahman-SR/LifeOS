import {
  DarkTheme as NavigationDarkTheme,
  DefaultTheme as NavigationLightTheme,
  type Theme as NavigationTheme,
} from '@react-navigation/native';
import { useColorScheme } from 'react-native';

import { useThemeStore } from '@/store/theme-store';
import { colorTokens, type ResolvedTheme, type ThemeColors } from '@/theme';

type AppTheme = {
  colors: ThemeColors;
  isDark: boolean;
  navigationTheme: NavigationTheme;
  resolvedTheme: ResolvedTheme;
};

export function useAppTheme(): AppTheme {
  const systemTheme = useColorScheme();
  const preference = useThemeStore((state) => state.preference);
  const resolvedTheme: ResolvedTheme =
    preference === 'system' ? (systemTheme === 'dark' ? 'dark' : 'light') : preference;
  const colors = colorTokens[resolvedTheme];
  const baseNavigationTheme =
    resolvedTheme === 'dark' ? NavigationDarkTheme : NavigationLightTheme;

  return {
    colors,
    isDark: resolvedTheme === 'dark',
    resolvedTheme,
    navigationTheme: {
      ...baseNavigationTheme,
      colors: {
        ...baseNavigationTheme.colors,
        background: colors.background,
        border: colors.border,
        card: colors.surface,
        notification: colors.danger,
        primary: colors.primary,
        text: colors.textPrimary,
      },
    },
  };
}
