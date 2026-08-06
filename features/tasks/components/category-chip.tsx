import { Tag } from 'lucide-react-native';

import { StatusBadge } from '@/components/ui';
import { useAppTheme } from '@/hooks/use-app-theme';

type CategoryChipProps = {
  color?: string;
  label: string;
  onPress?: () => void;
  selected?: boolean;
};

export function CategoryChip({ color, label, onPress, selected = false }: CategoryChipProps) {
  const { colors } = useAppTheme();
  return (
    <StatusBadge
      color={color ?? colors.textSecondary}
      icon={Tag}
      label={onPress ? `${label} category` : label}
      onPress={onPress}
      selected={selected}
    />
  );
}
