import { useRef, useState } from 'react';
import { 
  Eye, 
  Download, 
  Save, 
  Calendar, 
  LayoutTemplate,
  ListChecks,
  X,
  Cloud,
  FilePlus2,
  Copy,
  Trash2,
  Loader2,
  ChevronDown
} from 'lucide-react';
import { useResume } from '../../contexts/ResumeContext';
import ResumeFormPanel from '../../components/resume/ResumeFormPanel';
import ResumePreviewPanel from '../../components/resume/ResumePreviewPanel';
import toast from 'react-hot-toast';
import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';

export default function ResumeBuilderPage() {
  const { 
    resumes,
    activeResumeId,
    loading,
    saveState,
    hasLocalMigration,
    resumeData,
    lastUpdated, 
    activeTemplate, 
    getResumeStrength, 
    getSectionsCompleted,
    saveResume,
    createResume,
    deleteResume,
    duplicateResume,
    switchResume,
    migrateLocalResume
  } = useResume();
  
  const resumeRef = useRef(null);
  const pdfExportRef = useRef(null);
  const [isPreviewModalOpen, setIsPreviewModalOpen] = useState(false);
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);
  const [isResumeDropdownOpen, setIsResumeDropdownOpen] = useState(false);


  const handleSave = () => {
    saveResume();
  };

  const handleDownloadPDF = async () => {
    if (isGeneratingPDF) return;
    
    if (!pdfExportRef.current) {
      toast.error('PDF export engine not ready');
      return;
    }
    
    const element = pdfExportRef.current;

    
    if (!element.textContent || element.textContent.trim() === '') {
      console.warn("PDF Export Warning: Target clone element is empty");
      toast.error('Cannot generate PDF from empty preview');
      return;
    }
    
    setIsGeneratingPDF(true);
    toast.loading('Generating PDF...', { id: 'pdf-toast' });
    
    const userName = resumeData?.personalInfo?.fullName?.trim() || 'User';
    const cleanName = userName.replace(/[^a-zA-Z0-9]/g, '_');
    const filename = `${cleanName}_Resume.pdf`;

    try {
      await new Promise(resolve => setTimeout(resolve, 300));
      
      const canvas = await html2canvas(element, {
        scale: 2,
        useCORS: true,
        allowTaint: true,
        backgroundColor: '#ffffff',
        logging: false,
        onclone: (clonedDoc) => {
          const styleTags = clonedDoc.querySelectorAll('style');
          styleTags.forEach(style => {
            if (style.innerHTML) {
              style.innerHTML = style.innerHTML
                .replace(/oklch\([^)]+\)/g, '#000000')
                .replace(/color-mix\([^)]+\)/g, '#000000');
            }
          });
        }
      });
      
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4'
      });
      
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
      
      pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
      pdf.save(filename);
      
      toast.success('PDF downloaded successfully!', { id: 'pdf-toast' });
    } catch (err) {
      console.error("Critical PDF Error encountered during generation:", err);
      toast.error(err.message || 'Unable to generate PDF layout', { id: 'pdf-toast' });
    } finally {
      setIsGeneratingPDF(false);
    }
  };

  const strength = getResumeStrength();
  const completed = getSectionsCompleted();
  
  const formatDate = (timestamp) => {
    const d = new Date(timestamp);
    return d.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
  };

  const getRelativeTime = (timestamp) => {
    // eslint-disable-next-line react-hooks/purity
    const diff = Math.floor((Date.now() - timestamp) / 60000);
    if (diff < 1) return 'Just now';
    if (diff < 60) return `${diff} min ago`;
    const hours = Math.floor(diff / 60);
    if (hours < 24) return `${hours} hour${hours > 1 ? 's' : ''} ago`;
    const days = Math.floor(hours / 24);
    return `${days} day${days > 1 ? 's' : ''} ago`;
  };

  return (
    <div className="bg-slate-50 font-sans pb-20 p-4 lg:p-6">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-8">
      
      {/* Migration Banner */}
      {hasLocalMigration && (
        <div className="mb-6 bg-indigo-50 border border-indigo-100 rounded-xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center text-indigo-600 shrink-0">
              <Cloud size={20} />
            </div>
            <div>
              <h3 className="text-[14px] font-bold text-slate-900">Local Resume Found</h3>
              <p className="text-[13px] text-slate-600 font-medium">We found a resume saved on your device. Migrate it to the cloud to access it anywhere.</p>
            </div>
          </div>
          <button 
            onClick={migrateLocalResume}
            disabled={saveState === 'Saving...'}
            className="shrink-0 bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2.5 rounded-lg text-[13px] font-bold transition-colors flex items-center gap-2"
          >
            {saveState === 'Saving...' ? <Loader2 size={16} className="animate-spin" /> : <Cloud size={16} />}
            Migrate to Cloud
          </button>
        </div>
      )}

      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div className="relative">
          <div 
            className="flex items-center gap-2 cursor-pointer group"
            onClick={() => setIsResumeDropdownOpen(!isResumeDropdownOpen)}
          >
            <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight group-hover:text-indigo-600 transition-colors">
              {resumes.find(r => r.id === activeResumeId)?.title || 'Create Resume'}
            </h1>
            <ChevronDown size={20} className="text-slate-400 group-hover:text-indigo-600 transition-colors" />
          </div>
          <div className="text-[13px] font-medium text-slate-500 mt-1 flex items-center gap-2">
            <Calendar size={14} />
            <span>Last updated: {formatDate(lastUpdated)}</span>
            {saveState && (
              <>
                <span className="text-slate-300">•</span>
                <span className={`flex items-center gap-1 ${saveState === 'Saving...' ? 'text-indigo-500' : 'text-emerald-500'}`}>
                  {saveState === 'Saving...' && <Loader2 size={12} className="animate-spin" />}
                  {saveState === 'Saved' && <Cloud size={12} />}
                  {saveState}
                </span>
              </>
            )}
          </div>

          {/* Multiple Resumes Dropdown */}
          {isResumeDropdownOpen && (
            <div className="absolute top-full left-0 mt-2 w-72 bg-white rounded-xl shadow-xl border border-slate-100 z-50 overflow-hidden animate-in fade-in slide-in-from-top-2">
              <div className="p-2 border-b border-slate-100">
                <button
                  onClick={() => { createResume(); setIsResumeDropdownOpen(false); }}
                  className="w-full flex items-center gap-2 px-3 py-2 text-[13px] font-bold text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
                >
                  <FilePlus2 size={16} />
                  Create New Resume
                </button>
              </div>
              <div className="max-h-60 overflow-y-auto p-2 flex flex-col gap-1">
                {resumes.map(r => (
                  <div key={r.id} className={`flex items-center justify-between p-2 rounded-lg group transition-colors ${activeResumeId === r.id ? 'bg-indigo-50 border border-indigo-100' : 'hover:bg-slate-50 border border-transparent'}`}>
                    <div 
                      className="flex-1 cursor-pointer truncate mr-2"
                      onClick={() => { switchResume(r.id); setIsResumeDropdownOpen(false); }}
                    >
                      <p className={`text-[13px] font-bold truncate ${activeResumeId === r.id ? 'text-indigo-700' : 'text-slate-700'}`}>
                        {r.title}
                      </p>
                      <p className="text-[11px] font-medium text-slate-500 truncate">
                        {formatDate(r.updated_at)}
                      </p>
                    </div>
                    <div className="flex items-center opacity-0 group-hover:opacity-100 transition-opacity gap-1 shrink-0">
                      <button 
                        onClick={(e) => { e.stopPropagation(); duplicateResume(r.id); setIsResumeDropdownOpen(false); }}
                        className="p-1.5 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-md transition-colors"
                        title="Duplicate"
                      >
                        <Copy size={14} />
                      </button>
                      <button 
                        onClick={(e) => { e.stopPropagation(); deleteResume(r.id); }}
                        className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-md transition-colors"
                        title="Delete"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>
                ))}
                {resumes.length === 0 && (
                  <p className="text-[12px] font-medium text-slate-500 text-center py-4">No resumes found</p>
                )}
              </div>
            </div>
          )}
        </div>
        
        <div className="flex flex-wrap items-center gap-3">
          <button 
            onClick={() => setIsPreviewModalOpen(true)}
            className="h-10 px-4 rounded-xl border border-slate-200 text-slate-700 font-bold text-[13px] hover:bg-slate-50 transition-colors flex items-center gap-2"
          >
            <Eye size={16} />
            Preview
          </button>
          <button 
            onClick={handleDownloadPDF}
            disabled={isGeneratingPDF}
            className={`h-10 px-5 rounded-xl text-white font-bold text-[13px] transition-colors flex items-center gap-2 shadow-sm ${
              isGeneratingPDF ? 'bg-indigo-400 cursor-not-allowed opacity-80' : 'bg-[#6C4CF1] hover:bg-indigo-700'
            }`}
          >
            <Download size={16} />
            {isGeneratingPDF ? 'Generating...' : 'Download PDF'}
          </button>
          <button 
            onClick={handleSave}
            disabled={saveState === 'Saving...'}
            className="h-10 px-4 rounded-xl border border-slate-200 text-slate-700 font-bold text-[13px] hover:bg-slate-50 transition-colors flex items-center gap-2"
          >
            {saveState === 'Saving...' ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
            {saveState === 'Saving...' ? 'Saving...' : 'Save'}
          </button>
        </div>
      </div>

      {/* Top Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {/* Card 1: Resume Strength */}
        <div className="bg-white p-5 rounded-[20px] border border-slate-100 shadow-sm flex items-center gap-4 hover:shadow-md transition-transform">
          <div className="relative w-16 h-16 shrink-0">
            <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
              <path
                className="text-slate-100"
                strokeWidth="3"
                stroke="currentColor"
                fill="none"
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
              />
              <path
                className="text-[#6C4CF1]"
                strokeWidth="3"
                strokeDasharray={`${strength}, 100`}
                strokeLinecap="round"
                stroke="currentColor"
                fill="none"
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-[14px] font-extrabold text-slate-900 leading-none">{strength}%</span>
              <span className="text-[8px] font-bold text-slate-500 uppercase mt-0.5">Complete</span>
            </div>
          </div>
          <div className="flex flex-col justify-center">
            <span className="text-[12px] font-bold text-slate-500 mb-1">Resume Strength</span>
            <span className="text-[20px] font-extrabold text-slate-900 leading-none mb-1.5">{strength}%</span>
            <span className="text-[11px] font-medium text-slate-500 leading-tight">Excellent! Your resume is looking strong.</span>
          </div>
        </div>

        {/* Card 2: Last Updated */}
        <div className="bg-white p-5 rounded-[20px] border border-slate-100 shadow-sm flex flex-col justify-between hover:shadow-md transition-transform">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-8 h-8 rounded-lg bg-indigo-50 flex items-center justify-center text-indigo-500 shrink-0">
              <Calendar size={16} strokeWidth={2.5} />
            </div>
            <span className="text-[13px] font-bold text-slate-500">Last Updated</span>
          </div>
          <div className="flex flex-col gap-1">
            <span className="text-[20px] font-extrabold text-slate-900 leading-none tracking-tight">{formatDate(lastUpdated)}</span>
            <span className="text-[12px] font-medium text-slate-400">{getRelativeTime(lastUpdated)}</span>
          </div>
        </div>

        {/* Card 3: Active Template */}
        <div className="bg-white p-5 rounded-[20px] border border-slate-100 shadow-sm flex flex-col justify-between hover:shadow-md transition-transform">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-8 h-8 rounded-lg bg-purple-50 flex items-center justify-center text-purple-500 shrink-0">
              <LayoutTemplate size={16} strokeWidth={2.5} />
            </div>
            <span className="text-[13px] font-bold text-slate-500">Active Template</span>
          </div>
          <div className="flex flex-col gap-1">
            <span className="text-[20px] font-extrabold text-slate-900 leading-none tracking-tight">{activeTemplate}</span>
            <span className="text-[12px] font-medium text-slate-400">Clean & Professional</span>
          </div>
        </div>

        {/* Card 4: Sections Completed */}
        <div className="bg-white p-5 rounded-[20px] border border-slate-100 shadow-sm flex flex-col justify-between hover:shadow-md transition-transform">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-8 h-8 rounded-lg bg-emerald-50 flex items-center justify-center text-emerald-500 shrink-0">
              <ListChecks size={16} strokeWidth={2.5} />
            </div>
            <span className="text-[13px] font-bold text-slate-500">Sections Completed</span>
          </div>
          <div className="flex flex-col gap-1">
            <span className="text-[20px] font-extrabold text-slate-900 leading-none tracking-tight">{completed} / 6</span>
            <span className="text-[12px] font-medium text-slate-400">{completed === 6 ? 'All sections completed' : `${6 - completed} sections remaining`}</span>
          </div>
        </div>
      </div>

      {/* Main Content Area (50/50 Split) */}
      <div className="flex flex-col xl:flex-row gap-6 items-start">
        {/* Left Panel: Form Builder */}
        <div className="w-full xl:w-1/2 flex flex-col gap-4">
          <ResumeFormPanel />
        </div>

        {/* Right Panel: Live Preview */}
        <div className="w-full xl:w-1/2 sticky top-24 overflow-x-auto pb-4">
          <ResumePreviewPanel ref={resumeRef} isPdfMode={false} />
          
          {/* Hidden PDF Export Clone Container */}
          <div 
            style={{ position: 'absolute', top: '-9999px', left: '-9999px' }} 
            className="opacity-0 pointer-events-none w-[800px]" 
            aria-hidden="true"
          >
            <ResumePreviewPanel ref={pdfExportRef} isPdfMode={true} />
          </div>
        </div>
      </div>
      </div>

      {/* Preview Modal */}
      {isPreviewModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 sm:p-8">
          <div className="bg-slate-100 w-full max-w-5xl h-full rounded-2xl shadow-2xl flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            {/* Modal Header */}
            <div className="flex items-center justify-between px-6 py-4 bg-white border-b border-slate-200 shrink-0">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-indigo-50 flex items-center justify-center text-[#6C4CF1]">
                  <Eye size={20} strokeWidth={2.5} />
                </div>
                <div>
                  <h2 className="text-[16px] font-bold text-slate-900">Resume Preview</h2>
                  <p className="text-[12px] font-medium text-slate-500">Live preview of your configured resume</p>
                </div>
              </div>
              <button 
                onClick={() => setIsPreviewModalOpen(false)}
                className="w-10 h-10 rounded-full flex items-center justify-center text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
              >
                <X size={20} strokeWidth={2.5} />
              </button>
            </div>
            {/* Modal Body */}
            <div className="flex-1 overflow-y-auto p-6 md:p-10 flex justify-center bg-slate-100/50">
              <div className="w-full max-w-[850px]">
                <ResumePreviewPanel />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
