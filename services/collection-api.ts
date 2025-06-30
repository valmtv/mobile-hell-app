import { useApi } from '@/lib/request-api';
import { useMemo } from 'react';

const COLLECTIONS_URL = "/exam/teacher/collections";

// Types
interface User {
  email: string;
  id: string;
  first_name: string;
  last_name: string;
  role: string;
  receive_notifications: boolean;
}

export interface Collection {
  created_at: string;
  updated_at: string;
  title: string;
  description: string;
  status: 'draft' | 'published' | 'archived';
  id: string;
  created_by: User;
  question_count: number;
  questions?: Question[];
}

interface Question {
  id: string;
  question_text: string;
  type: 'mcq' | 'singlechoice' | 'shortanswer';
  weight: number;
  has_katex: boolean;
  correct_input_answer?: string;
  options?: QuestionOption[];
}

interface QuestionOption {
  text: string;
  is_correct: boolean;
}

interface CollectionsResponse {
  message: string;
  data: Collection[];
}

interface CreateCollectionData {
  title: string;
  description: string | undefined;
  status?: 'draft' | 'published' | 'archived';
}

interface UpdateCollectionData {
  title?: string;
  description?: string;
  status?: 'draft' | 'published' | 'archived';
}

interface QuestionData {
  question_text: string;
  type: 'mcq' | 'singlechoice' | 'shortanswer';
  weight?: number;
  has_katex?: boolean;
  correct_input_answer?: string;
  options?: Omit<QuestionOption, 'id'>[];
}

interface QuestionOrder {
  question_id: string;
  order: number;
}



