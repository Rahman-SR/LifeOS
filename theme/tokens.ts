import type { TextStyle } from 'react-native';

export const colorTokens = {
  light: {
    background: '#F7F8FA',
    surface: '#FFFFFF',
    surfaceSecondary: '#F0F2F5',
    textPrimary: '#171A1F',
    textSecondary: '#667085',
    textMuted: '#98A2B3',
    border: '#E4E7EC',
    primary: '#5B67F1',
    primaryPressed: '#4652D9',
    success: '#12B76A',
    warning: '#F79009',
    danger: '#F04438',
    info: '#2E90FA',
    onPrimary: '#FFFFFF',
  },
  dark: {
    background: '#0F1115',
    surface: '#181B21',
    surfaceSecondary: '#22262E',
    textPrimary: '#F5F7FA',
    textSecondary: '#B4BBC6',
    textMuted: '#7E8794',
    border: '#303641',
    primary: '#7C86FF',
    primaryPressed: '#626CE8',
    success: '#32D583',
    warning: '#FDB022',
    danger: '#FF6B61',
    info: '#53B1FD',
    onPrimary: '#FFFFFF',
  },
} as const;

export const moodColors = {
  excellent: '#12B76A',
  good: '#84CC16',
  okay: '#FACC15',
  low: '#FB923C',
  bad: '#F04438',
} as const;

export const spacing = {
  xxs: 4,
  xs: 8,
  sm: 12,
  md: 16,
  lg: 20,
  xl: 24,
  xxl: 32,
  xxxl: 40,
  huge: 48,
  giant: 64,
} as const;

export const radii = {
  small: 8,
  medium: 12,
  large: 16,
  xl: 24,
  pill: 999,
} as const;

type TypographyToken = Pick<TextStyle, 'fontSize' | 'lineHeight' | 'fontWeight'>;

export const typography = {
  display: { fontSize: 32, lineHeight: 38, fontWeight: '700' },
  heading1: { fontSize: 28, lineHeight: 34, fontWeight: '700' },
  heading2: { fontSize: 24, lineHeight: 30, fontWeight: '600' },
  heading3: { fontSize: 20, lineHeight: 26, fontWeight: '600' },
  title: { fontSize: 18, lineHeight: 24, fontWeight: '600' },
  bodyLarge: { fontSize: 17, lineHeight: 24, fontWeight: '400' },
  body: { fontSize: 15, lineHeight: 22, fontWeight: '400' },
  bodySmall: { fontSize: 13, lineHeight: 18, fontWeight: '400' },
  caption: { fontSize: 12, lineHeight: 16, fontWeight: '500' },
  button: { fontSize: 15, lineHeight: 20, fontWeight: '600' },
} satisfies Record<string, TypographyToken>;

export const sizing = {
  touchTarget: 44,
  controlHeight: 48,
  iconSmall: 16,
  icon: 22,
  iconLarge: 32,
  progressBar: 8,
  border: 1,
} as const;

export const shadows = {
  card: {
    shadowOpacity: 0.08,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 4 },
    elevation: 2,
  },
} as const;
