import React, { memo, useCallback, useMemo } from 'react';
import { VStack } from '@/components/ui/vstack';
import { HStack } from '@/components/ui/hstack';
import { Text } from '@/components/ui/text';
import { Input, InputField } from '@/components/ui/input';
import { Button, ButtonText, ButtonIcon } from '@/components/ui/button';
import {
  Plus,
  SortAsc,
  Home,
} from '@/components/Icons';

interface CollectionsHeaderProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  activeFilter: 'all' | 'draft' | 'published' | 'archived';
  onFilterChange: (filter: 'all' | 'draft' | 'published' | 'archived') => void;
  onShowSort: () => void;
  onCreateNew: () => void;
  onGoHome: () => void;
  currentSort: string;
  disabled?: boolean;
}

const FILTER_OPTIONS = ['all', 'draft', 'published', 'archived'] as const;

const CollectionsHeader: React.FC<CollectionsHeaderProps> = ({
  searchQuery,
  onSearchChange,
  activeFilter,
  onFilterChange,
  onShowSort,
  onCreateNew,
  onGoHome,
  currentSort,
  disabled = false,
}) => {
  // Memoized filter buttons
  const filterButtons = useMemo(() => 
    FILTER_OPTIONS.map((filter) => {
      const isActive = activeFilter === filter;
      return (
        <FilterButton
          key={filter}
          filter={filter}
          isActive={isActive}
          onPress={onFilterChange}
          disabled={disabled}
        />
      );
    }),
    [activeFilter, onFilterChange, disabled]
  );

  const currentSortLabel = useMemo(() => {
    const labels = {
      'updated-newest': 'Recent',
      'updated-oldest': 'Oldest',
      'created-newest': 'New',
      'created-oldest': 'Old',
      'questions-high': 'Most Q',
      'questions-low': 'Few Q',
    };
    return labels[currentSort as keyof typeof labels] || 'Sort';
  }, [currentSort]);

  // Disabled handlers
  const handleSearchChange = useCallback((query: string) => {
    if (!disabled) {
      onSearchChange(query);
    }
  }, [disabled, onSearchChange]);

  const handleShowSort = useCallback(() => {
    if (!disabled) {
      onShowSort();
    }
  }, [disabled, onShowSort]);

  return (
    <VStack className="bg-background-0 shadow-soft-1 pt-16 pb-4">
      <HStack className="justify-between items-center px-4 py-3">
        <HStack className="items-center space-x-3 flex-1">
          <Button
            variant="link"
            size="sm"
            onPress={onGoHome}
            className="p-2"
            disabled={disabled}
          >
            <ButtonIcon as={Home} size="md" />
          </Button>
          <VStack className="flex-1 min-w-0">
            <Text className="text-2xl font-bold text-typography-900">Test Collections</Text>
            <Text className="text-typography-600 text-sm">Create and manage your test question collections</Text>
          </VStack>
        </HStack>
        <Button 
          onPress={onCreateNew} 
          size="sm"
        >
          <ButtonIcon as={Plus} size="sm" />
        </Button>
      </HStack>
      
      {/* Search and Filters */}
      <VStack className="px-4">
        <Input className={`mb-3 ${disabled ? 'opacity-50' : ''}`}>
          <InputField
            placeholder="Search collections..."
            value={searchQuery}
            onChangeText={handleSearchChange}
            editable={!disabled}
          />
        </Input>
        
        <HStack className="justify-between items-center">
          <HStack className="space-x-1 flex-1 overflow-hidden">
            {filterButtons}
          </HStack>
          
          <Button
            variant="outline"
            size="sm"
            onPress={handleShowSort}
            className="flex-shrink-0"
            disabled={disabled}
          >
            <HStack className="items-center space-x-1">
              <ButtonIcon as={SortAsc} size="sm" />
              <ButtonText className="text-xs">
                {currentSortLabel}
              </ButtonText>
            </HStack>
          </Button>
        </HStack>
      </VStack>
    </VStack>
  );
};

// Separate memoized component for filter buttons
const FilterButton: React.FC<{
  filter: 'all' | 'draft' | 'published' | 'archived';
  isActive: boolean;
  onPress: (filter: 'all' | 'draft' | 'published' | 'archived') => void;
  disabled?: boolean;
}> = memo(({ filter, isActive, onPress, disabled = false }) => {
  const handlePress = useCallback(() => {
    if (!disabled) {
      onPress(filter);
    }
  }, [filter, onPress, disabled]);

  return (
    <Button
      variant={isActive ? "solid" : "outline"}
      size="sm"
      onPress={handlePress}
      className="flex-shrink-0"
      disabled={disabled}
    >
      <ButtonText className="capitalize text-xs">{filter === 'published' ? 'Public' : filter}</ButtonText>
    </Button>
  );
});

FilterButton.displayName = 'FilterButton';

export default memo(CollectionsHeader);