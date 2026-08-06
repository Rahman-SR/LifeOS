import { FilterChipRow } from '@/components/ui';
import { goalFilterOptions } from '../goal-options';
import type { GoalFilter } from '../goal-types';

export function GoalFilterTabs({ onChange, value }: { onChange: (value: GoalFilter) => void; value: GoalFilter }) {
  return <FilterChipRow onChange={onChange} options={goalFilterOptions} value={value} />;
}
