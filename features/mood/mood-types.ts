import type { Tables } from '@/types/database';

export type MoodLog = Omit<Tables<'mood_logs'>, 'mood_score'>;
export type MoodValue = 'excellent' | 'good' | 'okay' | 'low' | 'bad';
export type MoodMutationValues = { mood: MoodValue; mood_date: string; note: string | null };
export type MoodCounts = Record<MoodValue, number>;
