import { useState, useRef } from 'react';
import { useResume } from '../../contexts/ResumeContext';
import { 
  User, 
  GraduationCap, 
  Code, 
  Briefcase, 
  FolderGit2, 
  Award,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  FileText,
  BookOpen,
  Plus,
  Trash2,
  ArrowRight,
  Wand2,
  Loader2
} from 'lucide-react';
import toast from 'react-hot-toast';
import { geminiService } from '../../services/geminiService';

const AI_ACTIONS = [
  { id: 'enhance', label: 'Enhance with AI', icon: Wand2 },
  { id: 'ats', label: 'ATS Optimize', icon: CheckCircle2 },
  { id: 'shorten', label: 'Shorten', icon: ChevronUp },
  { id: 'professional', label: 'Make More Professional', icon: Briefcase }
];

export default function ResumeFormPanel() {
  const { 
    resumeData, 
    isSectionComplete, 
    updatePersonalInfo, 
    addArrayItem, 
    updateArrayItem, 
    removeArrayItem,
    updateSkills
  } = useResume();

  const [activeSection, setActiveSection] = useState('Personal Info');
  const [enhancingField, setEnhancingField] = useState(null); // stores { type, id }
  const [aiMenuOpen, setAiMenuOpen] = useState(null); // stores { type, id }
  const [aiDrafts, setAiDrafts] = useState({}); // stores { [id]: draftText }

  const handleEnhanceText = async (type, id, currentValue, contextType, actionType = 'enhance') => {
    if (!currentValue?.trim()) {
      toast.error('Please enter some text to enhance first.');
      return;
    }
    setAiMenuOpen(null);
    setEnhancingField({ type, id });
    try {
      const enhanced = await geminiService.enhanceResumeText(currentValue, contextType, actionType);
      setAiDrafts(prev => ({ ...prev, [id]: enhanced }));
      toast.success('AI generation complete!');
    } catch (err) {
      toast.error('Failed to enhance text.');
    } finally {
      setEnhancingField(null);
    }
  };

  const acceptAiDraft = (type, id) => {
    const enhanced = aiDrafts[id];
    if (!enhanced) return;
    
    if (type === 'projects') {
      updateArrayItem('projects', id, { description: enhanced });
    } else if (type === 'experience') {
      updateArrayItem('experience', id, { responsibilities: enhanced });
    } else if (type === 'certifications') {
      updateArrayItem('certifications', id, { issuer: enhanced });
    } else if (type === 'summary') {
      updatePersonalInfo({ summary: enhanced });
    }
    
    discardAiDraft(id);
    toast.success('AI changes accepted');
  };

  const discardAiDraft = (id) => {
    setAiDrafts(prev => {
      const next = { ...prev };
      delete next[id];
      return next;
    });
  };


  const sections = [
    { id: 'Personal Info', title: 'Personal Information', icon: User, description: 'Add your basic personal details.' },
    { id: 'Summary', title: 'Professional Summary', icon: FileText, description: 'Write a compelling overview of your career.' },
    { id: 'Education', title: 'Education', icon: GraduationCap, description: 'Add your educational background.' },
    { id: 'Skills', title: 'Skills', icon: Code, description: 'Add your technical and professional skills.' },
    { id: 'Projects', title: 'Projects', icon: FolderGit2, description: 'Add the projects you have worked on.' },
    { id: 'Experience', title: 'Experience', icon: Briefcase, description: 'Add your work and internship experience.' },
    { id: 'Certifications', title: 'Certifications', icon: Award, description: 'Add your certifications and achievements.' },
    { id: 'Workshops', title: 'Workshops & Training', icon: BookOpen, description: 'Add your workshops and training programs.' }
  ];

  const handleNext = () => {
    const currentIndex = sections.findIndex(s => s.id === activeSection);
    if (currentIndex < sections.length - 1) {
      setActiveSection(sections[currentIndex + 1].id);
    }
  };

  const renderAiButton = (type, id, currentValue, contextType) => {
    const isEnhancing = enhancingField?.type === type && enhancingField?.id === id;
    const isMenuOpen = aiMenuOpen?.type === type && aiMenuOpen?.id === id;

    return (
      <div className="relative">
        <button
          onClick={() => isMenuOpen ? setAiMenuOpen(null) : setAiMenuOpen({ type, id })}
          disabled={isEnhancing}
          className="text-[11px] font-bold text-indigo-600 bg-indigo-50 hover:bg-indigo-100 px-2.5 py-1.5 rounded-md flex items-center gap-1.5 transition-colors"
        >
          {isEnhancing ? (
            <><Loader2 size={12} className="animate-spin" /> Enhancing...</>
          ) : (
            <><Wand2 size={12} /> Enhance with AI <ChevronDown size={12} /></>
          )}
        </button>

        {isMenuOpen && !isEnhancing && (
          <div className="absolute right-0 top-full mt-1 w-56 max-w-[calc(100vw-2rem)] bg-white rounded-xl shadow-lg border border-slate-100 py-1.5 z-50 animate-in fade-in slide-in-from-top-2">
            {AI_ACTIONS.map(action => {
              const ActionIcon = action.icon;
              return (
                <button
                  key={action.id}
                  onClick={() => handleEnhanceText(type, id, currentValue, contextType, action.id)}
                  className="w-full px-3 py-2 text-left text-[12px] font-medium text-slate-700 hover:bg-indigo-50 hover:text-indigo-600 flex items-center gap-2 transition-colors"
                >
                  <ActionIcon size={14} />
                  {action.label}
                </button>
              );
            })}
          </div>
        )}
      </div>
    );
  };

  const renderAiDraft = (type, id) => {
    const draft = aiDrafts[id];
    if (!draft) return null;
    
    return (
      <div className="mt-2 bg-indigo-50/50 border border-indigo-100 rounded-xl p-3 text-[13px] animate-in fade-in slide-in-from-top-1">
        <div className="flex items-center gap-2 mb-2">
          <Wand2 size={14} className="text-indigo-500" />
          <span className="font-bold text-indigo-900">AI Suggestion</span>
        </div>
        <p className="text-slate-700 mb-3 whitespace-pre-wrap">{draft}</p>
        <div className="flex items-center gap-2">
          <button 
            onClick={() => acceptAiDraft(type, id)}
            className="px-3 py-1.5 bg-indigo-600 text-white font-semibold rounded-md hover:bg-indigo-700 transition-colors"
          >
            Replace
          </button>
          <button 
            onClick={() => discardAiDraft(id)}
            className="px-3 py-1.5 bg-white text-slate-600 font-semibold border border-slate-200 rounded-md hover:bg-slate-50 transition-colors"
          >
            Discard
          </button>
        </div>
      </div>
    );
  };

  const renderSummaryForm = () => {
    const summary = resumeData?.personalInfo?.summary || '';
    return (
      <div className="flex flex-col gap-4 mt-6 pb-2">
        <div className="flex flex-col gap-2">
          <div className="flex items-center justify-between">
            <label className="text-[13px] font-bold text-slate-800">Professional Summary</label>
            {renderAiButton('summary', 'summary-1', summary, 'professional summary')}
          </div>
          <textarea 
            rows={5}
            value={summary}
            onChange={(e) => updatePersonalInfo({ summary: e.target.value })}
            placeholder="Results-driven professional with experience in..."
            className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-[14px] focus:outline-none focus:ring-2 focus:ring-[#6C4CF1] focus:bg-white transition-all resize-none placeholder:text-slate-400"
          />
          <p className="text-xs text-slate-500 flex justify-end">
            {summary.length} / 500 characters
          </p>
          {renderAiDraft('summary', 'summary-1')}
        </div>
        <div className="flex justify-end mt-4">
          <button onClick={handleNext} className="bg-[#6C4CF1] hover:bg-indigo-700 text-white font-bold text-[14px] px-8 py-3 rounded-xl flex items-center gap-2 transition-all shadow-md hover:shadow-lg">Next <ArrowRight size={18} strokeWidth={2.5} /></button>
        </div>
      </div>
    );
  };

  const renderPersonalInfoForm = () => (
    <div className="flex flex-col gap-6 mt-6 pb-2">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-5">
        <div className="flex flex-col gap-2">
          <label className="text-[13px] font-bold text-slate-800">Full Name <span className="text-red-500">*</span></label>
          <input 
            type="text" 
            value={resumeData?.personalInfo?.fullName || ''}
            onChange={(e) => updatePersonalInfo({ fullName: e.target.value })}
            placeholder="Enter your full name"
            className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-[14px] focus:outline-none focus:ring-2 focus:ring-[#6C4CF1] focus:bg-white transition-all placeholder:text-slate-400"
          />
        </div>
        <div className="flex flex-col gap-2">
          <label className="text-[13px] font-bold text-slate-800">Email <span className="text-red-500">*</span></label>
          <input 
            type="email" 
            value={resumeData?.personalInfo?.email || ''}
            onChange={(e) => updatePersonalInfo({ email: e.target.value })}
            placeholder="your.email@example.com"
            className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-[14px] focus:outline-none focus:ring-2 focus:ring-[#6C4CF1] focus:bg-white transition-all placeholder:text-slate-400"
          />
        </div>
        <div className="flex flex-col gap-2">
          <label className="text-[13px] font-bold text-slate-800">Phone <span className="text-red-500">*</span></label>
          <input 
            type="tel" 
            value={resumeData?.personalInfo?.phone || ''}
            onChange={(e) => updatePersonalInfo({ phone: e.target.value })}
            placeholder="+91 XXXXX XXXXX"
            className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-[14px] focus:outline-none focus:ring-2 focus:ring-[#6C4CF1] focus:bg-white transition-all placeholder:text-slate-400"
          />
        </div>
        <div className="flex flex-col gap-2">
          <label className="text-[13px] font-bold text-slate-800">Location <span className="text-red-500">*</span></label>
          <input 
            type="text" 
            value={resumeData?.personalInfo?.location || ''}
            onChange={(e) => updatePersonalInfo({ location: e.target.value })}
            placeholder="City, Country"
            className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-[14px] focus:outline-none focus:ring-2 focus:ring-[#6C4CF1] focus:bg-white transition-all placeholder:text-slate-400"
          />
        </div>
        <div className="flex flex-col gap-2">
          <label className="text-[13px] font-bold text-slate-800">LinkedIn</label>
          <input 
            type="url" 
            value={resumeData?.personalInfo?.linkedin || ''}
            onChange={(e) => updatePersonalInfo({ linkedin: e.target.value })}
            placeholder="linkedin.com/in/your-profile"
            className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-[14px] focus:outline-none focus:ring-2 focus:ring-[#6C4CF1] focus:bg-white transition-all placeholder:text-slate-400"
          />
        </div>
        <div className="flex flex-col gap-2">
          <label className="text-[13px] font-bold text-slate-800">GitHub</label>
          <input 
            type="url" 
            value={resumeData?.personalInfo?.github || ''}
            onChange={(e) => updatePersonalInfo({ github: e.target.value })}
            placeholder="github.com/your-username"
            className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-[14px] focus:outline-none focus:ring-2 focus:ring-[#6C4CF1] focus:bg-white transition-all placeholder:text-slate-400"
          />
        </div>
      </div>
      <div className="flex flex-col gap-2">
        <label className="text-[13px] font-bold text-slate-800">Portfolio</label>
        <input 
          type="url" 
          value={resumeData.personalInfo.portfolio}
          onChange={(e) => updatePersonalInfo({ portfolio: e.target.value })}
          placeholder="https://yourportfolio.com"
          className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-[14px] focus:outline-none focus:ring-2 focus:ring-[#6C4CF1] focus:bg-white transition-all placeholder:text-slate-400"
        />
      </div>
      <div className="flex justify-end mt-4">
        <button 
          onClick={handleNext}
          className="bg-[#6C4CF1] hover:bg-indigo-700 text-white font-bold text-[14px] px-8 py-3 rounded-xl flex items-center gap-2 transition-all shadow-md hover:shadow-lg"
        >
          Next <ArrowRight size={18} strokeWidth={2.5} />
        </button>
      </div>
    </div>
  );

  const renderEducationForm = () => (
    <div className="flex flex-col gap-4 mt-6 pb-2">
      {resumeData.education.map((edu) => (
        <div key={edu.id} className="p-5 border border-slate-200 rounded-xl bg-white shadow-sm relative group">
          <button 
            onClick={() => removeArrayItem('education', edu.id)}
            className="absolute top-4 right-4 text-slate-400 hover:text-red-500 transition-colors"
          >
            <Trash2 size={18} />
          </button>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div className="flex flex-col gap-2">
              <label className="text-[13px] font-bold text-slate-800">Degree</label>
              <input 
                type="text" 
                value={edu.degree || ''}
                onChange={(e) => updateArrayItem('education', edu.id, { degree: e.target.value })}
                placeholder="B.Tech in Computer Science Engineering"
                className="px-4 py-3 rounded-lg border border-slate-200 text-[14px] focus:outline-none focus:border-indigo-500"
              />
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-[13px] font-bold text-slate-800">Institution</label>
              <input 
                type="text" 
                value={edu.school || ''}
                onChange={(e) => updateArrayItem('education', edu.id, { school: e.target.value })}
                placeholder="RV College of Engineering"
                className="px-4 py-3 rounded-lg border border-slate-200 text-[14px] focus:outline-none focus:border-indigo-500"
              />
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-[13px] font-bold text-slate-800">Year</label>
              <input 
                type="text" 
                value={edu.year || ''}
                onChange={(e) => updateArrayItem('education', edu.id, { year: e.target.value })}
                placeholder="2022 - 2026"
                className="px-4 py-3 rounded-lg border border-slate-200 text-[14px] focus:outline-none focus:border-indigo-500"
              />
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-[13px] font-bold text-slate-800">CGPA / Grade</label>
              <input 
                type="text" 
                value={edu.cgpa || ''}
                onChange={(e) => updateArrayItem('education', edu.id, { cgpa: e.target.value })}
                placeholder="8.7/10.0"
                className="px-4 py-3 rounded-lg border border-slate-200 text-[14px] focus:outline-none focus:border-indigo-500"
              />
            </div>
          </div>
        </div>
      ))}
      <button 
        onClick={() => addArrayItem('education', { degree: '', school: '', year: '', cgpa: '' })}
        className="w-full py-4 border-2 border-dashed border-indigo-200 text-indigo-600 rounded-xl font-bold text-[14px] hover:bg-indigo-50 transition-colors flex items-center justify-center gap-2"
      >
        <Plus size={18} strokeWidth={2.5} /> Add Education
      </button>
      <div className="flex justify-end mt-4">
        <button onClick={handleNext} className="bg-[#6C4CF1] hover:bg-indigo-700 text-white font-bold text-[14px] px-8 py-3 rounded-xl flex items-center gap-2 transition-all shadow-md hover:shadow-lg">Next <ArrowRight size={18} strokeWidth={2.5} /></button>
      </div>
    </div>
  );

  const [skillsText, setSkillsText] = useState(resumeData.skills.join(', '));

  const renderSkillsForm = () => (
    <div className="flex flex-col gap-4 mt-6 pb-2">
      <div className="flex flex-col gap-2">
        <label className="text-[13px] font-bold text-slate-800">Skills (Comma separated)</label>
        <textarea 
          rows={4}
          value={skillsText}
          onChange={(e) => {
            setSkillsText(e.target.value);
            updateSkills(e.target.value.split(',').map(s => s.trim()).filter(Boolean));
          }}
          placeholder="React, JavaScript, TypeScript, Node.js..."
          className="px-4 py-3 rounded-xl border border-slate-200 text-[14px] text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all resize-none"
        />
      </div>
      <div className="flex justify-end mt-4">
        <button onClick={handleNext} className="bg-[#6C4CF1] hover:bg-indigo-700 text-white font-bold text-[14px] px-8 py-3 rounded-xl flex items-center gap-2 transition-all shadow-md hover:shadow-lg">Next <ArrowRight size={18} strokeWidth={2.5} /></button>
      </div>
    </div>
  );

  const renderProjectsForm = () => (
    <div className="flex flex-col gap-4 mt-6 pb-2">
      {resumeData.projects.map((proj) => (
        <div key={proj.id} className="p-5 border border-slate-200 rounded-xl bg-white shadow-sm relative group">
          <button onClick={() => removeArrayItem('projects', proj.id)} className="absolute top-4 right-4 text-slate-400 hover:text-red-500 transition-colors">
            <Trash2 size={18} />
          </button>
          <div className="flex flex-col gap-5">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div className="flex flex-col gap-2">
                <label className="text-[13px] font-bold text-slate-800">Project Title</label>
                <input 
                  type="text" value={proj.title || ''}
                  onChange={(e) => updateArrayItem('projects', proj.id, { title: e.target.value })}
                  placeholder="e.g., E-commerce Platform"
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-[14px] focus:outline-none focus:ring-2 focus:ring-[#6C4CF1] focus:bg-white transition-all"
                />
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-[13px] font-bold text-slate-800">Link</label>
                <input 
                  type="text" value={proj.link || ''}
                  onChange={(e) => updateArrayItem('projects', proj.id, { link: e.target.value })}
                  placeholder="github.com/your-username/project"
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-[14px] focus:outline-none focus:ring-2 focus:ring-[#6C4CF1] focus:bg-white transition-all"
                />
              </div>
            </div>
            <div className="flex flex-col gap-2">
              <div className="flex items-center justify-between">
                <label className="text-[13px] font-bold text-slate-800">Description</label>
                {renderAiButton('projects', proj.id, proj.description, 'project description')}
              </div>
              <textarea 
                rows={3}
                value={proj.description || ''}
                onChange={(e) => updateArrayItem('projects', proj.id, { description: e.target.value })}
                placeholder="A full-stack platform..."
                className="px-4 py-3 rounded-lg border border-slate-200 text-[14px] focus:outline-none focus:border-indigo-500 resize-none"
              />
              {renderAiDraft('projects', proj.id)}
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-[13px] font-bold text-slate-800">Tech Stack</label>
              <input 
                type="text" value={proj.techStack || ''}
                onChange={(e) => updateArrayItem('projects', proj.id, { techStack: e.target.value })}
                placeholder="React • Node.js • MongoDB"
                className="px-4 py-3 rounded-lg border border-slate-200 text-[14px] focus:outline-none focus:border-indigo-500"
              />
            </div>
          </div>
        </div>
      ))}
      <button 
        onClick={() => addArrayItem('projects', { title: '', description: '', link: '', techStack: '' })}
        className="w-full py-4 border-2 border-dashed border-indigo-200 text-indigo-600 rounded-xl font-bold text-[14px] hover:bg-indigo-50 transition-colors flex items-center justify-center gap-2"
      >
        <Plus size={18} strokeWidth={2.5} /> Add Project
      </button>
      <div className="flex justify-end mt-4">
        <button onClick={handleNext} className="bg-[#6C4CF1] hover:bg-indigo-700 text-white font-bold text-[14px] px-8 py-3 rounded-xl flex items-center gap-2 transition-all shadow-md hover:shadow-lg">Next <ArrowRight size={18} strokeWidth={2.5} /></button>
      </div>
    </div>
  );

  const renderExperienceForm = () => (
    <div className="flex flex-col gap-4 mt-6 pb-2">
      {resumeData.experience.map((exp) => (
        <div key={exp.id} className="p-5 border border-slate-200 rounded-xl bg-white shadow-sm relative group">
          <button onClick={() => removeArrayItem('experience', exp.id)} className="absolute top-4 right-4 text-slate-400 hover:text-red-500 transition-colors">
            <Trash2 size={18} />
          </button>
          <div className="flex flex-col gap-5">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div className="flex flex-col gap-2">
                <label className="text-[13px] font-bold text-slate-800">Role</label>
                <input 
                  type="text" value={exp.role || ''}
                  onChange={(e) => updateArrayItem('experience', exp.id, { role: e.target.value })}
                  placeholder="Frontend Developer Intern"
                  className="px-4 py-3 rounded-lg border border-slate-200 text-[14px] focus:outline-none focus:border-indigo-500"
                />
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-[13px] font-bold text-slate-800">Company</label>
                <input 
                  type="text" value={exp.company || ''}
                  onChange={(e) => updateArrayItem('experience', exp.id, { company: e.target.value })}
                  placeholder="e.g., Tech Solutions Inc."
                  className="px-4 py-3 rounded-lg border border-slate-200 text-[14px] font-bold focus:outline-none focus:border-indigo-500"
                />
              </div>
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-[13px] font-bold text-slate-800">Duration</label>
              <input 
                type="text" value={exp.duration || ''}
                onChange={(e) => updateArrayItem('experience', exp.id, { duration: e.target.value })}
                placeholder="Jan 2025 - Apr 2025"
                className="px-4 py-3 rounded-lg border border-slate-200 text-[14px] focus:outline-none focus:border-indigo-500"
              />
            </div>
            <div className="flex flex-col gap-2">
              <div className="flex items-center justify-between">
                <label className="text-[13px] font-bold text-slate-800">Responsibilities (New line for bullet)</label>
                {renderAiButton('experience', exp.id, exp.responsibilities, 'work experience bullet points')}
              </div>
              <textarea 
                rows={4} value={exp.responsibilities || ''}
                onChange={(e) => updateArrayItem('experience', exp.id, { responsibilities: e.target.value })}
                placeholder="Built responsive web applications..."
                className="px-4 py-3 rounded-lg border border-slate-200 text-[14px] focus:outline-none focus:border-indigo-500 resize-none"
              />
              {renderAiDraft('experience', exp.id)}
            </div>
          </div>
        </div>
      ))}
      <button 
        onClick={() => addArrayItem('experience', { role: '', company: '', duration: '', responsibilities: '' })}
        className="w-full py-4 border-2 border-dashed border-indigo-200 text-indigo-600 rounded-xl font-bold text-[14px] hover:bg-indigo-50 transition-colors flex items-center justify-center gap-2"
      >
        <Plus size={18} strokeWidth={2.5} /> Add Experience
      </button>
      <div className="flex justify-end mt-4">
        <button onClick={handleNext} className="bg-[#6C4CF1] hover:bg-indigo-700 text-white font-bold text-[14px] px-8 py-3 rounded-xl flex items-center gap-2 transition-all shadow-md hover:shadow-lg">Next <ArrowRight size={18} strokeWidth={2.5} /></button>
      </div>
    </div>
  );

  const renderCertificationsForm = () => (
    <div className="flex flex-col gap-4 mt-6 pb-2">
      {resumeData.certifications.map((cert) => (
        <div key={cert.id} className="p-5 border border-slate-200 rounded-xl bg-white shadow-sm relative group">
          <button onClick={() => removeArrayItem('certifications', cert.id)} className="absolute top-4 right-4 text-slate-400 hover:text-red-500 transition-colors">
            <Trash2 size={18} />
          </button>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
            <div className="flex flex-col gap-2 sm:col-span-2">
              <label className="text-[13px] font-bold text-slate-800">Certification / Achievement</label>
              <input 
                type="text" value={cert.title || ''}
                onChange={(e) => updateArrayItem('certifications', cert.id, { title: e.target.value })}
                placeholder="JavaScript Algorithms"
                className="px-4 py-3 rounded-lg border border-slate-200 text-[14px] focus:outline-none focus:border-indigo-500"
              />
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-[13px] font-bold text-slate-800">Year</label>
              <input 
                type="text" value={cert.year || ''}
                onChange={(e) => updateArrayItem('certifications', cert.id, { year: e.target.value })}
                placeholder="2024"
                className="px-4 py-3 rounded-lg border border-slate-200 text-[14px] focus:outline-none focus:border-indigo-500"
              />
            </div>
            <div className="flex flex-col gap-2 sm:col-span-3">
              <div className="flex items-center justify-between">
                <label className="text-[13px] font-bold text-slate-800">Issuer / Detail</label>
                {renderAiButton('certifications', cert.id, cert.issuer, 'certification achievement details')}
              </div>
              <input 
                type="text" value={cert.issuer || ''}
                onChange={(e) => updateArrayItem('certifications', cert.id, { issuer: e.target.value })}
                placeholder="freeCodeCamp"
                className="px-4 py-3 rounded-lg border border-slate-200 text-[14px] focus:outline-none focus:border-indigo-500"
              />
              {renderAiDraft('certifications', cert.id)}
            </div>
          </div>
        </div>
      ))}
      <button 
        onClick={() => addArrayItem('certifications', { title: '', issuer: '', year: '' })}
        className="w-full py-4 border-2 border-dashed border-indigo-200 text-indigo-600 rounded-xl font-bold text-[14px] hover:bg-indigo-50 transition-colors flex items-center justify-center gap-2"
      >
        <Plus size={18} strokeWidth={2.5} /> Add Certification
      </button>
      <div className="flex justify-end mt-4">
        <button onClick={handleNext} className="bg-[#6C4CF1] hover:bg-indigo-700 text-white font-bold text-[14px] px-8 py-3 rounded-xl flex items-center gap-2 transition-all shadow-md hover:shadow-lg">Next <ArrowRight size={18} strokeWidth={2.5} /></button>
      </div>
    </div>
  );

  const renderWorkshopsForm = () => (
    <div className="flex flex-col gap-4 mt-6 pb-2">
      {(resumeData.workshops || []).map((ws) => (
        <div key={ws.id} className="p-5 border border-slate-200 rounded-xl bg-white shadow-sm relative group">
          <button onClick={() => removeArrayItem('workshops', ws.id)} className="absolute top-4 right-4 text-slate-400 hover:text-red-500 transition-colors">
            <Trash2 size={18} />
          </button>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
            <div className="flex flex-col gap-2 sm:col-span-2">
              <label className="text-[13px] font-bold text-slate-800">Workshop / Training Title</label>
              <input 
                type="text" value={ws.title || ''}
                onChange={(e) => updateArrayItem('workshops', ws.id, { title: e.target.value })}
                placeholder="Advanced System Design"
                className="px-4 py-3 rounded-lg border border-slate-200 text-[14px] focus:outline-none focus:border-indigo-500"
              />
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-[13px] font-bold text-slate-800">Year</label>
              <input 
                type="text" value={ws.year || ''}
                onChange={(e) => updateArrayItem('workshops', ws.id, { year: e.target.value })}
                placeholder="2023"
                className="px-4 py-3 rounded-lg border border-slate-200 text-[14px] focus:outline-none focus:border-indigo-500"
              />
            </div>
            <div className="flex flex-col gap-2 sm:col-span-3">
              <label className="text-[13px] font-bold text-slate-800">Issuer / Organization</label>
              <input 
                type="text" value={ws.issuer || ''}
                onChange={(e) => updateArrayItem('workshops', ws.id, { issuer: e.target.value })}
                placeholder="Tech Talks Conference"
                className="px-4 py-3 rounded-lg border border-slate-200 text-[14px] focus:outline-none focus:border-indigo-500"
              />
            </div>
          </div>
        </div>
      ))}
      <button 
        onClick={() => addArrayItem('workshops', { title: '', issuer: '', year: '' })}
        className="w-full py-4 border-2 border-dashed border-indigo-200 text-indigo-600 rounded-xl font-bold text-[14px] hover:bg-indigo-50 transition-colors flex items-center justify-center gap-2"
      >
        <Plus size={18} strokeWidth={2.5} /> Add Workshop
      </button>
    </div>
  );

  return (
    <div className="flex flex-col bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
      {sections.map((section, index) => {
        const isActive = activeSection === section.id;
        const isComplete = isSectionComplete(section.id);
        const Icon = section.icon;

        return (
          <div 
            key={section.id} 
            className={`bg-white overflow-hidden transition-all duration-300 ${index !== sections.length - 1 ? 'border-b border-slate-100' : ''}`}
          >
            {/* Accordion Header */}
            <div 
              onClick={() => setActiveSection(isActive ? null : section.id)}
              className={`flex items-center justify-between p-5 cursor-pointer transition-colors ${isActive ? 'bg-slate-50/50' : 'hover:bg-slate-50'}`}
            >
              <div className="flex items-center gap-4">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${isActive || isComplete ? 'bg-indigo-50 text-[#6C4CF1]' : 'bg-slate-50 text-slate-400'}`}>
                  <Icon size={18} strokeWidth={2.5} />
                </div>
                <div>
                  <h3 className="text-[15px] font-bold text-slate-900">{section.title}</h3>
                  <p className="text-[12px] text-slate-500 font-medium mt-0.5">{section.description}</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                {isComplete && <CheckCircle2 className="text-emerald-500" size={20} strokeWidth={2.5} />}
                {isActive ? <ChevronUp size={20} className="text-slate-400" /> : <ChevronDown size={20} className="text-slate-400" />}
              </div>
            </div>

            {/* Accordion Body */}
            {isActive && (
              <div className="px-5 pb-6 pt-0">
                {section.id === 'Personal Info' && renderPersonalInfoForm()}
                {section.id === 'Summary' && renderSummaryForm()}
                {section.id === 'Education' && renderEducationForm()}
                {section.id === 'Skills' && renderSkillsForm()}
                {section.id === 'Projects' && renderProjectsForm()}
                {section.id === 'Experience' && renderExperienceForm()}
                {section.id === 'Certifications' && renderCertificationsForm()}
                {section.id === 'Workshops' && renderWorkshopsForm()}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
