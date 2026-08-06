import { Archive, ArrowLeft, Pencil, RotateCcw, Trash2 } from 'lucide-react-native';
import { StyleSheet, View } from 'react-native';

import { AppText, Button, IconButton } from '@/components/ui';
import { useAppTheme } from '@/hooks/use-app-theme';
import { sizing, spacing } from '@/theme';

import type { GoalStatus } from '../goal-types';

type GoalDetailsHeaderProps = {
  onArchive: () => void;
  onBack: () => void;
  onDelete: () => void;
  onEdit: () => void;
  onRestore: () => void;
  status: GoalStatus;
  title: string;
};

export function GoalDetailsHeader({
  onArchive,
  onBack,
  onDelete,
  onEdit,
  onRestore,
  status,
  title,
}: GoalDetailsHeaderProps) {
  const { colors } = useAppTheme();
  return (
    <View style={styles.header}>
      <View style={styles.titleRow}>
        <IconButton icon={ArrowLeft} label="Back to goals" onPress={onBack} />
        <AppText numberOfLines={2} style={styles.title} variant="heading2">{title}</AppText>
        <IconButton icon={Pencil} label="Edit goal" onPress={onEdit} />
      </View>
      <View style={styles.actions}>
        {status === 'archived' ? (
          <Button
            fullWidth={false}
            label="Restore"
            leftIcon={<RotateCcw color={colors.primary} size={sizing.iconSmall} />}
            onPress={onRestore}
            variant="secondary"
          />
        ) : (
          <Button
            fullWidth={false}
            label="Archive"
            leftIcon={<Archive color={colors.primary} size={sizing.iconSmall} />}
            onPress={onArchive}
            variant="secondary"
          />
        )}
        <Button
          fullWidth={false}
          label="Delete"
          leftIcon={<Trash2 color={colors.onPrimary} size={sizing.iconSmall} />}
          onPress={onDelete}
          variant="destructive"
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  actions: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.xs, justifyContent: 'flex-end' },
  header: { gap: spacing.sm },
  title: { flex: 1 },
  titleRow: { alignItems: 'center', flexDirection: 'row', gap: spacing.xs },
});
