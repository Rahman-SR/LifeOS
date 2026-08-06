import { FilterChipRow, type FilterOption } from '@/components/ui';

import type { NoteFilter } from '../note-types';

const filters: readonly FilterOption<NoteFilter>[] = [
  { label: 'All', value: 'all' },
  { label: 'Pinned', value: 'pinned' },
  { label: 'Recent', value: 'recent' },
  { label: 'Archived', value: 'archived' },
];

export function NoteFilterTabs({ onChange, value }: { onChange: (value: NoteFilter) => void; value: NoteFilter }) {
  return <FilterChipRow onChange={onChange} options={filters} value={value} />;
}
