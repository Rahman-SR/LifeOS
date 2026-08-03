import type { PropsWithChildren } from 'react';
import {
  ScrollView,
  StyleSheet,
  View,
  type ScrollViewProps,
  type StyleProp,
  type ViewStyle,
} from 'react-native';
import { SafeAreaView, type Edge } from 'react-native-safe-area-context';

import { useAppTheme } from '@/hooks/use-app-theme';
import { spacing } from '@/theme';

type ScreenProps = PropsWithChildren<{
  contentContainerStyle?: StyleProp<ViewStyle>;
  edges?: Edge[];
  padded?: boolean;
  scroll?: boolean;
  scrollProps?: Omit<ScrollViewProps, 'contentContainerStyle'>;
  style?: StyleProp<ViewStyle>;
}>;

export function Screen({
  children,
  contentContainerStyle,
  edges = ['top', 'left', 'right'],
  padded = true,
  scroll = true,
  scrollProps,
  style,
}: ScreenProps) {
  const { colors } = useAppTheme();
  const contentStyle = [
    styles.content,
    padded && styles.padded,
    contentContainerStyle,
  ];

  return (
    <SafeAreaView edges={edges} style={[styles.safeArea, { backgroundColor: colors.background }, style]}>
      {scroll ? (
        <ScrollView
          contentContainerStyle={contentStyle}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
          {...scrollProps}
        >
          {children}
        </ScrollView>
      ) : (
        <View style={contentStyle}>{children}</View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  content: {
    flexGrow: 1,
  },
  padded: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
  },
});
