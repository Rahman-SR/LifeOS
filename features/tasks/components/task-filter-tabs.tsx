import { ScrollView, Pressable, StyleSheet } from 'react-native';

import { AppText } from '@/components/ui';
import { useAppTheme } from '@/hooks/use-app-theme';
import { radii, sizing, spacing } from '@/theme';

import type { TaskFilter } from '../task-types';

const filters: Array<{ label: string; value: TaskFilter }> = [
  { label: 'Today', value: 'today' },
  { label: 'Upcoming', value: 'upcoming' },
  { label: 'Overdue', value: 'overdue' },
  { label: 'Completed', value: 'completed' },
];

type TaskFilterTabsProps = {
  onChange: (filter: TaskFilter) => void;
  value: TaskFilter;
};

export function TaskFilterTabs({ onChange, value }: TaskFilterTabsProps) {
  const { colors } = useAppTheme();

  return (
    <ScrollView
      accessibilityRole="tablist"
      contentContainerStyle={styles.content}
      horizontal
      showsHorizontalScrollIndicator={false}
    >
      {filters.map((filter) => {
        const selected = filter.value === value;
        return (
          <Pressable
            accessibilityRole="tab"
            accessibilityState={{ selected }}
            key={filter.value}
            onPress={() => onChange(filter.value)}
            style={({ pressed }) => [
              styles.tab,
              {
                backgroundColor: selected ? colors.primary : colors.surface,
                borderColor: selected ? colors.primary : colors.border,
                opacity: pressed ? 0.75 : 1,
              },
            ]}
          >
            <AppText tone={selected ? 'inverse' : 'secondary'} variant="button">
              {filter.label}
            </AppText>
          </Pressable>
        );
      })}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  content: {
    gap: spacing.xs,
  },
  tab: {
    alignItems: 'center',
    borderRadius: radii.pill,
    borderWidth: sizing.border,
    justifyContent: 'center',
    minHeight: sizing.touchTarget,
    paddingHorizontal: spacing.md,
  },
});
