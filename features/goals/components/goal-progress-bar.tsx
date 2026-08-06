import { StyleSheet, View } from 'react-native';
import { AppText, ProgressBar } from '@/components/ui';
import { spacing } from '@/theme';

export function GoalProgressBar({ progress }: { progress: number }) {
  return <View style={styles.wrap}><View style={styles.row}><AppText tone="secondary" variant="bodySmall">Progress</AppText><AppText variant="bodySmall">{progress}%</AppText></View><ProgressBar accessibilityLabel={`Goal progress ${progress}%`} progress={progress / 100} /></View>;
}
const styles = StyleSheet.create({ row: { flexDirection: 'row', justifyContent: 'space-between' }, wrap: { gap: spacing.xs } });
