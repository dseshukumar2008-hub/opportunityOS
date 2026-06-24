import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Sparkles, Compass } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { useProfile } from '../../contexts/ProfileContext';
import { useCareer } from '../../contexts/CareerContext';
import { generateProjectRecommendations } from '../../services/projectRecommendationEngine';
import { saveRecommendation, getSavedRecommendations } from '../../services/recommendationRepository';
import { toast } from 'react-hot-toast';

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
  const [savedProjectIds, setSavedProjectIds] = useState(new Set());
  const [loading, setLoading] = useState(false);
  const [specialization, setSpecialization] = useState('');
  const [targetRole, setTargetRole] = useState('');
  const [missingSkills, setMissingSkills] = useState([]);
  const [apiError, setApiError] = useState(null);
  const [showHowItWorks, setShowHowItWorks] = useState(false);

  const location = useLocation();
  const isContextMode = !!location.state?.sourceName;

  // Stringify missingSkills to prevent duplicate hook execution due to array reference changes
  const missingSkillsStr = careerContext?.missingSkills?.join(',') || '';

  // Initialize from profile and careerContext when available
  useEffect(() => {
    if (!isContextMode) {
      return;
    }

    let contextRole = '';
    let parsedMissingSkills = missingSkillsStr ? missingSkillsStr.split(',') : [];
    
    if (careerContext?.targetRole) {
      contextRole = careerContext.targetRole;
      setTargetRole(contextRole);
      
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
      const newRecs = await generateProjectRecommendations({
        specialization: spec,
        targetRole: role,
        missingSkills: skills
      }, forceRefresh);
      setRecommendations(newRecs);
      
      // Check if it's the fallback data (has isMock true)
      if (!(newRecs.length > 0 && newRecs[0].isMock)) {
        toast.success("Generated personalized project recommendations!");
      }
    } catch (error) {
      console.error("Recommendation Generation Error:", error);
      // Fallback handled silently

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
      console.log("Current User:", user);
      console.log("UID:", user?.uid);
      console.log("Project Data:", project);
      console.error("Save Error:", error);
      toast.error(`Failed to save project: ${error.message || error}`);
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
              <span className="px-2.5 py-1 bg-[#6D4AFF]/10 text-[#6D4AFF] text-xs font-bold rounded-full">
                AI Powered
              </span>
            </div>
            <p className="text-sm text-slate-500">AI-curated portfolio projects tailored to your career goals.</p>
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
            {recommendations.some(r => r.isMock) && (
              <span className="px-2 py-0.5 bg-amber-100 border border-amber-200 text-amber-700 text-[11px] uppercase tracking-wider font-bold rounded-md">
                Demo
              </span>
            )}
          </div>
          <div className="flex items-center gap-3 w-full sm:w-auto">
            <button 
              onClick={() => {
                setSpecialization('');
                setTargetRole('');
                setRecommendations([]);
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
              <Sparkles size={16} className="text-white" />
              {loading ? "Generating..." : "Refresh Ideas"}
            </button>
          </div>
        </div>
      )}

      <div className="space-y-6">
        {loading ? (
          <LoadingState />
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
