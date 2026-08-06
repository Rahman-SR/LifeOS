import { StyleSheet, View } from 'react-native';
import { spacing } from '@/theme';
import { GoalCard } from './goal-card';
import type { GoalWithMilestones } from '../goal-types';
export function GoalList({ goals, onPress, todayDate }: { goals: GoalWithMilestones[]; onPress: (id: string) => void; todayDate: string }) { return <View style={styles.list}>{goals.map((goal) => <GoalCard goal={goal} key={goal.id} onPress={onPress} todayDate={todayDate} />)}</View>; }
const styles = StyleSheet.create({ list: { gap: spacing.sm } });
