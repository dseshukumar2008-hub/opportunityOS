import { useState, useEffect } from 'react';
import { useAuth } from '../../../contexts/AuthContext';
import { useProfile } from '../../../contexts/ProfileContext';
import { X, User, FileText, Code, Link as LinkIcon, ChevronDown, Globe, Save } from 'lucide-react';
import toast from 'react-hot-toast';
import { useModalBehavior } from '../../../hooks/useModalBehavior';
import { getErrorMessage } from '../../../utils/errorUtils';
import { parseSkillsString } from '../../../utils/formatUtils';

export default function EditProfileModal({ isOpen, onClose, initialData }) {
  const { updateUser } = useAuth();
  const { updateProfile } = useProfile();
  
  const [isSaving, setIsSaving] = useState(false);
  const [activeSection, setActiveSection] = useState('personal-info');
  const [editForm, setEditForm] = useState(initialData);
  const [skillInput, setSkillInput] = useState('');
  
  const modalRef = useModalBehavior(isOpen, onClose, false, isSaving);

  // Update form if initialData changes while modal is closed
  useEffect(() => {
    if (isOpen) {
      setEditForm(initialData);
      setSkillInput('');
    }
  }, [isOpen, initialData]);

  const handleSkillKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      const cleanSkill = skillInput.trim();
      if (!cleanSkill) return;
      const currentSkills = parseSkillsString(editForm.skills);
      if (currentSkills.some(s => s.toLowerCase() === cleanSkill.toLowerCase())) {
        toast.error(`${cleanSkill} is already in your skills.`);
        return;
      }
      const updatedSkillsStr = [...currentSkills, cleanSkill].join(', ');
      setEditForm({ ...editForm, skills: updatedSkillsStr });
      setSkillInput('');
    }
  };

  const handleRemoveSkillEdit = (skillToRemove) => {
    const updatedSkillsStr = (editForm.skills || '')
      .split(',')
      .map(s => s.trim())
      .filter(s => s && s !== skillToRemove)
      .join(', ');
    setEditForm({ ...editForm, skills: updatedSkillsStr });
    toast.success(`Removed staged skill: ${skillToRemove}`);
  };

  const scrollToSection = (id) => {
    setActiveSection(id);
  };

  const handleSave = async () => {
    if (!editForm.name?.trim()) {
      toast.error("Full name cannot be empty.");
      return;
    }
    
    const urlPattern = /^(https?:..)?([.a-z.-]+).([a-z.]{2,6})([.. .-]*)*.?$/i;
    if (editForm.socialLinks?.linkedin && !urlPattern.test(editForm.socialLinks.linkedin.trim())) {
      toast.error("Please enter a valid LinkedIn URL (e.g. linkedin.com/in/username).");
      return;
    }
    if (editForm.socialLinks?.github && !urlPattern.test(editForm.socialLinks.github.trim())) {
      toast.error("Please enter a valid GitHub URL (e.g. github.com/username).");
      return;
    }
    if (editForm.socialLinks?.portfolio && !urlPattern.test(editForm.socialLinks.portfolio.trim())) {
      toast.error("Please enter a valid Portfolio URL.");
      return;
    }

    setIsSaving(true);
    try {
      const skillsArray = parseSkillsString(editForm.skills);
      
      const res = await updateProfile({
        name: editForm.name,
        phone: editForm.phone,
        college: editForm.college,
        branch: editForm.branch,
        year: editForm.year,
        expectedGraduation: editForm.expectedGraduation,
        country: editForm.country,
        state: editForm.state,
        city: editForm.city,
        bio: editForm.bio,
        skills: skillsArray,
        socialLinks: editForm.socialLinks
      });
      
      if (res?.error) {
        throw res.error;
      }
      
      await updateUser({ name: editForm.name });
      
      toast.success("Profile updated successfully!");
      onClose();
    } catch (error) {
      console.error("Profile update failed in UI:", error);
      toast.error(getErrorMessage(error, "Failed to update profile. Please try again."));
    } finally {
      setIsSaving(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" aria-hidden="true" onClick={() => !isSaving && onClose()}></div>
      
      <div 
        ref={modalRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="edit-profile-title"
        className="relative bg-white rounded-2xl shadow-[0_20px_60px_-15px_rgba(0,0,0,0.1)] w-full max-w-[1200px] max-h-[90vh] overflow-hidden flex flex-col animate-in fade-in zoom-in-95 duration-200 outline-none"
      >
        
        {/* Header */}
        <div className="shrink-0 bg-white p-8 pb-6 relative z-10">
          <h2 id="edit-profile-title" className="text-3xl font-black tracking-tight text-slate-900">Edit Profile</h2>
          <p className="text-[14px] text-slate-500 mt-1">Update your personal information and preferences</p>
          
          <button 
            aria-label="Close"
            onClick={() => !isSaving && onClose()}
            disabled={isSaving}
            className="absolute top-8 right-8 w-9 h-9 flex items-center justify-center rounded-full bg-slate-100 text-slate-500 hover:bg-slate-200 hover:text-slate-900 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
          >
            <X size={18} />
          </button>
        </div>
        
        <div className="w-full border-b border-slate-100"></div>
        
        {/* Body */}
        <div className="flex-1 overflow-hidden flex flex-col lg:flex-row">
          
          {/* Left Sidebar */}
          <div className="w-full lg:w-[240px] shrink-0 border-r border-slate-100 p-6 flex flex-col gap-2 overflow-y-auto">
            <button 
              onClick={() => scrollToSection('personal-info')}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-semibold text-[14px] transition-colors ${activeSection === 'personal-info' ? 'bg-[#F3F0FF] text-[#6C4CF1]' : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'}`}
            >
              <User size={18} />
              Personal Info
            </button>
            <button 
              onClick={() => scrollToSection('about-me')}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-semibold text-[14px] transition-colors ${activeSection === 'about-me' ? 'bg-[#F3F0FF] text-[#6C4CF1]' : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'}`}
            >
              <FileText size={18} />
              About Me
            </button>
            <button 
              onClick={() => scrollToSection('skills')}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-semibold text-[14px] transition-colors ${activeSection === 'skills' ? 'bg-[#F3F0FF] text-[#6C4CF1]' : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'}`}
            >
              <Code size={18} />
              Skills
            </button>
            <button 
              onClick={() => scrollToSection('links')}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-semibold text-[14px] transition-colors ${activeSection === 'links' ? 'bg-[#F3F0FF] text-[#6C4CF1]' : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'}`}
            >
              <LinkIcon size={18} />
              Links
            </button>
          </div>

          {/* Right Content Area */}
          <div className="flex-1 p-8 overflow-x-hidden overflow-y-auto min-w-0 bg-white relative">
            {(() => {
              switch (activeSection) {
                case 'personal-info':
                  return (
                    <div id="personal-info">
                      <h3 className="text-[16px] font-bold text-slate-900 mb-6">Personal Information</h3>
                      
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-6 mb-8">
                        <div>
                          <label htmlFor="profile-name" className="block text-[13px] font-semibold text-slate-700 mb-2">Full Name</label>
                          <input 
                            id="profile-name"
                            type="text" 
                            value={editForm.name} 
                            onChange={e => setEditForm({...editForm, name: e.target.value})}
                            className="w-full h-[52px] px-4 bg-white border border-slate-200 focus:border-[#6C4CF1] rounded-xl text-[14px] outline-none transition-all text-slate-700"
                          />
                        </div>
                        <div>
                          <label htmlFor="profile-email" className="block text-[13px] font-semibold text-slate-700 mb-2">Email Address</label>
                          <input 
                            id="profile-email"
                            type="email" 
                            value={editForm.email} 
                            onChange={e => setEditForm({...editForm, email: e.target.value})}
                            className="w-full h-[52px] px-4 bg-white border border-slate-200 focus:border-[#6C4CF1] rounded-xl text-[14px] outline-none transition-all text-slate-700"
                          />
                        </div>
                        
                        <div>
                          <label htmlFor="profile-college" className="block text-[13px] font-semibold text-slate-700 mb-2">College/University</label>
                          <input 
                            id="profile-college"
                            type="text" 
                            value={editForm.college} 
                            onChange={e => setEditForm({...editForm, college: e.target.value})}
                            className="w-full h-[52px] px-4 bg-white border border-slate-200 focus:border-[#6C4CF1] rounded-xl text-[14px] outline-none transition-all text-slate-700"
                          />
                        </div>
                        <div>
                          <label htmlFor="profile-branch" className="block text-[13px] font-semibold text-slate-700 mb-2">Branch/Major</label>
                          <div className="relative">
                            <select 
                              id="profile-branch"
                              value={editForm.branch || ""} 
                              onChange={e => setEditForm({...editForm, branch: e.target.value})}
                              className="w-full h-[52px] px-4 pr-10 bg-white border border-slate-200 focus:border-[#6C4CF1] rounded-xl text-[14px] outline-none transition-all text-slate-700 appearance-none"
                            >
                              <option value="" disabled>Select a branch</option>
                              <option value="Computer Science">Computer Science</option>
                              <option value="AI / ML">AI / ML</option>
                              <option value="Data Science">Data Science</option>
                              <option value="Cyber Security">Cyber Security</option>
                              <option value="Electronics & Comm.">Electronics & Comm.</option>
                              <option value="Electrical Eng.">Electrical Eng.</option>
                              <option value="Mechanical Eng.">Mechanical Eng.</option>
                              <option value="Civil Eng.">Civil Eng.</option>
                            </select>
                            <ChevronDown size={18} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                          </div>
                        </div>
                        
                        <div>
                          <label htmlFor="profile-grad-year" className="block text-[13px] font-semibold text-slate-700 mb-2">Graduation Year</label>
                          <div className="relative">
                            <select 
                              id="profile-grad-year"
                              value={editForm.expectedGraduation || "2029"}
                              onChange={e => setEditForm({...editForm, expectedGraduation: e.target.value})}
                              className="w-full h-[52px] px-4 pr-10 bg-white border border-slate-200 focus:border-[#6C4CF1] rounded-xl text-[14px] outline-none transition-all text-slate-700 appearance-none"
                            >
                              <option>2026</option>
                              <option>2027</option>
                              <option>2028</option>
                              <option>2029</option>
                            </select>
                            <ChevronDown size={18} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                          </div>
                        </div>
                        <div>
                          <label htmlFor="profile-current-year" className="block text-[13px] font-semibold text-slate-700 mb-2">Current Year</label>
                          <div className="relative">
                            <select 
                              id="profile-current-year"
                              value={editForm.year}
                              onChange={e => setEditForm({...editForm, year: e.target.value})}
                              className="w-full h-[52px] px-4 pr-10 bg-white border border-slate-200 focus:border-[#6C4CF1] rounded-xl text-[14px] outline-none transition-all text-slate-700 appearance-none"
                            >
                              <option>1st Year</option>
                              <option>2nd Year</option>
                              <option>3rd Year</option>
                              <option>4th Year</option>
                            </select>
                            <ChevronDown size={18} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                          </div>
                        </div>
                        
                        <div>
                          <label htmlFor="profile-country" className="block text-[13px] font-semibold text-slate-700 mb-2">Country</label>
                          <input 
                            id="profile-country"
                            type="text" 
                            value={editForm.country} 
                            onChange={e => setEditForm({...editForm, country: e.target.value})}
                            className="w-full h-[52px] px-4 bg-white border border-slate-200 focus:border-[#6C4CF1] rounded-xl text-[14px] outline-none transition-all text-slate-700"
                          />
                        </div>
                        <div>
                          <label htmlFor="profile-state" className="block text-[13px] font-semibold text-slate-700 mb-2">State/Province</label>
                          <input 
                            id="profile-state"
                            type="text" 
                            value={editForm.state} 
                            onChange={e => setEditForm({...editForm, state: e.target.value})}
                            className="w-full h-[52px] px-4 bg-white border border-slate-200 focus:border-[#6C4CF1] rounded-xl text-[14px] outline-none transition-all text-slate-700"
                          />
                        </div>
                        <div>
                          <label htmlFor="profile-city" className="block text-[13px] font-semibold text-slate-700 mb-2">City</label>
                          <input 
                            id="profile-city"
                            type="text" 
                            value={editForm.city} 
                            onChange={e => setEditForm({...editForm, city: e.target.value})}
                            className="w-full h-[52px] px-4 bg-white border border-slate-200 focus:border-[#6C4CF1] rounded-xl text-[14px] outline-none transition-all text-slate-700"
                          />
                        </div>
                      </div>
                    </div>
                  );
                case 'skills':
                  return (
                    <div id="skills">
                      <h3 className="text-[16px] font-bold text-slate-900 mb-6">Skills</h3>
                      <label htmlFor="profile-skills" className="block text-[13px] font-semibold text-slate-700 mb-2">Skills Editor (Type and press Enter)</label>
                      <div className="p-4 bg-white border border-slate-200 rounded-xl flex flex-wrap gap-2 items-center min-h-[52px]">
                        {editForm.skills && editForm.skills.split(',').map((skill, index) => skill.trim() && (
                          <span key={index} className="px-3 py-1.5 bg-[#F3F0FF] text-[#6C4CF1] rounded-[8px] text-[13px] font-semibold flex items-center gap-1.5">
                            {skill.trim()}
                            <button 
                              aria-label={`Remove ${skill.trim()}`}
                              type="button" 
                              onClick={() => handleRemoveSkillEdit(skill.trim())}
                              className="hover:bg-[#E5DFFF] rounded-full p-0.5 transition-colors cursor-pointer"
                            >
                              <X size={12} />
                            </button>
                          </span>
                        ))}
                        <input 
                          id="profile-skills"
                          type="text" 
                          value={skillInput}
                          onChange={e => setSkillInput(e.target.value)}
                          onKeyDown={handleSkillKeyDown}
                          className="flex-1 min-w-[120px] bg-transparent outline-none text-[14px] text-slate-700" 
                          placeholder="Type a skill and press Enter..."
                        />
                      </div>
                    </div>
                  );
                case 'about-me':
                  return (
                    <div id="about-me">
                      <h3 className="text-[16px] font-bold text-slate-900 mb-6">About Me</h3>
                      <label htmlFor="profile-bio" className="block text-[13px] font-semibold text-slate-700 mb-4">Bio</label>
                      <textarea 
                        id="profile-bio"
                        value={editForm.bio} 
                        onChange={e => setEditForm({...editForm, bio: e.target.value})}
                        rows={6}
                        className="w-full p-4 bg-white border border-slate-200 focus:border-[#6C4CF1] rounded-xl text-[14px] outline-none transition-all resize-none text-slate-600 leading-[1.7]"
                      ></textarea>
                    </div>
                  );
                case 'links':
                  return (
                    <div id="links">
                      <h3 className="text-[16px] font-bold text-slate-900 mb-6">Social Links</h3>
                      
                      <div className="space-y-4">
                        <div>
                          <label className="block text-[12px] font-semibold text-slate-700 mb-2">LinkedIn</label>
                          <div className="relative">
                            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
                              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path><rect x="2" y="9" width="4" height="12"></rect><circle cx="4" cy="4" r="2"></circle></svg>
                            </div>
                            <input 
                              type="text" 
                              value={editForm.socialLinks?.linkedin || ''}
                              onChange={e => setEditForm({ ...editForm, socialLinks: { ...editForm.socialLinks, linkedin: e.target.value } })}
                              placeholder="https://linkedin.com/in/yourprofile"
                              className="w-full h-[48px] pl-11 pr-4 bg-white border border-slate-200 focus:border-[#6C4CF1] rounded-xl text-[13px] outline-none transition-all text-slate-500"
                            />
                          </div>
                        </div>
                        
                        <div>
                          <label className="block text-[12px] font-semibold text-slate-700 mb-2">GitHub</label>
                          <div className="relative">
                            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
                              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4"></path><path d="M9 18c-4.51 2-5-2-7-2"></path></svg>
                            </div>
                            <input 
                              type="text" 
                              value={editForm.socialLinks?.github || ''}
                              onChange={e => setEditForm({ ...editForm, socialLinks: { ...editForm.socialLinks, github: e.target.value } })}
                              placeholder="https://github.com/yourusername"
                              className="w-full h-[48px] pl-11 pr-4 bg-white border border-slate-200 focus:border-[#6C4CF1] rounded-xl text-[13px] outline-none transition-all text-slate-500"
                            />
                          </div>
                        </div>
                        
                        <div>
                          <label className="block text-[12px] font-semibold text-slate-700 mb-2">Portfolio</label>
                          <div className="relative">
                            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
                              <Globe size={18} />
                            </div>
                            <input 
                              type="text" 
                              value={editForm.socialLinks?.portfolio || ''}
                              onChange={e => setEditForm({ ...editForm, socialLinks: { ...editForm.socialLinks, portfolio: e.target.value } })}
                              placeholder="https://yourportfolio.com"
                              className="w-full h-[48px] pl-11 pr-4 bg-white border border-slate-200 focus:border-[#6C4CF1] rounded-xl text-[13px] outline-none transition-all text-slate-500"
                            />
                          </div>
                        </div>
                        
                        <div>
                          <label className="block text-[12px] font-semibold text-slate-700 mb-2">Twitter (X)</label>
                          <div className="relative">
                            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
                              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 4l11.733 16h4.267l-11.733 -16z" /><path d="M4 20l6.768 -6.768m2.46 -2.46l6.772 -6.772" /></svg>
                            </div>
                            <input 
                              type="text" 
                              value={editForm.socialLinks?.twitter || ''}
                              onChange={e => setEditForm({ ...editForm, socialLinks: { ...editForm.socialLinks, twitter: e.target.value } })}
                              placeholder="https://twitter.com/yourusername"
                              className="w-full h-[48px] pl-11 pr-4 bg-white border border-slate-200 focus:border-[#6C4CF1] rounded-xl text-[13px] outline-none transition-all text-slate-500"
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                default:
                  return null;
              }
            })()}
          </div>
        </div>

        {/* Footer Action Bar */}
        <div className="shrink-0 bg-white border-t border-slate-100 p-6 flex items-center justify-end gap-4 z-10">
          <button 
            onClick={onClose}
            disabled={isSaving}
            className="h-[48px] px-8 text-[14px] font-bold text-slate-700 bg-white border border-slate-200 hover:bg-slate-50 rounded-xl transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
          >
            Cancel
          </button>
          <button 
            disabled={isSaving}
            onClick={handleSave}
            className="flex items-center justify-center gap-2 h-[48px] px-8 text-[14px] font-bold text-white bg-gradient-to-r from-[#6C4CF1] to-[#5538EE] hover:from-[#5A3EE0] hover:to-[#4529CF] rounded-xl transition-all shadow-[0_4px_20px_-4px_rgba(108,76,241,0.4)] disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSaving ? (
              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <Save size={16} />
            )}
            {isSaving ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
        
      </div>
    </div>
  );
}
