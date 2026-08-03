import { router } from 'expo-router';
import { MapPinOff } from 'lucide-react-native';

import { EmptyState } from '@/components';
import { Screen } from '@/components/ui';

export default function NotFoundScreen() {
  return (
    <Screen contentContainerStyle={{ justifyContent: 'center' }} scroll={false}>
      <EmptyState
        actionLabel="Return to Today"
        description="The screen you requested does not exist."
        icon={MapPinOff}
        onAction={() => router.replace('/')}
        title="Screen not found"
      />
    </Screen>
  );
}
