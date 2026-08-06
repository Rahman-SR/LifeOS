import { FilterChipRow, type FilterOption } from '@/components/ui';

import type { HabitFilter } from '../habit-types';

const filters: readonly FilterOption<HabitFilter>[] = [
  { label: 'Today', value: 'today' },
  { label: 'All habits', value: 'all' },
  { label: 'Archived', value: 'archived' },
];

export function HabitFilterTabs({ onChange, value }: { onChange: (value: HabitFilter) => void; value: HabitFilter }) {
  return <FilterChipRow onChange={onChange} options={filters} value={value} />;
}
