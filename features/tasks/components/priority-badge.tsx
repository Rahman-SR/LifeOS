import { Flag } from 'lucide-react-native';

import { StatusBadge } from '@/components/ui';
import { useAppTheme } from '@/hooks/use-app-theme';

import type { TaskPriority } from '../task-types';

type PriorityBadgeProps = {
  onPress?: () => void;
  priority: TaskPriority;
  selected?: boolean;
};

export function PriorityBadge({ onPress, priority, selected = false }: PriorityBadgeProps) {
  const { colors } = useAppTheme();
  const color = { high: colors.danger, low: colors.info, medium: colors.warning }[priority];
  const label = { high: 'High', low: 'Low', medium: 'Medium' }[priority];
  return (
    <StatusBadge
      color={color}
      icon={Flag}
      label={onPress ? `${label} priority` : label}
      onPress={onPress}
      selected={selected}
    />
  );
}
