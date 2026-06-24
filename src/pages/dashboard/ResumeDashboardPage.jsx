import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  FileText, 
  Plus, 
  MoreVertical, 
  Edit3, 
  Trash2, 
  Clock,
  Sparkles,
  LayoutTemplate
} from 'lucide-react';
import { useResume } from '../../contexts/ResumeContext';
import toast from 'react-hot-toast';
import ConfirmationModal from '../../components/common/ConfirmationModal';

export default function ResumeDashboardPage() {
  const { resumes, createResume, deleteResume, renameResume } = useResume();
  const navigate = useNavigate();
  
  const [activeMenuId, setActiveMenuId] = useState(null);
  const [isRenamingId, setIsRenamingId] = useState(null);
  const [renameValue, setRenameValue] = useState('');

  // Confirmation Modal state
  const [resumeToDelete, setResumeToDelete] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const formatDate = (timestamp) => {
    if (!timestamp) return 'Just now';
    const d = new Date(timestamp);
    return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  const getAtsScore = (resume) => {
    // Basic heuristic or fetch from resume data if saved there
    // Since it's dynamic based on content, let's roughly estimate from completed sections
    let score = 0;
    const pi = resume.personal_info || {};
    if (pi.fullName) score += 5;
    if (pi.email) score += 5;
    if (resume.education?.length) score += 20;
    if (resume.skills?.length > 3) score += 15;
    if (resume.projects?.length) score += 20;
    if (resume.experience?.length) score += 25;
    if (resume.certifications?.length) score += 10;
    return Math.min(score, 100);
  };

  const handleRenameSubmit = async (id) => {
    if (renameValue.trim()) {
      await renameResume(id, renameValue.trim());
    }
    setIsRenamingId(null);
    setRenameValue('');
  };

  const openResume = (id) => {
    navigate(`/resume-builder/${id}`);
  };

  const handleConfirmDelete = async () => {
    if (!resumeToDelete) return;
    setIsDeleting(true);
    try {
      await deleteResume(resumeToDelete.id);
      toast.success('Resume deleted successfully');
    } catch (error) {
      toast.error('Failed to delete resume');
    } finally {
      setIsDeleting(false);
      setResumeToDelete(null);
    }
  };

  return (
    <div className="p-6 lg:p-8 max-w-7xl mx-auto min-h-screen">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-[28px] font-extrabold text-slate-900 flex items-center gap-3 mb-1">
            <div className="w-10 h-10 bg-indigo-50 text-[#6C4CF1] rounded-xl flex items-center justify-center">
              <FileText size={20} strokeWidth={2.5} />
            </div>
            My Resumes
          </h1>
          <p className="text-[14px] text-slate-500 font-medium">
            Create and manage tailored resumes for different opportunities.
          </p>
        </div>
        <button
          onClick={async () => {
            const newId = await createResume('Untitled Resume');
            if (newId) {
              navigate(`/resume-builder/${newId}`);
            }
          }}
          className="bg-[#6C4CF1] hover:bg-indigo-700 text-white px-5 py-2.5 rounded-xl font-bold transition-all shadow-sm flex items-center justify-center gap-2"
        >
          <Plus size={20} />
          Create New Resume
        </button>
      </div>

      {resumes.length === 0 ? (
        <div className="bg-white rounded-3xl border border-slate-200 p-12 text-center flex flex-col items-center justify-center min-h-[400px]">
          <div className="w-20 h-20 bg-indigo-50 text-indigo-500 rounded-full flex items-center justify-center mb-6">
            <FileText size={40} />
          </div>
          <h2 className="text-xl font-bold text-slate-900 mb-2">No resumes yet</h2>
          <p className="text-slate-500 max-w-md mx-auto mb-8">
            Create your first ATS-friendly resume to start applying for opportunities.
          </p>
          <button
            onClick={async () => {
              const newId = await createResume('Untitled Resume');
              if (newId) {
                navigate(`/resume-builder/${newId}`);
              }
            }}
            className="bg-[#6C4CF1] hover:bg-indigo-700 text-white px-6 py-3 rounded-xl font-bold transition-all shadow-sm flex items-center gap-2"
          >
            <Sparkles size={20} />
            Build My Resume
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {resumes.map(resume => {
            const score = getAtsScore(resume);
            return (
              <div 
                key={resume.id} 
                className="bg-white rounded-[20px] border border-slate-200 overflow-hidden hover:border-[#6C4CF1]/30 hover:shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:-translate-y-1 transition-all duration-300 group flex flex-col relative"
              >
                {/* Menu Button */}
                <div className="absolute top-4 right-4 z-10">
                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      setActiveMenuId(activeMenuId === resume.id ? null : resume.id);
                    }}
                    className="p-1.5 bg-white/80 hover:bg-white text-slate-500 hover:text-slate-900 rounded-lg shadow-sm border border-slate-100 backdrop-blur-sm transition-colors"
                  >
                    <MoreVertical size={16} />
                  </button>
                  
                  {activeMenuId === resume.id && (
                    <>
                      <div 
                        className="fixed inset-0 z-40"
                        onClick={(e) => { e.stopPropagation(); setActiveMenuId(null); }}
                      />
                      <div className="absolute right-0 mt-1 w-48 bg-white rounded-xl shadow-xl border border-slate-100 z-50 overflow-hidden py-1">
                        <button 
                          onClick={(e) => {
                            e.stopPropagation();
                            setIsRenamingId(resume.id);
                            setRenameValue(resume.title);
                            setActiveMenuId(null);
                          }}
                          className="w-full text-left px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 hover:text-indigo-600 flex items-center gap-2"
                        >
                          <Edit3 size={16} /> Rename
                        </button>
                        <div className="h-px bg-slate-100 my-1"></div>
                        <button 
                          onClick={(e) => {
                            e.stopPropagation();
                            setResumeToDelete(resume);
                            setActiveMenuId(null);
                          }}
                          className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 flex items-center gap-2"
                        >
                          <Trash2 size={16} /> Delete
                        </button>
                      </div>
                    </>
                  )}
                </div>

                <div 
                  className="p-6 pb-4 cursor-pointer flex-1"
                  onClick={() => openResume(resume.id)}
                >
                  <div className="w-12 h-12 bg-indigo-50 text-indigo-600 rounded-xl flex items-center justify-center mb-4">
                    <FileText size={24} />
                  </div>
                  
                  {isRenamingId === resume.id ? (
                    <div className="mb-2" onClick={e => e.stopPropagation()}>
                      <input 
                        type="text" 
                        value={renameValue}
                        onChange={e => setRenameValue(e.target.value)}
                        onKeyDown={e => {
                          if (e.key === 'Enter') handleRenameSubmit(resume.id);
                          if (e.key === 'Escape') setIsRenamingId(null);
                        }}
                        onBlur={() => handleRenameSubmit(resume.id)}
                        autoFocus
                        className="w-full text-lg font-bold text-slate-900 border-b-2 border-indigo-500 bg-transparent outline-none p-0 focus:ring-0"
                      />
                    </div>
                  ) : (
                    <h3 className="text-lg font-bold text-slate-900 mb-1 truncate pr-8 group-hover:text-indigo-600 transition-colors">
                      {resume.title}
                    </h3>
                  )}
                  
                  <div className="flex items-center gap-2 text-[12px] font-medium text-slate-500 mb-6">
                    <LayoutTemplate size={14} />
                    {resume.template || 'Modern'} Template
                  </div>
                  
                  <div className="mt-auto">
                    <div className="flex items-center justify-between text-[11px] font-bold uppercase tracking-wider mb-2">
                      <span className="text-slate-500">ATS Score</span>
                      <span className={score >= 80 ? 'text-emerald-600' : score >= 60 ? 'text-amber-600' : 'text-rose-600'}>
                        {score}%
                      </span>
                    </div>
                    <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                      <div 
                        className={`h-full rounded-full ${score >= 80 ? 'bg-emerald-500' : score >= 60 ? 'bg-amber-500' : 'bg-rose-500'}`}
                        style={{ width: `${score}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
                
                <div className="px-6 py-4 bg-white border-t border-slate-100 flex items-center justify-between">
                  <div className="flex items-center gap-1.5 text-[12px] font-medium text-slate-500">
                    <Clock size={14} />
                    Edited {formatDate(resume.updated_at)}
                  </div>
                  <button 
                    onClick={(e) => { e.stopPropagation(); openResume(resume.id); }}
                    className="text-[12px] font-bold text-[#6C4CF1] hover:text-indigo-700 bg-indigo-50 hover:bg-indigo-100 px-3 py-1.5 rounded-lg transition-colors"
                  >
                    Open Editor
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      <ConfirmationModal
        isOpen={!!resumeToDelete}
        onClose={() => !isDeleting && setResumeToDelete(null)}
        onConfirm={handleConfirmDelete}
        title="Delete Resume"
        message={
          <>
            Are you sure you want to delete{' '}
            <span className="font-bold text-slate-900">{resumeToDelete?.title}</span>?
            {'\n\n'}This action cannot be undone.
          </>
        }
        confirmText="Delete Resume"
        isLoading={isDeleting}
      />
    </div>
  );
}
