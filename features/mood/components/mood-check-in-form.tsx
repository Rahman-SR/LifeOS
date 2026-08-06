import * as Haptics from 'expo-haptics';
import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect, useRef, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { StyleSheet, View } from 'react-native';

import { AppText, Button, TextField } from '@/components/ui';
import { spacing } from '@/theme';

import { moodFormSchema, toMoodMutationValues, type MoodFormValues } from '../mood-schema';
import type { MoodLog, MoodMutationValues } from '../mood-types';
import { MoodSelector } from './mood-selector';

export function MoodCheckInForm({ date, initialMood, onSaved, onSubmit }: { date: string; initialMood: MoodLog | null; onSaved: (mood: MoodLog) => void; onSubmit: (values: MoodMutationValues) => Promise<MoodLog> }) {
  const lock = useRef(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const { control, formState: { errors, isSubmitting }, handleSubmit, reset } = useForm<MoodFormValues>({
    defaultValues: { mood: (initialMood?.mood as MoodFormValues['mood']) ?? undefined, note: initialMood?.note ?? '' },
    resolver: zodResolver(moodFormSchema),
  });

  useEffect(() => {
    reset({ mood: (initialMood?.mood as MoodFormValues['mood']) ?? undefined, note: initialMood?.note ?? '' });
  }, [initialMood, reset]);

  const submit = async (values: MoodFormValues) => {
    if (lock.current) return;
    lock.current = true;
    setSubmitError(null);
    try {
      const mood = await onSubmit(toMoodMutationValues(values, date));
      reset(values);
      void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => undefined);
      onSaved(mood);
    } catch (error) {
      setSubmitError(error instanceof Error ? error.message : 'Your mood could not be saved.');
    } finally {
      lock.current = false;
    }
  };

  return (
    <View style={styles.form}>
      <View style={styles.field}>
        <AppText variant="title">How are you feeling?</AppText>
        <Controller control={control} name="mood" render={({ field: { onChange, value } }) => <MoodSelector disabled={isSubmitting} onChange={(next) => { void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => undefined); onChange(next); }} value={value} />} />
        {errors.mood ? <AppText accessibilityRole="alert" tone="danger" variant="bodySmall">{errors.mood.message}</AppText> : null}
      </View>
      <Controller control={control} name="note" render={({ field: { onBlur, onChange, value } }) => <TextField editable={!isSubmitting} error={errors.note?.message} label="Reason (optional)" maxLength={500} multiline onBlur={onBlur} onChangeText={onChange} placeholder="What is shaping your mood today?" style={styles.note} textAlignVertical="top" value={value} />} />
      {submitError ? <AppText accessibilityLiveRegion="polite" accessibilityRole="alert" tone="danger">{submitError}</AppText> : null}
      <Button disabled={isSubmitting} label={initialMood ? 'Update today’s mood' : 'Save today’s mood'} loading={isSubmitting} onPress={() => void handleSubmit(submit)()} />
    </View>
  );
}

const styles = StyleSheet.create({ field: { gap: spacing.sm }, form: { gap: spacing.lg }, note: { minHeight: spacing.giant + spacing.xl } });
