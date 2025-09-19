import { 
  collection, 
  doc, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  getDocs, 
  query, 
  where, 
  orderBy,
  serverTimestamp,
  type DocumentData,
  type QuerySnapshot
} from 'firebase/firestore';
import { db } from '../firebase';
import type { FlashcardData } from '../types/flashcard';

// Collection name for flashcards
const FLASHCARDS_COLLECTION = 'flashcards';

// Convert Firestore document to FlashcardData
const convertDocToFlashcard = (doc: DocumentData): FlashcardData => {
  const data = doc.data();
  return {
    id: doc.id,
    front: data.front,
    back: data.back,
    createdAt: data.createdAt?.toDate() || new Date(),
    userId: data.userId
  };
};

// Add a new flashcard to Firestore
export const addFlashcard = async (flashcard: Omit<FlashcardData, 'id' | 'createdAt'>, userId: string): Promise<string> => {
  try {
    const docRef = await addDoc(collection(db, FLASHCARDS_COLLECTION), {
      ...flashcard,
      userId,
      createdAt: serverTimestamp()
    });
    return docRef.id;
  } catch (error) {
    console.error('Error adding flashcard:', error);
    throw new Error('Failed to add flashcard');
  }
};

// Update an existing flashcard
export const updateFlashcard = async (flashcardId: string, updates: Partial<Pick<FlashcardData, 'front' | 'back'>>): Promise<void> => {
  try {
    const flashcardRef = doc(db, FLASHCARDS_COLLECTION, flashcardId);
    await updateDoc(flashcardRef, {
      ...updates,
      updatedAt: serverTimestamp()
    });
  } catch (error) {
    console.error('Error updating flashcard:', error);
    throw new Error('Failed to update flashcard');
  }
};

// Delete a flashcard
export const deleteFlashcard = async (flashcardId: string): Promise<void> => {
  try {
    const flashcardRef = doc(db, FLASHCARDS_COLLECTION, flashcardId);
    await deleteDoc(flashcardRef);
  } catch (error) {
    console.error('Error deleting flashcard:', error);
    throw new Error('Failed to delete flashcard');
  }
};

// Get all flashcards for a specific user
export const getUserFlashcards = async (userId: string): Promise<FlashcardData[]> => {
  try {
    const q = query(
      collection(db, FLASHCARDS_COLLECTION),
      where('userId', '==', userId),
      orderBy('createdAt', 'desc')
    );
    
    const querySnapshot: QuerySnapshot = await getDocs(q);
    const flashcards: FlashcardData[] = [];
    
    querySnapshot.forEach((doc) => {
      flashcards.push(convertDocToFlashcard(doc));
    });
    
    return flashcards;
  } catch (error) {
    console.error('Error getting flashcards:', error);
    throw new Error('Failed to fetch flashcards');
  }
};

// Get a single flashcard by ID
export const getFlashcard = async (flashcardId: string): Promise<FlashcardData | null> => {
  try {
    const flashcardRef = doc(db, FLASHCARDS_COLLECTION, flashcardId);
    const docSnap = await getDocs(collection(db, FLASHCARDS_COLLECTION));
    
    let flashcard: FlashcardData | null = null;
    docSnap.forEach((doc) => {
      if (doc.id === flashcardId) {
        flashcard = convertDocToFlashcard(doc);
      }
    });
    
    return flashcard;
  } catch (error) {
    console.error('Error getting flashcard:', error);
    throw new Error('Failed to fetch flashcard');
  }
};

// Batch operations for better performance
export const batchUpdateFlashcards = async (updates: Array<{ id: string; data: Partial<Pick<FlashcardData, 'front' | 'back'>> }>): Promise<void> => {
  try {
    const promises = updates.map(({ id, data }) => updateFlashcard(id, data));
    await Promise.all(promises);
  } catch (error) {
    console.error('Error batch updating flashcards:', error);
    throw new Error('Failed to batch update flashcards');
  }
};

// Get flashcards count for a user
export const getUserFlashcardsCount = async (userId: string): Promise<number> => {
  try {
    const flashcards = await getUserFlashcards(userId);
    return flashcards.length;
  } catch (error) {
    console.error('Error getting flashcards count:', error);
    return 0;
  }
};
