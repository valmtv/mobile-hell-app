import React from 'react';
import { TouchableOpacity } from 'react-native';
import { Sun, Moon } from '@/components/Icons';
import { Box } from '@/components/ui/box';
import { Text } from '@/components/ui/text';
import { useTheme } from '@/hooks/useTheme';


interface ThemeToggleProps {
  showLabel?: boolean;
  size?: number;
}

export function ThemeToggle({ showLabel = false, size = 16 }: ThemeToggleProps) {
  const { themeMode, toggleTheme } = useTheme();

  const getIcon = () => {
    return themeMode === 'light' 
      ? <Sun size={size} className="stroke-warning-600" />
      : <Moon size={size} className="stroke-info-600"/>;
  };

  const getLabel = () => {
    return themeMode === 'light' ? 'Light' : 'Dark';
  };

  return (
    <TouchableOpacity onPress={toggleTheme} className="active:opacity-70">
      <Box className="flex-row items-center bg-background-100 px-2.5 py-1.5 rounded-full border border-outline-200">
        {getIcon()}
        {showLabel && (
          <Text className="text-typography-600 text-xs font-medium ml-1.5">
            {getLabel()}
          </Text>
        )}
      </Box>
    </TouchableOpacity>
  );
}
