import { zodResolver } from '@hookform/resolvers/zod';
import type { NavigationAction } from '@react-navigation/native';
import { useNavigation } from 'expo-router';
import { ArrowLeft, Trash2 } from 'lucide-react-native';
import { useEffect, useRef, useState } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  TextInput,
  View,
} from 'react-native';
import { Controller, useForm } from 'react-hook-form';

import { AppText, Button, IconButton } from '@/components/ui';
import { useAppTheme } from '@/hooks/use-app-theme';
import { radii, sizing, spacing, typography } from '@/theme';

import { noteFormSchema, toNoteMutationValues, type NoteFormValues } from '../note-schema';
import type { Note, NoteMutationValues } from '../note-types';
import { ArchiveNoteAction } from './archive-note-action';
import { PinToggle } from './pin-toggle';
import { UnsavedChangesDialog } from './unsaved-changes-dialog';

export const defaultNoteFormValues: NoteFormValues = { content: '', isPinned: false, title: '' };

type NoteEditorProps = {
  archived?: boolean;
  archiveLoading?: boolean;
  deleteLoading?: boolean;
  initialValues?: NoteFormValues;
  mode: 'create' | 'edit';
  onArchive?: () => void;
  onCancel: () => void;
  onDelete?: () => void;
  onSaved: (note: Note) => void;
  onSubmit: (values: NoteMutationValues) => Promise<Note>;
};

