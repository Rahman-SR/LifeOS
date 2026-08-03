import type { LucideIcon } from 'lucide-react-native';
import { CalendarCheck2, NotebookPen, Repeat2 } from 'lucide-react-native';
import { router } from 'expo-router';
import { useState } from 'react';
import { StyleSheet, View } from 'react-native';

import { AppText, Button, Card, Screen } from '@/components/ui';
import { useAppTheme } from '@/hooks/use-app-theme';
import { useAuth } from '@/hooks/use-auth';
import { radii, sizing, spacing } from '@/theme';

type OnboardingPage = {
  description: string;
  eyebrow: string;
  icon: LucideIcon;
  title: string;
};

const pages: OnboardingPage[] = [
  {
    description: 'Bring your priorities into one calm daily plan and focus on what matters now.',
    eyebrow: 'DAILY PLANNING',
    icon: CalendarCheck2,
    title: 'Organize your day',
  },
  {
    description: 'Build routines you can repeat, then see your consistency grow one day at a time.',
    eyebrow: 'HABITS',
    icon: Repeat2,
    title: 'Build better habits',
  },
  {
    description: 'Capture your mood and reflections so each day can teach you something useful.',
    eyebrow: 'REFLECTION',
    icon: NotebookPen,
    title: 'Reflect and improve',
  },
];

export default function OnboardingScreen() {
  const { colors } = useAppTheme();
  const { completeOnboarding } = useAuth();
  const [pageIndex, setPageIndex] = useState(0);
  const [isCompleting, setIsCompleting] = useState(false);
  const [completionError, setCompletionError] = useState<string | null>(null);
  const page = pages[pageIndex] ?? pages[0]!;
  const Icon = page.icon;
  const isLastPage = pageIndex === pages.length - 1;

  const finishOnboarding = async () => {
    if (isCompleting) return;
    setIsCompleting(true);
    setCompletionError(null);
    try {
      await completeOnboarding();
      router.replace('/login');
    } catch {
      setCompletionError('Unable to save onboarding progress. Please try again.');
    } finally {
      setIsCompleting(false);
    }
  };

  return (
    <Screen contentContainerStyle={styles.screen} scroll={false}>
      <View style={styles.topBar}>
        <AppText tone="secondary" variant="bodySmall">
          {pageIndex + 1} of {pages.length}
        </AppText>
        {!isLastPage ? (
          <Button
            disabled={isCompleting}
            fullWidth={false}
            label="Skip"
            onPress={() => void finishOnboarding()}
            variant="secondary"
          />
        ) : null}
      </View>

      <Card style={styles.card}>
        <View style={[styles.iconContainer, { backgroundColor: colors.surfaceSecondary }]}>
          <Icon color={colors.primary} size={sizing.iconLarge} />
        </View>
        <AppText tone="brand" variant="caption">
          {page.eyebrow}
        </AppText>
        <AppText align="center" accessibilityRole="header" variant="heading1">
          {page.title}
        </AppText>
        <AppText align="center" tone="secondary" variant="bodyLarge">
          {page.description}
        </AppText>
      </Card>

      <View accessibilityLabel={`Onboarding page ${pageIndex + 1} of ${pages.length}`} style={styles.dots}>
        {pages.map((item, index) => (
          <View
            key={item.title}
            style={[
              styles.dot,
              { backgroundColor: index === pageIndex ? colors.primary : colors.border },
            ]}
          />
        ))}
      </View>

      {completionError ? (
        <AppText accessibilityLiveRegion="polite" accessibilityRole="alert" align="center" tone="danger">
          {completionError}
        </AppText>
      ) : null}

      <Button
        label={isLastPage ? 'Get Started' : 'Next'}
        loading={isCompleting}
        onPress={() => {
          if (isLastPage) void finishOnboarding();
          else setPageIndex((index) => Math.min(index + 1, pages.length - 1));
        }}
      />
    </Screen>
  );
}

const styles = StyleSheet.create({
  card: {
    alignItems: 'center',
    gap: spacing.md,
    paddingVertical: spacing.xxl,
  },
  dot: {
    borderRadius: radii.pill,
    height: spacing.xs,
    width: spacing.xs,
  },
  dots: {
    flexDirection: 'row',
    gap: spacing.xs,
    justifyContent: 'center',
  },
  iconContainer: {
    alignItems: 'center',
    borderRadius: radii.xl,
    height: spacing.giant,
    justifyContent: 'center',
    width: spacing.giant,
  },
  screen: {
    gap: spacing.xl,
    justifyContent: 'space-between',
  },
  topBar: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    minHeight: sizing.controlHeight,
  },
});
