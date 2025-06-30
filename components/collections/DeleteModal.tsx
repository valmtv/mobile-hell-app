import React from 'react';
import { Modal, ModalBackdrop, ModalContent, ModalHeader, ModalCloseButton, ModalBody, ModalFooter } from '@/components/ui/modal';
import { Button, ButtonText } from '@/components/ui/button';
import { Heading } from '@/components/ui/heading';
import { Text } from '@/components/ui/text';
import { AlertTriangle } from '@/components/Icons';
import { Box } from '@/components/ui/box';
import { Collection } from '@/services/collection-api';

interface DeleteModalProps {
  isOpen: boolean;
  collection: Collection | null;
  onClose: () => void;
  onConfirm: () => void;
}

export const DeleteModal: React.FC<DeleteModalProps> = ({
  isOpen,
  collection,
  onClose,
  onConfirm,
}) => {
  if (!collection) return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="md">
      <ModalBackdrop />
      <ModalContent>
        <ModalHeader>
          <Box className="flex-row items-center">
            <AlertTriangle className="text-error-500 mr-3" size={24} />
            <Heading size="lg">Delete Collection</Heading>
          </Box>
          <ModalCloseButton />
        </ModalHeader>
        
        <ModalBody>
          <Text className="text-typography-700 mb-2">
            Are you sure you want to delete "{collection.title}"?
          </Text>
          <Text className="text-typography-500 text-sm">
            This action cannot be undone. The collection and all its questions will be permanently deleted.
          </Text>
        </ModalBody>
        
        <ModalFooter>
          <Button
            variant="outline"
            action="secondary"
            onPress={onClose}
            className="mr-3"
          >
            <ButtonText>Cancel</ButtonText>
          </Button>
          <Button
            variant="solid"
            action="negative"
            onPress={onConfirm}
          >
            <ButtonText>Delete</ButtonText>
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};
