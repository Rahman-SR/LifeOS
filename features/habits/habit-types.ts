import type { Tables, TablesInsert, TablesUpdate } from '@/types/database';

export type Habit = Tables<'habits'>;
export type HabitLog = Tables<'habit_logs'>;
export type HabitInsert = TablesInsert<'habits'>;
export type HabitUpdate = TablesUpdate<'habits'>;
export type HabitFrequency = 'daily' | 'weekly';
export type HabitFilter = 'today' | 'all' | 'archived';

export type HabitMutationValues = {
  color: string;
  days_of_week: number[];
  description: string | null;
  frequency_type: HabitFrequency;
  icon: string | null;
  name: string;
  reminder_time: string | null;
  target_count: number;
};

export type HabitStats = {
  bestStreak: number;
  completionRate: number;
  currentStreak: number;
};

export type HabitWithProgress = Habit & HabitStats & {
  completedToday: boolean;
  scheduledToday: boolean;
  todayCount: number;
};

export type HabitMutationResult = {
  habit: Habit;
  reminderWarning: string | null;
};
