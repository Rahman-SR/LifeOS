import { CalendarClock } from 'lucide-react-native';
import { StyleSheet, View } from 'react-native';

import { AppText } from '@/components/ui';
import { useAppTheme } from '@/hooks/use-app-theme';
import { sizing, spacing } from '@/theme';

import { formatDateKey, formatTimeKey, getLocalDateKey, parseLocalDate } from '../task-date-utils';

type DueDateLabelProps = {
  dueDate: string | null;
  dueTime: string | null;
  isCompleted?: boolean;
};

export function DueDateLabel({ dueDate, dueTime, isCompleted = false }: DueDateLabelProps) {
  const { colors } = useAppTheme();
  if (!dueDate) return null;

  const todayKey = getLocalDateKey();
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const tomorrowKey = getLocalDateKey(tomorrow);
  const dueDateValue = parseLocalDate(dueDate);
  const isOverdue = !isCompleted && Boolean(dueDateValue && dueDate < todayKey);
  const dateLabel = dueDate === todayKey ? 'Today' : dueDate === tomorrowKey ? 'Tomorrow' : formatDateKey(dueDate);
  const label = dueTime ? `${dateLabel}, ${formatTimeKey(dueTime)}` : dateLabel;
  const color = isOverdue ? colors.danger : colors.textSecondary;

  return (
    <View accessibilityLabel={`Due ${label}${isOverdue ? ', overdue' : ''}`} style={styles.row}>
      <CalendarClock color={color} size={sizing.iconSmall} />
      <AppText style={{ color }} variant="caption">
        {isOverdue ? `Overdue · ${label}` : label}
      </AppText>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: spacing.xxs,
  },
});
