import React, { useEffect, useState } from 'react';
import { SafeAreaView, View, TouchableOpacity, ActivityIndicator } from 'react-native';
import { Stack, useRouter, useLocalSearchParams } from 'expo-router';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useToast } from '@/components/ui/toast';
import { HStack } from '@/components/ui/hstack';
import { Text } from '@/components/ui/text';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { useAuth } from '@/context/AuthContext';
import { useCollectionAPI, Collection } from '@/services/collection-api';
import { Home, BookOpen, HelpCircle } from '@/components/Icons';
import { CollectionForm } from '@/components/collections/create/CollectionForm';
import { StatusIndicator } from '@/components/collections/create/StatusIndicator';
import { Button, ButtonText } from '@/components/ui/button';
import { DuplicateModal } from '@/components/collections/DuplicateModal';
import { Toast, ToastTitle, ToastDescription } from '@/components/ui/toast';

const schema = z.object({ 
  title: z.string().min(1, 'Title is required'), 
  description: z.string().optional() 
});
type FormData = z.infer<typeof schema>;

export default function CollectionDetailPage() {
  const router = useRouter();
  const toast = useToast();
  const { userData } = useAuth();
  const { collectionId } = useLocalSearchParams();
  const { getCollection, updateCollection, updateCollectionStatus } = useCollectionAPI();
  const [collection, setCollection] = useState<Collection | null>(null);
  const [loading, setLoading] = useState(true);
  const [showDuplicate, setShowDuplicate] = useState(false);
  const insets = useSafeAreaInsets();

  const {
    control,
    handleSubmit,
    reset,
    formState: { isDirty, isSubmitting, errors },
  } = useForm<FormData>({ 
    resolver: zodResolver(schema),
    defaultValues: { title: '', description: '' }
  });

  // fetch on mount
  useEffect(() => {
    (async () => {
      try {
        const res = await getCollection(collectionId as string);
        setCollection(res.data);
        reset({ title: res.data.title, description: res.data.description });
      } catch (err) {
        console.error(err);
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
                <ToastTitle>Load Failed</ToastTitle>
                <ToastDescription>
                  Failed to load collection details
                </ToastDescription>
              </Toast>
            );
          },
        });
      } finally {
        setLoading(false);
      }
    })();
  }, [collectionId]);

  if (loading) {
    return (
      <SafeAreaView className="flex-1 bg-background-0 justify-center items-center">
        <ActivityIndicator size="large" color="#6366f1" />
      </SafeAreaView>
    );
  }

  if (!collection) return null;

  // determine permissions with proper user context
  const currentUserId = userData?.id || '';
  const isOwner = collection.created_by.id === currentUserId;
  const canEdit = isOwner && collection.status !== 'archived';
  const isArchived = collection.status === 'archived';

  const onSave = async (data: FormData) => {
    try {
      await updateCollection(collection.id, { title: data.title, description: data.description });
      reset(data); // clear dirty
      setCollection(prev => prev ? { ...prev, title: data.title, description: data.description ?? '' } : null);
      
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
              <ToastTitle>Collection Updated</ToastTitle>
              <ToastDescription>
                Changes have been saved successfully
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
              <ToastTitle>Update Failed</ToastTitle>
              <ToastDescription>
                {error instanceof Error ? error.message : 'Failed to update collection'}
              </ToastDescription>
            </Toast>
          );
        },
      });
    }
  };

  const handleStatusChange = async (newStatus: 'draft' | 'published' | 'archived') => {
    try {
      await updateCollectionStatus(collection.id, newStatus);
      setCollection(prev => prev ? { ...prev, status: newStatus } : null);
      
      const getStatusToastAction = (status: string) => {
        switch (status) {
          case 'published': return 'success';
          case 'draft': return 'warning';
          case 'archived': return 'muted';
          default: return 'info';
        }
      };
      
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
              <ToastTitle>Status Updated</ToastTitle>
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
              <ToastTitle>Update Failed</ToastTitle>
              <ToastDescription>
                {error instanceof Error ? error.message : 'Failed to update collection status'}
              </ToastDescription>
            </Toast>
          );
        },
      });
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-background-0">
      <Stack.Screen options={{ title: collection.title }} />
      <View 
        style={{
          paddingTop: insets.top, // use safe area insets for top padding
        }}
      >
        {/* Header */}
        <View className="flex-row items-center justify-between px-4 py-3 border-b border-outline-200">
          {/* Left side: Icons */}
          <HStack space="md" className='items-center'>
            <TouchableOpacity onPress={() => router.push('/')}>        
              <Home className='w-6 h-6 stroke-primary-600' />
            </TouchableOpacity>
            <TouchableOpacity onPress={() => router.push('/test-collections')}>        
              <BookOpen className="w-6 h-6 stroke-primary-600" />
            </TouchableOpacity>
            <TouchableOpacity onPress={() => router.push(`/test-collections/${collectionId}/questions`)}>   
              <HStack space="sm" className='items-center'>
                <HelpCircle className="w-6 h-6 stroke-primary-600" />
                <Text className="text-xs text-primary-600">Questions</Text>
              </HStack>
            </TouchableOpacity>
          </HStack>

          {/* Right side: Status Indicator - only clickable if user is owner */}
          <StatusIndicator 
            status={collection.status} 
            onStatusChange={isOwner ? handleStatusChange : undefined}
            isClickable={isOwner}
          />
        </View>
      </View>

      {/* Collection Form */}

      <CollectionForm
        control={control}
        errors={errors}
        onSubmit={handleSubmit(onSave)}
        isSubmitting={isSubmitting}
        isDirty={isDirty}
        canEdit={canEdit && !isArchived}
        isNewCollection={false}
      />

      {/* Duplicate button for non-editable collections */}
      {(!canEdit || isArchived) && (
        <View className="px-4 pb-6">
          <Button
            variant="outline"
            action="secondary"
            onPress={() => setShowDuplicate(true)}
            className="mt-4"
          >
            <ButtonText>Duplicate Collection</ButtonText>
          </Button>
        </View>
      )}

      <DuplicateModal
        isOpen={showDuplicate}
        collection={collection}
        title={collection.title}
        description={collection.description}
        onTitleChange={() => {} }
        onDescriptionChange={() => {} }
        onClose={() => setShowDuplicate(false)}
        onConfirm={() => {} }
      />
    </SafeAreaView>
  );
}