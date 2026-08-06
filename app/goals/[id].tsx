import * as Haptics from 'expo-haptics';
import { router, useLocalSearchParams } from 'expo-router';
import { CheckCircle2, Pause, Play, Sparkles } from 'lucide-react-native';
import { useMemo, useState } from 'react';
import {
  Alert,
  KeyboardAvoidingView,
  Modal,
  Platform,
  RefreshControl,
  ScrollView,
  StyleSheet,
  View,
} from 'react-native';

import { ErrorState, LoadingState } from '@/components/feedback';
import { AppText, Button, Card, Screen, TextField } from '@/components/ui';
import {
  DeleteGoalConfirmation,
  DeleteMilestoneConfirmation,
  GoalDateLabel,
  GoalDetailsHeader,
  GoalProgressBar,
  GoalStatusBadge,
  MilestoneForm,
  MilestoneList,
  MilestoneProgressSummary,
  useDeleteGoalMutation,
  useGoalDetails,
  useGoalProgressMutation,
  useGoalStatusMutation,
  useMilestoneMutations,
  type GoalMilestone,
} from '@/features/goals';
import { useAppTheme } from '@/hooks/use-app-theme';
import { useAuth } from '@/hooks/use-auth';
import { getDateKey } from '@/lib/local-date';
import { radii, sizing, spacing } from '@/theme';

function returnToGoals() {
  if (router.canGoBack()) router.back();
  else router.replace('/goals');
}

