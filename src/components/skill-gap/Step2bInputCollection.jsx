import { useState, useEffect, useRef } from 'react';
import { UploadCloud, GitBranch, Link as LinkIcon, ListPlus, ChevronLeft, ChevronRight, X, FileText, CheckCircle2 } from 'lucide-react';

export default function Step2bInputCollection({ sources, onSubmit, onBack, initialData = {} }) {
  const [resumeFile, setResumeFile] = useState(initialData.resumeFile || null);
  const [githubUrl, setGithubUrl] = useState(initialData.githubUrl || '');
  const [linkedinFile, setLinkedinFile] = useState(initialData.linkedinFile || null);
  const [manualSkills, setManualSkills] = useState(initialData.manualSkills || []);
  const [skillInput, setSkillInput] = useState('');
  
  const [isDragging, setIsDragging] = useState(false);
  const [isDraggingLinkedin, setIsDraggingLinkedin] = useState(false);
  const fileInputRef = useRef(null);
  const linkedinInputRef = useRef(null);

  const pendingSkills = skillInput.split(',').map(s => s.trim()).filter(s => s !== '');
  const allCurrentSkills = [...new Set([...manualSkills, ...pendingSkills])];

  // Validation
  const isValidGithub = !sources.includes('github') || (githubUrl.trim().length > 0 && githubUrl.includes('github.com/'));
  const isValidLinkedin = !sources.includes('linkedin') || linkedinFile !== null;
  const isValidResume = !sources.includes('resume') || resumeFile !== null;
  const isValidManual = !sources.includes('manual') || allCurrentSkills.length >= 3;
  
  const canContinue = isValidGithub && isValidLinkedin && isValidResume && isValidManual;

  const handleSubmit = () => {
    if (canContinue) {
      onSubmit({
        resumeFile,
        githubUrl,
        linkedinFile,
        manualSkills: allCurrentSkills
      });
    }
  };

  // Drag and Drop Handlers
  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const file = e.dataTransfer.files[0];
      if (file.type === 'application/pdf' || file.name.endsWith('.docx')) {
        setResumeFile(file);
      }
    }
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      setResumeFile(e.target.files[0]);
    }
  };

  const handleDragOverLinkedin = (e) => {
    e.preventDefault();
    setIsDraggingLinkedin(true);
  };

  const handleDragLeaveLinkedin = () => {
    setIsDraggingLinkedin(false);
  };

  const handleDropLinkedin = (e) => {
    e.preventDefault();
    setIsDraggingLinkedin(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const file = e.dataTransfer.files[0];
      if (file.type === 'application/pdf') {
        setLinkedinFile(file);
      }
    }
  };

  const handleFileChangeLinkedin = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      setLinkedinFile(e.target.files[0]);
    }
  };

  // Skill Input Handlers
  const handleAddSkill = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      if (pendingSkills.length > 0) {
        setManualSkills(allCurrentSkills);
        setSkillInput('');
      }
    }
  };

  const removeSkill = (skillToRemove) => {
    setManualSkills(manualSkills.filter(s => s !== skillToRemove));
  };

  return (
    <div className="w-full max-w-[900px] mx-auto bg-white rounded-2xl border border-slate-200 shadow-sm p-6 lg:p-8 animate-in fade-in slide-in-from-right-8 duration-500">
      <div className="flex flex-col items-center text-center mb-10">
        <h1 className="text-2xl lg:text-3xl font-black text-slate-900 mb-2">Provide Your Details</h1>
        <p className="text-slate-500 font-medium">We need a bit more information based on the sources you selected.</p>
      </div>

      <div className="space-y-6 mb-10">
        
        {/* Resume Input */}
        {sources.includes('resume') && (
          <div className="border border-slate-200 rounded-2xl p-6 bg-slate-50/50">
            <h3 className="font-bold text-slate-900 flex items-center gap-2 mb-4">
              <FileText className="text-blue-500" size={20} />
              Upload Resume <span className="text-red-500">*</span>
            </h3>
            
            {!resumeFile ? (
              <div 
                className={`border-2 border-dashed rounded-xl p-8 flex flex-col items-center justify-center transition-all cursor-pointer ${
                  isDragging ? 'border-blue-500 bg-blue-50' : 'border-slate-300 hover:border-slate-400 bg-white'
                }`}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
              >
                <div className="w-12 h-12 rounded-full bg-blue-50 flex items-center justify-center mb-3">
                  <UploadCloud className="text-blue-500" size={24} />
                </div>
                <p className="font-bold text-slate-700 mb-1">Click to upload or drag and drop</p>
                <p className="text-sm text-slate-500 font-medium mb-2">PDF or DOCX (max 5MB)</p>
                {allCurrentSkills.length > 0 && (
                  <p className="text-[11px] font-bold text-indigo-500 bg-indigo-50 px-3 py-1 rounded-full border border-indigo-100">
                    Using {allCurrentSkills.length} profile skills. Upload a resume for better accuracy!
                  </p>
                )}
                <input 
                  type="file" 
                  ref={fileInputRef} 
                  onChange={handleFileChange} 
                  accept=".pdf,.docx,application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document" 
                  className="hidden" 
                />
              </div>
            ) : (
              <div className="flex items-center justify-between p-4 bg-white border border-slate-200 rounded-xl shadow-sm">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-emerald-50 flex items-center justify-center">
                    <CheckCircle2 className="text-emerald-500" size={20} />
                  </div>
                  <div>
                    <p className="font-bold text-slate-900">{resumeFile.name}</p>
                    <p className="text-[12px] font-medium text-slate-500">{(resumeFile.size / 1024 / 1024).toFixed(2)} MB</p>
                  </div>
                </div>
                <button 
                  onClick={() => setResumeFile(null)}
                  className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                >
                  <X size={20} />
                </button>
              </div>
            )}
          </div>
        )}

        {/* GitHub Input */}
        {sources.includes('github') && (
          <div className="border border-slate-200 rounded-2xl p-6 bg-slate-50/50">
            <h3 className="font-bold text-slate-900 flex items-center gap-2 mb-4">
              <GitBranch className="text-slate-700" size={20} />
              GitHub Profile <span className="text-red-500">*</span>
            </h3>
            <input
              type="url"
              value={githubUrl}
              onChange={(e) => setGithubUrl(e.target.value)}
              placeholder="https://github.com/username"
              className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#6C4CF1]/50 font-medium text-slate-900 placeholder:text-slate-400"
            />
          </div>
        )}

        {/* LinkedIn Input */}
        {sources.includes('linkedin') && (
          <div className="border border-slate-200 rounded-2xl p-6 bg-slate-50/50">
            <h3 className="font-bold text-slate-900 flex items-center gap-2 mb-4">
              <LinkIcon className="text-sky-600" size={20} />
              LinkedIn Profile PDF <span className="text-red-500">*</span>
            </h3>
            
            {!linkedinFile ? (
              <div 
                className={`border-2 border-dashed rounded-xl p-8 flex flex-col items-center justify-center transition-all cursor-pointer ${
                  isDraggingLinkedin ? 'border-sky-500 bg-sky-50' : 'border-slate-300 hover:border-slate-400 bg-white'
                }`}
                onDragOver={handleDragOverLinkedin}
                onDragLeave={handleDragLeaveLinkedin}
                onDrop={handleDropLinkedin}
                onClick={() => linkedinInputRef.current?.click()}
              >
                <div className="w-12 h-12 rounded-full bg-sky-50 flex items-center justify-center mb-3">
                  <UploadCloud className="text-sky-600" size={24} />
                </div>
                <p className="font-bold text-slate-700 mb-1">Click to upload or drag and drop</p>
                <p className="text-sm text-slate-500 font-medium">PDF only (max 5MB)</p>
                <input 
                  type="file" 
                  ref={linkedinInputRef} 
                  onChange={handleFileChangeLinkedin} 
                  accept=".pdf,application/pdf" 
                  className="hidden" 
                />
              </div>
            ) : (
              <div className="flex items-center justify-between p-4 bg-white border border-slate-200 rounded-xl shadow-sm">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-emerald-50 flex items-center justify-center">
                    <CheckCircle2 className="text-emerald-500" size={20} />
                  </div>
                  <div>
                    <p className="font-bold text-slate-900">{linkedinFile.name}</p>
                    <p className="text-[12px] font-medium text-slate-500">{(linkedinFile.size / 1024 / 1024).toFixed(2)} MB</p>
                  </div>
                </div>
                <button 
                  onClick={() => setLinkedinFile(null)}
                  className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                >
                  <X size={20} />
                </button>
              </div>
            )}
          </div>
        )}

        {/* Manual Skills Input */}
        {sources.includes('manual') && (
          <div className="border border-slate-200 rounded-2xl p-6 bg-slate-50/50">
            <h3 className="font-bold text-slate-900 flex items-center justify-between gap-2 mb-4">
              <div className="flex items-center gap-2">
                <ListPlus className="text-purple-500" size={20} />
                Manual Skills <span className="text-red-500">*</span>
              </div>
              <span className={`text-[12px] font-bold px-2 py-1 rounded-md ${allCurrentSkills.length >= 3 ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'}`}>
                {allCurrentSkills.length >= 3 ? `${allCurrentSkills.length} Entered` : `${allCurrentSkills.length}/3 Required`}
              </span>
            </h3>
            <input
              type="text"
              value={skillInput}
              onChange={(e) => setSkillInput(e.target.value)}
              onKeyDown={handleAddSkill}
              placeholder="e.g. Python, React, Data Analysis"
              className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#6C4CF1]/50 font-medium text-slate-900 placeholder:text-slate-400 mb-4"
            />
            
            {manualSkills.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {manualSkills.map((skill, index) => (
                  <div key={index} className="flex items-center gap-1.5 bg-white border border-slate-200 px-3 py-1.5 rounded-lg shadow-sm">
                    <span className="text-sm font-semibold text-slate-700">{skill}</span>
                    <button 
                      onClick={() => removeSkill(skill)}
                      className="text-slate-400 hover:text-red-500 transition-colors"
                    >
                      <X size={14} />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

      </div>

      <div className="flex items-center justify-between pt-8 mt-4 border-t border-slate-100">
        <button
          onClick={onBack}
          className="px-6 py-3 rounded-xl font-bold text-slate-500 hover:bg-slate-100 transition-colors flex items-center gap-2"
        >
          <ChevronLeft size={20} /> Back
        </button>
        <button
          onClick={handleSubmit}
          disabled={!canContinue}
          className="bg-[#6C4CF1] hover:bg-indigo-600 text-white font-bold rounded-xl px-8 py-3 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-sm hover:shadow-md"
        >
          Analyze Skills
          <ChevronRight size={20} color="#FFFFFF" />
        </button>
      </div>
    </div>
  );
}
