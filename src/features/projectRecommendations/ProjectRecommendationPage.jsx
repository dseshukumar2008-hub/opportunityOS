import  { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Sparkles, Compass, RefreshCw } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { useProfile } from '../../contexts/ProfileContext';
import { useCareer } from '../../contexts/CareerContext';
import { generateProjectRecommendations } from '../../services/projectRecommendationEngine';
import { toast } from 'react-hot-toast';
import { useRef } from 'react';

import ContextualBackButton from '../../components/navigation/ContextualBackButton';
import ProjectRecommendationCard from './ProjectRecommendationCard';
import LoadingState from './LoadingState';
import EmptyState from './EmptyState';
import HowItWorksModal from './HowItWorksModal';

export default function ProjectRecommendationPage() {
  const { user } = useAuth();
  const { profile } = useProfile();
  const { careerContext } = useCareer();
  
  const [recommendations, setRecommendations] = useState([]);
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(false);
  const [apiError, setApiError] = useState(null);
  const [specialization, setSpecialization] = useState('');
  const [targetRole, setTargetRole] = useState('');
  const [missingSkills, setMissingSkills] = useState([]);
  const [showHowItWorks, setShowHowItWorks] = useState(false);
  const isMounted = useRef(true);

  useEffect(() => {
    return () => { isMounted.current = false; };
  }, []);

  const location = useLocation();
  const isContextMode = !!location.state?.sourceName;

  // Stringify missingSkills to prevent duplicate hook execution due to array reference changes
  const missingSkillsStr = careerContext?.missingSkills?.join(',') || '';

  // Initialize from profile and careerContext when available
  useEffect(() => {
    if (!isContextMode) {
      return;
    }

    let parsedMissingSkills = missingSkillsStr ? missingSkillsStr.split(',') : [];
    
    if (careerContext?.targetRole) {
// eslint-disable-next-line react-hooks/set-state-in-effect
      setTargetRole(careerContext.targetRole);
      
      if (parsedMissingSkills.length > 0) {
        setMissingSkills(parsedMissingSkills);
      }
    } else if (profile?.careerGoal) {
      setTargetRole(profile.careerGoal);
    }
    
    if (profile?.specialization) {
      setSpecialization(profile.specialization);
    }
    
    // We intentionally DO NOT auto-generate here. The user must click "Generate".
  }, [profile, careerContext?.targetRole, missingSkillsStr, isContextMode]);

  const handleGenerate = async () => {
    handleGenerateWithData(targetRole, specialization, missingSkills, true);
  };

  const handleGenerateWithData = async (role, spec, skills, forceRefresh = false) => {
    if (!user) {
      toast.error("Please log in to generate recommendations");
      return;
    }
    
    if (loading) return; // Prevent duplicate requests

    setApiError(null);
    setLoading(true);
    try {
      let currentExcluded = [...history];
      if (forceRefresh && recommendations.length > 0) {
        const currentTitles = recommendations.map(r => r.title);
        currentExcluded = [...currentExcluded, ...currentTitles];
      }

      const newRecs = await generateProjectRecommendations({
        specialization: spec,
        targetRole: role,
        missingSkills: skills
      }, forceRefresh, currentExcluded);
      
      if (!isMounted.current) return;
      
      setRecommendations(newRecs);
      if (forceRefresh) {
        setHistory(currentExcluded);
      }
      
      if (forceRefresh && recommendations.length > 0) {
        toast.success("Found fresh project recommendations!");
      } else {
        toast.success("Found personalized project matches!");
      }
    } catch (error) {
      if (!isMounted.current) return;
      console.error("Recommendation Generation Error:", error);
      setApiError(error.message || "Failed to generate recommendations");
      toast.error("Analysis failed. Please try again.");
    } finally {
      if (isMounted.current) setLoading(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto p-4 sm:p-6 lg:p-8">
      <ContextualBackButton />
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-10 pb-6 border-b border-slate-100">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-[#6D4AFF] text-white flex items-center justify-center shadow-sm">
            <Compass size={24} />
          </div>
          <div>
            <div className="flex items-center gap-3 mb-1">
              <h1 className="text-2xl font-bold text-slate-900">Project Engine</h1>
            </div>
            <p className="text-sm text-slate-500">Curated portfolio projects tailored to your career goals.</p>
          </div>
        </div>
        <button 
          onClick={() => setShowHowItWorks(true)}
          className="flex items-center gap-2 px-4 py-2 border border-slate-200 text-slate-600 text-sm font-semibold rounded-xl hover:bg-slate-50 transition-colors"
        >
          <svg className="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          How it works
        </button>
      </div>

      <HowItWorksModal 
        isOpen={showHowItWorks} 
        onClose={() => setShowHowItWorks(false)} 
      />

      {recommendations.length > 0 && (
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-6">
          <div className="flex items-center gap-3">
            <h2 className="text-lg font-bold text-slate-900">Top Recommendations for You</h2>
          </div>
          <div className="flex items-center gap-3 w-full sm:w-auto">
            <button 
              onClick={() => {
                setSpecialization('');
                setTargetRole('');
                setRecommendations([]);
                setHistory([]);
              }}
              className="flex-1 sm:flex-none items-center justify-center px-4 py-2 bg-white border border-slate-200 text-slate-700 text-sm font-bold rounded-lg hover:bg-slate-50 transition-colors"
            >
              Start Over
            </button>
            <button 
              onClick={handleGenerate}
              disabled={loading}
              className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-2 bg-[#6D4AFF] text-white text-sm font-bold rounded-lg hover:bg-[#5B3DE6] shadow-sm transition-colors disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {loading && recommendations.length > 0 ? (
                <RefreshCw size={16} className="text-white animate-spin" />
              ) : (
                <Sparkles size={16} className="text-white" />
              )}
              {loading && recommendations.length > 0 ? "Refreshing Ideas..." : loading ? "Generating..." : "Refresh Ideas"}
            </button>
          </div>
        </div>
      )}

      <div className="space-y-6">
        {loading ? (
          <LoadingState />
        ) : apiError ? (
          <div className="bg-red-50 border border-red-100 rounded-[24px] p-8 text-center mt-6">
            <h3 className="text-xl font-bold text-red-600 mb-2">Analysis Failed</h3>
            <p className="text-red-500 mb-6">{apiError}</p>
            <button 
              onClick={() => setApiError(null)}
              className="px-6 py-2 bg-white text-red-600 border border-red-200 rounded-xl font-bold shadow-sm"
            >
              Dismiss
            </button>
          </div>
        ) : recommendations.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {recommendations.map((project, idx) => (
              <motion.div
                key={project.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
              >
                <ProjectRecommendationCard 
                  project={project} 
                />
              </motion.div>
            ))}
          </div>
        ) : (
          <EmptyState 
            specialization={specialization}
            setSpecialization={setSpecialization}
            targetRole={targetRole}
            setTargetRole={setTargetRole}
            onGenerate={handleGenerate} 
          />
        )}
      </div>
    </div>
  );
}
