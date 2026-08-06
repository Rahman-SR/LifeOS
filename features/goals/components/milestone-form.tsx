import { StyleSheet, View } from 'react-native';
import { Button, TextField } from '@/components/ui';
import { spacing } from '@/theme';

export function MilestoneForm({ error, loading, onCancel, onChange, onSubmit, value }: { error?: string; loading?: boolean; onCancel?: () => void; onChange: (value: string) => void; onSubmit: () => void; value: string }) {
  return <View style={styles.wrap}><TextField error={error} label="Milestone title" maxLength={240} onChangeText={onChange} onSubmitEditing={onSubmit} placeholder="Define the next checkpoint" returnKeyType="done" value={value} /><View style={styles.actions}>{onCancel ? <Button fullWidth={false} label="Cancel" onPress={onCancel} variant="secondary" /> : null}<Button fullWidth={false} label="Add milestone" loading={loading} onPress={onSubmit} /></View></View>;
}
const styles = StyleSheet.create({ actions: { flexDirection: 'row', gap: spacing.xs, justifyContent: 'flex-end' }, wrap: { gap: spacing.sm } });
