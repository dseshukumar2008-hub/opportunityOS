import React, { useState } from 'react';
import OnboardingFlow from './components/OnboardingFlow';
import CareerPathResults from './components/CareerPathResults';
import { useResume } from '../../contexts/ResumeContext';
import { useProfile } from '../../contexts/ProfileContext';

export default function CareerExplorerPage() {
  const { resumeData } = useResume();
  const { profile } = useProfile();
  const [hasCompletedOnboarding, setHasCompletedOnboarding] = useState(false);
  const [userProfile, setUserProfile] = useState({
    interests: [],
    strengths: [],
    workPreferences: []
  });

  const handleOnboardingComplete = (profileData) => {
    setUserProfile(profileData);
    setHasCompletedOnboarding(true);
  };

  const handleRetake = () => {
    setHasCompletedOnboarding(false);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pb-24 h-full overflow-y-auto scrollbar-hide">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Career Explorer</h1>
          <p className="mt-2 text-slate-600">Discover personalized career paths based on your unique profile.</p>
        </div>
      </div>

      {!hasCompletedOnboarding ? (
        <OnboardingFlow 
          onComplete={handleOnboardingComplete} 
          initialData={userProfile}
        />
      ) : (
        <CareerPathResults 
          userProfile={userProfile} 
          onRetake={handleRetake} 
          resumeData={resumeData}
          profileData={profile}
        />
      )}
    </div>
  );
}