export function NoteEditor({
  archived = false,
  archiveLoading,
  deleteLoading,
  initialValues = defaultNoteFormValues,
  mode,
  onArchive,
  onCancel,
  onDelete,
  onSaved,
  onSubmit,
}: NoteEditorProps) {
  const { colors } = useAppTheme();
  const navigation = useNavigation();
  const allowLeave = useRef(false);
  const pendingNavigation = useRef<NavigationAction | null>(null);
  const pendingCancel = useRef(false);
  const submitLock = useRef(false);
  const [showDiscard, setShowDiscard] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const {
    control,
    formState: { errors, isDirty, isSubmitting },
    handleSubmit,
    reset,
  } = useForm<NoteFormValues>({
    defaultValues: initialValues,
    mode: 'onChange',
    resolver: zodResolver(noteFormSchema),
  });

  useEffect(
    () => navigation.addListener('beforeRemove', (event) => {
      if (!isDirty || allowLeave.current) return;
      event.preventDefault();
      pendingNavigation.current = event.data.action;
      pendingCancel.current = false;
      setShowDiscard(true);
    }),
    [isDirty, navigation],
  );

  const requestCancel = () => {
    if (!isDirty) {
      allowLeave.current = true;
      onCancel();
      return;
    }
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

  const submit = async (values: NoteFormValues) => {
    if (submitLock.current) return;
    submitLock.current = true;
    setSubmitError(null);
    let savedNote: Note;
    try {
      savedNote = await onSubmit(toNoteMutationValues(values));
    } catch (error) {
      setSubmitError(error instanceof Error ? error.message : 'The note could not be saved.');
      submitLock.current = false;
      return;
    }

    allowLeave.current = true;
    reset(values);
    submitLock.current = false;
    try {
      onSaved(savedNote);
    } catch {
      // The database save succeeded; a navigation failure must not be shown as a save failure.
    }
  };

  const editorDisabled = isSubmitting || archiveLoading || deleteLoading;

  return (
    <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={styles.flex}>
      <View style={styles.header}>
        <IconButton disabled={editorDisabled} icon={ArrowLeft} label="Go back" onPress={requestCancel} />
        <View style={styles.heading}>
          <AppText accessibilityRole="header" variant="heading3">
            {mode === 'create' ? 'New note' : 'Edit note'}
          </AppText>
          {archived ? <AppText tone="secondary" variant="caption">Archived</AppText> : null}
        </View>
        <Button
          disabled={editorDisabled}
          fullWidth={false}
          label="Save"
          loading={isSubmitting}
          onPress={() => void handleSubmit(submit)()}
          style={styles.save}
        />
      </View>

      <ScrollView
        contentContainerStyle={styles.content}
        keyboardDismissMode="interactive"
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <Controller
          control={control}
          name="title"
          render={({ field: { onBlur, onChange, value } }) => (
            <View style={styles.field}>
              <AppText variant="bodySmall">Title (optional)</AppText>
              <TextInput
                accessibilityLabel="Note title"
                autoFocus={mode === 'create'}
                editable={!editorDisabled}
                maxLength={240}
                onBlur={onBlur}
                onChangeText={onChange}
                placeholder="Add a title"
                placeholderTextColor={colors.textMuted}
                returnKeyType="next"
                style={[
                  styles.titleInput,
                  typography.heading2,
                  { borderColor: errors.title ? colors.danger : colors.border, color: colors.textPrimary },
                ]}
                value={value}
              />
              {errors.title ? <AppText accessibilityRole="alert" tone="danger" variant="bodySmall">{errors.title.message}</AppText> : null}
            </View>
          )}
        />

        <Controller
          control={control}
          name="content"
          render={({ field: { onBlur, onChange, value } }) => (
            <View style={styles.field}>
              <AppText variant="bodySmall">Note</AppText>
              <TextInput
                accessibilityLabel="Note content"
                editable={!editorDisabled}
                multiline
                onBlur={onBlur}
                onChangeText={onChange}
                placeholder="Start writing…"
                placeholderTextColor={colors.textMuted}
                scrollEnabled
                style={[
                  styles.contentInput,
                  typography.bodyLarge,
                  { backgroundColor: colors.surface, borderColor: errors.content ? colors.danger : colors.border, color: colors.textPrimary },
                ]}
                textAlignVertical="top"
                value={value}
              />
              {errors.content ? <AppText accessibilityRole="alert" tone="danger" variant="bodySmall">{errors.content.message}</AppText> : null}
            </View>
          )}
        />

        <Controller
          control={control}
          name="isPinned"
          render={({ field: { onChange, value } }) => <PinToggle disabled={editorDisabled} onChange={onChange} value={value} />}
        />

        {submitError ? <AppText accessibilityLiveRegion="polite" accessibilityRole="alert" tone="danger">{submitError}</AppText> : null}

        {mode === 'edit' && onArchive && onDelete ? (
          <View style={styles.existingActions}>
            {isDirty ? <AppText tone="secondary" variant="bodySmall">Save or discard your changes before archiving or deleting.</AppText> : null}
            <ArchiveNoteAction archived={archived} disabled={isDirty || deleteLoading} loading={archiveLoading} onPress={onArchive} />
            <Button
              disabled={isDirty || archiveLoading}
              label="Delete note"
              leftIcon={<Trash2 color={colors.onPrimary} size={sizing.iconSmall} />}
              loading={deleteLoading}
              onPress={onDelete}
              variant="destructive"
            />
          </View>
        ) : null}
      </ScrollView>

      <UnsavedChangesDialog onDiscard={discard} onKeepEditing={() => setShowDiscard(false)} visible={showDiscard} />
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  content: { gap: spacing.lg, paddingBottom: spacing.giant },
  contentInput: { borderRadius: radii.medium, borderWidth: sizing.border, minHeight: spacing.giant * 4, padding: spacing.md },
  existingActions: { gap: spacing.sm, paddingTop: spacing.lg },
  field: { gap: spacing.xs },
  flex: { flex: 1 },
  header: { alignItems: 'center', flexDirection: 'row', gap: spacing.sm, paddingBottom: spacing.md },
  heading: { flex: 1 },
  save: { minWidth: spacing.giant + spacing.md },
  titleInput: { borderBottomWidth: sizing.border, minHeight: sizing.controlHeight, paddingVertical: spacing.xs },
});
