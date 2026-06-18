import { db } from '../config/firebase';
import { 
  collection, 
  doc, 
  getDocs, 
  setDoc, 
  deleteDoc, 
  serverTimestamp,
  query,
  orderBy
} from 'firebase/firestore';

/**
 * Save a recommendation for a user
 * @param {string} userId 
 * @param {Object} recommendation 
 * @param {string} careerGoal
 */
export const saveRecommendation = async (userId, recommendation, careerGoal) => {
  if (!userId) throw new Error("User ID is required to save recommendation");
  
  const recsRef = collection(db, 'users', userId, 'projectRecommendations');
  const docRef = doc(recsRef, recommendation.id);
  
  await setDoc(docRef, {
    careerGoal: careerGoal || "Not specified",
    recommendations: recommendation,
    generatedAt: serverTimestamp(),
  });
};

/**
 * Get all saved recommendations for a user
 * @param {string} userId 
 * @returns {Array} Array of saved recommendations
 */
export const getSavedRecommendations = async (userId) => {
  if (!userId) return [];
  
  try {
    const recsRef = collection(db, 'users', userId, 'projectRecommendations');
    const q = query(recsRef, orderBy('generatedAt', 'desc'));
    
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data().recommendations
    }));
  } catch (error) {
    console.error("Error fetching saved recommendations:", error);
    return [];
  }
};

/**
 * Remove a saved recommendation
 * @param {string} userId 
 * @param {string} recommendationId 
 */
export const removeSavedRecommendation = async (userId, recommendationId) => {
  if (!userId || !recommendationId) return;
  
  const docRef = doc(db, 'users', userId, 'projectRecommendations', recommendationId);
  await deleteDoc(docRef);
};
