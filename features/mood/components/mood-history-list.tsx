import type { ReactElement } from 'react';
import { FlatList, RefreshControl, StyleSheet, View } from 'react-native';

import { EmptyState } from '@/components/feedback';
import { AppListCard, AppText } from '@/components/ui';
import { useAppTheme } from '@/hooks/use-app-theme';
import { formatDateKey } from '@/lib/local-date';
import { radii, sizing, spacing } from '@/theme';

import { getMoodOption } from '../mood-options';
import type { MoodLog, MoodValue } from '../mood-types';

export function MoodHistoryList({ data, header, onRefresh, refreshing }: { data: MoodLog[]; header: ReactElement; onRefresh: () => void; refreshing: boolean }) {
  const { colors } = useAppTheme();
  return (
    <FlatList
      contentContainerStyle={styles.content}
      data={data}
      keyExtractor={(item) => item.id}
      ListEmptyComponent={<EmptyState description="Record your first daily mood to begin seeing patterns." title="No mood history" />}
      ListHeaderComponent={header}
      refreshControl={<RefreshControl accessibilityLabel="Refresh mood history" colors={[colors.primary]} onRefresh={onRefresh} refreshing={refreshing} tintColor={colors.primary} />}
      renderItem={({ item }) => {
        const option = getMoodOption(item.mood as MoodValue);
        const Icon = option.icon;
        return (
          <AppListCard accentColor={option.color} style={styles.card}>
            <View style={[styles.icon, { backgroundColor: colors.surfaceSecondary }]}><Icon color={option.color} size={sizing.icon} /></View>
            <View style={styles.copy}>
              <AppText variant="bodyLarge">{option.label}</AppText>
              <AppText tone="muted" variant="caption">{formatDateKey(item.mood_date, { day: 'numeric', month: 'long', weekday: 'short', year: 'numeric' })}</AppText>
              {item.note ? <AppText numberOfLines={2} tone="secondary" variant="bodySmall">{item.note}</AppText> : null}
            </View>
          </AppListCard>
        );
      }}
      showsVerticalScrollIndicator={false}
    />
  );
}

const styles = StyleSheet.create({
  card: { alignItems: 'center', flexDirection: 'row', gap: spacing.sm },
  content: { gap: spacing.sm, paddingBottom: spacing.giant },
  copy: { flex: 1, gap: spacing.xxs },
  icon: { alignItems: 'center', borderRadius: radii.medium, height: sizing.touchTarget, justifyContent: 'center', width: sizing.touchTarget },
});
