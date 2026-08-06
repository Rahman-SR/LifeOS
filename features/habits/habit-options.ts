import { colorTokens } from '@/theme';

export const habitIcons = [
  'droplets',
  'book-open',
  'dumbbell',
  'moon',
  'heart-pulse',
  'brain',
  'footprints',
  'pill',
] as const;

export type HabitIconName = (typeof habitIcons)[number];
export type HabitColorToken = 'primary' | 'success' | 'warning' | 'info' | 'danger';

export const habitColorOptions: Array<{ color: string; label: string; token: HabitColorToken }> = [
  { color: colorTokens.light.primary, label: 'Indigo', token: 'primary' },
  { color: colorTokens.light.success, label: 'Green', token: 'success' },
  { color: colorTokens.light.warning, label: 'Orange', token: 'warning' },
  { color: colorTokens.light.info, label: 'Blue', token: 'info' },
  { color: colorTokens.light.danger, label: 'Red', token: 'danger' },
];
