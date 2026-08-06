import type { Note, NoteFilter } from './note-types';

const contentTitleLength = 72;

export function getNoteTitle(note: Pick<Note, 'content' | 'title'>): string {
  const title = note.title.trim();
  if (title) return title;

  const content = note.content.trim().replace(/\s+/g, ' ');
  if (!content) return 'Untitled note';
  return content.length > contentTitleLength
    ? `${content.slice(0, contentTitleLength).trimEnd()}…`
    : content;
}

export function getNotePreview(note: Pick<Note, 'content' | 'title'>): string {
  const content = note.content.trim();
  if (content) return content;
  return note.title.trim();
}

export function formatNoteUpdatedAt(value: string, now = new Date()): string {
  const date = new Date(value);
  const elapsed = now.getTime() - date.getTime();
  const minute = 60_000;
  const hour = minute * 60;
  const day = hour * 24;

  if (elapsed >= 0 && elapsed < minute) return 'Updated just now';
  if (elapsed >= 0 && elapsed < hour) {
    const minutes = Math.max(1, Math.floor(elapsed / minute));
    return `Updated ${minutes} ${minutes === 1 ? 'minute' : 'minutes'} ago`;
  }
  if (elapsed >= 0 && elapsed < day) {
    const hours = Math.max(1, Math.floor(elapsed / hour));
    return `Updated ${hours} ${hours === 1 ? 'hour' : 'hours'} ago`;
  }

  return `Updated ${new Intl.DateTimeFormat(undefined, {
    day: 'numeric',
    month: 'short',
    year: date.getFullYear() === now.getFullYear() ? undefined : 'numeric',
  }).format(date)}`;
}

export function sortNotes(notes: Note[], filter: NoteFilter): Note[] {
  return [...notes].sort((left, right) => {
    if (filter !== 'archived' && left.is_pinned !== right.is_pinned) {
      return left.is_pinned ? -1 : 1;
    }
    return new Date(right.updated_at).getTime() - new Date(left.updated_at).getTime();
  });
}
