import { EmptyState } from '@/components/feedback';
import type { GoalFilter } from '../goal-types';
export function GoalEmptyState({ filter, onCreate }: { filter: GoalFilter; onCreate: () => void }) { return <EmptyState actionLabel="Create goal" description={`You have no ${filter} goals.`} onAction={onCreate} title="No goals here" />; }
