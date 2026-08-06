import { zodResolver } from '@hookform/resolvers/zod';
import { useNavigation } from 'expo-router';
import { useEffect, useRef, useState } from 'react';
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  View,
} from 'react-native';
import { Controller, useForm } from 'react-hook-form';

import { AppText, Button, TextField } from '@/components/ui';
import { spacing } from '@/theme';

import {
  taskFormSchema,
  toTaskMutationValues,
  type TaskFormValues,
} from '../task-schema';
import type { TaskCategory, TaskMutationValues, TaskPriority } from '../task-types';
import { CategoryChip } from './category-chip';
import { DatePickerField } from './date-picker-field';
import { PriorityBadge } from './priority-badge';
import { ReminderField } from './reminder-field';
import { TimePickerField } from './time-picker-field';

const defaultValues: TaskFormValues = {
  categoryId: '',
  description: '',
  dueDate: '',
  dueTime: '',
  priority: 'medium',
  reminderEnabled: false,
  title: '',
};

type TaskFormProps = {
  categories: TaskCategory[];
  initialValues?: TaskFormValues;
  onCancel: () => void;
  onSubmit: (values: TaskMutationValues) => Promise<void>;
  submitLabel: string;
};

export function TaskForm({
  categories,
  initialValues = defaultValues,
  onCancel,
  onSubmit,
  submitLabel,
}: TaskFormProps) {
  const navigation = useNavigation();
  const allowLeave = useRef(false);
  const submitLock = useRef(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const {
    control,
    formState: { errors, isDirty, isSubmitting },
    handleSubmit,
    reset,
    setValue,
    watch,
  } = useForm<TaskFormValues>({
    defaultValues: initialValues,
    mode: 'onBlur',
    resolver: zodResolver(taskFormSchema),
  });
  const dueDate = watch('dueDate');
  const dueTime = watch('dueTime');
  const reminderEnabled = watch('reminderEnabled');

  useEffect(() => {
    if (dueDate) return;
    setValue('dueTime', '');
  }, [dueDate, setValue]);

  useEffect(
    () =>
      navigation.addListener('beforeRemove', (event) => {
        if (!isDirty || allowLeave.current) return;
        event.preventDefault();
        Alert.alert(
          'Discard unsaved changes?',
          'Your task changes have not been saved.',
          [
            { style: 'cancel', text: 'Keep editing' },
            {
              onPress: () => {
                allowLeave.current = true;
                navigation.dispatch(event.data.action);
              },
              style: 'destructive',
              text: 'Discard',
            },
          ],
        );
      }),
    [isDirty, navigation],
  );

  const submit = async (values: TaskFormValues) => {
    if (submitLock.current) return;
    submitLock.current = true;
    setSubmitError(null);
    try {
      await onSubmit(toTaskMutationValues(values));
      allowLeave.current = true;
      reset(values);
    } catch (error) {
      allowLeave.current = false;
      setSubmitError(error instanceof Error ? error.message : 'Task could not be saved.');
    } finally {
      submitLock.current = false;
    }
  };

  const cancel = () => {
    if (!isDirty) {
      allowLeave.current = true;
      onCancel();
      return;
    }

    Alert.alert('Discard unsaved changes?', 'Your task changes have not been saved.', [
      { style: 'cancel', text: 'Keep editing' },
      {
        onPress: () => {
          allowLeave.current = true;
          onCancel();
        },
        style: 'destructive',
        text: 'Discard',
      },
    ]);
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      style={styles.keyboardView}
    >
      <ScrollView
        contentContainerStyle={styles.content}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <Controller
          control={control}
          name="title"
          render={({ field: { onBlur, onChange, value } }) => (
            <TextField
              autoFocus
              error={errors.title?.message}
              label="Task title"
              onBlur={onBlur}
              onChangeText={onChange}
              placeholder="What needs to be done?"
              returnKeyType="next"
              value={value}
            />
          )}
        />

        <Controller
          control={control}
          name="description"
          render={({ field: { onBlur, onChange, value } }) => (
            <TextField
              error={errors.description?.message}
              label="Description (optional)"
              multiline
              numberOfLines={4}
              onBlur={onBlur}
              onChangeText={onChange}
              placeholder="Add helpful details"
              textAlignVertical="top"
              value={value}
            />
          )}
        />

        <View style={styles.group}>
          <AppText variant="title">Priority</AppText>
          <Controller
            control={control}
            name="priority"
            render={({ field: { onChange, value } }) => (
              <View accessibilityRole="radiogroup" style={styles.wrapRow}>
                {(['low', 'medium', 'high'] as TaskPriority[]).map((priority) => (
                  <PriorityBadge
                    key={priority}
                    onPress={() => onChange(priority)}
                    priority={priority}
                    selected={value === priority}
                  />
                ))}
              </View>
            )}
          />
        </View>

        <View style={styles.group}>
          <AppText variant="title">Category</AppText>
          <Controller
            control={control}
            name="categoryId"
            render={({ field: { onChange, value } }) => (
              <View accessibilityRole="radiogroup" style={styles.wrapRow}>
                <CategoryChip label="None" onPress={() => onChange('')} selected={!value} />
                {categories.map((category) => (
                  <CategoryChip
                    color={category.color}
                    key={category.id}
                    label={category.name}
                    onPress={() => onChange(category.id)}
                    selected={value === category.id}
                  />
                ))}
              </View>
            )}
          />
        </View>

        <Controller
          control={control}
          name="dueDate"
          render={({ field: { onChange, value } }) => (
            <DatePickerField
              error={errors.dueDate?.message}
              label="Due date (optional)"
              onChange={onChange}
              value={value}
            />
          )}
        />

        <Controller
          control={control}
          name="dueTime"
          render={({ field: { onChange, value } }) => (
            <TimePickerField
              disabled={!dueDate}
              error={errors.dueTime?.message}
              label="Due time (optional)"
              onChange={onChange}
              value={value}
            />
          )}
        />

        <Controller
          control={control}
          name="reminderEnabled"
          render={({ field: { onChange, value } }) => (
            <ReminderField
              error={errors.reminderEnabled?.message}
              guidance={
                reminderEnabled && (!dueDate || !dueTime)
                  ? 'Choose a date and time for the reminder.'
                  : undefined
              }
              onChange={onChange}
              value={value}
            />
          )}
        />

        {submitError ? (
          <AppText accessibilityLiveRegion="polite" accessibilityRole="alert" tone="danger">
            {submitError}
          </AppText>
        ) : null}

        <View style={styles.actions}>
          <Button label={submitLabel} loading={isSubmitting} onPress={() => void handleSubmit(submit)()} />
          <Button disabled={isSubmitting} label="Cancel" onPress={cancel} variant="secondary" />
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  actions: {
    gap: spacing.sm,
  },
  content: {
    gap: spacing.lg,
    paddingBottom: spacing.giant,
  },
  group: {
    gap: spacing.xs,
  },
  keyboardView: {
    flex: 1,
  },
  wrapRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.xs,
  },
});
