export function getHabitDateKey(date = new Date()): string {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
}

export function parseHabitDateKey(key: string): Date | null {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(key);
  if (!match) return null;
  const date = new Date(Number(match[1]), Number(match[2]) - 1, Number(match[3]), 12);
  return getHabitDateKey(date) === key ? date : null;
}

export function addLocalDays(date: Date, amount: number): Date {
  const next = new Date(date);
  next.setDate(next.getDate() + amount);
  return next;
}

export function isHabitScheduled(
  frequencyType: string,
  weekdays: number[],
  date = new Date(),
): boolean {
  return frequencyType === 'daily' || (frequencyType === 'weekly' && weekdays.includes(date.getDay()));
}

export function fromHabitDatabaseTime(time: string | null): string {
  return time?.slice(0, 5) ?? '';
}

export function toHabitDatabaseTime(time: string): string | null {
  return time ? `${time}:00` : null;
}
