import { ScrollView, StyleSheet } from 'react-native';

import { moodOptions } from '../mood-options';
import type { MoodValue } from '../mood-types';
import { MoodOption } from './mood-option';
import { spacing } from '@/theme';

export function MoodSelector({ disabled, onChange, value }: { disabled?: boolean; onChange: (value: MoodValue) => void; value?: MoodValue }) {
  return (
    <ScrollView accessibilityRole="radiogroup" contentContainerStyle={styles.content} horizontal showsHorizontalScrollIndicator={false}>
      {moodOptions.map((option) => <MoodOption disabled={disabled} key={option.value} onPress={() => onChange(option.value)} option={option} selected={value === option.value} />)}
    </ScrollView>
  );
}

const styles = StyleSheet.create({ content: { gap: spacing.xs, paddingRight: spacing.lg } });
