const dateKeyPattern = /^(\d{4})-(\d{2})-(\d{2})$/;

export function getDateKey(date = new Date(), timeZone?: string | null): string {
  if (timeZone) {
    try {
      const parts = new Intl.DateTimeFormat('en-US', {
        day: '2-digit',
        month: '2-digit',
        timeZone,
        year: 'numeric',
      }).formatToParts(date);
      const values = Object.fromEntries(parts.map((part) => [part.type, part.value]));
      return `${values.year}-${values.month}-${values.day}`;
    } catch {
      // Fall back to the device-local calendar when a stored timezone is unavailable.
    }
  }
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
}

export function parseDateKey(key: string): Date | null {
  const match = dateKeyPattern.exec(key);
  if (!match) return null;
  const date = new Date(Number(match[1]), Number(match[2]) - 1, Number(match[3]), 12);
  return getDateKey(date) === key ? date : null;
}

export function shiftDateKey(key: string, days: number): string {
  const match = dateKeyPattern.exec(key);
  if (!match) return key;
  const date = new Date(Date.UTC(Number(match[1]), Number(match[2]) - 1, Number(match[3]) + days));
  return date.toISOString().slice(0, 10);
}

export function startOfWeekDateKey(key: string, weekStartsOn = 1): string {
  const date = parseDateKey(key);
  if (!date) return key;
  const offset = (date.getDay() - weekStartsOn + 7) % 7;
  return shiftDateKey(key, -offset);
}

export function startOfMonthDateKey(key: string): string {
  return `${key.slice(0, 7)}-01`;
}

export function formatDateKey(key: string, options?: Intl.DateTimeFormatOptions): string {
  const date = parseDateKey(key);
  if (!date) return key;
  return new Intl.DateTimeFormat(undefined, options ?? {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  }).format(date);
}
