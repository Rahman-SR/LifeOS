import { Angry, Frown, Laugh, Meh, Smile, type LucideIcon } from 'lucide-react-native';

import { moodColors } from '@/theme';

import type { MoodValue } from './mood-types';

export type MoodOptionDefinition = {
  color: string;
  icon: LucideIcon;
  label: string;
  score: number;
  value: MoodValue;
};

export const moodOptions: ReadonlyArray<MoodOptionDefinition> = [
  { color: moodColors.excellent, icon: Laugh, label: 'Excellent', score: 5, value: 'excellent' },
  { color: moodColors.good, icon: Smile, label: 'Good', score: 4, value: 'good' },
  { color: moodColors.okay, icon: Meh, label: 'Okay', score: 3, value: 'okay' },
  { color: moodColors.low, icon: Frown, label: 'Low', score: 2, value: 'low' },
  { color: moodColors.bad, icon: Angry, label: 'Bad', score: 1, value: 'bad' },
];

export function getMoodOption(value: MoodValue): MoodOptionDefinition {
  return moodOptions.find((option) => option.value === value) ?? moodOptions[2]!;
}
