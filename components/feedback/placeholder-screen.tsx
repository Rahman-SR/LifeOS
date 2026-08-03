import type { LucideIcon } from 'lucide-react-native';

import { EmptyState } from './empty-state';
import { Screen } from '../ui';

type PlaceholderScreenProps = {
  description: string;
  icon: LucideIcon;
  title: string;
};

export function PlaceholderScreen({ description, icon, title }: PlaceholderScreenProps) {
  return (
    <Screen contentContainerStyle={{ justifyContent: 'center' }} scroll={false}>
      <EmptyState description={description} icon={icon} title={title} />
    </Screen>
  );
}
