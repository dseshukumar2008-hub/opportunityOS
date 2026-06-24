import React, { useState, useMemo } from 'react';
import { careerPaths } from '../data/careerPathsDb';
import CareerPathCard from './CareerPathCard';
import { RefreshCcw } from 'lucide-react';

export default function CareerPathResults({ userProfile, onRetake, resumeData, profileData }) {
  const [simulatedSkills, setSimulatedSkills] = useState([]);

  const toggleSimulatedSkill = (skill) => {
    setSimulatedSkills(prev => 
      prev.includes(skill) 
        ? prev.filter(s => s !== skill)
        : [...prev, skill]
    );
  };

  const recommendedPaths = useMemo(() => {
    // Collect all words the user selected or has in their profiles
    const userTags = [
      ...userProfile.interests,
      ...userProfile.strengths,
      ...userProfile.workPreferences
    ].map(t => t.toLowerCase());

    if (resumeData?.skills) {
      userTags.push(...resumeData.skills.map(s => s.toLowerCase()));
    }
    if (profileData?.extractedSkills) {
      userTags.push(...profileData.extractedSkills.map(s => s.toLowerCase()));
    }

    const simTags = simulatedSkills.map(s => s.toLowerCase());
    const allUserTags = [...userTags, ...simTags];

    // Score each career path based strictly on matched skills vs required skills
    const scoredPaths = careerPaths.map(path => {
      let matchedSkills = [];
      let missingSkills = [];

      path.skillsNeeded.forEach(skill => {
        const lowerSkill = skill.toLowerCase();
        if (allUserTags.some(ut => ut.includes(lowerSkill) || lowerSkill.includes(ut))) {
          matchedSkills.push(skill);
        } else {
          missingSkills.push(skill);
        }
      });

      const totalRequired = path.skillsNeeded.length;
      let matchScore = totalRequired > 0 
        ? Math.round((matchedSkills.length / totalRequired) * 100)
        : 0;

      return {
        ...path,
        matchScore,
        matchedSkills,
        missingSkills
      };
    });

    // Sort by score descending and take top 4
    return scoredPaths.sort((a, b) => b.matchScore - a.matchScore).slice(0, 4);
  }, [userProfile, resumeData, profileData, simulatedSkills]);

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Real-Time Career Match Engine</h2>
          <p className="text-slate-500 mt-1">
            Calculated instantly from your Resume, GitHub, LinkedIn, and Onboarding profile.
          </p>
        </div>
        <button 
          onClick={onRetake}
          className="flex items-center gap-2 text-[13px] font-bold text-slate-500 hover:text-[#6D5DF6] transition-colors"
        >
          <RefreshCcw size={16} />
          Retake Assessment
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {recommendedPaths.map(path => (
          <CareerPathCard 
            key={path.id} 
            path={path} 
            simulatedSkills={simulatedSkills}
            toggleSimulatedSkill={toggleSimulatedSkill}
          />
        ))}
      </div>
    </div>
  );
}