export const useCollectionAPI = () => {
  const { get, post, put, del } = useApi();

  // Memoize the returned API object
  return useMemo(() => {
    const fetchCollections = async (): Promise<Collection[]> => {
      try {
        const [userRes, publicRes] = await Promise.all([
          get<CollectionsResponse>(`${COLLECTIONS_URL}/`),
          get<CollectionsResponse>(`${COLLECTIONS_URL}/public`),
        ]);

        const userCollections = userRes.data || [];
        const publicCollections = publicRes.data || [];
        const map = new Map<string, Collection>();

        // Add user collections first
        userCollections.forEach(col => map.set(col.id, col));
        
        // Add public collections that aren't already in the map
        publicCollections.forEach(col => {
          if (!map.has(col.id)) {
            map.set(col.id, col);
          }
        });

        return Array.from(map.values());
      } catch (err) {
        console.error("Error fetching collections:", err);
        throw new Error('Failed to load collections');
      }
    };

    const createCollection = async (collectionData: CreateCollectionData): Promise<{ collection_id: string }> => {
      try {
        return await post(`${COLLECTIONS_URL}/`, collectionData);
      } catch (err) {
        console.error("Error creating collection:", err);
        throw new Error('Failed to create collection');
      }
    };

    const getCollection = async (collectionId: string): Promise<{ data: Collection }> => {
      try {
        return await get(`${COLLECTIONS_URL}/${collectionId}`);
      } catch (err) {
        console.error(`Error fetching collection ${collectionId}:`, err);
        throw new Error('Failed to load collection');
      }
    };

    const updateCollection = async (collectionId: string, collectionData: UpdateCollectionData): Promise<Collection> => {
      try {
        return await put(`${COLLECTIONS_URL}/${collectionId}`, collectionData);
      } catch (err) {
        console.error(`Error updating collection ${collectionId}:`, err);
        throw new Error('Failed to update collection');
      }
    };

    const updateCollectionStatus = async (collectionId: string, newStatus: string): Promise<void> => {
      try {
        await put(`${COLLECTIONS_URL}/${collectionId}`, { status: newStatus });
      } catch (err) {
        console.error(`Error updating status for collection ${collectionId}:`, err);
        throw new Error('Failed to update collection status');
      }
    };

    const deleteCollection = async (collectionId: string): Promise<void> => {
      try {
        await del(`${COLLECTIONS_URL}/${collectionId}`);
      } catch (err) {
        console.error(`Error deleting collection ${collectionId}:`, err);
        throw new Error('Failed to delete collection');
      }
    };

    const duplicateCollection = async (collectionId: string, title: string, description: string): Promise<string> => {
      try {
        // Get the original collection with questions
        const detailRes = await get<{ data: Collection }>(`${COLLECTIONS_URL}/${collectionId}`);
        const original = detailRes.data;

        // Create the new collection
        const newRes = await post<{ collection_id: string }>(`${COLLECTIONS_URL}/`, {
          title,
          description,
          status: 'draft'
        });
        const newId = newRes.data.collection_id;
        console.log(`Duplicated collection ${collectionId} to new ID ${newId}`);

        // Copy each question if they exist
        if (Array.isArray(original.questions) && original.questions.length > 0) {
          for (const question of original.questions) {
            if (!question) continue;
            
            const payload: QuestionData = {
              question_text: question.question_text,
              type: question.type,
              weight: question.weight || 1,
              has_katex: question.has_katex || false,
            };

            // Add type-specific data
            if (question.type === 'shortanswer' && question.correct_input_answer) {
              payload.correct_input_answer = question.correct_input_answer;
            }

            if ((question.type === 'mcq' || question.type === 'singlechoice') && question.options) {
              payload.options = question.options.map(opt => ({
                text: opt.text,
                is_correct: opt.is_correct,
              }));
            }

            await post(`${COLLECTIONS_URL}/${newId}/questions`, payload);
          }
        }

        return newId;
      } catch (err) {
        console.error(`Error duplicating collection ${collectionId}:`, err);
        throw new Error('Failed to duplicate collection');
      }
    };

    const addQuestion = async (collectionId: string, questionData: QuestionData): Promise<Question> => {
      try {
        return await post(`${COLLECTIONS_URL}/${collectionId}/questions`, questionData);
      } catch (err) {
        console.error(`Error adding question to collection ${collectionId}:`, err);
        throw new Error('Failed to add question');
      }
    };

    const addBulkQuestions = async (collectionId: string, questions: QuestionData[]): Promise<Question[]> => {
      try {
        return await post(`${COLLECTIONS_URL}/${collectionId}/questions/bulk`, questions);
      } catch (err) {
        console.error(`Error adding bulk questions to collection ${collectionId}:`, err);
        throw new Error('Failed to add questions');
      }
    };

    const updateQuestion = async (collectionId: string, questionId: string, questionData: Partial<QuestionData>): Promise<Question> => {
      try {
        return await put(`${COLLECTIONS_URL}/${collectionId}/questions/${questionId}`, questionData);
      } catch (err) {
        console.error(`Error updating question ${questionId} in collection ${collectionId}:`, err);
        throw new Error('Failed to update question');
      }
    };

    const deleteQuestion = async (collectionId: string, questionId: string): Promise<void> => {
      try {
        await del(`${COLLECTIONS_URL}/${collectionId}/questions/${questionId}`);
      } catch (err) {
        console.error(`Error deleting question ${questionId} from collection ${collectionId}:`, err);
        throw new Error('Failed to delete question');
      }
    };

    const reorderQuestions = async (collectionId: string, questionOrders: QuestionOrder[]): Promise<void> => {
      try {
        await post(`${COLLECTIONS_URL}/${collectionId}/questions/reorder`, {
          question_orders: questionOrders
        });
      } catch (err) {
        console.error(`Error reordering questions in collection ${collectionId}:`, err);
        throw new Error('Failed to reorder questions');
      }
    };

    return {
      fetchCollections,
      createCollection,
      getCollection,
      updateCollection,
      updateCollectionStatus,
      deleteCollection,
      duplicateCollection,
      addQuestion,
      addBulkQuestions,
      updateQuestion,
      deleteQuestion,
      reorderQuestions,
    };
  }, [get, post, put, del]);
};
