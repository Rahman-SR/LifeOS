import { Pressable, StyleSheet, View } from 'react-native';
import { useAppTheme } from '@/hooks/use-app-theme';
import { radii, sizing, spacing } from '@/theme';
import { habitIcons, type HabitIconName } from '../habit-options';
import { habitIconMap } from './habit-icon';
export function HabitIconSelector({ onChange, value }: { onChange: (value: HabitIconName) => void; value: HabitIconName }) { const { colors } = useAppTheme(); return <View accessibilityRole="radiogroup" style={styles.row}>{habitIcons.map((name) => { const Icon = habitIconMap[name]; const selected = name === value; return <Pressable accessibilityLabel={`Habit icon ${name}`} accessibilityRole="radio" accessibilityState={{ checked: selected }} key={name} onPress={() => onChange(name)} style={[styles.icon, { backgroundColor: selected ? colors.primary : colors.surface, borderColor: selected ? colors.primary : colors.border }]}><Icon color={selected ? colors.onPrimary : colors.textSecondary} size={sizing.icon} /></Pressable>; })}</View>; }
const styles = StyleSheet.create({ icon: { alignItems: 'center', borderRadius: radii.medium, borderWidth: sizing.border, height: sizing.touchTarget, justifyContent: 'center', width: sizing.touchTarget }, row: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.xs } });
