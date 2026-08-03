import { NotebookPen } from 'lucide-react-native';

import { PlaceholderScreen } from '@/components/feedback';

export default function NotesScreen() {
  return (
    <PlaceholderScreen
      description="Note creation, search, pinning, and archiving will arrive in their own feature."
      icon={NotebookPen}
      title="A place for your thoughts"
    />
  );
}
