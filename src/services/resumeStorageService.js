import { ref, uploadBytesResumable, getDownloadURL, deleteObject } from 'firebase/storage';
import { doc, setDoc, getDoc, updateDoc } from 'firebase/firestore';
import { storage, db } from '../config/firebase';

/**
 * Resume Storage Service
 * Handles Firebase Storage upload + Firestore metadata/analysis persistence.
 */
export const resumeStorageService = {
  /**
   * Upload a resume file to Firebase Storage.
   * Path: users/{uid}/resume/{fileName}
   * @param {File} file
   * @param {string} uid
   * @param {function} onProgress - callback(progress: 0-100)
   * @returns {{ downloadURL: string, fileName: string, storagePath: string }}
   */
  async uploadResume(file, uid, onProgress) {
    if (!file || !uid) throw new Error('File and user ID are required.');

    const safeFileName = `${Date.now()}_${file.name.replace(/[^a-zA-Z0-9._-]/g, '_')}`;
    const storagePath = `users/${uid}/resume/${safeFileName}`;
    const storageRef = ref(storage, storagePath);

    return new Promise((resolve, reject) => {
      const uploadTask = uploadBytesResumable(storageRef, file);

      uploadTask.on(
        'state_changed',
        (snapshot) => {
          const progress = Math.round((snapshot.bytesTransferred / snapshot.totalBytes) * 100);
          if (onProgress) onProgress(progress);
        },
        (error) => {
          console.error('Firebase Storage upload error:', error);
          reject(error);
        },
        async () => {
          try {
            const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
            resolve({ downloadURL, fileName: safeFileName, storagePath });
          } catch (err) {
            reject(err);
          }
        }
      );
    });
  },

  /**
   * Delete a resume file from Firebase Storage.
   * @param {string} storagePath - Full path e.g. users/{uid}/resume/{fileName}
   */
  async deleteResume(storagePath) {
    if (!storagePath) return;
    try {
      const fileRef = ref(storage, storagePath);
      await deleteObject(fileRef);
    } catch (err) {
      // File may already be deleted — non-fatal
      console.warn('Resume delete warning:', err.code);
    }
  },

  /**
   * Save resume upload metadata to Firestore at users/{uid}.resume
   * @param {string} uid
   * @param {{ resumeUrl: string, fileName: string, storagePath: string }} meta
   */
  async saveResumeMetaToFirestore(uid, meta) {
    const userRef = doc(db, 'users', uid);
    await setDoc(userRef, { resume: { ...meta, uploadedAt: new Date().toISOString() } }, { merge: true });
  },

  /**
   * Save Gemini analysis results to Firestore at users/{uid}.resumeAnalysis
   * @param {string} uid
   * @param {object} analysis - Full Gemini analysis object
   */
  async saveAnalysisToFirestore(uid, analysis) {
    const userRef = doc(db, 'users', uid);
    await setDoc(
      userRef,
      {
        resumeAnalysis: {
          ...analysis,
          analyzedAt: new Date().toISOString()
        }
      },
      { merge: true }
    );
  },

  /**
   * Read the persisted analysis from Firestore.
   * @param {string} uid
   * @returns {object|null} - The stored analysis or null
   */
  async getAnalysisFromFirestore(uid) {
    if (!uid) return null;
    try {
      const userRef = doc(db, 'users', uid);
      const snap = await getDoc(userRef);
      if (snap.exists()) {
        const data = snap.data();
        return {
          analysis: data.resumeAnalysis || null,
          resume: data.resume || null
        };
      }
      return null;
    } catch (err) {
      console.error('Error reading Firestore analysis:', err);
      return null;
    }
  },

  /**
   * Merge extracted resume skills into the user's onboarding profile.
   * Reads users/{uid}.skills, deduplicates, and writes back.
   * @param {string} uid
   * @param {string[]} extractedSkills
   */
  async mergeSkillsToProfile(uid, extractedSkills) {
    if (!uid || !extractedSkills?.length) return;
    try {
      const userRef = doc(db, 'users', uid);
      const snap = await getDoc(userRef);

      const existing = snap.exists() ? (snap.data()?.skills || []) : [];
      const existingLower = existing.map(s => s.toLowerCase());

      // Only add skills not already present (case-insensitive dedup)
      const newSkills = extractedSkills.filter(
        skill => skill && !existingLower.includes(skill.toLowerCase())
      );

      if (newSkills.length > 0) {
        const merged = [...existing, ...newSkills];
        await updateDoc(userRef, { skills: merged, resumeSkills: extractedSkills });
        console.log(`Resume Intelligence: Merged ${newSkills.length} new skills into profile.`);
      } else {
        // Still save resumeSkills for match score use
        await updateDoc(userRef, { resumeSkills: extractedSkills });
      }
    } catch (err) {
      console.error('Error merging skills to profile:', err);
    }
  }
};
