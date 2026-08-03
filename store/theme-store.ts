import { create } from 'zustand';

import type { ThemePreference } from '@/theme';

type ThemeState = {
  preference: ThemePreference;
  setPreference: (preference: ThemePreference) => void;
};

export const useThemeStore = create<ThemeState>((set) => ({
  preference: 'system',
  setPreference: (preference) => set({ preference }),
}));
