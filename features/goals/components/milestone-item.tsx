import { Check, ChevronDown, ChevronUp, Pencil, Trash2 } from 'lucide-react-native';
import { Pressable, StyleSheet, View } from 'react-native';
import { AppText, IconButton } from '@/components/ui';
import { useAppTheme } from '@/hooks/use-app-theme';
import { radii, sizing, spacing } from '@/theme';
import type { GoalMilestone } from '../goal-types';

export function MilestoneItem({ canMoveDown, canMoveUp, disabled, milestone, onDelete, onEdit, onMoveDown, onMoveUp, onToggle }: { canMoveDown: boolean; canMoveUp: boolean; disabled?: boolean; milestone: GoalMilestone; onDelete: () => void; onEdit: () => void; onMoveDown: () => void; onMoveUp: () => void; onToggle: () => void }) {
  const { colors } = useAppTheme();
  return <View style={[styles.item, { borderColor: colors.border }]}><Pressable accessibilityLabel={`${milestone.is_completed ? 'Mark incomplete' : 'Mark complete'}: ${milestone.title}`} accessibilityRole="checkbox" accessibilityState={{ checked: milestone.is_completed, disabled }} disabled={disabled} onPress={onToggle} style={[styles.check, { backgroundColor: milestone.is_completed ? colors.success : colors.surface, borderColor: milestone.is_completed ? colors.success : colors.border }]}>{milestone.is_completed ? <Check color={colors.onPrimary} size={sizing.iconSmall} /> : null}</Pressable><AppText style={[styles.title, milestone.is_completed && styles.done]}>{milestone.title}</AppText><IconButton disabled={!canMoveUp || disabled} icon={ChevronUp} label={`Move ${milestone.title} up`} onPress={onMoveUp} /><IconButton disabled={!canMoveDown || disabled} icon={ChevronDown} label={`Move ${milestone.title} down`} onPress={onMoveDown} /><IconButton disabled={disabled} icon={Pencil} label={`Edit ${milestone.title}`} onPress={onEdit} /><IconButton disabled={disabled} icon={Trash2} label={`Delete ${milestone.title}`} onPress={onDelete} /></View>;
}
const styles = StyleSheet.create({ check: { alignItems: 'center', borderRadius: radii.small, borderWidth: sizing.border, height: sizing.touchTarget, justifyContent: 'center', width: sizing.touchTarget }, done: { opacity: 0.65, textDecorationLine: 'line-through' }, item: { alignItems: 'center', borderBottomWidth: sizing.border, flexDirection: 'row', gap: spacing.xxs, minHeight: sizing.touchTarget, paddingVertical: spacing.xs }, title: { flex: 1 } });
