import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { STORAGE_KEYS } from '@/constants';

type Theme = 'light' | 'dark' | 'system';

interface ThemeState {
  theme: Theme;
  setTheme: (theme: Theme) => void;
}

export const useThemeStore = create<ThemeState>()(
  persist(
    (set) => ({
      theme: 'light',

      setTheme: (_theme: Theme) => {
        set({ theme: 'light' });
        if (typeof window !== 'undefined') {
          const root = window.document.documentElement;
          root.classList.remove('dark');
          root.classList.add('light');
        }
      },
    }),
    {
      name: STORAGE_KEYS.THEME,
    }
  )
);
