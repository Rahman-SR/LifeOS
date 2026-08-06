export const moodKeys = {
  all: (userId: string) => ['mood', userId] as const,
  history: (userId: string) => [...moodKeys.all(userId), 'history'] as const,
  today: (userId: string, date: string) => [...moodKeys.all(userId), 'today', date] as const,
};
