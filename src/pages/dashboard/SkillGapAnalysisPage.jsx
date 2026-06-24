import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { WidgetErrorBoundary } from '../../components/common/GlobalErrorBoundary';
import { useProfile } from '../../contexts/ProfileContext';
import { useCareer } from '../../contexts/CareerContext';
import Step1TargetRole from '../../components/skill-gap/Step1TargetRole';
import Step2AnalysisSource from '../../components/skill-gap/Step2AnalysisSource';
import Step2bInputCollection from '../../components/skill-gap/Step2bInputCollection';
import Step3Analyzing from '../../components/skill-gap/Step3Analyzing';
import Step4Dashboard from '../../components/skill-gap/Step4Dashboard';
import ContextualBackButton from '../../components/navigation/ContextualBackButton';

export default function SkillGapAnalysisPage() {
  const location = useLocation();
  const isContextMode = !!location.state?.sourceName;

  const [currentStep, setCurrentStep] = useState(1);
  const [targetRole, setTargetRole] = useState(() => {
    const params = new URLSearchParams(location.search);
    return params.get('targetRole') || '';
  });
  const [selectedSources, setSelectedSources] = useState([]);
  const [inputData, setInputData] = useState({});
  const [analysisData, setAnalysisData] = useState(null);
  const { profile } = useProfile();
  const { careerContext } = useCareer();

  useEffect(() => {
    if (isContextMode && careerContext?.targetRole && !targetRole) {
      setTargetRole(careerContext.targetRole);
      
      // Pre-fill and advance to input collection instead of automatically analyzing
      if (careerContext?.missingSkills?.length > 0) {
        setSelectedSources(['manual']);
        setInputData({ manualSkills: careerContext.missingSkills });
        setCurrentStep(3); // Jump to Step2bInputCollection
      }
    }
  }, [isContextMode, careerContext?.targetRole, careerContext?.missingSkills]);

  useEffect(() => {
    // If we're entering directly, don't automatically prepopulate skills
    // We only prepopulate when entering from context.
    if (!isContextMode && currentStep === 1) return;

    const skills = careerContext?.missingSkills?.length > 0 
      ? careerContext.missingSkills 
      : profile?.extractedSkills || [];
      
    if (skills.length > 0) {
      setInputData(prev => ({
        ...prev,
        manualSkills: prev.manualSkills?.length ? prev.manualSkills : skills
      }));
    }
  }, [isContextMode, currentStep, profile, careerContext?.missingSkills]);

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
    setTargetRole('');
    setSelectedSources([]);
    setAnalysisData(null);
  };

  return (
    <div className="w-full max-w-5xl mx-auto p-4 sm:p-6 lg:p-8 bg-transparent min-h-[calc(100vh-64px)]">
      <WidgetErrorBoundary>
        <div className="w-full mb-6">
          <ContextualBackButton />
        </div>
        <div className="flex flex-col items-center w-full">
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
          <div className="w-full">
            <Step4Dashboard 
              data={analysisData} 
              onReset={resetAnalysis} 
            />
          </div>
        )}
        </div>
      </WidgetErrorBoundary>
    </div>
  );
}
