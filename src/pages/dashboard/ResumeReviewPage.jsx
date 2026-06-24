import { useState } from 'react';
import { useResumeAnalysis } from '../../hooks/useResumeAnalysis';
import { useResumeHistory } from '../../hooks/useResumeHistory';
import { useResume } from '../../contexts/ResumeContext';
import { useMatchResume } from '../../hooks/useMatchResume';
import ResumeUploadZone from '../../components/resume/ResumeUploadZone';
import ResumeAnalysisResults from '../../components/resume/ResumeAnalysisResults';
import ResumeSmartSuggestions from '../../components/resume/ResumeSmartSuggestions';
import ResumeHistory from '../../components/resume/ResumeHistory';
import { Bot, Sparkles, FileText, Activity, CheckCircle2, History, User, BarChart2, Check, Target, TrendingUp, Lock } from 'lucide-react';
import toast from 'react-hot-toast';

export default function ResumeReviewPage() {
  const [activeTab, setActiveTab] = useState('Review');
  const { analyzeResume, resetAnalysis, isAnalyzing, analysisResults, error } = useResumeAnalysis();
  const { history, addHistory, getBestVersion, compareVersions } = useResumeHistory();
  const { resumeData, activeResumeId } = useResume();
  const { matchResume } = useMatchResume();

  const handleAnalyzeFile = async (file) => {
    const results = await analyzeResume(file);
    if (results && !results._error) {
      toast.success('Analysis complete!');
      addHistory(results, file.name);
      setActiveTab('ATS Score');
    } else if (results && results._error) {
      toast.error(results.message);
    } else {
      toast.error('Unexpected error occurred.');
    }
  };

  const handleAnalyzeExisting = async () => {
    let payload = '';
    let name = 'Built Resume';

    if (matchResume?.resume_text) {
      payload = matchResume.resume_text;
      name = matchResume.resume_file_name || 'Uploaded Resume';
    } else if (activeResumeId && resumeData) {
      payload += `Name: ${resumeData.personalInfo?.fullName || ''}\n`;
      payload += `Email: ${resumeData.personalInfo?.email || ''}\n`;
      if (resumeData.skills?.length) payload += `Skills: ${resumeData.skills.join(', ')}\n`;
      if (resumeData.experience?.length) {
        payload += `Experience:\n`;
        resumeData.experience.forEach(e => { payload += `- ${e.title} at ${e.company}\n`; });
      }
    }

    if (!payload) {
      toast.error('No existing resume found to analyze.');
      return;
    }

    const results = await analyzeResume(payload);
    if (results && !results._error) {
      toast.success('Analysis complete!');
      addHistory(results, name);
      setActiveTab('ATS Score');
    } else if (results && results._error) {
      toast.error(results.message);
    } else {
      toast.error('Unexpected error occurred.');
    }
  };

  const tabs = [
    { id: 'Review', label: 'Review', icon: FileText },
    { id: 'ATS Score', label: 'ATS Score', icon: Activity, disabled: !analysisResults },
    { id: 'Suggestions', label: 'Suggestions', icon: CheckCircle2, disabled: !analysisResults },
    { id: 'History', label: 'History', icon: History }
  ];

  return (
    <div className="bg-[#FAFBFF] min-h-[calc(100vh-64px)] font-sans py-6 px-4 lg:px-8 flex flex-col items-center">
      <div className="w-full max-w-[1000px] flex-1 flex flex-col">
        
        {/* Header */}
        <div className="flex flex-col mb-4 pt-2">
          <div className="inline-flex items-center gap-1.5 px-2 py-1 rounded-md bg-indigo-50 border border-indigo-100 self-start mb-2">
            <Bot size={12} className="text-[#6D5DF6]" />
            <span className="text-[10px] font-bold text-[#6D5DF6] tracking-widest uppercase">AI Review</span>
          </div>
          <h1 className="text-3xl leading-tight font-extrabold text-[#111827] tracking-tight mb-1">
            Resume Analysis
          </h1>
          <p className="text-[14px] text-[#64748B] leading-snug max-w-2xl">
            Upload your resume or use your built OpportunityOS profile to get instant, AI-powered feedback on your format, skills, and ATS compatibility.
          </p>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center gap-6 border-b border-[#E5E7EB] mb-6 h-[48px]">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                disabled={tab.disabled}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 h-full text-[13px] font-semibold transition-colors relative ${
                  isActive 
                    ? 'text-[#6D5DF6]' 
                    : tab.disabled 
                      ? 'text-gray-300 cursor-not-allowed'
                      : 'text-[#64748B] hover:text-[#111827]'
                }`}
              >
                <Icon size={14} />
                {tab.label}
                {isActive && (
                  <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-[#6D5DF6]"></div>
                )}
              </button>
            );
          })}
        </div>

        {/* Content Area */}
        <div className="w-full flex-1 flex flex-col items-center">
          {activeTab === 'Review' && (
            <>
              {!isAnalyzing && (
                <div className="w-full flex flex-col items-center max-w-[1000px]">
                  {/* Upload Zone Wrapper */}
                  <div className="w-full bg-white rounded-xl shadow-[0_2px_12px_rgba(0,0,0,0.03)] border border-[#E5E7EB] p-5 flex flex-col">
                    <ResumeUploadZone onAnalyze={handleAnalyzeFile} />
                    
                    <div className="flex justify-center w-full mt-4">
                      <div className="flex items-center gap-1.5 text-[11px] text-[#64748B] font-medium px-3 py-1.5 bg-[#F8FAFC] rounded-md border border-[#F1F5F9]">
                        <Lock size={12} className="text-[#94A3B8]" />
                        <span>Your data is secure and never shared.</span>
                      </div>
                    </div>
                  </div>

                  {(matchResume || activeResumeId) && (
                    <div className="mt-4 flex flex-row items-center justify-between px-5 py-3 bg-indigo-50/50 rounded-xl border border-indigo-100 w-full">
                      <p className="text-[13px] text-[#64748B] font-medium m-0">We found an existing resume in your profile.</p>
                      <button
                        onClick={handleAnalyzeExisting}
                        className="bg-white border border-[#E5E7EB] hover:bg-gray-50 text-[#111827] px-4 py-1.5 rounded-md text-[13px] font-semibold shadow-sm transition-colors flex items-center gap-2 shrink-0"
                      >
                        <Sparkles size={14} className="text-[#6D5DF6]" /> Analyze Existing
                      </button>
                    </div>
                  )}
                </div>
              )}

              {isAnalyzing && (
                <div className="max-w-2xl mx-auto bg-white rounded-[24px] shadow-[0_8px_30px_rgba(0,0,0,0.04)] border border-[#E5E7EB] p-16 flex flex-col items-center justify-center text-center">
                  <div className="relative w-24 h-24 mb-8">
                    <div className="absolute inset-0 border-4 border-indigo-50 rounded-full"></div>
                    <div className="absolute inset-0 border-4 border-[#6D5DF6] rounded-full border-t-transparent animate-spin"></div>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <Sparkles className="text-[#6D5DF6] animate-pulse" size={28} />
                    </div>
                  </div>
                  <h3 className="text-2xl font-bold text-[#111827] tracking-tight mb-3">Analyzing your resume...</h3>
                  <p className="text-[15px] font-medium text-[#64748B] max-w-sm leading-relaxed">
                    Our AI is scanning for ATS compatibility, keyword density, and structural improvements. This will just take a moment.
                  </p>
                </div>
              )}
            </>
          )}

          {activeTab === 'ATS Score' && analysisResults && (
            <ResumeAnalysisResults 
              results={analysisResults} 
              onReset={() => {
                resetAnalysis();
                setActiveTab('Review');
              }} 
            />
          )}

          {activeTab === 'Suggestions' && analysisResults && (
            <ResumeSmartSuggestions
              suggestions={analysisResults.improvements || analysisResults.smartSuggestions || []}
              currentScore={analysisResults.atsScore || analysisResults.overallScore || 0}
              potentialScore={Math.min(100, (analysisResults.atsScore || analysisResults.overallScore || 0) + ((analysisResults.improvements || analysisResults.smartSuggestions)?.length || 0) * 5)}
            />
          )}

          {activeTab === 'History' && (
            <ResumeHistory 
              history={history} 
              getBestVersion={getBestVersion}
              compareVersions={compareVersions}
            />
          )}

        </div>
      </div>
      
      {/* Floating Action Button */}
      <button className="fixed bottom-8 right-8 w-14 h-14 bg-[#6D5DF6] text-white rounded-full flex items-center justify-center shadow-xl shadow-indigo-500/30 hover:bg-[#5a4cd1] transition-transform hover:scale-105 z-50">
        <Sparkles size={24} />
      </button>
    </div>
  );
}

