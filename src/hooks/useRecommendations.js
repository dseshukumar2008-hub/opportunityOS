import { useState, useEffect, useCallback } from 'react';
import { useApplications } from '../contexts/ApplicationContext';
import { useSavedOpportunities } from '../contexts/SavedOpportunitiesContext';
import { useLiveOpportunities } from './useLiveOpportunities';
import { calculateMatchScore } from './useMatchScore';
import { useRecommendationHistory } from './useRecommendationHistory';
import { useUserProfile } from './useUserProfile';
import { useAuth } from '../contexts/AuthContext';
import { db } from '../config/firebase';
import { collection, addDoc, serverTimestamp, query, where, getDocs, deleteDoc } from 'firebase/firestore';

export function useRecommendations() {
  const { applications } = useApplications();
  const { savedOpportunities } = useSavedOpportunities();
  const { addSnapshot } = useRecommendationHistory();
  const { opportunities: liveOpportunities, isLoading: isLiveOppsLoading } = useLiveOpportunities();
  const { profile } = useUserProfile();
  const { user } = useAuth();

  const [recommendations, setRecommendations] = useState([]);
  const [isCalculating, setIsCalculating] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (!liveOpportunities || liveOpportunities.length === 0) {
      setIsCalculating(false);
      return;
    }

    setIsCalculating(true);

    const timerId = setTimeout(() => {
      // Exclude opportunities we've already applied to
      const unappliedOpportunities = liveOpportunities.filter(opp => {
        const hasApplied = applications.some(
          app => app.title === opp.title && app.company === opp.company
        );
        return !hasApplied;
      });

      const evaluated = unappliedOpportunities.map(opp => {
        const matchData = calculateMatchScore(opp, profile);

        let bonusScore = matchData ? matchData.score : 0;

        // Saved company/category bonus
        if (savedOpportunities?.length > 0) {
          const hasSavedCompany = savedOpportunities.some(s => s.company === opp.company);
          const hasSavedCategory = savedOpportunities.some(s => s.type === opp.type);
          if (hasSavedCompany) bonusScore += 2;
          if (hasSavedCategory) bonusScore += 1;
        }

        return {
          ...opp,
          matchData: {
            ...matchData,
            finalSortScore: bonusScore
          }
        };
      });

      evaluated.sort((a, b) => b.matchData.finalSortScore - a.matchData.finalSortScore);
      setRecommendations(evaluated);
      setIsCalculating(false);
    }, 0);

    return () => clearTimeout(timerId);
  }, [profile, applications, savedOpportunities, liveOpportunities]);

  // Save top recommendations to Firebase
  const persistToFirebase = useCallback(async (recs) => {
    if (!user || isSaving || recs.length === 0) return;
    setIsSaving(true);
    try {
      // Clear old recommendations for this user
      const existing = query(collection(db, 'recommendations'), where('uid', '==', user.id));
      const snap = await getDocs(existing);
      await Promise.all(snap.docs.map(d => deleteDoc(d.ref)));

      // Write top 10 fresh recommendations
      await Promise.all(
        recs.slice(0, 10).map(opp =>
          addDoc(collection(db, 'recommendations'), {
            uid: user.id,
            opportunityId: opp.id,
            title: opp.title,
            company: opp.company,
            type: opp.type,
            url: opp.url || opp.applyLink || '',
            matchScore: opp.matchData?.score || 0,
            reasons: opp.matchData?.reasons || [],
            generatedAt: serverTimestamp(),
          })
        )
      );
    } catch (err) {
      console.error('Failed to save recommendations to Firebase:', err);
    } finally {
      setIsSaving(false);
    }
  }, [user, isSaving]);

  // Snapshot history and Firebase save when recommendations are generated
  useEffect(() => {
    if (recommendations && recommendations.length > 0) {
      const totalScore = recommendations.reduce((sum, opp) => sum + (opp.matchData?.score || 0), 0);
      const averageMatchScore = Math.round(totalScore / recommendations.length);
      const topRecommendation = recommendations[0];

      addSnapshot(averageMatchScore, topRecommendation, recommendations.length);
      persistToFirebase(recommendations);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [recommendations]);

  return { recommendations, isLoading: isLiveOppsLoading || isCalculating };
}
