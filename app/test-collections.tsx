import React, { useState, useCallback, useMemo } from 'react';
import { RefreshControl, FlatList } from 'react-native';
import { router } from 'expo-router';
import { Box } from '@/components/ui/box';
import { Toast, ToastTitle, ToastDescription, useToast } from '@/components/ui/toast';

import CollectionsHeader  from '@/components/collections/CollectionsHeader';
import CollectionCard  from '@/components/collections/CollectionCard';
import { EmptyState } from '@/components/collections/EmptyState';
import { ErrorState } from '@/components/collections/ErrorState';
import { DeleteModal } from '@/components/collections/DeleteModal';
import { DuplicateModal } from '@/components/collections/DuplicateModal';
import SortActionSheet from '@/components/collections/SortActionSheet';
import { CollectionsListSkeleton } from '@/components/skeletons/CollectionsListSkeleton';
import { useCollectionsLogic } from '@/hooks/useCollectionsLogic';
import { useCollectionActions } from '@/hooks/useCollectionActions';
import { Collection } from '@/services/collection-api';

const viewabilityConfig = {
  itemVisiblePercentThreshold: 50,
  minimumViewTime: 250,
};

const CollectionsScreen = () => {
  const toast = useToast();
  
  const {
    allCollections,
    loading,
    refreshing,
    error,
    searchQuery,
    activeFilter,
    sortOption,
    filteredAndSortedCollections,
    setSearchQuery,
    setActiveFilter,
    setSortOption,
    setAllCollections,
    handleRefresh,
    canEditCollection,
  } = useCollectionsLogic({ toast });

  const {
    selectedCollection,
    showDeleteModal,
    showDuplicateModal,
    duplicateTitle,
    duplicateDescription,
    setDuplicateTitle,
    setDuplicateDescription,
    handleStatusChange,
    handleDelete,
    handleDuplicate,
    openDuplicateModal,
    openDeleteModal,
    closeDeleteModal,
    closeDuplicateModal,
  } = useCollectionActions({
    allCollections,
    setAllCollections,
    toast,
  });

  // Sort modal state
  const [showSortOptions, setShowSortOptions] = useState(false);

  const hasFilters = useMemo(() => 
    searchQuery !== '' || activeFilter !== 'all', 
    [searchQuery, activeFilter]
  );

  const navigateToNew = useCallback(() => {
    router.push('/collections/new');
  }, []);

  const navigateToHome = useCallback(() => router.push('/home'), []);
  const showSortModal = useCallback(() => setShowSortOptions(true), []);
  const closeSortModal = useCallback(() => setShowSortOptions(false), []);

  // sort option change
  const handleSortChange = useCallback((newSortOption: string) => {
    setSortOption(newSortOption);
    
    // Show toast for sort change
    const sortLabels: Record<string, string> = {
      'updated-newest': 'Recently Updated',
      'updated-oldest': 'Oldest Updated',
      'created-newest': 'Recently Created',
      'created-oldest': 'Oldest Created',
      'questions-high': 'Most Questions',
      'questions-low': 'Fewest Questions',
    };
    
    toast.show({
      placement: 'bottom',
      render: ({ id }) => {
        const toastId = 'toast-' + id;
        return (
          <Toast nativeID={toastId} action="info" variant="solid">
            <ToastTitle>Sorted</ToastTitle>
            <ToastDescription>Collections sorted by {sortLabels[newSortOption] || newSortOption}</ToastDescription>
          </Toast>
        );
      },
    });
  }, [setSortOption, toast]);

  // Memoized render function
  const renderCollectionCard = useCallback(
    ({ item: collection }: { item: Collection }) => (
      <CollectionCard
        collection={collection}
        canEdit={canEditCollection(collection)}
        onStatusChange={handleStatusChange}
        onDelete={openDeleteModal}
        onDuplicate={openDuplicateModal}
      />
    ),
    [canEditCollection, handleStatusChange, openDeleteModal, openDuplicateModal]
  );

  // Memoized key extractor
  const keyExtractor = useCallback((item: Collection) => item.id, []);

  // Memoized content container style
  const contentContainerStyle = useMemo(() => ({ 
    paddingTop: 16, 
    paddingBottom: 32 
  }), []);

  return (
    <Box className="flex-1 bg-background-50">
      <CollectionsHeader
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        activeFilter={activeFilter}
        onFilterChange={setActiveFilter}
        onShowSort={showSortModal}
        onCreateNew={navigateToNew}
        onGoHome={navigateToHome}
        currentSort={sortOption}
        disabled={loading} // Disable interactions during loading
      />

      {loading ? (
        <CollectionsListSkeleton count={4} />
      ) : error ? (
        <ErrorState error={error} onRetry={handleRefresh} />
      ) : filteredAndSortedCollections.length === 0 ? (
        <EmptyState hasFilters={hasFilters} onCreateNew={navigateToNew} />
      ) : (
        <FlatList
          data={filteredAndSortedCollections}
          renderItem={renderCollectionCard}
          keyExtractor={keyExtractor}
          contentContainerStyle={contentContainerStyle}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
          }
          // Performance optimizations
          removeClippedSubviews={true}
          maxToRenderPerBatch={3}
          windowSize={3}
          initialNumToRender={6}
          updateCellsBatchingPeriod={30}
          viewabilityConfig={viewabilityConfig}
          disableVirtualization={false}
          legacyImplementation={false}
        />
      )}

      {/* Sort ActionSheet */}
      <SortActionSheet
        isOpen={showSortOptions}
        onClose={closeSortModal}
        currentSort={sortOption}
        onSortChange={handleSortChange}
      />

      <DeleteModal
        isOpen={showDeleteModal}
        collection={selectedCollection}
        onClose={closeDeleteModal}
        onConfirm={handleDelete}
      />

      <DuplicateModal
        isOpen={showDuplicateModal}
        collection={selectedCollection}
        title={duplicateTitle}
        description={duplicateDescription}
        onTitleChange={setDuplicateTitle}
        onDescriptionChange={setDuplicateDescription}
        onClose={closeDuplicateModal}
        onConfirm={handleDuplicate}
      />
    </Box>
  );
};

export default CollectionsScreen;