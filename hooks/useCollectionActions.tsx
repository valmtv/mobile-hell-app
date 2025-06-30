import { useState, useCallback } from 'react';
import { Collection } from '@/services/collection-api';
import { useCollectionAPI } from '@/services/collection-api';
import { Toast, ToastTitle, ToastDescription } from '@/components/ui/toast';

interface UseCollectionActionsProps {
  allCollections: Collection[];
  setAllCollections: (collections: Collection[]) => void;
  toast: any;
}

export const useCollectionActions = ({
  allCollections,
  setAllCollections,
  toast,
}: UseCollectionActionsProps) => {
  const {
    updateCollectionStatus,
    deleteCollection,
    duplicateCollection,
  } = useCollectionAPI();

  // Modal states
  const [selectedCollection, setSelectedCollection] = useState<Collection | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showDuplicateModal, setShowDuplicateModal] = useState(false);
  
  // Duplicate form states
  const [duplicateTitle, setDuplicateTitle] = useState('');
  const [duplicateDescription, setDuplicateDescription] = useState('');

  // Helper functions
  const updateCollectionInList = useCallback((list: Collection[], collectionId: string, updates: Partial<Collection>) =>
    list.map(c => c.id === collectionId ? { ...c, ...updates } : c), []);

  const removeFromList = useCallback((list: Collection[], collectionId: string) =>
    list.filter(c => c.id !== collectionId), []);

  // Modal handlers
  const openDeleteModal = useCallback((collection: Collection) => {
    setSelectedCollection(collection);
    setShowDeleteModal(true);
  }, []);

  const closeDeleteModal = useCallback(() => {
    setShowDeleteModal(false);
    setSelectedCollection(null);
  }, []);

  const openDuplicateModal = useCallback((collection: Collection) => {
    setSelectedCollection(collection);
    setDuplicateTitle(collection.title + ' (Copy)');
    setDuplicateDescription(collection.description);
    setShowDuplicateModal(true);
  }, []);

  const closeDuplicateModal = useCallback(() => {
    setShowDuplicateModal(false);
    setSelectedCollection(null);
    setDuplicateTitle('');
    setDuplicateDescription('');
  }, []);

  // Get toast action based on status
  const getStatusToastAction = (status: string) => {
    switch (status) {
      case 'published': return 'success';
      case 'draft': return 'warning';
      case 'archived': return 'muted';
      default: return 'info';
    }
  };

  // Memoized action handlers
  const handleStatusChange = useCallback(async (collectionId: string, newStatus: string) => {
    try {
      await updateCollectionStatus(collectionId, newStatus);
      
      const updates = { status: newStatus as Collection['status'] };
      setAllCollections(updateCollectionInList(allCollections, collectionId, updates));
      
      toast.show({
        placement: 'bottom',
        duration: 3000,
        render: ({ id }) => {
          const toastId = 'toast-' + id;
          const action = getStatusToastAction(newStatus);
          
          return (
            <Toast 
              nativeID={toastId} 
              action={action}
              variant="solid"
            >
              <ToastTitle>
                Status Updated
              </ToastTitle>
              <ToastDescription>
                Collection status changed to {newStatus}
              </ToastDescription>
            </Toast>
          );
        },
      });
    } catch (error) {
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
                Update Failed
              </ToastTitle>
              <ToastDescription>
                {error instanceof Error ? error.message : 'Failed to update collection status'}
              </ToastDescription>
            </Toast>
          );
        },
      });
    }
  }, [allCollections, setAllCollections, updateCollectionStatus, toast, updateCollectionInList]);

  const handleDelete = useCallback(async () => {
    if (!selectedCollection) return;

    try {
      await deleteCollection(selectedCollection.id);
      
      setAllCollections(removeFromList(allCollections, selectedCollection.id));
      
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
                Collection Deleted
              </ToastTitle>
              <ToastDescription>
                "{selectedCollection.title}" has been permanently removed
              </ToastDescription>
            </Toast>
          );
        },
      });
      
      closeDeleteModal();
    } catch (error) {
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
                Delete Failed
              </ToastTitle>
              <ToastDescription>
                {error instanceof Error ? error.message : 'Failed to delete collection'}
              </ToastDescription>
            </Toast>
          );
        },
      });
    }
  }, [selectedCollection, allCollections, setAllCollections, deleteCollection, toast, removeFromList, closeDeleteModal]);

  const handleDuplicate = useCallback(async () => {
    if (!selectedCollection) return;

    if (!duplicateTitle.trim()) {
      toast.show({
        placement: 'bottom',
        duration: 4000,
        render: ({ id }) => {
          const toastId = 'toast-' + id;
          return (
            <Toast 
              nativeID={toastId} 
              action="warning" 
              variant="solid"
            >
              <ToastTitle>
                Title Required
              </ToastTitle>
              <ToastDescription>
                Please enter a title for the duplicated collection
              </ToastDescription>
            </Toast>
          );
        },
      });
      return;
    }

    try {
      const newCollectionId = await duplicateCollection(
        selectedCollection.id,
        duplicateTitle.trim(),
        duplicateDescription.trim()
      );
      
      const newCollection: Collection = {
        ...selectedCollection,
        id: newCollectionId,
        title: duplicateTitle.trim(),
        description: duplicateDescription.trim(),
        status: 'draft',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        question_count: selectedCollection.question_count,
      };
      
      setAllCollections([newCollection, ...allCollections]);
      
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
                Collection Duplicated
              </ToastTitle>
              <ToastDescription>
                "{duplicateTitle.trim()}" has been created successfully
              </ToastDescription>
            </Toast>
          );
        },
      });
      
      closeDuplicateModal();
    } catch (error) {
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
                Duplication Failed
              </ToastTitle>
              <ToastDescription>
                {error instanceof Error ? error.message : 'Failed to duplicate collection'}
              </ToastDescription>
            </Toast>
          );
        },
      });
    }
  }, [selectedCollection, duplicateTitle, duplicateDescription, allCollections, setAllCollections, duplicateCollection, toast, closeDuplicateModal]);

  return {
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
  };
};