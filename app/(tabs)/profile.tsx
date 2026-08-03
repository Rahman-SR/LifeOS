import { useState } from 'react';
import { StyleSheet, View } from 'react-native';

import { AppHeader, AppText, Button, Card, Screen, SectionHeader } from '@/components/ui';
import { getAuthErrorMessage } from '@/features/auth/auth-service';
import { useAuth } from '@/hooks/use-auth';
import { useThemeStore } from '@/store/theme-store';
import { spacing, type ThemePreference } from '@/theme';

const themeOptions: ThemePreference[] = ['system', 'light', 'dark'];
const themeLabels: Record<ThemePreference, string> = {
  system: 'System',
  light: 'Light',
  dark: 'Dark',
};

export default function ProfileScreen() {
  const { profile, profileError, refreshProfile, signOut, user } = useAuth();
  const preference = useThemeStore((state) => state.preference);
  const setPreference = useThemeStore((state) => state.setPreference);
  const [isSigningOut, setIsSigningOut] = useState(false);
  const [signOutError, setSignOutError] = useState<string | null>(null);
  const displayName = profile?.display_name ?? user?.user_metadata.display_name ?? 'LifeOS User';

  const handleSignOut = async () => {
    if (isSigningOut) return;
    setIsSigningOut(true);
    setSignOutError(null);
    try {
      await signOut();
    } catch (error) {
      setSignOutError(getAuthErrorMessage(error));
    } finally {
      setIsSigningOut(false);
    }
  };

  return (
    <Screen contentContainerStyle={styles.screen}>
      <AppHeader eyebrow="PROFILE" subtitle="Your authenticated LifeOS account." title={displayName} />

      <View style={styles.section}>
        <SectionHeader title="Account" />
        <Card style={styles.card}>
          <AppText variant="title">{displayName}</AppText>
          <AppText tone="secondary">{user?.email ?? 'No email available'}</AppText>
          <AppText tone={user?.email_confirmed_at ? 'brand' : 'danger'} variant="bodySmall">
            {user?.email_confirmed_at ? 'Email verified' : 'Email verification pending'}
          </AppText>
          {profileError ? (
            <>
              <AppText accessibilityRole="alert" tone="danger" variant="bodySmall">
                {profileError}
              </AppText>
              <Button
                label="Retry profile"
                onPress={() => void refreshProfile()}
                variant="secondary"
              />
            </>
          ) : null}
        </Card>
      </View>

      <View style={styles.section}>
        <SectionHeader subtitle="Choose how LifeOS looks on this device." title="Appearance" />
        <Card style={styles.card}>
          {themeOptions.map((option) => (
            <Button
              key={option}
              label={themeLabels[option]}
              onPress={() => setPreference(option)}
              variant={preference === option ? 'primary' : 'secondary'}
            />
          ))}
        </Card>
      </View>

      {signOutError ? (
        <AppText accessibilityLiveRegion="polite" accessibilityRole="alert" tone="danger">
          {signOutError}
        </AppText>
      ) : null}
      <Button
        accessibilityLabel="Log out of LifeOS"
        label="Log out"
        loading={isSigningOut}
        onPress={() => void handleSignOut()}
        variant="destructive"
      />
    </Screen>
  );
}

const styles = StyleSheet.create({
  card: {
    gap: spacing.sm,
  },
  screen: {
    gap: spacing.xl,
  },
  section: {
    gap: spacing.sm,
  },
});
