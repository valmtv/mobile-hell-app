import React from 'react';
import { VStack } from '@/components/ui/vstack';
import { Text } from '@/components/ui/text';
import { Button, ButtonText, ButtonIcon } from '@/components/ui/button';
import { Library, Plus } from '@/components/Icons';

interface EmptyStateProps {
  hasFilters: boolean;
  onCreateNew: () => void;
}

export const EmptyState: React.FC<EmptyStateProps> = ({ hasFilters, onCreateNew }) => {
  return (
    <VStack className="flex-1 justify-center items-center px-8 pb-12">
      <Library className="w-16 h-16 stroke-typography-400 mb-4" />
      <Text className="text-xl font-semibold text-typography-900 mb-2">No collections found</Text>
      <Text className="text-typography-600 text-center mb-6">
        {hasFilters 
          ? "Try adjusting your search or filters" 
          : "Create your first collection to get started"}
      </Text>
      <Button onPress={onCreateNew}>
        <ButtonIcon as={Plus} size="sm" className="mr-2" />
        <ButtonText>Create Collection</ButtonText>
      </Button>
    </VStack>
  );
};
