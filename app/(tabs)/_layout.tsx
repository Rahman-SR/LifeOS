import { Tabs } from 'expo-router';
import { CalendarCheck2, ListTodo, NotebookPen, Repeat2, UserRound } from 'lucide-react-native';

import { AppText, TabIconContainer } from '@/components/ui';
import { useAppTheme } from '@/hooks/use-app-theme';
import { shadows, sizing, tabAccentTokens } from '@/theme';

function TabLabel({ accent, focused, label }: { accent: string; focused: boolean; label: string }) {
  return (
    <AppText
      numberOfLines={1}
      style={{ color: accent, fontWeight: focused ? '700' : '500' }}
      variant="caption"
    >
      {label}
    </AppText>
  );
}

export default function TabsLayout() {
  const { colors, isDark } = useAppTheme();
  const accents = tabAccentTokens[isDark ? 'dark' : 'light'];

  return (
    <Tabs
      screenOptions={{
        animation: 'none',
        freezeOnBlur: true,
        headerShown: false,
        lazy: true,
        tabBarHideOnKeyboard: true,
        tabBarInactiveTintColor: colors.textMuted,
        tabBarItemStyle: { minHeight: sizing.touchTarget },
        tabBarStyle: {
          backgroundColor: colors.surface,
          borderTopColor: colors.border,
          borderTopWidth: sizing.border,
          ...(isDark ? { elevation: 0, shadowOpacity: 0 } : shadows.tabBar),
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          tabBarAccessibilityLabel: 'Today tab',
          tabBarActiveTintColor: accents.today.accent,
          tabBarIcon: ({ focused }) => (
            <TabIconContainer
              accentColor={accents.today.accent}
              backgroundColor={accents.today.surface}
              focused={focused}
              icon={CalendarCheck2}
              mutedColor={colors.textMuted}
            />
          ),
          tabBarLabel: ({ focused }) => (
            <TabLabel accent={focused ? accents.today.accent : colors.textMuted} focused={focused} label="Today" />
          ),
          title: 'Today',
        }}
      />
      <Tabs.Screen
        name="tasks"
        options={{
          tabBarAccessibilityLabel: 'Tasks tab',
          tabBarActiveTintColor: accents.tasks.accent,
          tabBarIcon: ({ focused }) => (
            <TabIconContainer
              accentColor={accents.tasks.accent}
              backgroundColor={accents.tasks.surface}
              focused={focused}
              icon={ListTodo}
              mutedColor={colors.textMuted}
            />
          ),
          tabBarLabel: ({ focused }) => (
            <TabLabel accent={focused ? accents.tasks.accent : colors.textMuted} focused={focused} label="Tasks" />
          ),
          title: 'Tasks',
        }}
      />
      <Tabs.Screen
        name="habits"
        options={{
          tabBarAccessibilityLabel: 'Habits tab',
          tabBarActiveTintColor: accents.habits.accent,
          tabBarIcon: ({ focused }) => (
            <TabIconContainer
              accentColor={accents.habits.accent}
              backgroundColor={accents.habits.surface}
              focused={focused}
              icon={Repeat2}
              mutedColor={colors.textMuted}
            />
          ),
          tabBarLabel: ({ focused }) => (
            <TabLabel accent={focused ? accents.habits.accent : colors.textMuted} focused={focused} label="Habits" />
          ),
          title: 'Habits',
        }}
      />
      <Tabs.Screen
        name="notes"
        options={{
          tabBarAccessibilityLabel: 'Notes tab',
          tabBarActiveTintColor: accents.notes.accent,
          tabBarIcon: ({ focused }) => (
            <TabIconContainer
              accentColor={accents.notes.accent}
              backgroundColor={accents.notes.surface}
              focused={focused}
              icon={NotebookPen}
              mutedColor={colors.textMuted}
            />
          ),
          tabBarLabel: ({ focused }) => (
            <TabLabel accent={focused ? accents.notes.accent : colors.textMuted} focused={focused} label="Notes" />
          ),
          title: 'Notes',
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          tabBarAccessibilityLabel: 'Profile tab',
          tabBarActiveTintColor: accents.profile.accent,
          tabBarIcon: ({ focused }) => (
            <TabIconContainer
              accentColor={accents.profile.accent}
              backgroundColor={accents.profile.surface}
              focused={focused}
              icon={UserRound}
              mutedColor={colors.textMuted}
            />
          ),
          tabBarLabel: ({ focused }) => (
            <TabLabel accent={focused ? accents.profile.accent : colors.textMuted} focused={focused} label="Profile" />
          ),
          title: 'Profile',
        }}
      />
    </Tabs>
  );
}
