import React, { memo, useCallback } from 'react';
import {
  Actionsheet,
  ActionsheetBackdrop,
  ActionsheetContent,
  ActionsheetDragIndicator,
  ActionsheetDragIndicatorWrapper,
  ActionsheetItem,
  ActionsheetItemText,
} from '@/components/ui/actionsheet';
import { VStack } from '@/components/ui/vstack';
import { HStack } from '@/components/ui/hstack';
import { Text } from '@/components/ui/text';
import { Check } from '@/components/Icons';

interface SortActionSheetProps {
  isOpen: boolean;
  onClose: () => void;
  currentSort: string;
  onSortChange: (sortOption: string) => void;
}

const SORT_OPTIONS = [
  { value: 'updated-newest', label: 'Recently Updated' },
  { value: 'updated-oldest', label: 'Oldest Updated' },
  { value: 'created-newest', label: 'Recently Created' },
  { value: 'created-oldest', label: 'Oldest Created' },
  { value: 'questions-high', label: 'Most Questions' },
  { value: 'questions-low', label: 'Fewest Questions' },
] as const;

const SortActionSheet: React.FC<SortActionSheetProps> = memo(({
  isOpen,
  onClose,
  currentSort,
  onSortChange,
}) => {
  const handleSortSelect = useCallback((sortValue: string) => {
    onSortChange(sortValue);
    onClose();
  }, [onSortChange, onClose]);

  return (
    <Actionsheet isOpen={isOpen} onClose={onClose}>
      <ActionsheetBackdrop />
      <ActionsheetContent className="pb-8">
        <ActionsheetDragIndicatorWrapper>
          <ActionsheetDragIndicator />
        </ActionsheetDragIndicatorWrapper>
        
        <VStack className="w-full px-4 pt-4">
          <Text className="text-lg font-semibold text-typography-900 mb-4">
            Sort Collections
          </Text>
          
          <VStack className="w-full space-y-1">
            {SORT_OPTIONS.map(({ value, label }) => (
              <ActionsheetItem
                key={value}
                onPress={() => handleSortSelect(value)}
                className="w-full"
              >
                <HStack className="justify-between items-center w-full py-2">
                  <ActionsheetItemText className="text-typography-900">
                    {label}
                  </ActionsheetItemText>
                  {currentSort === value && (
                    <Check size={20} className="text-primary-600" />
                  )}
                </HStack>
              </ActionsheetItem>
            ))}
          </VStack>
        </VStack>
      </ActionsheetContent>
    </Actionsheet>
  );
});

SortActionSheet.displayName = 'SortActionSheet';

export default SortActionSheet;
