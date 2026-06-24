import { db } from '../config/firebase';
import { doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore';

export const hiddenPotentialService = {
  /**
   * Fetch the cached Hidden Potential Report for the user
   */
  async getReport(userId) {
    if (!userId) return null;
    try {
      const docRef = doc(db, 'hidden_potential_reports', userId);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        return docSnap.data();
      }
      return null;
    } catch (err) {
      console.error('Error fetching hidden potential report:', err);
      throw err;
    }
  },

  /**
   * Save a newly generated Hidden Potential Report
   */
  async saveReport(userId, currentTarget, detectedCareers) {
    if (!userId) throw new Error("User ID required");
    try {
      const docRef = doc(db, 'hidden_potential_reports', userId);
      
      const payload = {
        userId,
        currentTarget,
        detectedCareers,
        generatedAt: serverTimestamp()
      };

      await setDoc(docRef, payload, { merge: true });
      return payload;
    } catch (err) {
      console.error('Error saving hidden potential report:', err);
      throw err;
    }
  }
};
