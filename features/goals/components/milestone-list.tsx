import { View } from 'react-native';
import { MilestoneItem } from './milestone-item';
import type { GoalMilestone } from '../goal-types';

export function MilestoneList({ disabled, milestones, onDelete, onEdit, onMove, onToggle }: { disabled?: boolean; milestones: GoalMilestone[]; onDelete: (item: GoalMilestone) => void; onEdit: (item: GoalMilestone) => void; onMove: (index: number, direction: -1 | 1) => void; onToggle: (item: GoalMilestone) => void }) {
  return <View>{milestones.map((item, index) => <MilestoneItem canMoveDown={index < milestones.length - 1} canMoveUp={index > 0} disabled={disabled} key={item.id} milestone={item} onDelete={() => onDelete(item)} onEdit={() => onEdit(item)} onMoveDown={() => onMove(index, 1)} onMoveUp={() => onMove(index, -1)} onToggle={() => onToggle(item)} />)}</View>;
}
