import { CalendarDays } from 'lucide-react-native';
import { StyleSheet, View } from 'react-native';
import { AppText } from '@/components/ui';
import { useAppTheme } from '@/hooks/use-app-theme';
import { formatDateKey } from '@/lib/local-date';
import { sizing, spacing } from '@/theme';
import { isGoalOverdue } from '../goal-date-utils';

export function GoalDateLabel({ status, targetDate, todayDate }: { status: string; targetDate: string | null; todayDate: string }) {
  const { colors } = useAppTheme();
  if (!targetDate) return <AppText tone="muted" variant="caption">No target date</AppText>;
  const overdue = isGoalOverdue({ status, target_date: targetDate }, todayDate);
  return <View style={styles.row}><CalendarDays color={overdue ? colors.danger : colors.textMuted} size={sizing.iconSmall} /><AppText tone={overdue ? 'danger' : 'muted'} variant="caption">{overdue ? 'Overdue · ' : ''}{formatDateKey(targetDate, { day: 'numeric', month: 'short', year: 'numeric' })}</AppText></View>;
}
const styles = StyleSheet.create({ row: { alignItems: 'center', flexDirection: 'row', gap: spacing.xxs } });
