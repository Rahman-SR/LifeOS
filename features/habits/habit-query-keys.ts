export const habitKeys = {
  all: (userId: string) => ['habits', userId] as const,
  detail: (userId: string, habitId: string) => ['habits', userId, 'detail', habitId] as const,
  lists: (userId: string) => ['habits', userId, 'list'] as const,
  logs: (userId: string) => ['habits', userId, 'logs'] as const,
};
