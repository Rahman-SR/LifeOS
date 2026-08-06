import { zodResolver } from '@hookform/resolvers/zod';
import type { NavigationAction } from '@react-navigation/native';
import { useNavigation } from 'expo-router';
import { ArrowLeft, History, Trash2 } from 'lucide-react-native';
import { useEffect, useRef, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { KeyboardAvoidingView, Platform, ScrollView, StyleSheet, View } from 'react-native';

import { AppText, Button, IconButton, TextField } from '@/components/ui';
import { useAppTheme } from '@/hooks/use-app-theme';
import { spacing } from '@/theme';

import { defaultJournalValues, journalFormSchema, toJournalMutationValues, type JournalFormValues } from '../journal-schema';
import type { JournalEntry, JournalMutationValues } from '../journal-types';
import { JournalPromptField } from './journal-prompt-field';
import { UnsavedChangesDialog } from './unsaved-changes-dialog';

export function JournalEditor({ entryDate, initialValues = defaultJournalValues, mode, onCancel, onDelete, onHistory, onSaved, onSubmit }: { entryDate: string; initialValues?: JournalFormValues; mode: 'create' | 'edit'; onCancel: () => void; onDelete?: () => void; onHistory?: () => void; onSaved: (entry: JournalEntry) => void; onSubmit: (values: JournalMutationValues) => Promise<JournalEntry> }) {
  const { colors } = useAppTheme();
  const navigation = useNavigation();
  const allowLeave = useRef(false);
  const pendingNavigation = useRef<NavigationAction | null>(null);
  const pendingCancel = useRef(false);
  const submitLock = useRef(false);
  const [showDiscard, setShowDiscard] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const { control, formState: { errors, isDirty, isSubmitting }, handleSubmit, reset } = useForm<JournalFormValues>({ defaultValues: initialValues, mode: 'onChange', resolver: zodResolver(journalFormSchema) });

  useEffect(() => { reset(initialValues); }, [initialValues, reset]);
  useEffect(() => navigation.addListener('beforeRemove', (event) => {
    if (!isDirty || allowLeave.current) return;
    event.preventDefault();
    pendingNavigation.current = event.data.action;
    pendingCancel.current = false;
    setShowDiscard(true);
  }), [isDirty, navigation]);

  const requestCancel = () => {
    if (!isDirty) { allowLeave.current = true; onCancel(); return; }
    pendingNavigation.current = null;
    pendingCancel.current = true;
    setShowDiscard(true);
  };
  const discard = () => {
    allowLeave.current = true;
    setShowDiscard(false);
    const action = pendingNavigation.current;
    pendingNavigation.current = null;
    if (action) navigation.dispatch(action);
    else if (pendingCancel.current) onCancel();
    pendingCancel.current = false;
  };
  const submit = async (values: JournalFormValues) => {
    if (submitLock.current) return;
    submitLock.current = true;
    setSubmitError(null);
    let saved: JournalEntry;
    try { saved = await onSubmit(toJournalMutationValues(values, entryDate)); }
    catch (error) { setSubmitError(error instanceof Error ? error.message : 'The journal entry could not be saved.'); submitLock.current = false; return; }
    allowLeave.current = true;
    reset(values);
    submitLock.current = false;
    try { onSaved(saved); } catch { /* The database save succeeded; navigation is best effort. */ }
  };

  const disabled = isSubmitting;
  return <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={styles.flex}>
    <View style={styles.header}>
      <IconButton disabled={disabled} icon={ArrowLeft} label="Go back" onPress={requestCancel} />
      <View style={styles.heading}><AppText accessibilityRole="header" variant="heading3">{mode === 'create' ? 'Today’s journal' : 'Edit journal'}</AppText><AppText tone="muted" variant="caption">Explicit save · private to you</AppText></View>
      {onHistory ? <IconButton disabled={disabled} icon={History} label="View journal history" onPress={onHistory} /> : null}
      <Button disabled={disabled} fullWidth={false} label="Save" loading={isSubmitting} onPress={() => void handleSubmit(submit)()} style={styles.save} />
    </View>
    <ScrollView contentContainerStyle={styles.content} keyboardDismissMode="interactive" keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false}>
      <Controller control={control} name="title" render={({ field: { onBlur, onChange, value } }) => <TextField editable={!disabled} error={errors.title?.message} label="Title (optional)" maxLength={240} onBlur={onBlur} onChangeText={onChange} placeholder="Name this day" value={value} />} />
      <Controller control={control} name="content" render={({ field: { onBlur, onChange, value } }) => <JournalPromptField editable={!disabled} error={errors.content?.message} label="Journal" onBlur={onBlur} onChangeText={onChange} placeholder="Write freely about your day…" value={value} />} />
      <Controller control={control} name="wentWell" render={({ field: { onBlur, onChange, value } }) => <JournalPromptField editable={!disabled} label="What went well today?" onBlur={onBlur} onChangeText={onChange} placeholder="A win, a kind moment, or something you appreciated" value={value} />} />
      <Controller control={control} name="wasDifficult" render={({ field: { onBlur, onChange, value } }) => <JournalPromptField editable={!disabled} label="What was difficult?" onBlur={onBlur} onChangeText={onChange} placeholder="A challenge you faced" value={value} />} />
      <Controller control={control} name="improveTomorrow" render={({ field: { onBlur, onChange, value } }) => <JournalPromptField editable={!disabled} label="What should I improve tomorrow?" onBlur={onBlur} onChangeText={onChange} placeholder="One gentle intention for tomorrow" value={value} />} />
      {submitError ? <AppText accessibilityLiveRegion="polite" accessibilityRole="alert" tone="danger">{submitError}</AppText> : null}
      {onDelete ? <Button disabled={isDirty || disabled} label="Delete journal entry" leftIcon={<Trash2 color={colors.onPrimary} />} onPress={onDelete} variant="destructive" /> : null}
    </ScrollView>
    <UnsavedChangesDialog onDiscard={discard} onKeepEditing={() => setShowDiscard(false)} visible={showDiscard} />
  </KeyboardAvoidingView>;
}

const styles = StyleSheet.create({ content: { gap: spacing.lg, paddingBottom: spacing.giant }, flex: { flex: 1 }, header: { alignItems: 'center', flexDirection: 'row', gap: spacing.xs, paddingBottom: spacing.md }, heading: { flex: 1 }, save: { minWidth: spacing.giant + spacing.sm } });
