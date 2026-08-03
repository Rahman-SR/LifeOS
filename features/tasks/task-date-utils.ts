export function getLocalDateKey(date = new Date()): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export function parseLocalDate(dateKey: string): Date | null {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(dateKey);
  if (!match) return null;
  const [, year, month, day] = match;
  const date = new Date(Number(year), Number(month) - 1, Number(day));
  return getLocalDateKey(date) === dateKey ? date : null;
}

export function parseLocalDateTime(dateKey: string, timeKey: string): Date | null {
  const date = parseLocalDate(dateKey);
  const match = /^(\d{2}):(\d{2})$/.exec(timeKey);
  if (!date || !match) return null;
  const [, hour, minute] = match;
  const hours = Number(hour);
  const minutes = Number(minute);
  if (hours > 23 || minutes > 59) return null;
  date.setHours(hours, minutes, 0, 0);
  return date;
}

export function formatDateKey(dateKey: string): string {
  const date = parseLocalDate(dateKey);
  if (!date) return dateKey;
  return new Intl.DateTimeFormat(undefined, { day: 'numeric', month: 'short', year: 'numeric' }).format(date);
}

export function formatTimeKey(timeKey: string): string {
  const match = /^(\d{2}):(\d{2})/.exec(timeKey);
  if (!match) return timeKey;
  const date = new Date();
  date.setHours(Number(match[1]), Number(match[2]), 0, 0);
  return new Intl.DateTimeFormat(undefined, { hour: 'numeric', minute: '2-digit' }).format(date);
}

export function toDateKey(date: Date): string {
  return getLocalDateKey(date);
}

export function toTimeKey(date: Date): string {
  return `${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}`;
}

export function toDatabaseTime(timeKey: string): string | null {
  return timeKey ? `${timeKey}:00` : null;
}

export function fromDatabaseTime(time: string | null): string {
  return time?.slice(0, 5) ?? '';
}
