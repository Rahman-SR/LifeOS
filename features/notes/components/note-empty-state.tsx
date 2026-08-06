import { NotebookPen, SearchX } from 'lucide-react-native';

import { EmptyState } from '@/components/feedback';

import type { NoteFilter } from '../note-types';

export function NoteEmptyState({ filter, isSearch, onCreate }: { filter: NoteFilter; isSearch: boolean; onCreate: () => void }) {
  if (isSearch) {
    return <EmptyState description="Try a different title or phrase." icon={SearchX} title="No matching notes" />;
  }
  const archived = filter === 'archived';
  const pinned = filter === 'pinned';
  return (
    <EmptyState
      actionLabel={archived ? undefined : 'Create note'}
      description={
        archived
          ? 'Archived notes will stay here until you restore or delete them.'
          : pinned
            ? 'Pin an important note to keep it easy to find.'
            : 'Capture an idea, reminder, or important thought.'
      }
      icon={NotebookPen}
      onAction={archived ? undefined : onCreate}
      title={archived ? 'No archived notes' : pinned ? 'No pinned notes' : 'No notes yet'}
    />
  );
}
