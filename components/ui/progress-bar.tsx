import { StyleSheet, View } from 'react-native';

import { useAppTheme } from '@/hooks/use-app-theme';
import { radii, sizing } from '@/theme';

type ProgressBarProps = {
  accessibilityLabel?: string;
  progress: number;
};

export function ProgressBar({ accessibilityLabel = 'Progress', progress }: ProgressBarProps) {
  const { colors } = useAppTheme();
  const normalizedProgress = Math.min(1, Math.max(0, progress));

  return (
    <View
      accessibilityLabel={accessibilityLabel}
      accessibilityRole="progressbar"
      accessibilityValue={{ max: 100, min: 0, now: Math.round(normalizedProgress * 100) }}
      style={[styles.track, { backgroundColor: colors.surfaceSecondary }]}
    >
      <View
        style={[
          styles.fill,
          { backgroundColor: colors.primary, width: `${normalizedProgress * 100}%` },
        ]}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  fill: {
    borderRadius: radii.pill,
    height: '100%',
  },
  track: {
    borderRadius: radii.pill,
    height: sizing.progressBar,
    overflow: 'hidden',
    width: '100%',
  },
});
