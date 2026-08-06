import type { PropsWithChildren } from 'react';
import { StyleSheet, View, type StyleProp, type ViewStyle } from 'react-native';

import { spacing } from '@/theme';

export function MetadataRow({ children, style }: PropsWithChildren<{ style?: StyleProp<ViewStyle> }>) {
  return <View style={[styles.row, style]}>{children}</View>;
}

const styles = StyleSheet.create({
  row: { alignItems: 'center', flexDirection: 'row', flexWrap: 'wrap', gap: spacing.xs },
});
