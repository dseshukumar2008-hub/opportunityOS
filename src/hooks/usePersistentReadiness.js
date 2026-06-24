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

  const fetchPersistentData = useCallback(async () => {
    if (!user?.uid) return;
    try {
      setIsLoading(true);
      const data = await careerReadinessService.getReadiness(user.uid);
      if (data) {
        setPersistentData(data);
      }
    } catch (err) {
      console.error('Failed to fetch persistent readiness data:', err);
    } finally {
      setIsLoading(false);
    }
  }, [user]);

  useEffect(() => {
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
      
      // 4. Update local state
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
