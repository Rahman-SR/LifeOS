import { CalendarCheck2, CalendarClock, CircleCheckBig, ListTodo } from 'lucide-react-native';

import { EmptyState } from '@/components/feedback';

import type { TaskFilter } from '../task-types';

const copy = {
  completed: {
    description: 'Completed tasks will appear here when you finish them.',
    icon: CircleCheckBig,
    title: 'No completed tasks yet',
  },
  overdue: {
    description: 'Nothing needs catching up. Your overdue list is clear.',
    icon: CalendarClock,
    title: 'No overdue tasks',
  },
  today: {
    description: "You're all clear. Add a task when you're ready.",
    icon: CalendarCheck2,
    title: 'No tasks for today',
  },
  upcoming: {
    description: 'Future tasks will appear here when you schedule them.',
    icon: ListTodo,
    title: 'No upcoming tasks',
  },
} as const;

type TaskEmptyStateProps = {
  filter: TaskFilter;
  onCreate: () => void;
};

export function TaskEmptyState({ filter, onCreate }: TaskEmptyStateProps) {
  const state = copy[filter];
  return (
    <EmptyState
      actionLabel="Add task"
      description={state.description}
      icon={state.icon}
      onAction={onCreate}
      title={state.title}
    />
  );
}
