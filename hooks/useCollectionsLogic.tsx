import { useState, useEffect, useCallback, useMemo } from 'react';
import { useCollectionAPI, type Collection } from '@/services/collection-api';
import { useAuth } from '@/context/AuthContext';
import { Toast, ToastTitle, ToastDescription } from '@/components/ui/toast';

interface UseCollectionsLogicProps {
  toast?: any;
}

export const useCollectionsLogic = ({ toast }: UseCollectionsLogicProps = {}) => {
  const { userData } = useAuth();
  const collectionAPI = useCollectionAPI();
  
  // State
  const [allCollections, setAllCollections] = useState<Collection[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState('');
  
  // Filters and sorting
  const [activeFilter, setActiveFilter] = useState<'all' | 'draft' | 'published' | 'archived'>('all');
  const [sortOption, setSortOption] = useState('updated-newest');

  // Debounce search query
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchQuery(searchQuery);
    }, 300);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Load collections
  const loadCollections = useCallback(async (showSuccessToast = false) => {
    try {
      setError(null);
      const data = await collectionAPI.fetchCollections();
      setAllCollections(data);
      
      // Show success toast only on manual refresh
      if (showSuccessToast && toast) {
        toast.show({
          placement: 'bottom',
          duration: 3000,
          render: ({ id }) => {
            const toastId = 'toast-' + id;
            return (
              <Toast 
                nativeID={toastId} 
                action="success" 
                variant="solid"
              >
                <ToastTitle>
                  Collections Refreshed
                </ToastTitle>
                <ToastDescription>
                  Your collections have been updated successfully
                </ToastDescription>
              </Toast>
            );
          },
        });
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to load collections';
      setError(errorMessage);
      
      // Show error toast
      if (toast) {
        toast.show({
          placement: 'bottom',
          duration: 4000,
          render: ({ id }) => {
            const toastId = 'toast-' + id;
            return (
              <Toast 
                nativeID={toastId} 
                action="error" 
                variant="solid"
              >
                <ToastTitle>
                  Failed to Load Collections
                </ToastTitle>
                <ToastDescription>
                  {errorMessage}
                </ToastDescription>
              </Toast>
            );
          },
        });
      }
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [collectionAPI, toast]);

  // Initial load
  useEffect(() => {
    loadCollections(false); // Don't show success toast on initial load
  }, [loadCollections]);

  // Memoized sort function
  const sortedCollections = useMemo(() => {
    if (!allCollections.length) return [];
    
    const collectionsToSort = [...allCollections];
    
    switch (sortOption) {
      case 'updated-newest':
        collectionsToSort.sort((a, b) => new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime());
        break;
      case 'updated-oldest':
        collectionsToSort.sort((a, b) => new Date(a.updated_at).getTime() - new Date(b.updated_at).getTime());
        break;
      case 'created-newest':
        collectionsToSort.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
        break;
      case 'created-oldest':
        collectionsToSort.sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime());
        break;
      case 'questions-high':
        collectionsToSort.sort((a, b) => (b.question_count || 0) - (a.question_count || 0));
        break;
      case 'questions-low':
        collectionsToSort.sort((a, b) => (a.question_count || 0) - (b.question_count || 0));
        break;
    }
    
    // Ensure archived items are at the end
    return collectionsToSort.sort((a, b) => {
      if (a.status === 'archived' && b.status !== 'archived') return 1;
      if (a.status !== 'archived' && b.status === 'archived') return -1;
      return 0;
    });
  }, [allCollections, sortOption]);

  // Apply filters and sorting
  const filteredAndSortedCollections = useMemo(() => {
    if (!sortedCollections.length) return [];
    
    return sortedCollections.filter(collection => {
      // Status filter
      if (activeFilter !== 'all' && activeFilter !== collection.status) return false;
      
      // Search query filter
      if (debouncedSearchQuery) {
        const query = debouncedSearchQuery.toLowerCase();
        const titleMatch = collection.title.toLowerCase().includes(query);
        const descriptionMatch = collection.description.toLowerCase().includes(query);
        if (!titleMatch && !descriptionMatch) return false;
      }
      
      return true;
    });
  }, [sortedCollections, activeFilter, debouncedSearchQuery]);

  // Memoized functions
  const canEditCollection = useCallback((collection: Collection) => 
    userData && collection.created_by?.id === userData.id, [userData]);

  const handleRefresh = useCallback(() => {
    setRefreshing(true);
    loadCollections(true); // Show success toast on manual refresh
  }, [loadCollections]);

  // Memoized setters
  const memoizedSetActiveFilter = useCallback((filter: 'all' | 'draft' | 'published' | 'archived') => {
    setActiveFilter(filter);
  }, []);

  const memoizedSetSearchQuery = useCallback((query: string) => {
    setSearchQuery(query);
  }, []);

  const memoizedSetSortOption = useCallback((option: string) => {
    setSortOption(option);
  }, []);

  return {
    // State
    allCollections,
    loading,
    refreshing,
    error,
    searchQuery,
    activeFilter,
    sortOption,
    filteredAndSortedCollections, // Return filtered data directly
    
    // Actions
    setSearchQuery: memoizedSetSearchQuery,
    setActiveFilter: memoizedSetActiveFilter,
    setSortOption: memoizedSetSortOption,
    setAllCollections,
    loadCollections,
    handleRefresh,
    canEditCollection,
  };
};