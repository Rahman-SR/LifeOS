import { zodResolver } from '@hookform/resolvers/zod';
import { useNavigation } from 'expo-router';
import { useEffect, useRef, useState } from 'react';
import { Alert, KeyboardAvoidingView, Platform, Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { Controller, useForm } from 'react-hook-form';

import { AppText, Button, TextField } from '@/components/ui';
import { useAppTheme } from '@/hooks/use-app-theme';
import { radii, sizing, spacing } from '@/theme';

import { habitColorOptions, type HabitColorToken, type HabitIconName } from '../habit-options';
import { habitFormSchema, toHabitMutationValues, type HabitFormValues } from '../habit-schema';
import type { HabitMutationValues } from '../habit-types';
import { HabitFrequencySelector } from './habit-frequency-selector';
import { HabitIconSelector } from './habit-icon-selector';
import { HabitReminderField } from './habit-reminder-field';
import { WeekdaySelector } from './weekday-selector';

export const defaultHabitFormValues: HabitFormValues = { colorToken: 'primary', description: '', frequencyType: 'daily', icon: 'heart-pulse', name: '', reminderEnabled: false, reminderTime: '', targetCount: '1', weekdays: [] };

type Props = { initialValues?: HabitFormValues; onCancel: () => void; onSubmit: (values: HabitMutationValues) => Promise<void>; submitLabel: string };
export function HabitForm({ initialValues = defaultHabitFormValues, onCancel, onSubmit, submitLabel }: Props) {
  const { colors } = useAppTheme();
  const navigation = useNavigation();
  const allowLeave = useRef(false);
  const submitLock = useRef(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const { control, formState: { errors, isDirty, isSubmitting }, handleSubmit, reset, watch } = useForm<HabitFormValues>({ defaultValues: initialValues, mode: 'onBlur', resolver: zodResolver(habitFormSchema) });
  const frequency = watch('frequencyType');

  useEffect(() => navigation.addListener('beforeRemove', (event) => {
    if (!isDirty || allowLeave.current) return;
    event.preventDefault();
    Alert.alert('Discard unsaved changes?', 'Your habit changes have not been saved.', [
      { style: 'cancel', text: 'Keep editing' },
      { onPress: () => { allowLeave.current = true; navigation.dispatch(event.data.action); }, style: 'destructive', text: 'Discard' },
    ]);
  }), [isDirty, navigation]);

  const submit = async (values: HabitFormValues) => {
    if (submitLock.current) return;
    submitLock.current = true;
    setSubmitError(null);
    try { await onSubmit(toHabitMutationValues(values)); allowLeave.current = true; reset(values); }
    catch (error) { allowLeave.current = false; setSubmitError(error instanceof Error ? error.message : 'Habit could not be saved.'); }
    finally { submitLock.current = false; }
  };
  const cancel = () => { if (!isDirty) { allowLeave.current = true; onCancel(); return; } Alert.alert('Discard unsaved changes?', 'Your habit changes have not been saved.', [{ style: 'cancel', text: 'Keep editing' }, { onPress: () => { allowLeave.current = true; onCancel(); }, style: 'destructive', text: 'Discard' }]); };

  return <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={styles.flex}><ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false}>
    <Controller control={control} name="name" render={({ field: { onBlur, onChange, value } }) => <TextField autoFocus error={errors.name?.message} label="Habit name" onBlur={onBlur} onChangeText={onChange} placeholder="What do you want to repeat?" value={value} />} />
    <Controller control={control} name="description" render={({ field: { onBlur, onChange, value } }) => <TextField error={errors.description?.message} label="Description (optional)" multiline numberOfLines={3} onBlur={onBlur} onChangeText={onChange} placeholder="Why does this habit matter?" textAlignVertical="top" value={value} />} />
    <View style={styles.group}><AppText variant="title">Icon</AppText><Controller control={control} name="icon" render={({ field: { onChange, value } }) => <HabitIconSelector onChange={onChange} value={value as HabitIconName} />} /></View>
    <View style={styles.group}><AppText variant="title">Color</AppText><Controller control={control} name="colorToken" render={({ field: { onChange, value } }) => <View accessibilityRole="radiogroup" style={styles.colors}>{habitColorOptions.map((item) => { const selected = item.token === value; return <Pressable accessibilityLabel={item.label} accessibilityRole="radio" accessibilityState={{ checked: selected }} key={item.token} onPress={() => onChange(item.token as HabitColorToken)} style={[styles.color, { backgroundColor: item.color, borderColor: selected ? colors.textPrimary : colors.border }, selected && styles.colorSelected]} />; })}</View>} /></View>
    <View style={styles.group}><AppText variant="title">Frequency</AppText><Controller control={control} name="frequencyType" render={({ field: { onChange, value } }) => <HabitFrequencySelector onChange={onChange} value={value} />} />{frequency === 'weekly' ? <Controller control={control} name="weekdays" render={({ field: { onChange, value } }) => <WeekdaySelector error={errors.weekdays?.message} onChange={onChange} value={value} />} /> : null}</View>
    <Controller control={control} name="targetCount" render={({ field: { onBlur, onChange, value } }) => <TextField error={errors.targetCount?.message} keyboardType="number-pad" label="Target count" onBlur={onBlur} onChangeText={onChange} placeholder="1" value={value} />} />
    <Controller control={control} name="reminderEnabled" render={({ field: enabledField }) => <Controller control={control} name="reminderTime" render={({ field: timeField }) => <HabitReminderField enabled={enabledField.value} error={errors.reminderTime?.message} onEnabledChange={enabledField.onChange} onTimeChange={timeField.onChange} time={timeField.value} />} />} />
    {submitError ? <AppText accessibilityLiveRegion="polite" accessibilityRole="alert" tone="danger">{submitError}</AppText> : null}
    <View style={styles.actions}><Button label={submitLabel} loading={isSubmitting} onPress={() => void handleSubmit(submit)()} /><Button disabled={isSubmitting} label="Cancel" onPress={cancel} variant="secondary" /></View>
  </ScrollView></KeyboardAvoidingView>;
}

const styles = StyleSheet.create({ actions: { gap: spacing.sm }, color: { borderRadius: radii.pill, borderWidth: sizing.border, height: sizing.touchTarget, width: sizing.touchTarget }, colorSelected: { borderWidth: spacing.xxs }, colors: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.xs }, content: { gap: spacing.lg, paddingBottom: spacing.giant }, flex: { flex: 1 }, group: { gap: spacing.xs } });
