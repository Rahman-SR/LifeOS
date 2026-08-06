export const journalKeys = {
  all: (userId: string) => ['journal', userId] as const,
  detail: (userId: string, id: string) => [...journalKeys.all(userId), 'detail', id] as const,
  history: (userId: string) => [...journalKeys.all(userId), 'history'] as const,
  today: (userId: string, date: string) => [...journalKeys.all(userId), 'today', date] as const,
};
