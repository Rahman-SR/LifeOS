import { FilterChipRow, type FilterOption } from '@/components/ui';

import type { TaskFilter } from '../task-types';

const filters: readonly FilterOption<TaskFilter>[] = [
  { label: 'Today', value: 'today' },
  { label: 'Upcoming', value: 'upcoming' },
  { label: 'Overdue', value: 'overdue' },
  { label: 'Completed', value: 'completed' },
];

export function TaskFilterTabs({ onChange, value }: { onChange: (value: TaskFilter) => void; value: TaskFilter }) {
  return <FilterChipRow onChange={onChange} options={filters} value={value} />;
}
