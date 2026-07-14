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
    <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-12 pt-0 lg:pt-2 pb-24 h-full overflow-y-auto scrollbar-hide">
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
