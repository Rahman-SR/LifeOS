import { Pressable, StyleSheet, View } from 'react-native';
import { AppListCard, AppText } from '@/components/ui';
import { spacing } from '@/theme';
import { GoalDateLabel } from './goal-date-label';
import { GoalProgressBar } from './goal-progress-bar';
import { GoalStatusBadge } from './goal-status-badge';
import type { GoalWithMilestones } from '../goal-types';

export function GoalCard({ goal, onPress, todayDate }: { goal: GoalWithMilestones; onPress: (id: string) => void; todayDate: string }) {
  return <Pressable accessibilityLabel={`Open goal ${goal.title}`} accessibilityRole="button" onPress={() => onPress(goal.id)}><AppListCard><View style={styles.row}><AppText style={styles.title} variant="title">{goal.title}</AppText><GoalStatusBadge status={goal.status} /></View><GoalDateLabel status={goal.status} targetDate={goal.target_date} todayDate={todayDate} /><GoalProgressBar progress={goal.progress} /><AppText tone="secondary" variant="caption">{goal.goal_milestones.filter((item) => item.is_completed).length} of {goal.goal_milestones.length} milestones complete</AppText></AppListCard></Pressable>;
}
const styles = StyleSheet.create({ row: { alignItems: 'center', flexDirection: 'row', gap: spacing.sm }, title: { flex: 1 } });
