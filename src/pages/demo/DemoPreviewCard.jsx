import Step1CreateProfile from './screens/Step1CreateProfile';
import DashboardPreview from '../../components/DashboardPreview';
import Step3AIResumeAnalysis from './screens/Step3AIResumeAnalysis';
import Step4OpportunityMatching from './screens/Step4OpportunityMatching';
import Step5AICoach from './screens/Step5AICoach';
import Step6CareerRoadmap from './screens/Step6CareerRoadmap';
import Step7SkillGapAnalysis from './screens/Step7SkillGapAnalysis';
import Step8Welcome from './screens/Step8Welcome';
export default function DemoPreviewCard({ step }) {
  const getPreviewContent = () => {
    switch (step) {
      case 1: return <Step1CreateProfile />;
      case 2: return <div className="h-[600px] w-[900px] max-w-full mx-auto"><DashboardPreview /></div>;
      case 3: return <Step3AIResumeAnalysis />;
      case 4: return <Step4OpportunityMatching />;
      case 5: return <Step5AICoach />;
      case 6: return <Step6CareerRoadmap />;
      case 7: return <Step7SkillGapAnalysis />;
      case 8: return <Step8Welcome />;
      default: return null;
    }
  };

  return (
    <div className="w-full h-full flex flex-col items-center justify-center p-6 lg:p-12 overflow-y-auto custom-scrollbar">
      <div className="w-full max-w-5xl mx-auto animate-in slide-in-from-bottom-4 fade-in duration-500" key={step}>
        {getPreviewContent()}
      </div>
    </div>
  );
}
