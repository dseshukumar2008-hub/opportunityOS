import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { careerReadinessService } from '../services/careerReadinessService';
import { geminiService } from '../services/geminiService';
import { useCareerReadiness } from './useCareerReadiness'; // Dynamic underlying calculator

export function usePersistentReadiness() {
  const { user } = useAuth();
  const dynamicReadiness = useCareerReadiness(); 
  
  const [persistentData, setPersistentData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isRecalculating, setIsRecalculating] = useState(false);

let readinessCache = new Map();
let pendingReadinessFetches = new Map();

  const fetchPersistentData = useCallback(async () => {
    if (!user?.uid) return;
    
    try {
      if (readinessCache.has(user.uid)) {
        setPersistentData(readinessCache.get(user.uid));
        setIsLoading(false);
        return;
      }

      setIsLoading(true);
      let fetchPromise = pendingReadinessFetches.get(user.uid);
      if (!fetchPromise) {
        fetchPromise = careerReadinessService.getReadiness(user.uid);
        pendingReadinessFetches.set(user.uid, fetchPromise);
      }

      const data = await fetchPromise;
      if (data) {
        readinessCache.set(user.uid, data);
        setPersistentData(data);
      }
    } catch (err) {
      console.error('Failed to fetch persistent readiness data:', err);
    } finally {
      pendingReadinessFetches.delete(user.uid);
      setIsLoading(false);
    }
// eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  useEffect(() => {
// eslint-disable-next-line react-hooks/set-state-in-effect
    fetchPersistentData();
  }, [fetchPersistentData]);

  const recalculateAndSave = async () => {
    if (!user?.uid || !dynamicReadiness?.score) return;
    setIsRecalculating(true);
    try {
      // 1. Get the latest dynamically calculated score and breakdown
      const currentDynamicData = {
        score: dynamicReadiness.score,
        breakdown: dynamicReadiness.breakdown
      };
      
      // 2. Fetch fresh AI analysis
      const aiAnalysis = await geminiService.analyzeReadiness(currentDynamicData);
      
      // 3. Save to Firestore
      const savedPayload = await careerReadinessService.saveReadiness(
        user.uid, 
        currentDynamicData, 
        aiAnalysis
      );
      
      // 4. Update local state and cache
      readinessCache.set(user.uid, savedPayload);
      setPersistentData(savedPayload);
      return savedPayload;
    } catch (err) {
      console.error('Error recalculating readiness:', err);
      throw err;
    } finally {
      setIsRecalculating(false);
    }
  };

  return {
    persistentData,
    isLoading,
    isRecalculating,
    recalculateAndSave,
    // We also expose the dynamic data so the widget can know if it's "out of sync"
    dynamicReadiness 
  };
}
