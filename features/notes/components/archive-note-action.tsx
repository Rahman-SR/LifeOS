import { Archive, RotateCcw } from 'lucide-react-native';

import { Button } from '@/components/ui';
import { useAppTheme } from '@/hooks/use-app-theme';
import { sizing } from '@/theme';

export function ArchiveNoteAction({ archived, disabled, loading, onPress }: { archived: boolean; disabled?: boolean; loading?: boolean; onPress: () => void }) {
  const { colors } = useAppTheme();
  const Icon = archived ? RotateCcw : Archive;
  return (
    <Button
      disabled={disabled}
      label={archived ? 'Restore note' : 'Archive note'}
      leftIcon={<Icon color={colors.primary} size={sizing.iconSmall} />}
      loading={loading}
      onPress={onPress}
      variant="secondary"
    />
  );
}
