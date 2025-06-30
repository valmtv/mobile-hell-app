import React from 'react';
import { SafeAreaView, TouchableOpacity, View } from 'react-native';
import { HStack } from '@/components/ui/hstack';
import { Stack, useRouter } from 'expo-router';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useToast } from '@/components/ui/toast';

import { useCollectionAPI } from '@/services/collection-api';
import { Home, BookOpen } from '@/components/Icons';
import { CollectionForm } from '@/components/collections/create/CollectionForm';
import { StatusIndicator } from '@/components/collections/create/StatusIndicator';
import { Toast, ToastTitle, ToastDescription } from '@/components/ui/toast';

// Validation schema
const schema = z.object({
  title: z.string().min(1, 'Title is required'),
  description: z.string().optional(),
});
type FormData = z.infer<typeof schema>;

export default function NewCollectionPage() {
  const router = useRouter();
  const toast = useToast();
  const { createCollection } = useCollectionAPI();

  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: { title: '', description: '' },
  });

  const onSubmit = async (data: FormData) => {
    try {
      const res = await createCollection({ title: data.title, description: data.description });
      
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
              <ToastTitle>Collection Created</ToastTitle>
              <ToastDescription>
                "{data.title}" has been created successfully
              </ToastDescription>
            </Toast>
          );
        },
      });

      router.replace(`/test-collections/${res.data.collection_id}`);
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
              <ToastTitle>Creation Failed</ToastTitle>
              <ToastDescription>
                {error instanceof Error ? error.message : 'Failed to create collection'}
              </ToastDescription>
            </Toast>
          );
        },
      });
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-background-0">
      <Stack.Screen options={{ title: 'Create Test Collection' }} />
      
      {/* Header */}
      <View className="flex-row items-center justify-between px-4 py-3 border-b border-outline-200">
        {/* Left side: Icons */}
        <HStack space="md" className='items-center'>
          <TouchableOpacity onPress={() => router.push('/')}>        
            <Home className="w-6 h-6" />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => router.push('/test-collections')}>        
            <BookOpen className="w-6 h-6 stroke-primary-600" />
          </TouchableOpacity>
        </HStack>

        {/* Right side: Status */}
        <StatusIndicator status="draft" />
      </View>

      <CollectionForm
        control={control}
        errors={errors}
        onSubmit={handleSubmit(onSubmit)}
        isSubmitting={isSubmitting}
        canEdit={true}
        isNewCollection={true}
      />
    </SafeAreaView>
  );
}