import type { LucideIcon } from 'lucide-react-native';
import { StyleSheet, View } from 'react-native';

import { radii, sizing } from '@/theme';

export function TabIconContainer({
  accentColor,
  backgroundColor,
  focused,
  icon: Icon,
  mutedColor,
}: {
  accentColor: string;
  backgroundColor: string;
  focused: boolean;
  icon: LucideIcon;
  mutedColor: string;
}) {
  return (
    <View style={[styles.container, focused && { backgroundColor }]}>
      <Icon
        color={focused ? accentColor : mutedColor}
        size={sizing.icon}
        strokeWidth={focused ? 2.6 : 2}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    borderRadius: radii.pill,
    height: sizing.tabIconContainerHeight,
    justifyContent: 'center',
    width: sizing.tabIconContainerWidth,
  },
});
