import React, { useEffect, useState } from 'react';
import { SafeAreaView, View, TouchableOpacity, ActivityIndicator, ScrollView, Alert } from 'react-native';
import { Stack, useRouter, useLocalSearchParams } from 'expo-router';
import { useToast } from '@/components/ui/toast';
import { HStack } from '@/components/ui/hstack';
import { VStack } from '@/components/ui/vstack';
import { Text } from '@/components/ui/text';
import { Button, ButtonText, ButtonIcon } from '@/components/ui/button';

import { useAuth } from '@/context/AuthContext';
import { useCollectionAPI, Collection } from '@/services/collection-api';
import { Home, BookOpen, Plus, Edit3, Trash2 } from '@/components/Icons';
import { StatusIndicator } from '@/components/collections/create/StatusIndicator';
import { Toast, ToastTitle, ToastDescription } from '@/components/ui/toast';
import { Question } from '@/services/collection-api';

interface QuestionCardProps {
  question: Question;
  canEdit: boolean;
  onEdit: (question: Question) => void;
  onDelete: (questionId: string) => void;
}

const QuestionCard: React.FC<QuestionCardProps> = ({ question, canEdit, onEdit, onDelete }) => {
  const getTypeLabel = (type: string) => {
    switch (type) {
      case 'mcq': return 'Multiple Choice';
      case 'singlechoice': return 'Single Choice';
      case 'shortanswer': return 'Short Answer';
      default: return type;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'mcq': return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'singlechoice': return 'bg-green-50 text-green-700 border-green-200';
      case 'shortanswer': return 'bg-purple-50 text-purple-700 border-purple-200';
      default: return 'bg-gray-50 text-gray-700 border-gray-200';
    }
  };

  return (
    <View className="bg-white border border-outline-200 rounded-lg p-4 mb-3">
      <HStack className="justify-between items-start mb-3">
        <View className="flex-1 mr-3">
          <HStack className="items-center mb-2">
            <View className={`px-2 py-1 rounded-full border ${getTypeColor(question.type)}`}>
              <Text className="text-xs font-medium">{getTypeLabel(question.type)}</Text>
            </View>
            <Text className="text-sm text-typography-500 ml-2">Weight: {question.weight}</Text>
          </HStack>
          <Text className="text-base font-medium text-typography-900 mb-2">
            {question.question_text}
          </Text>
        </View>
        
        {canEdit && (
          <HStack space="sm">
            <TouchableOpacity onPress={() => onEdit(question)}>
              <Edit3 className="w-5 h-5 stroke-primary-600" />
            </TouchableOpacity>
            <TouchableOpacity onPress={() => onDelete(question.id)}>
              <Trash2 className="w-5 h-5 stroke-error-500" />
            </TouchableOpacity>
          </HStack>
        )}
      </HStack>

      {/* Show options for MCQ/Single Choice */}
      {(question.type === 'mcq' || question.type === 'singlechoice') && question.options && (
        <VStack space="xs" className="mt-2">
          {question.options.map((option, index) => (
            <View
              key={index}
              className={`flex-row items-center p-2 rounded border ${
                option.is_correct 
                  ? 'bg-success-50 border-success-200' 
                  : 'bg-gray-50 border-gray-200'
              }`}
            >
              <View className={`w-3 h-3 rounded-full mr-2 ${
                option.is_correct ? 'bg-success-500' : 'bg-gray-300'
              }`} />
              <Text className={`text-sm ${
                option.is_correct ? 'text-success-700 font-medium' : 'text-typography-700'
              }`}>
                {option.text}
              </Text>
            </View>
          ))}
        </VStack>
      )}

      {/* Show correct answer for short answer */}
      {question.type === 'shortanswer' && question.correct_input_answer && (
        <View className="mt-2 p-2 bg-success-50 border border-success-200 rounded">
          <Text className="text-sm text-success-700">
            <Text className="font-medium">Correct Answer: </Text>
            {question.correct_input_answer}
          </Text>
        </View>
      )}
    </View>
  );
};

