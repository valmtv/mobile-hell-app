import React from 'react';
import { Box } from '@/components/ui/box';
import { Text } from '@/components/ui/text';
import { Button, ButtonText } from '@/components/ui/button';
import { AlertTriangle, RefreshCw } from '@/components/Icons';
import { VStack } from '@/components/ui/vstack';

interface ErrorStateProps {
  error: Error | string;
  onRetry: () => void;
}

export const ErrorState: React.FC<ErrorStateProps> = ({ error, onRetry }) => {
  const errorMessage = error instanceof Error ? error.message : error;

  return (
    <Box className="flex-1 justify-center items-center px-6 py-12">
      <VStack space="lg" className="items-center max-w-sm">
        <Box className="w-16 h-16 rounded-full bg-error-50 items-center justify-center">
          <AlertTriangle className="text-error-500" size={32} />
        </Box>
        
        <VStack space="sm" className="items-center">
          <Text className="text-lg font-semibold text-typography-900 text-center">
            Oops! Something went wrong
          </Text>
          <Text className="text-typography-600 text-center leading-relaxed">
            {errorMessage}
          </Text>
        </VStack>
        
        <Button
          variant="outline"
          action="primary"
          onPress={onRetry}
          className="min-w-[120px]"
        >
          <RefreshCw className="mr-2" size={16} />
          <ButtonText>Try Again</ButtonText>
        </Button>
      </VStack>
    </Box>
  );
};