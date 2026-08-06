import { useCallback } from 'react';
import { FlatList, RefreshControl, StyleSheet, type ListRenderItem } from 'react-native';

import { useAppTheme } from '@/hooks/use-app-theme';
import { spacing } from '@/theme';

import type { JournalEntry } from '../journal-types';
import { JournalCard } from './journal-card';
import { JournalEmptyState } from './journal-empty-state';

export function JournalList({ data, isSearch, onCreate, onDelete, onOpen, onRefresh, refreshing }: { data: JournalEntry[]; isSearch: boolean; onCreate: () => void; onDelete: (entry: JournalEntry) => void; onOpen: (id: string) => void; onRefresh: () => void; refreshing: boolean }) {
  const { colors } = useAppTheme();
  const renderItem = useCallback<ListRenderItem<JournalEntry>>(({ item }) => <JournalCard entry={item} onDelete={onDelete} onOpen={onOpen} />, [onDelete, onOpen]);
  return <FlatList contentContainerStyle={[styles.content, data.length === 0 && styles.empty]} data={data} keyExtractor={(item) => item.id} ListEmptyComponent={<JournalEmptyState isSearch={isSearch} onCreate={onCreate} />} refreshControl={<RefreshControl accessibilityLabel="Refresh journal history" colors={[colors.primary]} onRefresh={onRefresh} refreshing={refreshing} tintColor={colors.primary} />} renderItem={renderItem} showsVerticalScrollIndicator={false} />;
}

const styles = StyleSheet.create({ content: { gap: spacing.sm, paddingBottom: spacing.giant }, empty: { flexGrow: 1, justifyContent: 'center' } });