export default function QuestionsPage() {
  const router = useRouter();
  const toast = useToast();
  const { userData } = useAuth();
  const { collectionId } = useLocalSearchParams();
  const { getCollection, deleteQuestion, updateCollectionStatus } = useCollectionAPI();  
  const [collection, setCollection] = useState<Collection | null>(null);
  const [loading, setLoading] = useState(true);


  // fetch collection and questions on mount
  useEffect(() => {
    (async () => {
      try {
        const res = await getCollection(collectionId as string);
        setCollection(res.data);
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
                  Failed to load questions
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

  const handleStatusChange = async (newStatus: 'draft' | 'published' | 'archived') => {
    if (!collection) return;
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


  if (loading) {
    return (
      <SafeAreaView className="flex-1 bg-background-0 justify-center items-center">
        <ActivityIndicator size="large" color="#6366f1" />
      </SafeAreaView>
    );
  }

  if (!collection) return null;

  // determine permissions
  const currentUserId = userData?.id || '';
  const isOwner = collection.created_by.id === currentUserId;
  const canEdit = isOwner && collection.status !== 'archived';
  const questions = collection.questions || [];

  const handleEditQuestion = (question: Question) => {
    // TODO: Open edit modal or navigate to edit form
    console.log('Edit question:', question);
    toast.show({
      placement: 'bottom',
      duration: 2000,
      render: ({ id }) => {
        const toastId = 'toast-' + id;
        return (
          <Toast nativeID={toastId} action="info" variant="solid">
            <ToastTitle>Edit Question</ToastTitle>
            <ToastDescription>Edit functionality coming soon</ToastDescription>
          </Toast>
        );
      },
    });
  };

  const handleDeleteQuestion = async (questionId: string) => {
    Alert.alert(
      'Delete Question',
      'Are you sure you want to delete this question? This action cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              await deleteQuestion(collection.id, questionId);
              
              // Update local state
              setCollection(prev => prev ? {
                ...prev,
                questions: prev.questions?.filter(q => q.id !== questionId),
                question_count: (prev.question_count || 1) - 1
              } : null);
              
              toast.show({
                placement: 'bottom',
                duration: 3000,
                render: ({ id }) => {
                  const toastId = 'toast-' + id;
                  return (
                    <Toast nativeID={toastId} action="success" variant="solid">
                      <ToastTitle>Question Deleted</ToastTitle>
                      <ToastDescription>Question has been removed</ToastDescription>
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
                    <Toast nativeID={toastId} action="error" variant="solid">
                      <ToastTitle>Delete Failed</ToastTitle>
                      <ToastDescription>
                        {error instanceof Error ? error.message : 'Failed to delete question'}
                      </ToastDescription>
                    </Toast>
                  );
                },
              });
            }
          },
        },
      ]
    );
  };

  const handleAddQuestion = () => {
    // TODO: Open add question modal or navigate to add form
    console.log('Add new question');
    toast.show({
      placement: 'bottom',
      duration: 2000,
      render: ({ id }) => {
        const toastId = 'toast-' + id;
        return (
          <Toast nativeID={toastId} action="info" variant="solid">
            <ToastTitle>Add Question</ToastTitle>
            <ToastDescription>Add functionality coming soon</ToastDescription>
          </Toast>
        );
      },
    });
  };

  return (
    <SafeAreaView className="flex-1 bg-background-0">
      <Stack.Screen options={{ title: `${collection.title} - Questions` }} />
      
      {/* Header */}
      <View className="flex-row items-center justify-between px-4 py-3 border-b border-outline-200">
        {/* Left side: Navigation Icons */}
        <HStack space="md" className='items-center'>
          <TouchableOpacity onPress={() => router.push('/')}>        
            <Home size={24} />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => router.push('/test-collections')}>        
            <BookOpen className="w-6 h-6 stroke-primary-600" />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => router.push(`/test-collections/${collectionId}`)}>        
            <Text className="text-primary-600 font-medium">Back to Collection</Text>
          </TouchableOpacity>
        </HStack>

        {/* Right side: Status Indicator */}
        <StatusIndicator 
          status={collection.status} 
          onStatusChange={isOwner ? handleStatusChange : undefined}
          isClickable={isOwner}
        />
      </View>

      {/* Questions Header */}
      <View className="flex-row items-center justify-between px-4 py-4 bg-gray-50 border-b border-outline-200">
        <VStack>
          <Text className="text-lg font-semibold text-typography-900">Questions</Text>
          <Text className="text-sm text-typography-600">
            {questions.length} question{questions.length !== 1 ? 's' : ''} in this collection
          </Text>
        </VStack>
        
        {canEdit && (
          <Button
            variant="solid"
            action="primary"
            size="sm"
            onPress={handleAddQuestion}
          >
            <ButtonIcon as={Plus} size="sm" className="mr-1" />
            <ButtonText>Add Question</ButtonText>
          </Button>
        )}
      </View>

      {/* Questions List */}
      <ScrollView className="flex-1 px-4 py-4">
        {questions.length === 0 ? (
          <View className="flex-1 justify-center items-center py-12">
            <Text className="text-lg font-medium text-typography-600 mb-2">
              No questions yet
            </Text>
            <Text className="text-sm text-typography-500 text-center mb-6">
              {canEdit 
                ? "Add your first question to get started" 
                : "This collection doesn't have any questions yet"
              }
            </Text>
            {canEdit && (
              <Button
                variant="outline"
                action="primary"
                onPress={handleAddQuestion}
              >
                <ButtonIcon as={Plus} size="sm" className="mr-2" />
                <ButtonText>Add First Question</ButtonText>
              </Button>
            )}
          </View>
        ) : (
          <VStack space="md">
            {questions
              .sort((a, b) => (a.position || 0) - (b.position || 0))
              .map((question) => (
                <QuestionCard
                  key={question.id}
                  question={question}
                  canEdit={canEdit}
                  onEdit={handleEditQuestion}
                  onDelete={handleDeleteQuestion}
                />
              ))
            }
          </VStack>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}