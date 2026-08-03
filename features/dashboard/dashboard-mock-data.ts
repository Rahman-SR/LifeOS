export type MockHabitIcon = 'book' | 'droplets' | 'dumbbell' | 'moon';

export type MockHabit = {
  completed: boolean;
  icon: MockHabitIcon;
  id: string;
  name: string;
  streak: number;
};

export type MockGoal = {
  progress: number;
  targetLabel: string;
  title: string;
};

export type MockNote = {
  excerpt: string;
  title: string;
  updatedLabel: string;
};

export const mockHabits: MockHabit[] = [
  { completed: true, icon: 'droplets', id: 'water', name: 'Drink water', streak: 8 },
  { completed: true, icon: 'book', id: 'read', name: 'Read for 20 minutes', streak: 12 },
  { completed: false, icon: 'dumbbell', id: 'move', name: 'Move your body', streak: 5 },
  { completed: false, icon: 'moon', id: 'sleep', name: 'Sleep before 11 PM', streak: 3 },
];

export const mockGoal: MockGoal = {
  progress: 64,
  targetLabel: 'Target: 30 September',
  title: 'Build a consistent morning routine',
};

export const mockNote: MockNote = {
  excerpt: 'Keep tomorrow simple: finish the important work first, then leave space to recharge.',
  title: 'A reminder for tomorrow',
  updatedLabel: 'Updated today',
};

export const resetMockHabits = () => mockHabits.map((habit) => ({ ...habit }));
