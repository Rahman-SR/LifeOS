import { StatusBadge } from '@/components/ui';
import { useAppTheme } from '@/hooks/use-app-theme';
import type { GoalStatus } from '../goal-types';

const labels: Record<GoalStatus, string> = { active: 'Active', archived: 'Archived', completed: 'Completed', paused: 'Paused' };
export function GoalStatusBadge({ status }: { status: GoalStatus }) {
  const { colors } = useAppTheme();
  const color = status === 'completed' ? colors.success : status === 'paused' ? colors.warning : status === 'active' ? colors.info : colors.textMuted;
  return <StatusBadge color={color} label={labels[status]} />;
}
