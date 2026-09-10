import { useState, useEffect, useCallback } from 'react';
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
import SkillGapHowItWorksModal from '../../components/skill-gap/SkillGapHowItWorksModal';

// Parses the persisted analysis result from sessionStorage.
// Returns null if the value is missing, malformed, or an offline sentinel.
function loadPersistedAnalysis() {
  try {
    const val = sessionStorage.getItem('sg_analysis');
    if (!val || val === 'null') return null;
    const parsed = JSON.parse(val);
    if (!parsed || typeof parsed !== 'object') return null;
    // Reject offline/template-provider sentinel objects so we never
    // render a blank page (step 5 with no real data) on the next load.
    const isOfflineSentinel =
      parsed.targetRole === 'Offline' ||
      (parsed.readinessScore === 0 &&
        parsed.skillGapPercentage === 100 &&
        !parsed.currentSkills?.length);
    if (isOfflineSentinel) {
      sessionStorage.removeItem('sg_analysis');
      return null;
    }
    return parsed;
  } catch {
    return null;
  }
}

export default function SkillGapAnalysisPage() {
  const location = useLocation();
  const isContextMode = !!location.state?.sourceName;

  // Restore persisted analysis first so we can validate the step.
  const [analysisData, setAnalysisData] = useState(() => loadPersistedAnalysis());

  const [currentStep, setCurrentStep] = useState(() => {
    const raw = sessionStorage.getItem('sg_step');
    const saved = parseInt(raw || '1', 10);

    // Guard: NaN, 0, or negative → step 1.
    if (!saved || saved < 1) return 1;
    // Step 4 is the live-analysis screen — never restore it (would show
    // a stuck spinner if the tab was closed mid-analysis).
    if (saved === 4) {
      sessionStorage.removeItem('sg_step');
      return 1;
    }
    // Step 5 is the results dashboard — only valid when we have real data.
    // If analysisData was purged (offline sentinel / missing), fall back to 1.
    if (saved === 5 && !loadPersistedAnalysis()) {
      sessionStorage.setItem('sg_step', '1');
      return 1;
    }
    return saved;
  });

  const [targetRole, setTargetRole] = useState(() => {
    const params = new URLSearchParams(location.search);
    return params.get('targetRole') || sessionStorage.getItem('sg_role') || '';
  });

  const [selectedSources, setSelectedSources] = useState(() => {
    try {
      const val = sessionStorage.getItem('sg_sources');
      return val ? JSON.parse(val) : [];
    } catch {
      return [];
    }
  });

  const [inputData, setInputData] = useState(() => {
    try {
      const val = sessionStorage.getItem('sg_input');
      return val ? JSON.parse(val) : {};
    } catch {
      return {};
    }
  });

  const [showHowItWorks, setShowHowItWorks] = useState(false);

  // Persist state to sessionStorage whenever it changes.
  useEffect(() => {
    // Never persist the analyzing step — restoring it on the next load would
    // show an infinite spinner.
    if (currentStep === 4) {
      sessionStorage.removeItem('sg_step');
    } else {
      sessionStorage.setItem('sg_step', String(currentStep));
    }
  }, [currentStep]);

  useEffect(() => { sessionStorage.setItem('sg_role', targetRole); }, [targetRole]);
  useEffect(() => { sessionStorage.setItem('sg_sources', JSON.stringify(selectedSources)); }, [selectedSources]);
  useEffect(() => { sessionStorage.setItem('sg_input', JSON.stringify(inputData)); }, [inputData]);
  useEffect(() => { sessionStorage.setItem('sg_analysis', JSON.stringify(analysisData)); }, [analysisData]);

  const { profile } = useProfile();
  const { careerContext } = useCareer();

  // When arriving from Career Explorer / Career Coach context, pre-fill the role.
  useEffect(() => {
    if (isContextMode && careerContext?.targetRole && !targetRole) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setTargetRole(careerContext.targetRole);

      if (careerContext?.missingSkills?.length > 0) {
        setSelectedSources(['manual']);
        setInputData({ manualSkills: careerContext.missingSkills });
        setCurrentStep(3);
      }
    }
  }, [isContextMode, careerContext?.targetRole, careerContext?.missingSkills, targetRole]);

  // Pre-populate the manual skills input from the user's profile / career context.
  // Only runs when the user has explicitly reached step 2+ (or is in context mode).
  useEffect(() => {
    if (!isContextMode && currentStep === 1) return;

    const skills =
      careerContext?.missingSkills?.length > 0
        ? careerContext.missingSkills
        : profile?.extractedSkills || [];

    if (skills.length > 0) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setInputData(prev => ({
        ...prev,
        manualSkills: prev.manualSkills?.length ? prev.manualSkills : skills,
      }));
    }
  }, [isContextMode, currentStep, profile, careerContext?.missingSkills]);

  const handleRoleSubmit = (role) => {
    setTargetRole(role);
    setCurrentStep(2);
  };

  const handleSourceSubmit = (sources) => {
    setSelectedSources(sources);
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

  const resetAnalysis = useCallback(() => {
    setCurrentStep(1);
    setInputData({});
    setTargetRole('');
    setSelectedSources([]);
    setAnalysisData(null);
    sessionStorage.removeItem('sg_step');
    sessionStorage.removeItem('sg_role');
    sessionStorage.removeItem('sg_sources');
    sessionStorage.removeItem('sg_input');
    sessionStorage.removeItem('sg_analysis');
  }, []);

  // useCallback prevents a new function reference on every render, which would
  // re-trigger Step3Analyzing's useEffect and restart the analysis unnecessarily.
  const handleAnalysisComplete = useCallback((data) => {
    // Reject offline/template sentinel results — treat them as a failure so
    // the user can retry rather than seeing an "Offline" report.
    const isOfflineSentinel =
      data?.targetRole === 'Offline' ||
      (data?.readinessScore === 0 &&
        data?.skillGapPercentage === 100 &&
        !data?.currentSkills?.length);

    if (isOfflineSentinel && !data?._error) {
      resetAnalysis();
      return;
    }

    setAnalysisData(data);
    setCurrentStep(5);
  }, [resetAnalysis]);

  // Wrap in useCallback for the same reason as handleAnalysisComplete.
  const handleAnalysisError = useCallback(() => {
    resetAnalysis();
  }, [resetAnalysis]);

  return (
    <div className="w-full max-w-5xl mx-auto p-4 sm:p-6 lg:p-8 bg-transparent min-h-[calc(100vh-64px)]">
      <WidgetErrorBoundary>
        <div className="w-full mb-6 flex items-center justify-between">
          <ContextualBackButton />
          <button
            onClick={() => setShowHowItWorks(true)}
            className="ml-auto flex items-center gap-2 px-4 py-2 border border-slate-200 text-slate-600 text-sm font-semibold rounded-xl hover:bg-slate-50 transition-colors bg-white shadow-sm"
          >
            <svg className="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            How it works
          </button>
        </div>

        <SkillGapHowItWorksModal
          isOpen={showHowItWorks}
          onClose={() => setShowHowItWorks(false)}
        />

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
              onError={handleAnalysisError}
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
