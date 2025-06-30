import React, { useState, useCallback } from 'react';
import {
  Popover,
  PopoverBackdrop,
  PopoverContent,
  PopoverBody,
} from '@/components/ui/popover';
import { Button, ButtonIcon, ButtonText } from '@/components/ui/button';
import { VStack } from '@/components/ui/vstack';
import { MoreHorizontal, Copy, Globe, Lock, Archive, Trash2 } from '@/components/Icons';
import type { Collection } from '@/services/collection-api';

interface CollectionActionsMenuProps {
  collection: Collection;
  canEdit: boolean | null;
  onStatusChange: (collectionId: string, newStatus: string) => void;
  onDelete: (collection: Collection) => void;
  onDuplicate: (collection: Collection) => void;
}

export const CollectionActionsMenu: React.FC<CollectionActionsMenuProps> = ({
  collection,
  canEdit,
  onStatusChange,
  onDelete,
  onDuplicate,
}) => {
  const [isOpen, setIsOpen] = useState(false);

  // Helper function to close popover and execute action
  const executeAction = useCallback((action: () => void) => {
    // Close popover first
    setIsOpen(false);
    
    // Action after a short delay to ensure UI updates
    setTimeout(() => {
      action();
    }, 100);
  }, []);

  // Wrapped action handlers
  const handleDuplicate = useCallback(() => {
    executeAction(() => onDuplicate(collection));
  }, [executeAction, onDuplicate, collection]);

  const handleStatusChange = useCallback((newStatus: string) => {
    executeAction(() => onStatusChange(collection.id, newStatus));
  }, [executeAction, onStatusChange, collection.id]);

  const handleDelete = useCallback(() => {
    executeAction(() => onDelete(collection));
  }, [executeAction, onDelete, collection]);

  return (
    <Popover
      isOpen={isOpen}
      onClose={() => setIsOpen(false)}
      trigger={(triggerProps) => (
        <Button 
          {...triggerProps} 
          variant="outline" 
          size="sm"
          onPress={() => setIsOpen(true)}
        >
          <ButtonIcon as={MoreHorizontal} size="sm" />
        </Button>
      )}
    >
      <PopoverBackdrop />
      <PopoverContent className="w-48">
        <PopoverBody>
          <VStack className="space-y-1">
            <Button
              variant="outline"
              size="sm"
              className="justify-start"
              onPress={handleDuplicate}
            >
              <ButtonIcon as={Copy} size="sm" className="mr-2" />
              <ButtonText>Duplicate</ButtonText>
            </Button>
            
            {canEdit && (
              <>
                {collection.status === 'draft' && (
                  <Button
                    variant="outline"
                    size="sm"
                    className="justify-start"
                    onPress={() => handleStatusChange('published')}
                  >
                    <ButtonIcon as={Globe} size="sm" className="mr-2" />
                    <ButtonText>Make Public</ButtonText>
                  </Button>
                )}
                
                {collection.status === 'published' && (
                  <Button
                    variant="outline"
                    size="sm"
                    className="justify-start"
                    onPress={() => handleStatusChange('draft')}
                  >
                    <ButtonIcon as={Lock} size="sm" className="mr-2" />
                    <ButtonText>Make Draft</ButtonText>
                  </Button>
                )}
                
                {(collection.status === 'draft' || collection.status === 'published') && (
                  <Button
                    variant="outline"
                    size="sm"
                    className="justify-start"
                    onPress={() => handleStatusChange('archived')}
                  >
                    <ButtonIcon as={Archive} size="sm" className="mr-2" />
                    <ButtonText>Archive</ButtonText>
                  </Button>
                )}
                
                {collection.status === 'archived' && (
                  <Button
                    variant="outline"
                    size="sm"
                    className="justify-start"
                    onPress={() => handleStatusChange('draft')}
                  >
                    <ButtonIcon as={Lock} size="sm" className="mr-2" />
                    <ButtonText>Restore to Draft</ButtonText>
                  </Button>
                )}
                
                <Button
                  variant="outline"
                  size="sm"
                  className="justify-start"
                  onPress={handleDelete}
                >
                  <ButtonIcon as={Trash2} size="sm" className="mr-2 stroke-error-500" />
                  <ButtonText className="text-error-500">Delete</ButtonText>
                </Button>
              </>
            )}
          </VStack>
        </PopoverBody>
      </PopoverContent>
    </Popover>
  );
};
