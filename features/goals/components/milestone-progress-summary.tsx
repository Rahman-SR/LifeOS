import { AppText } from '@/components/ui';
import type { GoalMilestone } from '../goal-types';
export function MilestoneProgressSummary({ milestones }: { milestones: GoalMilestone[] }) { const done = milestones.filter((item) => item.is_completed).length; return <AppText tone="secondary" variant="bodySmall">{done} of {milestones.length} milestones complete{milestones.length ? ` · ${Math.round((done / milestones.length) * 100)}% suggested progress` : ''}</AppText>; }
