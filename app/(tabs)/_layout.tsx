import { Tabs } from 'expo-router';
import { CalendarCheck2, ListTodo, NotebookPen, Repeat2, UserRound } from 'lucide-react-native';

import { useAppTheme } from '@/hooks/use-app-theme';
import { sizing, typography } from '@/theme';

export default function TabsLayout() {
  const { colors } = useAppTheme();

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.textMuted,
        tabBarLabelStyle: typography.caption,
        tabBarStyle: {
          backgroundColor: colors.surface,
          borderTopColor: colors.border,
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Today',
          tabBarIcon: ({ color }) => <CalendarCheck2 color={color} size={sizing.icon} />,
        }}
      />
      <Tabs.Screen
        name="tasks"
        options={{
          title: 'Tasks',
          tabBarIcon: ({ color }) => <ListTodo color={color} size={sizing.icon} />,
        }}
      />
      <Tabs.Screen
        name="habits"
        options={{
          title: 'Habits',
          tabBarIcon: ({ color }) => <Repeat2 color={color} size={sizing.icon} />,
        }}
      />
      <Tabs.Screen
        name="notes"
        options={{
          title: 'Notes',
          tabBarIcon: ({ color }) => <NotebookPen color={color} size={sizing.icon} />,
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profile',
          tabBarIcon: ({ color }) => <UserRound color={color} size={sizing.icon} />,
        }}
      />
    </Tabs>
  );
}
