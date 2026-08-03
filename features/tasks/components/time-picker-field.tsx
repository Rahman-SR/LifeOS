import DateTimePicker, { type DateTimePickerEvent } from '@react-native-community/datetimepicker';
import { Clock3 } from 'lucide-react-native';
import { useState } from 'react';
import { Platform, Pressable, StyleSheet, View } from 'react-native';

import { AppText, Button } from '@/components/ui';
import { useAppTheme } from '@/hooks/use-app-theme';
import { radii, sizing, spacing } from '@/theme';

import { formatTimeKey, parseLocalDateTime, toTimeKey } from '../task-date-utils';

type TimePickerFieldProps = {
  disabled?: boolean;
  error?: string;
  label: string;
  onChange: (value: string) => void;
  value: string;
};

export function TimePickerField({ disabled = false, error, label, onChange, value }: TimePickerFieldProps) {
  const { colors } = useAppTheme();
  const [showPicker, setShowPicker] = useState(false);
  const pickerValue = value ? (parseLocalDateTime('2000-01-01', value) ?? new Date()) : new Date();

  const handleChange = (event: DateTimePickerEvent, date?: Date) => {
    if (Platform.OS === 'android') setShowPicker(false);
    if (event.type === 'dismissed' || !date) return;
    onChange(toTimeKey(date));
  };

  return (
    <View style={styles.field}>
      <AppText variant="bodySmall">{label}</AppText>
      <View style={styles.row}>
        <Pressable
          accessibilityLabel={`${label}: ${value ? formatTimeKey(value) : 'not set'}`}
          accessibilityRole="button"
          accessibilityState={{ disabled }}
          disabled={disabled}
          onPress={() => setShowPicker(true)}
          style={({ pressed }) => [
            styles.control,
            {
              backgroundColor: colors.surface,
              borderColor: error ? colors.danger : colors.border,
              opacity: disabled ? 0.5 : pressed ? 0.75 : 1,
            },
          ]}
        >
          <Clock3 color={colors.textMuted} size={sizing.icon} />
          <AppText tone={value ? 'primary' : 'muted'}>{value ? formatTimeKey(value) : 'Choose time'}</AppText>
        </Pressable>
        {value ? <Button fullWidth={false} label="Clear" onPress={() => onChange('')} variant="secondary" /> : null}
      </View>
      {showPicker ? (
        <View style={styles.picker}>
          <DateTimePicker mode="time" onChange={handleChange} value={pickerValue} />
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
