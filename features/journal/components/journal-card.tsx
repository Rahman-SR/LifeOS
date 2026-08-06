import { BookOpen, Trash2 } from 'lucide-react-native';
import { memo } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';

import { AppListCard, AppText, IconButton } from '@/components/ui';
import { useAppTheme } from '@/hooks/use-app-theme';
import { formatDateKey } from '@/lib/local-date';
import { radii, sizing, spacing } from '@/theme';

import type { JournalEntry } from '../journal-types';
import { getJournalPreview, getJournalTitle } from '../journal-utils';

function JournalCardComponent({ entry, onDelete, onOpen }: { entry: JournalEntry; onDelete: (entry: JournalEntry) => void; onOpen: (id: string) => void }) {
  const { colors } = useAppTheme();
  return <AppListCard style={styles.card}>
    <Pressable accessibilityHint="Opens and edits this journal entry" accessibilityLabel={`Open journal: ${getJournalTitle(entry)}`} accessibilityRole="button" onPress={() => onOpen(entry.id)} style={({ pressed }) => [styles.main, pressed && styles.pressed]}>
      <View style={[styles.icon, { backgroundColor: colors.surfaceSecondary }]}><BookOpen color={colors.primary} size={sizing.iconSmall} /></View>
      <View style={styles.copy}>
        <AppText numberOfLines={1} variant="bodyLarge">{getJournalTitle(entry)}</AppText>
        <AppText tone="muted" variant="caption">{formatDateKey(entry.entry_date, { day: 'numeric', month: 'long', weekday: 'short', year: 'numeric' })} · Updated {new Date(entry.updated_at).toLocaleDateString()}</AppText>
        <AppText numberOfLines={2} tone="secondary" variant="bodySmall">{getJournalPreview(entry)}</AppText>
      </View>
    </Pressable>
    <IconButton icon={Trash2} label={`Delete ${getJournalTitle(entry)}`} onPress={() => onDelete(entry)} />
  </AppListCard>;
}

export const JournalCard = memo(JournalCardComponent);

const styles = StyleSheet.create({ card: { alignItems: 'flex-start', flexDirection: 'row', gap: spacing.xs }, copy: { flex: 1, gap: spacing.xxs }, icon: { alignItems: 'center', borderRadius: radii.medium, height: sizing.compactIconContainer, justifyContent: 'center', width: sizing.compactIconContainer }, main: { alignItems: 'flex-start', flex: 1, flexDirection: 'row', gap: spacing.sm, minHeight: sizing.touchTarget }, pressed: { opacity: 0.7 } });
