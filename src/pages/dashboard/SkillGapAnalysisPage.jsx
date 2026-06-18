import { useState, useEffect } from 'react';
import { WidgetErrorBoundary } from '../../components/common/GlobalErrorBoundary';
import { useProfile } from '../../contexts/ProfileContext';
import Step1TargetRole from '../../components/skill-gap/Step1TargetRole';
import Step2AnalysisSource from '../../components/skill-gap/Step2AnalysisSource';
import Step2bInputCollection from '../../components/skill-gap/Step2bInputCollection';
import Step3Analyzing from '../../components/skill-gap/Step3Analyzing';
import Step4Dashboard from '../../components/skill-gap/Step4Dashboard';

export default function SkillGapAnalysisPage() {
  const [currentStep, setCurrentStep] = useState(1);
  const [targetRole, setTargetRole] = useState('');
  const [selectedSources, setSelectedSources] = useState([]);
  const [inputData, setInputData] = useState({});
  const [analysisData, setAnalysisData] = useState(null);
  const { profile } = useProfile();

  useEffect(() => {
    if (profile?.extractedSkills?.length > 0) {
      setInputData(prev => ({
        ...prev,
        manualSkills: prev.manualSkills?.length ? prev.manualSkills : profile.extractedSkills
      }));
    }
  }, [profile]);

  const handleRoleSubmit = (role) => {
    setTargetRole(role);
    setCurrentStep(2);
  };

  const handleSourceSubmit = (sources) => {
    setSelectedSources(sources);
    // If only roadmap is selected, we can skip input collection
    if (sources.length === 1 && sources[0] === 'roadmap') {
      setCurrentStep(4);
    } else {
      setCurrentStep(3);
    }
  };

  const handleInputSubmit = (data) => {
    setInputData(data);
    setCurrentStep(4);
  };

  const handleAnalysisComplete = (data) => {
    setAnalysisData(data);
    setCurrentStep(5);
  };

  const resetAnalysis = () => {
    setCurrentStep(1);
    setInputData({});
  };

  return (
    <div className="w-full max-w-[1600px] mx-auto px-4 lg:px-8 pt-6 pb-12 bg-[#F8FAFC] min-h-[calc(100vh-64px)] flex justify-center">
      <WidgetErrorBoundary>
        {currentStep === 1 && (
          <Step1TargetRole 
            onSubmit={handleRoleSubmit} 
            initialRole={targetRole} 
          />
        )}
        
        {currentStep === 2 && (
          <Step2AnalysisSource 
            onSubmit={handleSourceSubmit} 
            onBack={() => setCurrentStep(1)} 
            initialSources={selectedSources} 
          />
        )}

        {currentStep === 3 && (
          <Step2bInputCollection
            sources={selectedSources}
            onSubmit={handleInputSubmit}
            onBack={() => setCurrentStep(2)}
            initialData={inputData}
          />
        )}

        {currentStep === 4 && (
          <Step3Analyzing 
            targetRole={targetRole} 
            sources={selectedSources}
            inputData={inputData}
            onComplete={handleAnalysisComplete} 
          />
        )}

        {currentStep === 5 && analysisData && (
          <Step4Dashboard 
            data={analysisData} 
            onReset={resetAnalysis} 
          />
        )}
      </WidgetErrorBoundary>
    </div>
  );
}
