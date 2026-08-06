import { useEffect, useRef } from 'react';
import { ScrollView, StyleSheet, type LayoutChangeEvent } from 'react-native';

import { sizing, spacing } from '@/theme';

import { FilterChip } from './filter-chip';

export type FilterOption<Value extends string> = { label: string; value: Value };

type ChipLayout = { width: number; x: number };

export function FilterChipRow<Value extends string>({
  onChange,
  options,
  value,
}: {
  onChange: (value: Value) => void;
  options: readonly FilterOption<Value>[];
  value: Value;
}) {
  const scrollRef = useRef<ScrollView>(null);
  const layouts = useRef(new Map<Value, ChipLayout>());

  useEffect(() => {
    const selectedLayout = layouts.current.get(value);
    if (!selectedLayout) return;
    scrollRef.current?.scrollTo({ animated: true, x: Math.max(0, selectedLayout.x - spacing.lg) });
  }, [value]);

  const captureLayout = (itemValue: Value) => (event: LayoutChangeEvent) => {
    layouts.current.set(itemValue, event.nativeEvent.layout);
  };

  return (
    <ScrollView
      accessibilityRole="tablist"
      contentContainerStyle={styles.content}
      horizontal
      keyboardShouldPersistTaps="handled"
      ref={scrollRef}
      showsHorizontalScrollIndicator={false}
      style={styles.scroll}
    >
      {options.map((option) => (
        <FilterChip
          key={option.value}
          label={option.label}
          onLayout={captureLayout(option.value)}
          onPress={() => onChange(option.value)}
          selected={option.value === value}
        />
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  content: { alignItems: 'center', gap: spacing.xs, paddingRight: spacing.xs },
  scroll: {
    flexGrow: 0,
    flexShrink: 0,
    height: sizing.filterChipHeight,
    maxHeight: sizing.filterChipHeight,
  },
});
