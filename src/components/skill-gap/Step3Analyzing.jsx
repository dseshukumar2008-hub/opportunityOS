import { useState, useEffect } from 'react';
import { Bot, CheckCircle2, Loader2 } from 'lucide-react';
import { geminiService } from '../../services/geminiService';
import { fileToBase64 } from '../../utils/fileUtils';
import { toast } from 'react-hot-toast';

const STEPS = [
  "Extracting Skills from Sources...",
  "Analyzing GitHub & Resume Data...",
  "Comparing Against Industry Standards...",
  "Calculating Readiness Score...",
  "Building Personalized Learning Path..."
];

export default function Step3Analyzing({ targetRole, sources, inputData, onComplete }) {
  const [currentStepIndex, setCurrentStepIndex] = useState(0);

  useEffect(() => {
    let isMounted = true;

    async function performAnalysis() {
      try {
        // Step 0: Extracting Skills...
        setCurrentStepIndex(0);
        
        let resumeData = null;
        if (inputData?.resumeFile) {
          resumeData = await fileToBase64(inputData.resumeFile);
        }

        let linkedinData = null;
        if (inputData?.linkedinFile) {
          linkedinData = await fileToBase64(inputData.linkedinFile);
        }

        // Step 1: Analyzing GitHub...
        setCurrentStepIndex(1);
        
        let githubData = null;
        if (inputData?.githubUrl) {
          try {
            const match = inputData.githubUrl.match(/github\.com\/([^/]+)/);
            if (match && match[1]) {
              const username = match[1];
              const response = await fetch(`https://api.github.com/users/${username}/repos?per_page=10&sort=updated`);
              if (response.ok) {
                const repos = await response.json();
                githubData = repos.map(repo => ({
                  name: repo.name,
                  language: repo.language,
                  description: repo.description,
                  topics: repo.topics
                }));
              }
            }
          } catch (e) {
            console.warn("GitHub fetch failed", e);
          }
        }

        // Step 2 & 3: Comparing and Calculating (Handled by Gemini AI call)
        setCurrentStepIndex(2);
        
        const payload = {
          targetRole,
          manualSkills: inputData?.manualSkills || [],
          githubData,
          linkedinData,
          resumeData
        };

        // Let the UI show step 3 after a tiny delay so it doesn't get skipped visually
        setTimeout(() => { if (isMounted) setCurrentStepIndex(3); }, 1500);

        const report = await geminiService.generateDynamicSkillGapReport(payload);

        // Step 4: Building Path...
        if (isMounted) {
          setCurrentStepIndex(4);
          setTimeout(() => {
            if (isMounted) onComplete(report);
          }, 1000);
        }
      } catch (error) {
        console.error("Skill Gap Analysis Error:", error);
        if (isMounted) {
          setCurrentStepIndex(4);
          setTimeout(() => {
            if (isMounted) onComplete({ _error: true, message: `Analysis Failed: ${error.message || "The AI service was temporarily busy or encountered an error."}` });
          }, 1000);
        }
      }
    }

    performAnalysis();

    return () => { isMounted = false; };
  }, [targetRole, inputData, onComplete]);

  return (
    <div className="w-full max-w-lg mx-auto bg-white rounded-[24px] border border-slate-100 shadow-xl shadow-slate-200/20 p-8 lg:p-12 animate-in fade-in zoom-in-95 duration-500">
      <div className="flex flex-col items-center text-center mb-8">
        <div className="w-20 h-20 bg-[#F4F2FF] rounded-full flex items-center justify-center mb-6 relative">
          <Bot size={40} className="text-[#6C4CF1] absolute z-10" />
          <div className="absolute inset-0 border-4 border-[#6C4CF1] border-t-transparent rounded-full animate-spin opacity-30" />
          <div className="absolute inset-[-8px] border-2 border-[#6C4CF1] border-b-transparent rounded-full animate-spin-[3s_linear_infinite] opacity-10" />
        </div>
        <h1 className="text-2xl font-black text-slate-900 mb-2">Analyzing Your Skills</h1>
        <p className="text-slate-500 font-medium">OpportunityOS Copilot is generating your report...</p>
      </div>

      <div className="space-y-4 max-w-sm mx-auto">
        {STEPS.map((step, idx) => {
          const isActive = idx === currentStepIndex;
          const isDone = idx < currentStepIndex;
          
          return (
            <div 
              key={step} 
              className={`flex items-center gap-4 p-3 rounded-xl transition-all duration-300 ${
                isActive ? 'bg-indigo-50 border border-indigo-100 scale-105' : 
                isDone ? 'opacity-80' : 'opacity-40'
              }`}
            >
              <div className="shrink-0">
                {isDone ? (
                  <CheckCircle2 size={24} className="text-[#10B981]" />
                ) : isActive ? (
                  <Loader2 size={24} className="text-[#6C4CF1] animate-spin" />
                ) : (
                  <div className="w-6 h-6 rounded-full border-2 border-slate-300" />
                )}
              </div>
              <span className={`font-bold ${
                isActive ? 'text-[#6C4CF1]' : 
                isDone ? 'text-slate-700' : 'text-slate-500'
              }`}>
                {step}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
