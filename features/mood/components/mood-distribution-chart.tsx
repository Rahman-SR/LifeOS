import { memo } from 'react';
import { StyleSheet, View } from 'react-native';

import { AppText } from '@/components/ui';
import { useAppTheme } from '@/hooks/use-app-theme';
import { radii, sizing, spacing } from '@/theme';

import { moodOptions } from '../mood-options';
import type { MoodCounts } from '../mood-types';

function MoodDistributionChartComponent({ counts, title }: { counts: MoodCounts; title: string }) {
  const { colors } = useAppTheme();
  const maximum = Math.max(1, ...Object.values(counts));
  const summary = moodOptions.map((option) => `${option.label}: ${counts[option.value]}`).join(', ');
  return (
    <View accessibilityLabel={`${title}. ${summary}`} style={styles.chart}>
      <AppText variant="title">{title}</AppText>
      {moodOptions.map((option) => {
        const count = counts[option.value];
        return (
          <View key={option.value} style={styles.row}>
            <AppText style={styles.label} variant="bodySmall">{option.label}</AppText>
            <View style={[styles.track, { backgroundColor: colors.surfaceSecondary }]}>
              <View style={[styles.bar, { backgroundColor: option.color, width: `${(count / maximum) * 100}%` }]} />
            </View>
            <AppText align="right" style={styles.count} variant="caption">{count}</AppText>
          </View>
        );
      })}
    </View>
  );
}

export const MoodDistributionChart = memo(MoodDistributionChartComponent);

const styles = StyleSheet.create({
  bar: { borderRadius: radii.pill, height: sizing.progressBar },
  chart: { gap: spacing.sm },
  count: { width: spacing.xl },
  label: { width: spacing.giant },
  row: { alignItems: 'center', flexDirection: 'row', gap: spacing.xs },
  track: { borderRadius: radii.pill, flex: 1, height: sizing.progressBar, overflow: 'hidden' },
});
