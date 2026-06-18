import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Sparkles, Compass } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { useProfile } from '../../contexts/ProfileContext';
import { generateProjectRecommendations } from '../../services/projectRecommendationEngine';
import { saveRecommendation, getSavedRecommendations } from '../../services/recommendationRepository';
import { toast } from 'react-hot-toast';

import ProjectRecommendationCard from './ProjectRecommendationCard';
import LoadingState from './LoadingState';
import EmptyState from './EmptyState';

export default function ProjectRecommendationPage() {
  const { user } = useAuth();
  const { profile } = useProfile();
  
  const [recommendations, setRecommendations] = useState([]);
  const [savedProjectIds, setSavedProjectIds] = useState(new Set());
  const [loading, setLoading] = useState(false);
  const [specialization, setSpecialization] = useState('');
  const [targetRole, setTargetRole] = useState('');
  const [apiError, setApiError] = useState(null);

  // Initialize from profile when available
  useEffect(() => {
    if (profile) {
      if (profile.specialization) setSpecialization(profile.specialization);
      if (profile.careerGoal) setTargetRole(profile.careerGoal);
    }
  }, [profile]);

  useEffect(() => {
    if (user) {
      loadSavedProjects();
    }
  }, [user]);

  const loadSavedProjects = async () => {
    try {
      const saved = await getSavedRecommendations(user.uid);
      setSavedProjectIds(new Set(saved.map(p => p.id)));
    } catch (error) {
      console.error("Failed to load saved projects:", error);
    }
  };

  const handleGenerate = async () => {
    if (!user) {
      toast.error("Please log in to generate recommendations");
      return;
    }

    setApiError(null);
    setLoading(true);
    try {
      const newRecs = await generateProjectRecommendations({
        specialization,
        targetRole
      });
      setRecommendations(newRecs);
      toast.success("Generated personalized project recommendations!");
    } catch (error) {
      console.error("Recommendation Generation Error:", error);
      
      const isQuotaError = error.status === 429 || 
        error.message?.toLowerCase().includes('quota') || 
        error.message?.toLowerCase().includes('rate limit');

      if (isQuotaError) {
        setApiError('quota');
      } else {
        toast.error(`Failed to generate recommendations: ${error.message || error}`);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleSaveProject = async (project) => {
    if (!user) return;
    
    try {
      const careerGoal = profile?.careerGoal || "Software Engineer";
      await saveRecommendation(user.uid, project, careerGoal);
      setSavedProjectIds(prev => new Set(prev).add(project.id));
      toast.success("Project saved to your workspace!");
    } catch (error) {
      console.error("Failed to save project:", error);
      toast.error("Failed to save project.");
    }
  };

  return (
    <div className="max-w-5xl mx-auto p-4 sm:p-6 lg:p-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-10 pb-6 border-b border-slate-100">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-[#6D4AFF] text-white flex items-center justify-center shadow-sm">
            <Compass size={24} />
          </div>
          <div>
            <div className="flex items-center gap-3 mb-1">
              <h1 className="text-2xl font-bold text-slate-900">Project Engine</h1>
              <span className="px-2.5 py-1 bg-[#6D4AFF]/10 text-[#6D4AFF] text-xs font-bold rounded-full">
                AI Powered
              </span>
            </div>
            <p className="text-sm text-slate-500">AI-curated portfolio projects tailored to your career goals.</p>
          </div>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 border border-slate-200 text-slate-600 text-sm font-semibold rounded-xl hover:bg-slate-50 transition-colors">
          <svg className="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          How it works
        </button>
      </div>

      {!loading && recommendations.length > 0 && (
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-6">
          <div className="flex items-center gap-3">
            <h2 className="text-lg font-bold text-slate-900">Top Recommendations for You</h2>
            {recommendations.some(r => r.isMock) && (
              <span className="px-2 py-0.5 bg-amber-100 border border-amber-200 text-amber-700 text-[11px] uppercase tracking-wider font-bold rounded-md">
                Demo
              </span>
            )}
          </div>
          <button 
            onClick={handleGenerate}
            className="flex items-center justify-center gap-2 px-4 py-2 bg-white border border-slate-200 text-slate-700 text-sm font-bold rounded-lg hover:bg-slate-50 transition-colors w-full sm:w-auto"
          >
            <Sparkles size={16} className="text-[#6D4AFF]" />
            Refresh Ideas
          </button>
        </div>
      )}

      <div className="space-y-6">
        {loading ? (
          <LoadingState />
        ) : apiError === 'quota' ? (
          <div className="w-full max-w-[1100px] mx-auto bg-white border border-[#EAEAEA] rounded-[20px] p-8 md:p-12 text-center shadow-sm flex flex-col items-center">
            <div className="w-16 h-16 bg-amber-50 rounded-full flex items-center justify-center mb-6">
              <svg className="w-8 h-8 text-amber-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
            <h2 className="text-xl font-bold text-slate-900 mb-2">Project generation is temporarily busy.</h2>
            <p className="text-slate-500 max-w-md mb-8">Please wait a minute and try again.</p>
            <button
              onClick={handleGenerate}
              className="px-8 py-3.5 bg-[#6D4AFF] text-white font-bold rounded-[14px] hover:bg-[#5B3DE6] transition-colors shadow-sm"
            >
              Retry
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
                  onSave={handleSaveProject}
                  isSaved={savedProjectIds.has(project.id)}
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
