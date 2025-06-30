import React from 'react';
import { Modal, ModalBackdrop, ModalContent, ModalHeader, ModalCloseButton, ModalBody, ModalFooter } from '@/components/ui/modal';
import { Button, ButtonText } from '@/components/ui/button';
import { Input, InputField } from '@/components/ui/input';
import { Textarea, TextareaInput } from '@/components/ui/textarea';
import { FormControl, FormControlLabel, FormControlLabelText } from '@/components/ui/form-control';
import { Heading } from '@/components/ui/heading';
import { Text } from '@/components/ui/text';
import { Copy } from '@/components/Icons';
import { Box } from '@/components/ui/box';
import { VStack } from '@/components/ui/vstack';
import { Collection } from '@/services/collection-api';

interface DuplicateModalProps {
  isOpen: boolean;
  collection: Collection | null;
  title: string;
  description: string;
  onTitleChange: (title: string) => void;
  onDescriptionChange: (description: string) => void;
  onClose: () => void;
  onConfirm: () => void;
}

export const DuplicateModal: React.FC<DuplicateModalProps> = ({
  isOpen,
  collection,
  title,
  description,
  onTitleChange,
  onDescriptionChange,
  onClose,
  onConfirm,
}) => {
  if (!collection) return null;

  const handleConfirm = () => {
    if (!title.trim()) {
      return; // Validation handled in the hook
    }
    onConfirm();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="md">
      <ModalBackdrop />
      <ModalContent>
        <ModalHeader>
          <Box className="flex-row items-center">
            <Copy className="text-primary-500 mr-3" size={24} />
            <Heading size="lg">Duplicate Collection</Heading>
          </Box>
          <ModalCloseButton />
        </ModalHeader>
        
        <ModalBody>
          <VStack space="md">
            <Text className="text-typography-600 mb-2">
              Create a copy of "{collection.title}" with all its questions.
            </Text>
            
            <FormControl isRequired>
              <FormControlLabel>
                <FormControlLabelText>Collection Title</FormControlLabelText>
              </FormControlLabel>
              <Input
                variant="outline"
                size="md"
                isRequired
                isInvalid={!title.trim()}
              >
                <InputField
                  placeholder="Enter collection title"
                  value={title}
                  onChangeText={onTitleChange}
                />
              </Input>
            </FormControl>
            
            <FormControl>
              <FormControlLabel>
                <FormControlLabelText>Description</FormControlLabelText>
              </FormControlLabel>
              <Textarea
                size="md"
                className="min-h-[100px]"
              >
                <TextareaInput
                  placeholder="Enter collection description (optional)"
                  value={description}
                  onChangeText={onDescriptionChange}
                />
              </Textarea>
            </FormControl>
          </VStack>
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
            action="primary"
            onPress={handleConfirm}
            isDisabled={!title.trim()}
          >
            <ButtonText>Duplicate</ButtonText>
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};
