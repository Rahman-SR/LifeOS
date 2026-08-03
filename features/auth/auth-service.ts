import type { Session } from '@supabase/supabase-js';

import { getSupabaseClient } from '@/lib/supabase';
import type { Tables } from '@/types/database';

export type Profile = Tables<'profiles'>;

export async function signInWithEmail(email: string, password: string): Promise<Session> {
  const { data, error } = await getSupabaseClient().auth.signInWithPassword({
    email: email.trim().toLowerCase(),
    password,
  });

  if (error) throw error;
  return data.session;
}

export async function registerWithEmail(
  displayName: string,
  email: string,
  password: string,
): Promise<Session | null> {
  const { data, error } = await getSupabaseClient().auth.signUp({
    email: email.trim().toLowerCase(),
    password,
    options: {
      data: {
        display_name: displayName.trim(),
      },
    },
  });

  if (error) throw error;
  return data.session;
}

export async function sendPasswordReset(email: string): Promise<void> {
  const { error } = await getSupabaseClient().auth.resetPasswordForEmail(
    email.trim().toLowerCase(),
  );

  if (error) throw error;
}

export async function getProfile(userId: string): Promise<Profile> {
  const { data, error } = await getSupabaseClient()
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .single();

  if (error) throw error;
  return data;
}

export async function markProfileOnboardingComplete(userId: string): Promise<void> {
  const { error } = await getSupabaseClient()
    .from('profiles')
    .update({ onboarding_completed: true })
    .eq('id', userId);

  if (error) throw error;
}

export function getAuthErrorMessage(error: unknown): string {
  const message = error instanceof Error ? error.message : 'Something went wrong. Please try again.';
  const normalized = message.toLowerCase();

  if (normalized.includes('invalid login credentials')) {
    return 'The email or password is incorrect.';
  }
  if (normalized.includes('email not confirmed')) {
    return 'Verify your email address before signing in.';
  }
  if (normalized.includes('user already registered')) {
    return 'An account with this email already exists.';
  }
  if (normalized.includes('rate limit') || normalized.includes('too many requests')) {
    return 'Too many attempts. Wait a moment and try again.';
  }
  if (normalized.includes('network') || normalized.includes('fetch')) {
    return 'Unable to connect. Check your internet connection and try again.';
  }

  return message;
}
