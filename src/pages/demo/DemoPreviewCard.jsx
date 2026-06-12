import Step1CreateProfile from './screens/Step1CreateProfile';
import Step2BuildResume from './screens/Step2BuildResume';
import Step3AnalyzeResume from './screens/Step3AnalyzeResume';
import Step4ViewMatches from './screens/Step4ViewMatches';
import Step5Recommendations from './screens/Step5Recommendations';
import Step6JoinTeam from './screens/Step6JoinTeam';
import Step7ConnectStudents from './screens/Step7ConnectStudents';
import Step8CareerReadiness from './screens/Step8CareerReadiness';
import Step9CompleteOnboarding from './screens/Step9CompleteOnboarding';

export default function DemoPreviewCard({ step }) {
  const getPreviewContent = () => {
    switch (step) {
      case 1: return <Step1CreateProfile />;
      case 2: return <Step2BuildResume />;
      case 3: return <Step3AnalyzeResume />;
      case 4: return <Step4ViewMatches />;
      case 5: return <Step5Recommendations />;
      case 6: return <Step6JoinTeam />;
      case 7: return <Step7ConnectStudents />;
      case 8: return <Step8CareerReadiness />;
      case 9: return <Step9CompleteOnboarding />;
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
