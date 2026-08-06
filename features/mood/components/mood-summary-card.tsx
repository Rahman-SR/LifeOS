import { StyleSheet, View } from 'react-native';

import { AppText, Card } from '@/components/ui';
import { spacing } from '@/theme';

import { MoodDistributionChart } from './mood-distribution-chart';
import type { MoodCounts } from '../mood-types';

export function MoodSummaryCard({ average, counts, label, total }: { average: number; counts: MoodCounts; label: string; total: number }) {
  return (
    <Card style={styles.card}>
      <View style={styles.header}>
        <View style={styles.copy}>
          <AppText variant="title">{label}</AppText>
          <AppText tone="secondary" variant="bodySmall">{total ? `${total} check-in${total === 1 ? '' : 's'}` : 'No check-ins yet'}</AppText>
        </View>
        <View>
          <AppText align="right" variant="heading3">{average ? average.toFixed(1) : '—'}</AppText>
          <AppText tone="muted" variant="caption">average / 5</AppText>
        </View>
      </View>
      <MoodDistributionChart counts={counts} title={`${label} distribution`} />
    </Card>
  );
}

const styles = StyleSheet.create({ card: { gap: spacing.lg }, copy: { flex: 1, gap: spacing.xxs }, header: { flexDirection: 'row', gap: spacing.md, justifyContent: 'space-between' } });
