import { useColorScheme } from 'nativewind';
import { useState } from 'react';
import { script } from '@/components/ui/gluestack-ui-provider/script';

export type ThemeMode = 'light' | 'dark' | 'system';

export function useTheme() {
  const { colorScheme, setColorScheme } = useColorScheme();
  const [themeMode, setThemeMode] = useState<ThemeMode>('system');

  const toggleTheme = () => {
    const nextTheme: ThemeMode = themeMode === 'light' ? 'dark' : 'light';
    setThemeMode(nextTheme);
    setColorScheme(nextTheme);
  };

  const setTheme = (mode: ThemeMode) => {
    setThemeMode(mode);
    setColorScheme(mode);
  };

  return {
    colorScheme,
    themeMode,
    toggleTheme,
    setTheme,
    isDark: colorScheme === 'dark',
  };
}
