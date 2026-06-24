import { db } from '../config/firebase';
import { doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore';

export const careerReadinessService = {
  /**
   * Fetch the current saved readiness score and AI insights
   */
  async getReadiness(userId) {
    if (!userId) return null;
    try {
      const docRef = doc(db, 'career_readiness', userId);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        return docSnap.data();
      }
      return null;
    } catch (err) {
      console.error('Error fetching career readiness:', err);
      throw err;
    }
  },

  /**
   * Save a newly calculated score and AI analysis
   */
  async saveReadiness(userId, scoreData, aiAnalysis) {
    if (!userId) throw new Error("User ID required");
    try {
      const docRef = doc(db, 'career_readiness', userId);
      
      const payload = {
        userId,
        score: scoreData.score,
        breakdown: scoreData.breakdown,
        aiAnalysis: {
          strengths: aiAnalysis.strengths || [],
          weaknesses: aiAnalysis.weaknesses || [],
          recommendations: aiAnalysis.recommendations || []
        },
        lastUpdated: serverTimestamp()
      };

      await setDoc(docRef, payload, { merge: true });
      return payload;
    } catch (err) {
      console.error('Error saving career readiness:', err);
      throw err;
    }
  }
};
