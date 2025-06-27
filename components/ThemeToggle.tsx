import React from 'react';
import { TouchableOpacity } from 'react-native';
import { Sun, Moon } from 'lucide-react-native';
import { Box } from '@/components/ui/box';
import { Text } from '@/components/ui/text';
import { useTheme } from '@/hooks/useTheme';

interface ThemeToggleProps {
  showLabel?: boolean;
  size?: number;
}

export function ThemeToggle({ showLabel = false, size = 20 }: ThemeToggleProps) {
  const { themeMode, toggleTheme } = useTheme();

  const getIcon = () => {
    return themeMode === 'light' 
      ? <Sun size={size} className="text-typography-700" />
      : <Moon size={size} className="text-typography-700" />;
  };

  const getLabel = () => {
    return themeMode === 'light' ? 'Light' : 'Dark';
  };

  return (
    <TouchableOpacity onPress={toggleTheme}>
      <Box className="flex-row items-center p-2 rounded-lg">
        {getIcon()}
        {showLabel && (
          <Text className="text-typography-700 text-sm font-medium ml-2">
            {getLabel()}
          </Text>
        )}
      </Box>
    </TouchableOpacity>
  );
}