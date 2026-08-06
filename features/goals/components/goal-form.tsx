import { zodResolver } from '@hookform/resolvers/zod';
import type { NavigationAction } from '@react-navigation/native';
import { useNavigation } from 'expo-router';
import { useEffect, useRef, useState } from 'react';
import { Controller, useFieldArray, useForm } from 'react-hook-form';
import { KeyboardAvoidingView, Platform, ScrollView, StyleSheet, View } from 'react-native';

import { AppText, Button, StatusBadge, TextField } from '@/components/ui';
import { DatePickerField } from '@/features/tasks';
import { useAppTheme } from '@/hooks/use-app-theme';
import { spacing } from '@/theme';

import { goalStatusOptions } from '../goal-options';
import { createGoalFormSchema, toGoalMutationValues, type GoalFormValues } from '../goal-schema';
import type { GoalMutationValues, GoalStatus, GoalWithMilestones } from '../goal-types';
import { MilestoneForm } from './milestone-form';
import { UnsavedChangesDialog } from './unsaved-changes-dialog';

export const defaultGoalFormValues: GoalFormValues = {
  description: '',
  milestones: [],
  progress: 0,
  status: 'active',
  targetDate: '',
  title: '',
};

export function goalToFormValues(goal: GoalWithMilestones): GoalFormValues {
  return {
    description: goal.description ?? '',
    milestones: goal.goal_milestones.map((item) => ({
      completedAt: item.completed_at,
      id: item.id,
      isCompleted: item.is_completed,
      title: item.title,
    })),
    progress: goal.progress,
    status: goal.status,
    targetDate: goal.target_date ?? '',
    title: goal.title,
  };
}

type GoalFormProps = {
  existingCompletedAt?: string | null;
  initialValues?: GoalFormValues;
  mode: 'create' | 'edit';
  onCancel: () => void;
  onSaved: (goal: GoalWithMilestones) => void;
  onSubmit: (values: GoalMutationValues) => Promise<GoalWithMilestones>;
  todayDate: string;
};

