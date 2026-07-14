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
  ChevronDown,
  History,
  Plus,
  Edit2,
  Check,
  ArrowLeft
} from 'lucide-react';
import ResumeFormPanel from '../../components/resume/ResumeFormPanel';
import ResumePreviewPanel from '../../components/resume/ResumePreviewPanel';
import ResumeHealthPanel from '../../components/resume/ResumeHealthPanel';
import ResumeImportModal from '../../components/resume/ResumeImportModal';
import ResumeHistoryModal from '../../components/resume/ResumeHistoryModal';
import toast from 'react-hot-toast';
import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';

import { useParams, useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import { useResume } from '../../contexts/ResumeContext';

export default function ResumeBuilderPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { 
    resumes,
    activeResumeId,
    loading,
    saveState,
    hasLocalMigration,
    resumeData,
    lastUpdated, 
    activeTemplate, 
    isDirty,
    getResumeStrength, 
    getSectionsCompleted,
    saveResume,
    createResume,
    deleteResume,
    switchResume,
    migrateLocalResume,
    renameResume
  } = useResume();
  
  
  const resumeRef = useRef(null);
  const [isPreviewModalOpen, setIsPreviewModalOpen] = useState(false);
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);
  const [activeTab, setActiveTab] = useState('builder'); // 'builder' or 'health'
  const [isImportModalOpen, setIsImportModalOpen] = useState(false);
  const [isHistoryModalOpen, setIsHistoryModalOpen] = useState(false);
  
  const [isRenaming, setIsRenaming] = useState(false);
  const [editTitle, setEditTitle] = useState('');
  const [switcherOpen, setSwitcherOpen] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const switcherRef = useRef(null);

  const currentResume = resumes.find(r => r.id === activeResumeId);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (switcherRef.current && !switcherRef.current.contains(event.target)) {
        setSwitcherOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleRenameStart = () => {
    setEditTitle(currentResume?.title || 'Untitled Resume');
    setIsRenaming(true);
  };

  const handleRenameSubmit = async () => {
    setIsRenaming(false);
    const currentName = currentResume?.title || currentResume?.resumeName;
    if (editTitle.trim() && editTitle !== currentName) {
      await renameResume(activeResumeId, editTitle.trim());
    }
  };

  const handleDeleteConfirm = async () => {
    setShowDeleteConfirm(false);
    await deleteResume(activeResumeId);
  };

  const handleCreateNew = async () => {
    setSwitcherOpen(false);
    const newId = await createResume();
    if (newId) navigate(`/resume-builder/${newId}`);
  };

  useEffect(() => {
    // Route synchronization
    if (id && activeResumeId && id !== activeResumeId) {
      const exists = resumes.some(r => r.id === id);
      if (exists) {
        // User manually navigated to a valid resume via URL
        switchResume(id);
      } else {
        // The URL ID doesn't exist (e.g. was deleted), but we have a valid active resume. Sync URL.
        navigate(`/resume-builder/${activeResumeId}`, { replace: true });
      }
    } else if (id && !activeResumeId && !loading) {
      const exists = resumes.some(r => r.id === id);
      if (exists) {
        switchResume(id);
      } else if (resumes.length === 0) {
        // Invalid URL and no resumes exist
        navigate('/resume-builder', { replace: true });
      } else {
        // Invalid URL (resume deleted or invalid), always go to dashboard
        navigate(`/resume-builder`, { replace: true });
      }
    }
  }, [id, activeResumeId, resumes, loading, switchResume, navigate]);

  useEffect(() => {
    const handleBeforeUnload = (e) => {
      if (isDirty) {
        e.preventDefault();
        e.returnValue = '';
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [isDirty]);

  const handleSave = () => {
    saveResume();
  };

  const handleDownloadPDF = async () => {
    if (isGeneratingPDF) return;
    
    if (!resumeRef.current) {
      toast.error('Resume preview not ready');
      return;
    }
    
    const element = resumeRef.current;

    
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
      <div className="flex items-center justify-between bg-white border border-slate-200 px-5 py-3 rounded-xl shadow-sm mb-8">
        
        {/* LEFT: Title & Date */}
        <div className="flex items-center gap-4">
          <button 
            onClick={() => navigate('/resume-builder')}
            className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-slate-500 hover:bg-slate-100 hover:text-slate-900 transition-colors shrink-0 border border-transparent hover:border-slate-200"
            title="Back to My Resumes"
          >
            <ArrowLeft size={16} />
            <span className="hidden sm:inline text-[13px] font-bold">Back to My Resumes</span>
          </button>
          <div className="flex flex-col justify-center">
            <div className="flex items-center gap-1" ref={switcherRef}>
              {isRenaming ? (
                <input 
                  value={editTitle}
                  onChange={e => setEditTitle(e.target.value)}
                  onBlur={handleRenameSubmit}
                  onKeyDown={e => e.key === 'Enter' && e.target.blur()}
                  className="text-[15px] font-bold text-slate-900 tracking-tight leading-none px-1 py-0.5 border border-indigo-500 rounded outline-none w-48"
                  autoFocus
                />
              ) : (
                <h1 
                  onClick={handleRenameStart}
                  className="text-[15px] font-bold text-slate-900 tracking-tight leading-none cursor-text hover:bg-slate-100 px-1 py-0.5 rounded -ml-1 transition-colors"
                  title="Click to rename"
                >
                  {currentResume?.title || 'Untitled Resume'}
                </h1>
              )}

              <div className="relative">
                <button 
                  onClick={() => setSwitcherOpen(!switcherOpen)} 
                  className={`p-1 rounded text-slate-500 hover:text-slate-900 transition-colors ${switcherOpen ? 'bg-slate-100 text-slate-900' : 'hover:bg-slate-100'}`}
                >
                  <ChevronDown size={14} />
                </button>

                {switcherOpen && (
                  <div className="absolute top-full left-0 mt-1 w-64 bg-white border border-slate-200 shadow-xl rounded-xl py-2 z-50 overflow-hidden">
                    <div className="px-3 pb-2 mb-2 border-b border-slate-100">
                      <p className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">Current</p>
                      <button onClick={() => { handleRenameStart(); setSwitcherOpen(false); }} className="w-full text-left px-2 py-1.5 text-[13px] font-medium text-slate-700 hover:bg-slate-50 rounded-lg flex items-center gap-2">
                        <Edit2 size={14} className="text-slate-400" /> Rename
                      </button>
                      <button onClick={() => { setShowDeleteConfirm(true); setSwitcherOpen(false); }} className="w-full text-left px-2 py-1.5 text-[13px] font-medium text-red-600 hover:bg-red-50 rounded-lg flex items-center gap-2 mt-0.5">
                        <Trash2 size={14} className="text-red-400" /> Delete
                      </button>
                    </div>
                    
                    <div className="px-3">
                      <p className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">My Resumes</p>
                      <div className="max-h-40 overflow-y-auto space-y-0.5 pr-1">
                        {resumes.map(r => (
                          <button
                            key={r.id}
                            onClick={() => { switchResume(r.id); setSwitcherOpen(false); }}
                            className={`w-full text-left px-2 py-1.5 text-[13px] font-medium rounded-lg flex items-center gap-2 ${r.id === activeResumeId ? 'bg-indigo-50 text-indigo-700' : 'text-slate-700 hover:bg-slate-50'}`}
                          >
                            <span className="truncate flex-1">{r.title || 'Untitled Resume'}</span>
                            {r.id === activeResumeId && <Check size={14} className="text-indigo-600 shrink-0" />}
                          </button>
                        ))}
                      </div>
                    </div>
                    
                    <div className="px-3 pt-2 mt-2 border-t border-slate-100">
                      <button onClick={handleCreateNew} className="w-full text-left px-2 py-1.5 text-[13px] font-bold text-indigo-600 hover:bg-indigo-50 rounded-lg flex items-center gap-2">
                        <Plus size={14} /> Create New Resume
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
            <div className="text-[11px] font-medium text-slate-500 flex items-center gap-1.5 mt-1">
              <span>Last edited {getRelativeTime(lastUpdated)}</span>
              {saveState && (
                <>
                  <span className="text-slate-300">•</span>
                  <span className={`flex items-center gap-1 ${saveState === 'Saving...' ? 'text-indigo-500' : 'text-emerald-500'}`}>
                    {saveState === 'Saving...' && <Loader2 size={10} className="animate-spin" />}
                    {saveState === 'Saved' && <Cloud size={10} />}
                    {saveState}
                  </span>
                </>
              )}
            </div>
          </div>
        </div>

        {/* CENTER: Compact Indicators */}
        <div className="hidden lg:flex items-center gap-4 px-3 py-1.5 bg-slate-50/50 rounded-lg border border-slate-200/50">
          <div className="flex items-center gap-1.5 text-[12px] font-medium text-slate-600">
            <div className="w-1.5 h-1.5 rounded-full bg-emerald-500"></div>
            <span className="font-semibold text-slate-900">{strength}%</span> Strength
          </div>
          <div className="w-px h-3 bg-slate-300"></div>
          <div className="flex items-center gap-1.5 text-[12px] font-medium text-slate-600">
            <ListChecks size={14} className="text-indigo-500" />
            <span className="font-semibold text-slate-900">{completed}/6</span> Sections
          </div>
        </div>
        
        {/* RIGHT: Actions */}
        <div className="flex items-center gap-2 sm:gap-3">
          {saveState === 'Unsaved Changes' && (
            <button 
              onClick={handleSave}
              className="hidden sm:block text-[12px] font-bold text-indigo-600 px-2 hover:text-indigo-700 transition-colors"
            >
              Save Now
            </button>
          )}

          {/* Compact Toolbar */}
          <div className="flex items-center bg-slate-50 rounded-lg p-0.5 border border-slate-200/60 hidden sm:flex">
            <button 
              onClick={() => setIsImportModalOpen(true)}
              className="p-1.5 text-slate-500 hover:text-slate-900 hover:bg-white rounded shadow-sm transition-all"
              title="Import Data"
            >
              <FilePlus2 size={16} />
            </button>
            <button 
              onClick={() => setIsHistoryModalOpen(true)}
              className="p-1.5 text-slate-500 hover:text-slate-900 hover:bg-white rounded shadow-sm transition-all"
              title="Version History"
            >
              <History size={16} />
            </button>
            <button 
              onClick={() => setIsPreviewModalOpen(true)}
              className="p-1.5 text-slate-500 hover:text-slate-900 hover:bg-white rounded shadow-sm transition-all"
              title="Preview Mode"
            >
              <Eye size={16} />
            </button>
          </div>

          <div className="w-px h-4 bg-slate-200 mx-1 hidden sm:block"></div>

          <button 
            onClick={handleSave}
            disabled={saveState === 'Saving...'}
            className="h-8 px-3 rounded-lg border border-slate-200 bg-white text-slate-700 font-bold text-[12px] hover:bg-slate-50 transition-colors flex items-center gap-1.5 shadow-sm"
          >
            {saveState === 'Saving...' ? <Loader2 size={14} className="animate-spin" /> : <Save size={14} />}
            <span className="hidden sm:inline">{saveState === 'Saving...' ? 'Saving...' : 'Save'}</span>
          </button>

          <button 
            onClick={handleDownloadPDF}
            disabled={isGeneratingPDF}
            className={`h-8 px-4 rounded-lg text-white font-bold text-[12px] transition-colors flex items-center gap-1.5 shadow-sm ${
              isGeneratingPDF ? 'bg-slate-400 cursor-not-allowed opacity-80' : 'bg-slate-900 hover:bg-slate-800'
            }`}
          >
            <Download size={14} />
            <span className="hidden sm:inline">{isGeneratingPDF ? 'Exporting...' : 'Export PDF'}</span>
            <span className="inline sm:hidden">Export</span>
          </button>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex flex-col xl:flex-row gap-8 items-start">
        {/* Left Panel: Tabs & Content (Fixed width to give more space to preview) */}
        <div className="w-full xl:w-[450px] shrink-0 flex flex-col gap-4">
          
          {/* Panel Tabs */}
          <div className="flex items-center gap-2 p-1.5 bg-slate-200/50 rounded-xl">
            <button 
              onClick={() => setActiveTab('builder')}
              className={`flex-1 py-2 text-[13px] font-bold rounded-lg transition-all ${activeTab === 'builder' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-600 hover:text-slate-900'}`}
            >
              Resume Builder
            </button>
            <button 
              onClick={() => setActiveTab('health')}
              className={`flex-1 py-2 text-[13px] font-bold rounded-lg transition-all ${activeTab === 'health' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-600 hover:text-slate-900'}`}
            >
              Live ATS Health
            </button>
          </div>

          <div className="h-[800px]">
            {activeTab === 'builder' ? <ResumeFormPanel /> : <ResumeHealthPanel />}
          </div>
        </div>

        <div className="flex-1 w-full sticky top-24 overflow-x-auto pb-4">
          <ResumePreviewPanel ref={resumeRef} isPdfMode={false} />
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
      
      <ResumeImportModal 
        isOpen={isImportModalOpen} 
        onClose={() => setIsImportModalOpen(false)} 
      />
      
      <ResumeHistoryModal 
        isOpen={isHistoryModalOpen} 
        onClose={() => setIsHistoryModalOpen(false)} 
      />

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4">
          <div className="bg-white w-full max-w-md rounded-2xl shadow-xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            <div className="p-6">
              <div className="w-12 h-12 bg-red-100 text-red-600 rounded-full flex items-center justify-center mb-4">
                <Trash2 size={24} />
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-2">Delete Resume</h3>
              <p className="text-[14px] text-slate-600 mb-6">
                Are you sure you want to delete "{currentResume?.title || 'Untitled Resume'}"? This action cannot be undone.
              </p>
              <div className="flex items-center gap-3 justify-end">
                <button 
                  onClick={() => setShowDeleteConfirm(false)}
                  className="px-4 py-2 text-[13px] font-bold text-slate-600 hover:bg-slate-100 rounded-xl transition-colors"
                >
                  Cancel
                </button>
                <button 
                  onClick={handleDeleteConfirm}
                  className="px-4 py-2 text-[13px] font-bold text-white bg-red-600 hover:bg-red-700 rounded-xl transition-colors"
                >
                  Yes, Delete
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
