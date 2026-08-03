import * as SecureStore from 'expo-secure-store';
import { Platform } from 'react-native';

const onboardingStorageKey = 'lifeos.onboarding.completed';

export async function getOnboardingCompleted(): Promise<boolean> {
  if (Platform.OS === 'web') {
    return typeof localStorage !== 'undefined'
      ? localStorage.getItem(onboardingStorageKey) === 'true'
      : false;
  }

  return (await SecureStore.getItemAsync(onboardingStorageKey)) === 'true';
}

export async function setOnboardingCompleted(): Promise<void> {
  if (Platform.OS === 'web') {
    if (typeof localStorage !== 'undefined') {
      localStorage.setItem(onboardingStorageKey, 'true');
    }
    return;
  }

  await SecureStore.setItemAsync(onboardingStorageKey, 'true');
}
