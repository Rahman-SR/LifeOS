import type { Session, User } from '@supabase/supabase-js';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { createContext, useCallback, useEffect, useMemo, useState, type PropsWithChildren } from 'react';
import { AppState, Platform } from 'react-native';

import {
  getProfile,
  markProfileOnboardingComplete,
  type Profile,
} from '@/features/auth/auth-service';
import {
  getOnboardingCompleted,
  setOnboardingCompleted,
} from '@/features/auth/auth-storage';
import { getSupabaseClient, isSupabaseConfigured } from '@/lib/supabase';

export type AuthContextValue = {
  completeOnboarding: () => Promise<void>;
  hasCompletedOnboarding: boolean;
  isLoading: boolean;
  profile: Profile | null;
  profileError: string | null;
  refreshProfile: () => Promise<void>;
  session: Session | null;
  signOut: () => Promise<void>;
  user: User | null;
};

export const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: PropsWithChildren) {
  const queryClient = useQueryClient();
  const [session, setSession] = useState<Session | null>(null);
  const [isSessionLoading, setIsSessionLoading] = useState(true);
  const [isOnboardingLoading, setIsOnboardingLoading] = useState(true);
  const [localOnboardingCompleted, setLocalOnboardingCompleted] = useState(false);

  useEffect(() => {
    let isMounted = true;

    getOnboardingCompleted()
      .then((completed) => {
        if (isMounted) setLocalOnboardingCompleted(completed);
      })
      .catch(() => {
        if (isMounted) setLocalOnboardingCompleted(false);
      })
      .finally(() => {
        if (isMounted) setIsOnboardingLoading(false);
      });

    if (!isSupabaseConfigured) {
      setIsSessionLoading(false);
      return () => {
        isMounted = false;
      };
    }

    const client = getSupabaseClient();
    const {
      data: { subscription },
    } = client.auth.onAuthStateChange((_event, nextSession) => {
      if (!isMounted) return;
      setSession(nextSession);
      setIsSessionLoading(false);
    });

    client.auth
      .getSession()
      .then(({ data, error }) => {
        if (!isMounted) return;
        if (error) throw error;
        setSession(data.session);
      })
      .catch(() => {
        if (isMounted) setSession(null);
      })
      .finally(() => {
        if (isMounted) setIsSessionLoading(false);
      });

    return () => {
      isMounted = false;
      subscription.unsubscribe();
    };
  }, []);

  useEffect(() => {
    if (!isSupabaseConfigured || Platform.OS === 'web') return;

    const client = getSupabaseClient();
    if (AppState.currentState === 'active') client.auth.startAutoRefresh();

    const subscription = AppState.addEventListener('change', (state) => {
      if (state === 'active') client.auth.startAutoRefresh();
      else client.auth.stopAutoRefresh();
    });

    return () => {
      subscription.remove();
      client.auth.stopAutoRefresh();
    };
  }, []);

  const profileQuery = useQuery({
    queryKey: ['profile', session?.user.id],
    queryFn: () => getProfile(session!.user.id),
    enabled: Boolean(session?.user.id),
  });
  const profile = session ? (profileQuery.data ?? null) : null;

  const refreshProfile = useCallback(async () => {
    await profileQuery.refetch();
  }, [profileQuery]);

  useEffect(() => {
    if (
      !session?.user.id ||
      !localOnboardingCompleted ||
      !profile ||
      profile.onboarding_completed
    ) {
      return;
    }

    markProfileOnboardingComplete(session.user.id)
      .then(() => queryClient.invalidateQueries({ queryKey: ['profile', session.user.id] }))
      .catch(() => undefined);
  }, [localOnboardingCompleted, profile, queryClient, session?.user.id]);

  const completeOnboarding = useCallback(async () => {
    await setOnboardingCompleted();
    setLocalOnboardingCompleted(true);

    if (session?.user.id) {
      await markProfileOnboardingComplete(session.user.id);
      await queryClient.invalidateQueries({ queryKey: ['profile', session.user.id] });
    }
  }, [queryClient, session?.user.id]);

  const signOut = useCallback(async () => {
    const { error } = await getSupabaseClient().auth.signOut();
    if (error) throw error;
    queryClient.removeQueries({ queryKey: ['profile'] });
  }, [queryClient]);

  const value = useMemo<AuthContextValue>(
    () => ({
      completeOnboarding,
      hasCompletedOnboarding:
        localOnboardingCompleted || Boolean(profile?.onboarding_completed),
      isLoading:
        isSessionLoading ||
        isOnboardingLoading ||
        (Boolean(session) && profileQuery.isLoading),
      profile,
      profileError: profileQuery.error
        ? 'Your account is signed in, but the profile could not be loaded.'
        : null,
      refreshProfile,
      session,
      signOut,
      user: session?.user ?? null,
    }),
    [
      completeOnboarding,
      isOnboardingLoading,
      isSessionLoading,
      localOnboardingCompleted,
      profile,
      profileQuery.error,
      profileQuery.isLoading,
      refreshProfile,
      session,
      signOut,
    ],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
