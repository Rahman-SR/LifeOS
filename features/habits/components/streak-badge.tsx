import { Flame } from 'lucide-react-native';

import { StatusBadge } from '@/components/ui';
import { useAppTheme } from '@/hooks/use-app-theme';

export function StreakBadge({ streak }: { streak: number }) {
  const { colors } = useAppTheme();
  return <StatusBadge color={colors.warning} icon={Flame} label={`${streak}d streak`} />;
}
