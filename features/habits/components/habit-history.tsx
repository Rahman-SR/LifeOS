import { Check, Minus } from 'lucide-react-native';
import { ScrollView, StyleSheet, View } from 'react-native';
import { AppText } from '@/components/ui';
import { useAppTheme } from '@/hooks/use-app-theme';
import { addLocalDays, getHabitDateKey } from '../habit-date-utils';
import type { HabitLog } from '../habit-types';
import { radii, sizing, spacing } from '@/theme';
export function HabitHistory({ logs, targetCount }: { logs: HabitLog[]; targetCount: number }) { const { colors } = useAppTheme(); const byDate = new Map(logs.map((log) => [log.log_date, log.completed_count])); const days = Array.from({ length: 14 }, (_, index) => addLocalDays(new Date(), index - 13)); return <ScrollView horizontal showsHorizontalScrollIndicator={false}><View style={styles.row}>{days.map((date) => { const key = getHabitDateKey(date); const done = (byDate.get(key) ?? 0) >= targetCount; return <View key={key} style={styles.day}><AppText tone="secondary" variant="caption">{new Intl.DateTimeFormat(undefined, { weekday: 'narrow' }).format(date)}</AppText><View style={[styles.dot, { backgroundColor: done ? colors.success : colors.surfaceSecondary, borderColor: done ? colors.success : colors.border }]}>{done ? <Check color={colors.onPrimary} size={sizing.iconSmall} /> : <Minus color={colors.textMuted} size={sizing.iconSmall} />}</View><AppText variant="caption">{date.getDate()}</AppText></View>; })}</View></ScrollView>; }
const styles = StyleSheet.create({ day: { alignItems: 'center', gap: spacing.xxs }, dot: { alignItems: 'center', borderRadius: radii.pill, borderWidth: sizing.border, height: sizing.touchTarget, justifyContent: 'center', width: sizing.touchTarget }, row: { flexDirection: 'row', gap: spacing.xs } });
