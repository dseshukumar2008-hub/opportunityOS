import { useState } from 'react';
import { useResumeAnalysis } from '../../hooks/useResumeAnalysis';
import { useResumeHistory } from '../../hooks/useResumeHistory';
import { useResume } from '../../contexts/ResumeContext';
import { useMatchResume } from '../../hooks/useMatchResume';
import ResumeUploadZone from '../../components/resume/ResumeUploadZone';
import ResumeAnalysisResults from '../../components/resume/ResumeAnalysisResults';
import ResumeSmartSuggestions from '../../components/resume/ResumeSmartSuggestions';
import ResumeHistory from '../../components/resume/ResumeHistory';
import { Bot, Sparkles, FileText, Activity, CheckCircle2, History } from 'lucide-react';
import toast from 'react-hot-toast';

export default function ResumeReviewPage() {
  const [activeTab, setActiveTab] = useState('Review');
  const { analyzeResume, resetAnalysis, isAnalyzing, analysisResults, error } = useResumeAnalysis();
  const { history, addHistory, getBestVersion, compareVersions } = useResumeHistory();
  const { resumeData, activeResumeId } = useResume();
  const { matchResume } = useMatchResume();

  const handleAnalyzeFile = async (file) => {
    const results = await analyzeResume(file);
    if (results) {
      toast.success('Analysis complete!');
      addHistory(results, file.name);
      setActiveTab('ATS Score');
    } else {
      toast.error(error || 'Analysis failed. Please try again.');
    }
  };

  const handleAnalyzeExisting = async () => {
    let payload = '';
    let name = 'Built Resume';

    if (matchResume?.resume_text) {
      payload = matchResume.resume_text;
      name = matchResume.resume_file_name || 'Uploaded Resume';
    } else if (activeResumeId && resumeData) {
      // Build text from resumeData
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
    if (results) {
      toast.success('Analysis complete!');
      addHistory(results, name);
      setActiveTab('ATS Score');
    } else {
      toast.error(error || 'Analysis failed. Please try again.');
    }
  };

  const tabs = [
    { id: 'Review', label: 'Review', icon: FileText },
    { id: 'ATS Score', label: 'ATS Score', icon: Activity, disabled: !analysisResults },
    { id: 'Suggestions', label: 'Suggestions', icon: CheckCircle2, disabled: !analysisResults },
    { id: 'History', label: 'History', icon: History }
  ];

  return (
    <div className="bg-[#F8FAFC] min-h-[calc(100vh-64px)] font-sans p-4 lg:p-8">
      <div className="max-w-[1000px] mx-auto space-y-6">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <div className="w-8 h-8 rounded-lg bg-[#6C4CF1] flex items-center justify-center text-white shadow-sm">
                <Bot size={18} />
              </div>
              <span className="text-sm font-bold text-indigo-600 tracking-wider uppercase">AI Review</span>
            </div>
            <h1 className="text-2xl md:text-3xl font-black text-slate-900 tracking-tight">Resume AI Analysis</h1>
            <p className="text-sm font-medium text-slate-500 mt-2 max-w-lg leading-relaxed">
              Upload your resume or use your built OpportunityOS profile to get instant, AI-powered feedback on your format, skills, and ATS compatibility.
            </p>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center gap-2 overflow-x-auto border-b border-slate-200 pb-px mb-8 scrollbar-hide">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                disabled={tab.disabled}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-4 py-3 border-b-2 font-semibold text-sm transition-all whitespace-nowrap ${
                  isActive 
                    ? 'border-indigo-600 text-indigo-600' 
                    : tab.disabled 
                      ? 'border-transparent text-slate-300 cursor-not-allowed'
                      : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'
                }`}
              >
                <Icon size={16} />
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* Content Area */}
        <div className="mt-8">
          
          {activeTab === 'Review' && (
            <>
              {!isAnalyzing && (
                <div className="max-w-2xl mx-auto space-y-6">


                  {/* Upload Zone */}
                  <ResumeUploadZone onAnalyze={handleAnalyzeFile} />

                  {(matchResume || activeResumeId) && (
                    <div className="mt-6 flex flex-col items-center justify-center p-6 bg-indigo-50/50 rounded-xl border border-indigo-100">
                      <p className="text-sm text-slate-600 mb-3 font-medium">We found an existing resume in your profile.</p>
                      <button
                        onClick={handleAnalyzeExisting}
                        className="bg-[#6C4CF1] hover:bg-[#5a3dd9] text-white px-6 py-2.5 rounded-lg text-sm font-bold shadow-sm transition-colors flex items-center gap-2"
                      >
                        <Sparkles size={16} /> Analyze Existing Resume
                      </button>
                    </div>
                  )}
                </div>
              )}

              {isAnalyzing && (
                <div className="max-w-2xl mx-auto bg-white rounded-2xl shadow-[0_2px_10px_rgba(0,0,0,0.02)] border border-slate-100 p-12 flex flex-col items-center justify-center text-center">
                  <div className="relative w-20 h-20 mb-6">
                    <div className="absolute inset-0 border-4 border-indigo-100 rounded-full"></div>
                    <div className="absolute inset-0 border-4 border-indigo-600 rounded-full border-t-transparent animate-spin"></div>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <Sparkles className="text-indigo-600 animate-pulse" size={24} />
                    </div>
                  </div>
                  <h3 className="text-lg font-bold text-slate-900 tracking-tight mb-2">Analyzing your resume...</h3>
                  <p className="text-sm font-medium text-slate-500 max-w-sm">
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
    </div>
  );
}
