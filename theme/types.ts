import type { colorTokens } from './tokens';

export type ThemePreference = 'system' | 'light' | 'dark';
export type ResolvedTheme = 'light' | 'dark';
export type ThemeColors = {
  [Key in keyof (typeof colorTokens)['light']]: string;
};
