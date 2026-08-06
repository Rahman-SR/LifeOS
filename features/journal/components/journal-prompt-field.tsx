import { TextField } from '@/components/ui';
import { spacing } from '@/theme';

export function JournalPromptField({ editable, error, label, onBlur, onChangeText, placeholder, value }: { editable?: boolean; error?: string; label: string; onBlur: () => void; onChangeText: (value: string) => void; placeholder: string; value: string }) {
  return <TextField editable={editable} error={error} label={label} multiline onBlur={onBlur} onChangeText={onChangeText} placeholder={placeholder} style={{ minHeight: spacing.giant + spacing.lg }} textAlignVertical="top" value={value} />;
}
