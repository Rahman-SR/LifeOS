import { Pressable, StyleSheet, View } from 'react-native';
import { AppText } from '@/components/ui';
import { useAppTheme } from '@/hooks/use-app-theme';
import { radii, sizing, spacing } from '@/theme';
import type { HabitFrequency } from '../habit-types';
export function HabitFrequencySelector({ onChange, value }: { onChange: (value: HabitFrequency) => void; value: HabitFrequency }) { const { colors } = useAppTheme(); return <View accessibilityRole="radiogroup" style={styles.row}>{([{ label: 'Daily', value: 'daily' }, { label: 'Selected weekdays', value: 'weekly' }] as const).map((item) => { const selected = item.value === value; return <Pressable accessibilityRole="radio" accessibilityState={{ checked: selected }} key={item.value} onPress={() => onChange(item.value)} style={[styles.option, { backgroundColor: selected ? colors.primary : colors.surface, borderColor: selected ? colors.primary : colors.border }]}><AppText tone={selected ? 'inverse' : 'secondary'} variant="button">{item.label}</AppText></Pressable>; })}</View>; }
const styles = StyleSheet.create({ option: { alignItems: 'center', borderRadius: radii.medium, borderWidth: sizing.border, flex: 1, justifyContent: 'center', minHeight: sizing.controlHeight, paddingHorizontal: spacing.sm }, row: { flexDirection: 'row', gap: spacing.xs } });
