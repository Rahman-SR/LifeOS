import { Repeat2 } from 'lucide-react-native';
import { EmptyState } from '@/components/feedback';
import type { HabitFilter } from '../habit-types';
export function HabitEmptyState({ filter, onCreate }: { filter: HabitFilter; onCreate: () => void }) { const archived = filter === 'archived'; return <EmptyState actionLabel={archived ? undefined : 'Create habit'} description={archived ? 'Archived habits will stay here with their history.' : filter === 'today' ? 'No active habits are scheduled for today.' : 'Create a habit you want to repeat consistently.'} icon={Repeat2} onAction={archived ? undefined : onCreate} title={archived ? 'No archived habits' : 'No habits yet'} />; }