export function GoalForm({
  existingCompletedAt = null,
  initialValues = defaultGoalFormValues,
  mode,
  onCancel,
  onSaved,
  onSubmit,
  todayDate,
}: GoalFormProps) {
  const { colors } = useAppTheme();
  const navigation = useNavigation();
  const allowLeave = useRef(false);
  const pendingAction = useRef<NavigationAction | null>(null);
  const [showDiscard, setShowDiscard] = useState(false);
  const [milestoneTitle, setMilestoneTitle] = useState('');
  const [submitError, setSubmitError] = useState<string | null>(null);
  const {
    control,
    formState: { errors, isDirty, isSubmitting },
    handleSubmit,
    reset,
  } = useForm<GoalFormValues>({
    defaultValues: initialValues,
    mode: 'onChange',
    resolver: zodResolver(createGoalFormSchema({
      initialTargetDate: initialValues.targetDate || null,
      mode,
      todayDate,
    })),
  });
  const milestones = useFieldArray({ control, keyName: '_formKey', name: 'milestones' });

  useEffect(
    () => navigation.addListener('beforeRemove', (event) => {
      if (!isDirty || allowLeave.current) return;
      event.preventDefault();
      pendingAction.current = event.data.action;
      setShowDiscard(true);
    }),
    [isDirty, navigation],
  );

  const cancel = () => {
    if (!isDirty) {
      onCancel();
      return;
    }
    setShowDiscard(true);
  };

  const discard = () => {
    allowLeave.current = true;
    setShowDiscard(false);
    if (pendingAction.current) navigation.dispatch(pendingAction.current);
    else onCancel();
  };

  const submit = async (values: GoalFormValues) => {
    setSubmitError(null);
    try {
      const saved = await onSubmit(toGoalMutationValues(values, existingCompletedAt));
      allowLeave.current = true;
      reset(values);
      onSaved(saved);
    } catch (error) {
      setSubmitError(error instanceof Error ? error.message : 'The goal could not be saved.');
    }
  };

  const addMilestone = () => {
    const title = milestoneTitle.trim();
    if (!title) return;
    milestones.append({ isCompleted: false, title });
    setMilestoneTitle('');
  };

  return (
    <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.flex}>
      <ScrollView
        automaticallyAdjustKeyboardInsets={Platform.OS === 'ios'}
        contentContainerStyle={styles.content}
        keyboardDismissMode="interactive"
        keyboardShouldPersistTaps="handled"
      >
        <AppText accessibilityRole="header" variant="heading2">
          {mode === 'create' ? 'Create goal' : 'Edit goal'}
        </AppText>

        <Controller
          control={control}
          name="title"
          render={({ field }) => (
            <TextField
              error={errors.title?.message}
              label="Title"
              maxLength={240}
              onBlur={field.onBlur}
              onChangeText={field.onChange}
              placeholder="What do you want to achieve?"
              value={field.value}
            />
          )}
        />
        <Controller
          control={control}
          name="description"
          render={({ field }) => (
            <TextField
              error={errors.description?.message}
              label="Description (optional)"
              maxLength={2000}
              multiline
              onBlur={field.onBlur}
              onChangeText={field.onChange}
              placeholder="Add context or motivation"
              style={styles.description}
              textAlignVertical="top"
              value={field.value}
            />
          )}
        />
        <Controller
          control={control}
          name="targetDate"
          render={({ field }) => (
            <DatePickerField
              error={errors.targetDate?.message}
              label="Target date (optional)"
              onChange={field.onChange}
              value={field.value}
            />
          )}
        />
        <Controller
          control={control}
          name="progress"
          render={({ field }) => (
            <TextField
              error={errors.progress?.message}
              keyboardType="number-pad"
              label="Manual progress (0–100%)"
              maxLength={3}
              onChangeText={(value) => field.onChange(Number(value.replace(/\D/g, '')) || 0)}
              value={String(field.value)}
            />
          )}
        />
        <Controller
          control={control}
          name="status"
          render={({ field }) => (
            <View style={styles.field}>
              <AppText variant="bodySmall">Status</AppText>
              <View accessibilityRole="radiogroup" style={styles.wrap}>
                {goalStatusOptions.map((option) => (
                  <StatusBadge
                    color={field.value === option.value ? colors.primary : colors.textMuted}
                    key={option.value}
                    label={option.label}
                    onPress={() => field.onChange(option.value as GoalStatus)}
                    selected={field.value === option.value}
                  />
                ))}
              </View>
            </View>
          )}
        />

        <View style={styles.field}>
          <AppText variant="title">Milestones</AppText>
          {milestones.fields.map((item, index) => (
            <View key={item._formKey} style={styles.milestone}>
              <Controller
                control={control}
                name={`milestones.${index}.title`}
                render={({ field }) => (
                  <TextField
                    error={errors.milestones?.[index]?.title?.message}
                    label={`Milestone ${index + 1}`}
                    onChangeText={field.onChange}
                    value={field.value}
                  />
                )}
              />
              <Button
                fullWidth={false}
                label="Remove"
                onPress={() => milestones.remove(index)}
                variant="secondary"
              />
            </View>
          ))}
          <MilestoneForm onChange={setMilestoneTitle} onSubmit={addMilestone} value={milestoneTitle} />
        </View>

        {submitError ? <AppText accessibilityRole="alert" tone="danger">{submitError}</AppText> : null}
        <View style={styles.actions}>
          <Button disabled={isSubmitting} label="Cancel" onPress={cancel} variant="secondary" />
          <Button label="Save goal" loading={isSubmitting} onPress={() => void handleSubmit(submit)()} />
        </View>
      </ScrollView>
      <UnsavedChangesDialog
        onDiscard={discard}
        onKeepEditing={() => setShowDiscard(false)}
        visible={showDiscard}
      />
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  actions: { gap: spacing.sm, paddingBottom: spacing.giant },
  content: { gap: spacing.lg },
  description: { minHeight: spacing.giant * 2 },
  field: { gap: spacing.xs },
  flex: { flex: 1 },
  milestone: { gap: spacing.xs },
  wrap: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.xs },
});
