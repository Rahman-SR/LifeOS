import DateTimePicker, { type DateTimePickerEvent } from '@react-native-community/datetimepicker';
import { CalendarDays } from 'lucide-react-native';
import { useState } from 'react';
import { Platform, Pressable, StyleSheet, View } from 'react-native';

import { AppText, Button } from '@/components/ui';
import { useAppTheme } from '@/hooks/use-app-theme';
import { radii, sizing, spacing } from '@/theme';

import { formatDateKey, parseLocalDate, toDateKey } from '../task-date-utils';

type DatePickerFieldProps = {
  error?: string;
  label: string;
  onChange: (value: string) => void;
  value: string;
};

export function DatePickerField({ error, label, onChange, value }: DatePickerFieldProps) {
  const { colors } = useAppTheme();
  const [showPicker, setShowPicker] = useState(false);
  const pickerValue = parseLocalDate(value) ?? new Date();

  const handleChange = (event: DateTimePickerEvent, date?: Date) => {
    if (Platform.OS === 'android') setShowPicker(false);
    if (event.type === 'dismissed' || !date) return;
    onChange(toDateKey(date));
  };

  return (
    <View style={styles.field}>
      <AppText variant="bodySmall">{label}</AppText>
      <View style={styles.row}>
        <Pressable
          accessibilityLabel={`${label}: ${value ? formatDateKey(value) : 'not set'}`}
          accessibilityRole="button"
          onPress={() => setShowPicker(true)}
          style={({ pressed }) => [
            styles.control,
            {
              backgroundColor: colors.surface,
              borderColor: error ? colors.danger : colors.border,
              opacity: pressed ? 0.75 : 1,
            },
          ]}
        >
          <CalendarDays color={colors.textMuted} size={sizing.icon} />
          <AppText tone={value ? 'primary' : 'muted'}>{value ? formatDateKey(value) : 'Choose date'}</AppText>
        </Pressable>
        {value ? <Button fullWidth={false} label="Clear" onPress={() => onChange('')} variant="secondary" /> : null}
      </View>
      {showPicker ? (
        <View style={styles.picker}>
          <DateTimePicker mode="date" onChange={handleChange} value={pickerValue} />
          {Platform.OS === 'ios' ? (
            <Button fullWidth={false} label="Done" onPress={() => setShowPicker(false)} variant="secondary" />
          ) : null}
        </View>
      ) : null}
      {error ? (
        <AppText accessibilityRole="alert" tone="danger" variant="bodySmall">
          {error}
        </AppText>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  control: {
    alignItems: 'center',
    borderRadius: radii.medium,
    borderWidth: sizing.border,
    flex: 1,
    flexDirection: 'row',
    gap: spacing.xs,
    minHeight: sizing.controlHeight,
    paddingHorizontal: spacing.sm,
  },
  field: {
    gap: spacing.xs,
  },
  picker: {
    alignItems: 'flex-end',
    gap: spacing.xs,
  },
  row: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: spacing.xs,
  },
});
