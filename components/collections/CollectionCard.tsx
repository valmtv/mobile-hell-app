import React, { memo, useCallback, useMemo } from 'react';
import { router } from 'expo-router';
import { Box } from '@/components/ui/box';
import { VStack } from '@/components/ui/vstack';
import { HStack } from '@/components/ui/hstack';
import { Text } from '@/components/ui/text';
import { Pressable } from '@/components/ui/pressable';
import { Button, ButtonText, ButtonIcon } from '@/components/ui/button';
import { Divider } from '@/components/ui/divider';
import {
  Globe,
  Lock,
  Archive,
  Library,
  Eye,
  NotebookPen,
  Copy,
} from '@/components/Icons';
import { Collection } from '@/services/collection-api';
import { CollectionActionsMenu } from '@/components/collections/CollectionActionsMenu';

interface CollectionCardProps {
  collection: Collection;
  canEdit: boolean | null;
  onStatusChange: (collectionId: string, newStatus: string) => void;
  onDelete: (collection: Collection) => void;
  onDuplicate: (collection: Collection) => void;
}

const CollectionCard: React.FC<CollectionCardProps> = ({
  collection,
  canEdit,
  onStatusChange,
  onDelete,
  onDuplicate,
}) => {
  // Memoized computed values
  const formattedDate = useMemo(() => {
    const date = new Date(collection.updated_at);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  }, [collection.updated_at]);

  const statusIcon = useMemo(() => {
    switch (collection.status) {
      case 'published':
        return <Globe className="w-4 h-4 stroke-success-500" />;
      case 'archived':
        return <Archive className="w-4 h-4 stroke-typography-500" />;
      default:
        return <Lock className="w-4 h-4 stroke-warning-500" />;
    }
  }, [collection.status]);

  const statusStyle = useMemo(() => {
    switch (collection.status) {
      case 'published':
        return 'bg-success-100 text-success-800';
      case 'archived':
        return 'bg-typography-100 text-typography-800';
      default:
        return 'bg-warning-100 text-warning-800';
    }
  }, [collection.status]);

  const statusText = useMemo(() => {
    switch (collection.status) {
      case 'published':
        return 'Public';
      case 'archived':
        return 'Archived';
      default:
        return 'Draft';
    }
  }, [collection.status]);

  const questionCountText = useMemo(() => {
    const count = collection.question_count || 0;
    return `${count} ${count === 1 ? 'question' : 'questions'}`;
  }, [collection.question_count]);

  // Memoized callbacks
  const handlePress = useCallback(() => {
    router.push(`/test-collections/${collection.id}`);
  }, [collection.id]);

  const handleViewPress = useCallback(() => {
    router.push(`/test-collections/${collection.id}`);
  }, [collection.id]);

  const handleCreateExamPress = useCallback(() => {
    router.push(`/exams/new?collectionId=${collection.id}`);
  }, [collection.id]);

  const handleDuplicatePress = useCallback(() => {
    onDuplicate(collection);
  }, [collection, onDuplicate]);

  return (
    <Pressable
      className="mx-4 mb-4 bg-background-0 rounded-lg shadow-soft-1 border border-outline-200"
      onPress={handlePress}
    >
      <VStack className="p-4">
        {/* Header */}
        <HStack className="justify-between items-start mb-3">
          <HStack className="flex-1 items-start">
            <Box className="mr-2 mt-1">
              {statusIcon}
            </Box>
            <VStack className="flex-1">
              <Text className="text-lg font-semibold text-typography-900" numberOfLines={2}>
                {collection.title}
              </Text>
              <Text className="text-sm text-typography-600 mt-1">
                Created by {collection.created_by.first_name} {collection.created_by.last_name} • 
                Last updated {formattedDate}
              </Text>
            </VStack>
          </HStack>
          <Box className={`px-2 py-1 rounded-full ${statusStyle}`}>
            <Text className="text-xs font-medium">
              {statusText}
            </Text>
          </Box>
        </HStack>

        {/* Description */}
        <Text className="text-sm text-typography-600 mb-4" numberOfLines={3}>
          {collection.description}
        </Text>

        {/* Stats */}
        <HStack className="space-x-4 mb-4">
          <HStack className="items-center">
            <Library className="w-4 h-4 stroke-typography-500 mr-2" />
            <Text className="text-sm text-typography-600">
              {questionCountText}
            </Text>
          </HStack>
        </HStack>

        <Divider className="my-3" />

        {/* Actions */}
        <HStack className="justify-between items-center">
          <Button
            variant="outline"
            size="sm"
            onPress={handleViewPress}
          >
            <ButtonIcon as={Eye} size="sm" className="mr-2" />
            <ButtonText>View</ButtonText>
          </Button>
          
          {canEdit === false ? (
            // Show only Create Exam and Duplicate buttons when canEdit is false
            <HStack className="space-x-2">
              <Button
                variant="outline"
                size="sm"
                onPress={handleCreateExamPress}
              >
                <ButtonIcon as={NotebookPen} size="sm" className="mr-2" />
                <ButtonText>Create Exam</ButtonText>
              </Button>
              
              <Button
                variant="outline"
                size="sm"
                onPress={handleDuplicatePress}
              >
                <ButtonIcon as={Copy} size="sm" className="mr-2" />
                <ButtonText>Duplicate</ButtonText>
              </Button>
            </HStack>
          ) : (
            <HStack className="space-x-2">
              <Button
                variant="outline"
                size="sm"
                onPress={handleCreateExamPress}
              >
                <ButtonIcon as={NotebookPen} size="sm" className="mr-2" />
                <ButtonText>Create Exam</ButtonText>
              </Button>
              
              <CollectionActionsMenu
                collection={collection}
                canEdit={canEdit}
                onStatusChange={onStatusChange}
                onDelete={onDelete}
                onDuplicate={onDuplicate}
              />
            </HStack>
          )}
        </HStack>
      </VStack>
    </Pressable>
  );
};

// Memoize the component to prevent unnecessary re-renders
export default memo(CollectionCard);
