import { Search, X } from 'lucide-react-native';
import { StyleSheet, TextInput, View } from 'react-native';

import { IconButton } from '@/components/ui';
import { useAppTheme } from '@/hooks/use-app-theme';
import { radii, sizing, spacing, typography } from '@/theme';

export function JournalSearchBar({ onChangeText, value }: { onChangeText: (value: string) => void; value: string }) {
  const { colors } = useAppTheme();
  return <View style={[styles.container, { backgroundColor: colors.surface, borderColor: colors.border }]}>
    <Search color={colors.textMuted} size={sizing.icon} />
    <TextInput accessibilityLabel="Search journal entries" autoCapitalize="none" onChangeText={onChangeText} placeholder="Search journal and reflections" placeholderTextColor={colors.textMuted} returnKeyType="search" style={[styles.input, typography.body, { color: colors.textPrimary }]} value={value} />
    {value ? <IconButton icon={X} label="Clear journal search" onPress={() => onChangeText('')} /> : null}
  </View>;
}

const styles = StyleSheet.create({ container: { alignItems: 'center', borderRadius: radii.medium, borderWidth: sizing.border, flexDirection: 'row', minHeight: sizing.controlHeight, paddingLeft: spacing.md }, input: { flex: 1, minHeight: sizing.touchTarget, paddingHorizontal: spacing.sm } });
