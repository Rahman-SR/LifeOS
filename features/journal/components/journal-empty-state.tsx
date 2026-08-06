import { EmptyState } from '@/components/feedback';

export function JournalEmptyState({ isSearch, onCreate }: { isSearch: boolean; onCreate: () => void }) {
  return <EmptyState actionLabel={isSearch ? undefined : 'Write today'} description={isSearch ? 'Try a different word or clear the search.' : 'Write your first daily reflection when you are ready.'} onAction={isSearch ? undefined : onCreate} title={isSearch ? 'No matching entries' : 'Your journal is empty'} />;
}