export default function GoalDetailsScreen() {
  const params = useLocalSearchParams<{ id: string }>();
  const id = Array.isArray(params.id) ? params.id[0] : params.id;
  const { colors } = useAppTheme();
  const { profile, user } = useAuth();
  const userId = user!.id;
  const query = useGoalDetails(userId, id);
  const statusMutation = useGoalStatusMutation(userId);
  const progressMutation = useGoalProgressMutation(userId);
  const deleteMutation = useDeleteGoalMutation(userId);
  const milestones = useMilestoneMutations(userId, id ?? '');
  const [showDelete, setShowDelete] = useState(false);
  const [deleteMilestone, setDeleteMilestone] = useState<GoalMilestone | null>(null);
  const [newTitle, setNewTitle] = useState('');
  const [editing, setEditing] = useState<GoalMilestone | null>(null);
  const [editTitle, setEditTitle] = useState('');
  const [progress, setProgress] = useState<string | null>(null);
  const goal = query.data;
  const ordered = useMemo(() => goal?.goal_milestones ?? [], [goal?.goal_milestones]);
  const today = getDateKey(new Date(), profile?.timezone);
  const busy = statusMutation.isPending
    || progressMutation.isPending
    || milestones.create.isPending
    || milestones.update.isPending
    || milestones.delete.isPending
    || milestones.reorder.isPending;

  const run = async (task: () => Promise<unknown>, success?: string): Promise<boolean> => {
    try {
      await task();
      if (success) Alert.alert('Saved', success);
      return true;
    } catch (error) {
      Alert.alert('Could not save', error instanceof Error ? error.message : 'Please try again.');
      return false;
    }
  };

  if (query.isLoading) return <Screen><LoadingState label="Loading goal…" /></Screen>;
  if (!goal || query.error) {
    return (
      <Screen>
        <ErrorState
          description="This goal may have been deleted or is unavailable."
          onRetry={() => void query.refetch()}
          title="Goal unavailable"
        />
        <Button label="Back to goals" onPress={returnToGoals} variant="secondary" />
      </Screen>
    );
  }

  const changeStatus = (status: 'active' | 'archived' | 'completed' | 'paused') => {
    void run(() => statusMutation.mutateAsync({ goal, status }), `Goal marked ${status}.`);
  };
  const toggleMilestone = (item: GoalMilestone) => {
    void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => undefined);
    void run(() => milestones.update.mutateAsync({
      id: item.id,
      values: {
        completed_at: item.is_completed ? null : new Date().toISOString(),
        is_completed: !item.is_completed,
      },
    }));
  };
  const move = (index: number, direction: -1 | 1) => {
    const next = [...ordered];
    const target = index + direction;
    const currentItem = next[index];
    const targetItem = next[target];
    if (!currentItem || !targetItem) return;
    next[index] = targetItem;
    next[target] = currentItem;
    void run(() => milestones.reorder.mutateAsync(next));
  };
  const startEditing = (item: GoalMilestone) => {
    setEditTitle(item.title);
    setEditing(item);
  };
  const saveMilestoneEdit = async () => {
    if (!editing || !editTitle.trim()) return;
    const saved = await run(() => milestones.update.mutateAsync({
      id: editing.id,
      values: { title: editTitle.trim() },
    }));
    if (saved) setEditing(null);
  };
  const suggested = ordered.length
    ? Math.round((ordered.filter((item) => item.is_completed).length / ordered.length) * 100)
    : 0;
  const progressEditable = goal.status === 'active' || goal.status === 'paused';

  return (
    <Screen padded={false} scroll={false}>
      <ScrollView
        contentContainerStyle={styles.content}
        refreshControl={(
          <RefreshControl
            colors={[colors.primary]}
            onRefresh={() => void query.refetch()}
            refreshing={query.isRefetching}
            tintColor={colors.primary}
          />
        )}
      >
        <GoalDetailsHeader
          onArchive={() => changeStatus('archived')}
          onBack={returnToGoals}
          onDelete={() => setShowDelete(true)}
          onEdit={() => router.push(`/goals/edit/${goal.id}`)}
          onRestore={() => changeStatus(goal.completed_at ? 'completed' : 'active')}
          status={goal.status}
          title={goal.title}
        />
        <View style={styles.badges}>
          <GoalStatusBadge status={goal.status} />
          <GoalDateLabel status={goal.status} targetDate={goal.target_date} todayDate={today} />
        </View>
        {goal.description ? <AppText tone="secondary">{goal.description}</AppText> : null}

        <Card style={styles.card}>
          <GoalProgressBar progress={goal.progress} />
          <View style={styles.progressRow}>
            <View style={styles.progressField}>
              <TextField
                editable={progressEditable}
                helperText={progressEditable ? undefined : 'Restore this goal before changing its progress.'}
                keyboardType="number-pad"
                label="Set progress"
                maxLength={3}
                onChangeText={setProgress}
                placeholder={String(goal.progress)}
                value={progress ?? ''}
              />
            </View>
            <Button
              disabled={!progressEditable || progress === null}
              fullWidth={false}
              label="Update"
              loading={progressMutation.isPending}
              onPress={() => void run(
                () => progressMutation.mutateAsync({ goalId: goal.id, progress: Number(progress) }),
                'Progress updated.',
              )}
            />
          </View>
          {ordered.length ? (
            <Button
              disabled={!progressEditable}
              label={`Use milestone progress (${suggested}%)`}
              leftIcon={<Sparkles color={colors.primary} size={sizing.iconSmall} />}
              onPress={() => void run(
                () => progressMutation.mutateAsync({ goalId: goal.id, progress: suggested }),
                'Progress updated from milestones.',
              )}
              variant="secondary"
            />
          ) : null}
        </Card>

        <View style={styles.statusActions}>
          {goal.status === 'active' || goal.status === 'paused' ? (
            <Button
              disabled={busy}
              label="Complete goal"
              leftIcon={<CheckCircle2 color={colors.onPrimary} size={sizing.iconSmall} />}
              onPress={() => changeStatus('completed')}
            />
          ) : null}
          {goal.status === 'paused' ? (
            <Button
              disabled={busy}
              label="Resume goal"
              leftIcon={<Play color={colors.primary} size={sizing.iconSmall} />}
              onPress={() => changeStatus('active')}
              variant="secondary"
            />
          ) : goal.status === 'active' ? (
            <Button
              disabled={busy}
              label="Pause goal"
              leftIcon={<Pause color={colors.primary} size={sizing.iconSmall} />}
              onPress={() => changeStatus('paused')}
              variant="secondary"
            />
          ) : null}
        </View>

        <View style={styles.section}>
          <AppText variant="heading3">Milestones</AppText>
          <MilestoneProgressSummary milestones={ordered} />
          {ordered.length ? (
            <MilestoneList
              disabled={busy}
              milestones={ordered}
              onDelete={setDeleteMilestone}
              onEdit={startEditing}
              onMove={move}
              onToggle={toggleMilestone}
            />
          ) : (
            <AppText tone="secondary">Add a checkpoint to make this goal easier to act on.</AppText>
          )}
          <MilestoneForm
            loading={milestones.create.isPending}
            onChange={setNewTitle}
            onSubmit={() => {
              if (!newTitle.trim()) return;
              void run(async () => {
                await milestones.create.mutateAsync({ position: ordered.length, title: newTitle });
                setNewTitle('');
              });
            }}
            value={newTitle}
          />
        </View>
      </ScrollView>

      <Modal
        animationType="fade"
        onRequestClose={() => setEditing(null)}
        statusBarTranslucent
        transparent
        visible={Boolean(editing)}
      >
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={[styles.editOverlay, { backgroundColor: `${colors.textPrimary}73` }]}
        >
          <View
            accessibilityViewIsModal
            style={[styles.editDialog, { backgroundColor: colors.surface, borderColor: colors.border }]}
          >
            <AppText accessibilityRole="header" variant="heading3">Edit milestone</AppText>
            <TextField
              autoFocus
              label="Milestone title"
              maxLength={240}
              onChangeText={setEditTitle}
              onSubmitEditing={() => void saveMilestoneEdit()}
              returnKeyType="done"
              value={editTitle}
            />
            <View style={styles.dialogActions}>
              <Button
                disabled={milestones.update.isPending}
                fullWidth={false}
                label="Cancel"
                onPress={() => setEditing(null)}
                variant="secondary"
              />
              <Button
                disabled={!editTitle.trim()}
                fullWidth={false}
                label="Save milestone"
                loading={milestones.update.isPending}
                onPress={() => void saveMilestoneEdit()}
              />
            </View>
          </View>
        </KeyboardAvoidingView>
      </Modal>

      <DeleteGoalConfirmation
        loading={deleteMutation.isPending}
        name={goal.title}
        onCancel={() => setShowDelete(false)}
        onConfirm={() => void run(async () => {
          await deleteMutation.mutateAsync(goal.id);
          setShowDelete(false);
          router.replace('/goals');
        }, 'Goal deleted.')}
        visible={showDelete}
      />
      <DeleteMilestoneConfirmation
        loading={milestones.delete.isPending}
        name={deleteMilestone?.title ?? ''}
        onCancel={() => setDeleteMilestone(null)}
        onConfirm={() => deleteMilestone && void run(async () => {
          await milestones.delete.mutateAsync(deleteMilestone.id);
          setDeleteMilestone(null);
        })}
        visible={Boolean(deleteMilestone)}
      />
    </Screen>
  );
}

const styles = StyleSheet.create({
  badges: { alignItems: 'center', flexDirection: 'row', gap: spacing.sm },
  card: { gap: spacing.md },
  content: { gap: spacing.lg, padding: spacing.lg, paddingBottom: spacing.giant },
  dialogActions: { flexDirection: 'row', gap: spacing.sm, justifyContent: 'flex-end' },
  editDialog: {
    borderRadius: radii.large,
    borderWidth: sizing.border,
    gap: spacing.md,
    marginHorizontal: spacing.lg,
    padding: spacing.lg,
  },
  editOverlay: { flex: 1, justifyContent: 'center' },
  progressField: { flex: 1 },
  progressRow: { alignItems: 'flex-end', flexDirection: 'row', gap: spacing.sm },
  section: { gap: spacing.sm },
  statusActions: { gap: spacing.sm },
});
