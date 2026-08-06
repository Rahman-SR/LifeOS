import type { JournalEntry } from './journal-types';

export function getJournalTitle(entry: JournalEntry): string {
  if (entry.title?.trim()) return entry.title.trim();
  const source = [entry.content, entry.went_well, entry.was_difficult, entry.improve_tomorrow].find((value) => value?.trim());
  return source?.trim().split(/\s+/).slice(0, 8).join(' ') || 'Daily reflection';
}

export function getJournalPreview(entry: JournalEntry): string {
  return [entry.content, entry.went_well, entry.was_difficult, entry.improve_tomorrow].find((value) => value?.trim())?.trim() ?? '';
}

export function filterJournalEntries(entries: JournalEntry[], search: string): JournalEntry[] {
  const query = search.trim().toLocaleLowerCase();
  if (!query) return entries;
  return entries.filter((entry) => [entry.title, entry.content, entry.went_well, entry.was_difficult, entry.improve_tomorrow].some((value) => value?.toLocaleLowerCase().includes(query)));
}
