import { Archive, Clock3, Pin } from 'lucide-react-native';
import { StyleSheet, View } from 'react-native';

import { AppText, MetadataRow } from '@/components/ui';
import { useAppTheme } from '@/hooks/use-app-theme';
import { sizing, spacing } from '@/theme';

import { formatNoteUpdatedAt } from '../note-utils';

export function NoteMetadata({ archived, isPinned, updatedAt }: { archived: boolean; isPinned: boolean; updatedAt: string }) {
  const { colors } = useAppTheme();
  return (
    <MetadataRow>
      <View style={styles.item}>
        <Clock3 color={colors.textMuted} size={sizing.iconSmall} />
        <AppText tone="muted" variant="caption">{formatNoteUpdatedAt(updatedAt)}</AppText>
      </View>
      {isPinned ? (
        <View accessibilityLabel="Pinned note" style={styles.item}>
          <Pin color={colors.primary} size={sizing.iconSmall} />
          <AppText tone="brand" variant="caption">Pinned</AppText>
        </View>
      ) : null}
      {archived ? (
        <View accessibilityLabel="Archived note" style={styles.item}>
          <Archive color={colors.warning} size={sizing.iconSmall} />
          <AppText tone="secondary" variant="caption">Archived</AppText>
        </View>
      ) : null}
    </MetadataRow>
  );
}

const styles = StyleSheet.create({
  item: { alignItems: 'center', flexDirection: 'row', gap: spacing.xxs },
});
