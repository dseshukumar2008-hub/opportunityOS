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
  Plus,
  Trash2,
  ArrowRight,
  Upload,
  Camera
} from 'lucide-react';
import toast from 'react-hot-toast';

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
  const fileInputRef = useRef(null);

  const handlePhotoUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Check size (5MB max)
    if (file.size > 5 * 1024 * 1024) {
      toast.error('Image must be less than 5MB');
      return;
    }

    // Check type
    if (!['image/jpeg', 'image/png', 'image/webp'].includes(file.type)) {
      toast.error('Only JPG, PNG, and WEBP formats are supported');
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      updatePersonalInfo({ photo: reader.result });
      toast.success('Profile photo updated!');
    };
    reader.onerror = () => {
      toast.error('Failed to read file');
    };
    reader.readAsDataURL(file);
  };

  const sections = [
    { id: 'Personal Info', title: 'Personal Information', icon: User, description: 'Add your basic personal details.' },
    { id: 'Education', title: 'Education', icon: GraduationCap, description: 'Add your educational background.' },
    { id: 'Skills', title: 'Skills', icon: Code, description: 'Add your technical and professional skills.' },
    { id: 'Projects', title: 'Projects', icon: FolderGit2, description: 'Add the projects you have worked on.' },
    { id: 'Experience', title: 'Experience', icon: Briefcase, description: 'Add your work and internship experience.' },
    { id: 'Certifications', title: 'Certifications', icon: Award, description: 'Add your certifications and achievements.' }
  ];

  const handleNext = () => {
    const currentIndex = sections.findIndex(s => s.id === activeSection);
    if (currentIndex < sections.length - 1) {
      setActiveSection(sections[currentIndex + 1].id);
    }
  };

  const renderPersonalInfoForm = () => (
    <div className="flex flex-col gap-6 mt-6 pb-2">
      {/* Profile Photo Upload */}
      <div className="flex items-center gap-5 p-4 rounded-2xl border border-slate-200 bg-slate-50/50">
        <div className="relative w-20 h-20 shrink-0">
          <img 
            src={resumeData.personalInfo.photo || `https://api.dicebear.com/7.x/notionists/svg?seed=${resumeData.personalInfo.fullName || 'User'}&backgroundColor=e2e8f0`} 
            alt="Profile Preview" 
            className="w-full h-full object-cover rounded-full border-2 border-white shadow-sm"
          />
          <button 
            onClick={() => fileInputRef.current?.click()}
            className="absolute bottom-0 right-0 w-7 h-7 bg-white rounded-full border border-slate-200 shadow-sm flex items-center justify-center text-slate-600 hover:text-indigo-600 hover:border-indigo-200 transition-colors"
          >
            <Camera size={14} />
          </button>
        </div>
        <div className="flex flex-col gap-2 flex-1">
          <div>
            <h4 className="text-[14px] font-bold text-slate-800">Profile Photo</h4>
            <p className="text-[12px] text-slate-500 font-medium">Supported formats: JPG, PNG, WEBP (Max 5MB)</p>
          </div>
          <div className="flex gap-3">
            <button 
              onClick={() => fileInputRef.current?.click()}
              className="px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-[12px] font-bold text-slate-700 hover:bg-slate-50 transition-colors flex items-center gap-1.5"
            >
              <Upload size={14} />
              {resumeData.personalInfo.photo ? 'Change Photo' : 'Upload Photo'}
            </button>
            {resumeData.personalInfo.photo && (
              <button 
                onClick={() => {
                  updatePersonalInfo({ photo: '' });
                  if (fileInputRef.current) fileInputRef.current.value = '';
                }}
                className="px-3 py-1.5 bg-red-50 border border-red-100 rounded-lg text-[12px] font-bold text-red-600 hover:bg-red-100 transition-colors"
              >
                Remove
              </button>
            )}
          </div>
          <input 
            type="file" 
            ref={fileInputRef} 
            onChange={handlePhotoUpload} 
            accept="image/jpeg, image/png, image/webp" 
            className="hidden" 
          />
        </div>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-5">
        <div className="flex flex-col gap-2">
          <label className="text-[13px] font-bold text-slate-800">Full Name <span className="text-red-500">*</span></label>
          <input 
            type="text" 
            value={resumeData.personalInfo.fullName}
            onChange={(e) => updatePersonalInfo({ fullName: e.target.value })}
            placeholder="Seshu Kumar"
            className="px-4 py-3 rounded-xl border border-slate-200 text-[14px] text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all placeholder:text-slate-400"
          />
        </div>
        <div className="flex flex-col gap-2">
          <label className="text-[13px] font-bold text-slate-800">Email <span className="text-red-500">*</span></label>
          <input 
            type="email" 
            value={resumeData.personalInfo.email}
            onChange={(e) => updatePersonalInfo({ email: e.target.value })}
            placeholder="seshu@example.com"
            className="px-4 py-3 rounded-xl border border-slate-200 text-[14px] text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all placeholder:text-slate-400"
          />
        </div>
        <div className="flex flex-col gap-2">
          <label className="text-[13px] font-bold text-slate-800">Phone <span className="text-red-500">*</span></label>
          <input 
            type="tel" 
            value={resumeData.personalInfo.phone}
            onChange={(e) => updatePersonalInfo({ phone: e.target.value })}
            placeholder="+91 98765 43210"
            className="px-4 py-3 rounded-xl border border-slate-200 text-[14px] text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all placeholder:text-slate-400"
          />
        </div>
        <div className="flex flex-col gap-2">
          <label className="text-[13px] font-bold text-slate-800">Location <span className="text-red-500">*</span></label>
          <input 
            type="text" 
            value={resumeData.personalInfo.location}
            onChange={(e) => updatePersonalInfo({ location: e.target.value })}
            placeholder="Bangalore, India"
            className="px-4 py-3 rounded-xl border border-slate-200 text-[14px] text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all placeholder:text-slate-400"
          />
        </div>
        <div className="flex flex-col gap-2">
          <label className="text-[13px] font-bold text-slate-800">LinkedIn</label>
          <input 
            type="url" 
            value={resumeData.personalInfo.linkedin}
            onChange={(e) => updatePersonalInfo({ linkedin: e.target.value })}
            placeholder="linkedin.com/in/seshu-kumar"
            className="px-4 py-3 rounded-xl border border-slate-200 text-[14px] text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all placeholder:text-slate-400"
          />
        </div>
        <div className="flex flex-col gap-2">
          <label className="text-[13px] font-bold text-slate-800">GitHub</label>
          <input 
            type="url" 
            value={resumeData.personalInfo.github}
            onChange={(e) => updatePersonalInfo({ github: e.target.value })}
            placeholder="github.com/seshu-dev"
            className="px-4 py-3 rounded-xl border border-slate-200 text-[14px] text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all placeholder:text-slate-400"
          />
        </div>
      </div>
      <div className="flex flex-col gap-2">
        <label className="text-[13px] font-bold text-slate-800">Portfolio</label>
        <input 
          type="url" 
          value={resumeData.personalInfo.portfolio}
          onChange={(e) => updatePersonalInfo({ portfolio: e.target.value })}
          placeholder="https://seshu.dev"
          className="px-4 py-3 rounded-xl border border-slate-200 text-[14px] text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all placeholder:text-slate-400"
        />
      </div>
      <div className="flex justify-end mt-4">
        <button 
          onClick={handleNext}
          className="bg-[#6C4CF1] hover:bg-indigo-700 text-white font-bold text-[14px] px-8 py-3 rounded-xl flex items-center gap-2 transition-all shadow-[0_4px_14px_0_rgba(108,76,241,0.39)] hover:shadow-[0_6px_20px_rgba(108,76,241,0.23)]"
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
        <button onClick={handleNext} className="bg-[#6C4CF1] hover:bg-indigo-700 text-white font-bold text-[14px] px-8 py-3 rounded-xl flex items-center gap-2 transition-all shadow-[0_4px_14px_0_rgba(108,76,241,0.39)]">Next <ArrowRight size={18} strokeWidth={2.5} /></button>
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
        <button onClick={handleNext} className="bg-[#6C4CF1] hover:bg-indigo-700 text-white font-bold text-[14px] px-8 py-3 rounded-xl flex items-center gap-2 transition-all shadow-[0_4px_14px_0_rgba(108,76,241,0.39)]">Next <ArrowRight size={18} strokeWidth={2.5} /></button>
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
                  placeholder="OpportunityOS"
                  className="px-4 py-3 rounded-lg border border-slate-200 text-[14px] focus:outline-none focus:border-indigo-500"
                />
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-[13px] font-bold text-slate-800">Link</label>
                <input 
                  type="text" value={proj.link || ''}
                  onChange={(e) => updateArrayItem('projects', proj.id, { link: e.target.value })}
                  placeholder="github.com/seshu-dev/opportunityos"
                  className="px-4 py-3 rounded-lg border border-slate-200 text-[14px] focus:outline-none focus:border-indigo-500"
                />
              </div>
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-[13px] font-bold text-slate-800">Description</label>
              <input 
                type="text" value={proj.description || ''}
                onChange={(e) => updateArrayItem('projects', proj.id, { description: e.target.value })}
                placeholder="A full-stack platform..."
                className="px-4 py-3 rounded-lg border border-slate-200 text-[14px] focus:outline-none focus:border-indigo-500"
              />
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
        <button onClick={handleNext} className="bg-[#6C4CF1] hover:bg-indigo-700 text-white font-bold text-[14px] px-8 py-3 rounded-xl flex items-center gap-2 transition-all shadow-[0_4px_14px_0_rgba(108,76,241,0.39)]">Next <ArrowRight size={18} strokeWidth={2.5} /></button>
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
                  placeholder="CodeTech Solutions"
                  className="px-4 py-3 rounded-lg border border-slate-200 text-[14px] focus:outline-none focus:border-indigo-500"
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
              <label className="text-[13px] font-bold text-slate-800">Responsibilities (New line for bullet)</label>
              <textarea 
                rows={4} value={exp.responsibilities || ''}
                onChange={(e) => updateArrayItem('experience', exp.id, { responsibilities: e.target.value })}
                placeholder="Built responsive web applications..."
                className="px-4 py-3 rounded-lg border border-slate-200 text-[14px] focus:outline-none focus:border-indigo-500 resize-none"
              />
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
        <button onClick={handleNext} className="bg-[#6C4CF1] hover:bg-indigo-700 text-white font-bold text-[14px] px-8 py-3 rounded-xl flex items-center gap-2 transition-all shadow-[0_4px_14px_0_rgba(108,76,241,0.39)]">Next <ArrowRight size={18} strokeWidth={2.5} /></button>
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
              <label className="text-[13px] font-bold text-slate-800">Issuer / Detail</label>
              <input 
                type="text" value={cert.issuer || ''}
                onChange={(e) => updateArrayItem('certifications', cert.id, { issuer: e.target.value })}
                placeholder="freeCodeCamp"
                className="px-4 py-3 rounded-lg border border-slate-200 text-[14px] focus:outline-none focus:border-indigo-500"
              />
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
    </div>
  );

  return (
    <div className="flex flex-col gap-4">
      {sections.map(section => {
        const isActive = activeSection === section.id;
        const isComplete = isSectionComplete(section.id);
        const Icon = section.icon;

        return (
          <div 
            key={section.id} 
            className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden transition-all duration-300"
          >
            {/* Accordion Header */}
            <div 
              onClick={() => setActiveSection(isActive ? null : section.id)}
              className={`flex items-center justify-between p-6 cursor-pointer transition-colors ${isActive ? 'bg-white' : 'hover:bg-slate-50'}`}
            >
              <div className="flex items-center gap-5">
                <div className={`w-12 h-12 rounded-[16px] flex items-center justify-center shrink-0 ${isActive || isComplete ? 'bg-indigo-50 text-[#6C4CF1]' : 'bg-slate-50 text-slate-400'}`}>
                  <Icon size={20} strokeWidth={2.5} />
                </div>
                <div>
                  <h3 className="text-[16px] font-bold text-slate-900">{section.title}</h3>
                  <p className="text-[13px] text-slate-500 font-medium mt-0.5">{section.description}</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                {isComplete && <CheckCircle2 className="text-emerald-500" size={24} strokeWidth={2} />}
                {isActive ? <ChevronUp size={24} className="text-slate-400" /> : <ChevronDown size={24} className="text-slate-400" />}
              </div>
            </div>

            {/* Accordion Body */}
            {isActive && (
              <div className="px-6 pb-6 pt-0">
                {section.id === 'Personal Info' && renderPersonalInfoForm()}
                {section.id === 'Education' && renderEducationForm()}
                {section.id === 'Skills' && renderSkillsForm()}
                {section.id === 'Projects' && renderProjectsForm()}
                {section.id === 'Experience' && renderExperienceForm()}
                {section.id === 'Certifications' && renderCertificationsForm()}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
