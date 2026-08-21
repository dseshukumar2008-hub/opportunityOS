import { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useProfile } from '../../contexts/ProfileContext';
import { 
  User, Mail, BookOpen, GraduationCap, Calendar, 
  MapPin, Edit, FileText, Award, Bookmark, X,
  Code, BarChart3, Trophy, Link as LinkIcon, 
// eslint-disable-next-line no-unused-vars
  Globe, Save, ChevronDown, Check
} from 'lucide-react';
import CareerReadinessPanel from '../../components/dashboard/CareerReadinessPanel';
import { getUserFullName } from '../../utils/userUtils';
import toast from 'react-hot-toast';
import { useDashboardInsights } from '../../hooks/useDashboardInsights';
import { useResumeInsights } from '../../hooks/useResumeInsights';
import { useCareerReadiness } from '../../hooks/useCareerReadiness';
import { useGoals } from '../../contexts/GoalContext';

export default function ProfilePage() {
  const { user, updateUser } = useAuth();
  const { profile, updateProfile } = useProfile();
  const { profileCompletion } = useDashboardInsights();
  const { hasInsights, atsScore } = useResumeInsights();
  const { score: readinessScore } = useCareerReadiness();
  const { goals } = useGoals();
  
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('personal-info');
  
  const profileData = {
    name: profile?.profile?.fullName || user?.name || getUserFullName(user, null),
    email: user?.email || '',
    phone: profile?.profile?.phone || user?.phone || '',
    college: profile?.education?.university || user?.college || '',
    branch: profile?.education?.branch || user?.branch || '',
    year: profile?.education?.currentYear || user?.year || '',
    expectedGraduation: profile?.education?.graduationYear || user?.expectedGraduation || '',
    country: user?.country || user?.profile?.country || '',
    state: user?.state || user?.profile?.state || '',
    city: user?.city || user?.profile?.city || '',
    location: user?.location || '',
    bio: profile?.about?.bio || user?.bio || '',
    skills: profile?.skills?.join(', ') || user?.skills || '',
    socialLinks: {
      linkedin: profile?.socialLinks?.linkedin || '',
      github: profile?.socialLinks?.github || '',
      portfolio: profile?.socialLinks?.portfolio || '',
      twitter: profile?.socialLinks?.twitter || ''
    }
  };

  const [editForm, setEditForm] = useState(profileData);
  const [skillInput, setSkillInput] = useState('');

  const handleEditClick = () => {
    setEditForm(profileData);
    setSkillInput('');
    setIsEditModalOpen(true);
  };

  const handleSkillKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      const cleanSkill = skillInput.trim();
      if (!cleanSkill) return;
      const currentSkills = editForm.skills ? editForm.skills.split(',').map(s => s.trim()).filter(Boolean) : [];
      if (currentSkills.some(s => s.toLowerCase() === cleanSkill.toLowerCase())) {
        toast.error(`${cleanSkill} is already in your skills.`);
        return;
      }
      const updatedSkillsStr = [...currentSkills, cleanSkill].join(', ');
      setEditForm({ ...editForm, skills: updatedSkillsStr });
      setSkillInput('');
    }
  };

  useEffect(() => {
    if (!isEditModalOpen) return;
    
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          setActiveSection(entry.target.id);
        }
      });
    }, { rootMargin: '-20% 0px -60% 0px' });

    const sections = ['personal-info', 'skills', 'about-me', 'links'];
    
    // Slight delay to allow DOM to render modal content
    const timeoutId = setTimeout(() => {
      sections.forEach(id => {
        const el = document.getElementById(id);
        if (el) observer.observe(el);
      });
    }, 100);

    return () => {
      clearTimeout(timeoutId);
      observer.disconnect();
    };
  }, [isEditModalOpen]);

  const scrollToSection = (id) => {
    setActiveSection(id);
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const handleRemoveSkillEdit = (skillToRemove) => {
    const currentSkills = editForm.skills ? editForm.skills.split(',').map(s => s.trim()).filter(Boolean) : [];
    const updatedSkillsStr = currentSkills.filter(s => s !== skillToRemove).join(', ');
    setEditForm({ ...editForm, skills: updatedSkillsStr });
    toast.success(`Removed staged skill: ${skillToRemove}`);
  };

  const skillsList = profileData.skills ? profileData.skills.split(',').map(s => s.trim()).filter(Boolean) : [];
  
  const completedGoalsCount = goals?.filter(g => g.status === 'Completed' || g.currentValue >= g.targetValue)?.length || 0;
  
  const stats = [
    { label: 'Resume Score', value: hasInsights && atsScore ? `${atsScore}%` : 'Not analyzed', icon: FileText, color: 'text-[#6C4CF1]', bg: 'bg-[#F4F2FF]' },
    { label: 'Profile Completion', value: `${profileCompletion?.score ?? 0}%`, icon: Trophy, color: 'text-[#6C4CF1]', bg: 'bg-[#F4F2FF]' },
    { label: 'AI Readiness', value: `${readinessScore || 0}%`, icon: BarChart3, color: 'text-[#6C4CF1]', bg: 'bg-[#F4F2FF]' },
    { label: 'Goals Completed', value: goals?.length > 0 ? `${completedGoalsCount}` : 'No goals tracked', icon: Bookmark, color: 'text-[#6C4CF1]', bg: 'bg-[#F4F2FF]' },
  ];

  return (
    <div className="max-w-[1200px] mx-auto pb-10 p-4 lg:p-6">
      
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">My Profile</h1>
          <p className="text-[14px] text-slate-500 mt-1">Manage your profile and track your progress</p>
        </div>
        <button 
          onClick={handleEditClick}
          className="flex items-center gap-2 bg-[#6C4CF1] hover:bg-[#5b3fda] text-white px-5 py-2.5 rounded-xl text-[14px] font-bold transition-all shadow-[0_2px_10px_rgba(108,76,241,0.2)] w-full sm:w-auto justify-center"
        >
          <Edit size={16} />
          Edit Profile
        </button>
      </div>

      <div className="space-y-6">
        
        {/* Profile Hero Card */}
        <div className="bg-white rounded-[16px] border border-slate-100 shadow-sm p-8">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-8">
            {/* Left Side: Avatar & Basic Info */}
            <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
              <div className="relative shrink-0">
                <img 
                  src={user?.photoURL || `https://api.dicebear.com/7.x/notionists/svg?seed=${getUserFullName(user, null)}&backgroundColor=e2e8f0`} 
                  alt="Profile Avatar" 
                  className="w-[120px] h-[120px] rounded-full border border-slate-200 bg-slate-100 object-cover"
                />
              </div>
              
              <div className="text-center sm:text-left mt-2">
                <h2 className="text-[24px] font-bold text-slate-900 tracking-tight mb-2">{profileData.name}</h2>
                <div className="inline-block px-3 py-1 bg-[#F4F2FF] text-[#6C4CF1] rounded-[6px] text-[12px] font-bold mb-4">
                  Student
                </div>
                <div className="flex flex-col gap-2.5 text-[14px] text-slate-600 font-medium">
                  <span className="flex items-center gap-2.5 justify-center sm:justify-start">
                    <Mail size={16} className="text-slate-400" /> {profileData.email}
                  </span>
                </div>
              </div>
            </div>
            
            {/* Right Side: Academic Info */}
            <div className="flex flex-col gap-4 text-[14px] font-medium text-slate-600 lg:pl-12 lg:border-l lg:border-slate-100 lg:min-w-[280px]">
              <span className="flex items-center gap-3">
                <GraduationCap size={18} className="text-slate-400 shrink-0" /> {profileData.college}
              </span>
              <span className="flex items-center gap-3">
                <BookOpen size={18} className="text-slate-400 shrink-0" /> {profileData.branch}
              </span>
              <span className="flex items-center gap-3">
                <Calendar size={18} className="text-slate-400 shrink-0" /> {profileData.year}
              </span>
              <span className="flex items-center gap-3">
                <Award size={18} className="text-slate-400 shrink-0" /> 2025 - {profileData.expectedGraduation}
              </span>
            </div>
          </div>
        </div>

        {/* Career Readiness Panel */}
        <CareerReadinessPanel />

        {/* Action Buttons */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          
          {/* Personal Information (Left) */}
          <div className="bg-white rounded-[16px] border border-slate-100 shadow-sm p-7 flex flex-col">
            <div className="flex items-center gap-3 mb-6">
              <div className="text-[#6C4CF1] bg-[#F4F2FF] w-8 h-8 rounded-lg flex items-center justify-center">
                <User size={16} />
              </div>
              <h3 className="text-[16px] font-bold text-slate-900">Personal Information</h3>
            </div>
            
            <div className="flex-1 flex flex-col">
              <div className="flex justify-between items-center py-4 border-b border-slate-100">
                <span className="text-[13px] font-bold text-slate-900">Full Name</span>
                <span className="text-[13px] text-slate-500 font-medium">{profileData.name}</span>
              </div>
              <div className="flex justify-between items-center py-4 border-b border-slate-100">
                <span className="text-[13px] font-bold text-slate-900">Email</span>
                <span className="text-[13px] text-slate-500 font-medium">{profileData.email}</span>
              </div>
              <div className="flex justify-between items-center py-4 border-b border-slate-100">
                <span className="text-[13px] font-bold text-slate-900">Phone</span>
                <span className="text-[13px] text-slate-500 font-medium">{profileData.phone}</span>
              </div>
              <div className="flex justify-between items-center py-4 border-b border-slate-100">
                <span className="text-[13px] font-bold text-slate-900">College</span>
                <span className="text-[13px] text-slate-500 font-medium">{profileData.college}</span>
              </div>
              <div className="flex justify-between items-center py-4 border-b border-slate-100">
                <span className="text-[13px] font-bold text-slate-900">Branch</span>
                <span className="text-[13px] text-slate-500 font-medium">{profileData.branch}</span>
              </div>
              <div className="flex justify-between items-center py-4 border-b border-slate-100">
                <span className="text-[13px] font-bold text-slate-900">Year</span>
                <span className="text-[13px] text-slate-500 font-medium">{profileData.year}</span>
              </div>
              <div className="flex justify-between items-center py-4">
                <span className="text-[13px] font-bold text-slate-900">Expected Graduation</span>
                <span className="text-[13px] text-slate-500 font-medium">{profileData.expectedGraduation}</span>
              </div>
            </div>
          </div>

          {/* Right Column (Skills & About Me) */}
          <div className="space-y-6 flex flex-col">
            
            {/* Skills */}
            <div className="bg-white rounded-[16px] border border-slate-100 shadow-sm p-7">
              <div className="flex items-center gap-3 mb-6">
                <div className="text-[#6C4CF1] bg-[#F4F2FF] w-8 h-8 rounded-lg flex items-center justify-center">
                  <Code size={16} />
                </div>
                <h3 className="text-[16px] font-bold text-slate-900">Skills</h3>
              </div>
              <div className="flex flex-wrap gap-2.5">
                {skillsList.map((skill, index) => (
                  <span 
                    key={index}
                    className="px-4 py-1.5 bg-[#F4F2FF] text-[#6C4CF1] text-[13px] font-bold rounded-[8px] cursor-default"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>

            {/* About Me */}
            <div className="bg-white rounded-[16px] border border-slate-100 shadow-sm p-7 flex-1">
              <div className="flex items-center gap-3 mb-5">
                <div className="text-[#6C4CF1] bg-[#F4F2FF] w-8 h-8 rounded-lg flex items-center justify-center">
                  <User size={16} />
                </div>
                <h3 className="text-[16px] font-bold text-slate-900">About Me</h3>
              </div>
              <p className="text-[13px] text-slate-500 font-medium leading-[1.7]">
                {profileData.bio}
              </p>
            </div>

            {/* Social Links */}
            {(profileData.socialLinks?.linkedin || profileData.socialLinks?.github || profileData.socialLinks?.portfolio || profileData.socialLinks?.twitter) && (
              <div className="bg-white rounded-[16px] border border-slate-100 shadow-sm p-7">
                <div className="flex items-center gap-3 mb-6">
                  <div className="text-[#6C4CF1] bg-[#F4F2FF] w-8 h-8 rounded-lg flex items-center justify-center">
                    <Globe size={16} />
                  </div>
                  <h3 className="text-[16px] font-bold text-slate-900">Social Links</h3>
                </div>
                <div className="flex flex-wrap gap-3">
                  {profileData.socialLinks.linkedin && (
                    <a href={profileData.socialLinks.linkedin} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 px-4 py-2 bg-slate-50 hover:bg-slate-100 text-slate-700 text-[13px] font-bold rounded-xl transition-colors border border-slate-200">
                      <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path><rect x="2" y="9" width="4" height="12"></rect><circle cx="4" cy="4" r="2"></circle></svg>
                      LinkedIn
                    </a>
                  )}
                  {profileData.socialLinks.github && (
                    <a href={profileData.socialLinks.github} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 px-4 py-2 bg-slate-50 hover:bg-slate-100 text-slate-700 text-[13px] font-bold rounded-xl transition-colors border border-slate-200">
                      <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4"></path><path d="M9 18c-4.51 2-5-2-7-2"></path></svg>
                      GitHub
                    </a>
                  )}
                  {profileData.socialLinks.portfolio && (
                    <a href={profileData.socialLinks.portfolio} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 px-4 py-2 bg-slate-50 hover:bg-slate-100 text-slate-700 text-[13px] font-bold rounded-xl transition-colors border border-slate-200">
                      <Globe size={14} />
                      Portfolio
                    </a>
                  )}
                  {profileData.socialLinks.twitter && (
                    <a href={profileData.socialLinks.twitter} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 px-4 py-2 bg-slate-50 hover:bg-slate-100 text-slate-700 text-[13px] font-bold rounded-xl transition-colors border border-slate-200">
                      <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 4l11.733 16h4.267l-11.733 -16z" /><path d="M4 20l6.768 -6.768m2.46 -2.46l6.772 -6.772" /></svg>
                      Twitter (X)
                    </a>
                  )}
                </div>
              </div>
            )}

          </div>
        </div>

        {/* Activity Overview */}
        <div className="bg-white rounded-[16px] border border-slate-100 shadow-sm p-7">
          <div className="flex items-center gap-3 mb-6">
            <div className="text-[#6C4CF1] bg-[#F4F2FF] w-8 h-8 rounded-lg flex items-center justify-center">
              <BarChart3 size={16} />
            </div>
            <h3 className="text-[16px] font-bold text-slate-900">Activity Overview</h3>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {stats.map((stat, i) => {
              const Icon = stat.icon;
              return (
                <div key={i} className="bg-white border border-slate-100 shadow-[0_2px_10px_rgba(0,0,0,0.02)] rounded-[12px] p-5 flex items-start gap-4">
                  <div className={`w-12 h-12 rounded-[10px] ${stat.bg} ${stat.color} flex items-center justify-center shrink-0`}>
                    <Icon size={22} strokeWidth={2} />
                  </div>
                  <div className="flex flex-col pt-0.5">
                    <span className="text-2xl font-bold text-slate-900 leading-none mb-1.5">{stat.value}</span>
                    <span className="text-[12px] font-medium text-slate-500 leading-tight">
                      {stat.label.split(' ')[0]}<br/>{stat.label.split(' ')[1]}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

      </div>

      {/* Edit Profile Modal */}
      {isEditModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={() => setIsEditModalOpen(false)}></div>
          <div className="relative bg-white rounded-2xl shadow-[0_20px_60px_-15px_rgba(0,0,0,0.1)] w-full max-w-[1200px] max-h-[90vh] overflow-hidden flex flex-col animate-in fade-in zoom-in-95 duration-200">
            
            {/* Header */}
            <div className="shrink-0 bg-white p-8 pb-6 relative z-10">
              <h2 className="text-[22px] font-bold text-slate-900 tracking-tight">Edit Profile</h2>
              <p className="text-[14px] text-slate-500 mt-1">Update your personal information and preferences</p>
              
              <button 
                onClick={() => setIsEditModalOpen(false)}
                className="absolute top-8 right-8 w-9 h-9 flex items-center justify-center rounded-full bg-slate-100 text-slate-500 hover:bg-slate-200 hover:text-slate-900 transition-colors"
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

              {/* Center Column */}
              <div className="flex-1 p-8 overflow-y-auto border-r border-slate-100 min-w-0 scroll-smooth">
                <div id="personal-info" className="scroll-mt-8">
                  <h3 className="text-[16px] font-bold text-slate-900 mb-6">Personal Information</h3>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-6 mb-8">
                  <div>
                    <label className="block text-[13px] font-semibold text-slate-700 mb-2">Full Name</label>
                    <input 
                      type="text" 
                      value={editForm.name} 
                      onChange={e => setEditForm({...editForm, name: e.target.value})}
                      className="w-full h-[52px] px-4 bg-white border border-slate-200 focus:border-[#6C4CF1] rounded-xl text-[14px] outline-none transition-all text-slate-700"
                    />
                  </div>
                  <div>
                    <label className="block text-[13px] font-semibold text-slate-700 mb-2">Email Address</label>
                    <input 
                      type="email" 
                      value={editForm.email} 
                      onChange={e => setEditForm({...editForm, email: e.target.value})}
                      className="w-full h-[52px] px-4 bg-white border border-slate-200 focus:border-[#6C4CF1] rounded-xl text-[14px] outline-none transition-all text-slate-700"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-[13px] font-semibold text-slate-700 mb-2">College/University</label>
                    <input 
                      type="text" 
                      value={editForm.college} 
                      onChange={e => setEditForm({...editForm, college: e.target.value})}
                      className="w-full h-[52px] px-4 bg-white border border-slate-200 focus:border-[#6C4CF1] rounded-xl text-[14px] outline-none transition-all text-slate-700"
                    />
                  </div>
                  <div>
                    <label className="block text-[13px] font-semibold text-slate-700 mb-2">Branch/Major</label>
                    <div className="relative">
                      <select 
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
                    <label className="block text-[13px] font-semibold text-slate-700 mb-2">Graduation Year</label>
                    <div className="relative">
                      <select 
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
                    <label className="block text-[13px] font-semibold text-slate-700 mb-2">Current Year</label>
                    <div className="relative">
                      <select 
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
                    <label className="block text-[13px] font-semibold text-slate-700 mb-2">Country</label>
                    <input 
                      type="text" 
                      value={editForm.country} 
                      onChange={e => setEditForm({...editForm, country: e.target.value})}
                      className="w-full h-[52px] px-4 bg-white border border-slate-200 focus:border-[#6C4CF1] rounded-xl text-[14px] outline-none transition-all text-slate-700"
                    />
                  </div>
                  <div>
                    <label className="block text-[13px] font-semibold text-slate-700 mb-2">State/Province</label>
                    <input 
                      type="text" 
                      value={editForm.state} 
                      onChange={e => setEditForm({...editForm, state: e.target.value})}
                      className="w-full h-[52px] px-4 bg-white border border-slate-200 focus:border-[#6C4CF1] rounded-xl text-[14px] outline-none transition-all text-slate-700"
                    />
                  </div>
                  <div>
                    <label className="block text-[13px] font-semibold text-slate-700 mb-2">City</label>
                    <input 
                      type="text" 
                      value={editForm.city} 
                      onChange={e => setEditForm({...editForm, city: e.target.value})}
                      className="w-full h-[52px] px-4 bg-white border border-slate-200 focus:border-[#6C4CF1] rounded-xl text-[14px] outline-none transition-all text-slate-700"
                    />
                  </div>
                </div>
                </div>
                
                <div className="w-full border-b border-slate-100 mb-8"></div>

                <div id="skills" className="mb-8 scroll-mt-8">
                  <label className="block text-[13px] font-semibold text-slate-700 mb-2">Skills Editor (Type and press Enter)</label>
                  <div className="p-4 bg-white border border-slate-200 rounded-xl flex flex-wrap gap-2 items-center min-h-[52px]">
                    {editForm.skills.split(',').map((skill, index) => skill.trim() && (
                      <span key={index} className="px-3 py-1.5 bg-[#F3F0FF] text-[#6C4CF1] rounded-[8px] text-[13px] font-semibold flex items-center gap-1.5">
                        {skill.trim()}
                        <button 
                          type="button" 
                          onClick={() => handleRemoveSkillEdit(skill.trim())}
                          className="hover:bg-[#E5DFFF] rounded-full p-0.5 transition-colors cursor-pointer"
                        >
                          <X size={12} />
                        </button>
                      </span>
                    ))}
                    <input 
                      type="text" 
                      value={skillInput}
                      onChange={e => setSkillInput(e.target.value)}
                      onKeyDown={handleSkillKeyDown}
                      className="flex-1 min-w-[120px] bg-transparent outline-none text-[14px] text-slate-700" 
                      placeholder="Type a skill and press Enter..."
                    />
                  </div>
                </div>

                <div id="about-me" className="mb-8 scroll-mt-8">
                  <label className="block text-[13px] font-semibold text-slate-700 mb-4">About Me (Bio)</label>
                  <textarea 
                    value={editForm.bio} 
                    onChange={e => setEditForm({...editForm, bio: e.target.value})}
                    rows={6}
                    className="w-full p-4 bg-white border border-slate-200 focus:border-[#6C4CF1] rounded-xl text-[14px] outline-none transition-all resize-none text-slate-600 leading-[1.7]"
                  ></textarea>
                </div>
              </div>

              {/* Right Column */}
              <div className="w-full lg:w-[340px] shrink-0 bg-[#FAFAFA] p-8 overflow-y-auto scroll-smooth">

                
                <div id="links" className="scroll-mt-8">
                  <h3 className="text-[14px] font-semibold text-slate-900 mb-6">Social Links</h3>
                  
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

              </div>

            </div>

            {/* Footer Action Bar */}
            <div className="shrink-0 bg-white border-t border-slate-100 p-6 flex items-center justify-end gap-4 z-10">
              <button 
                onClick={() => setIsEditModalOpen(false)}
                className="h-[48px] px-8 text-[14px] font-bold text-slate-700 bg-white border border-slate-200 hover:bg-slate-50 rounded-xl transition-colors"
              >
                Cancel
              </button>
              <button 
                onClick={async () => {
                  const skillsArray = editForm.skills ? editForm.skills.split(',').map(s => s.trim()).filter(Boolean) : [];
                  
                  await updateProfile({
                    profile: {
                      ...profile?.profile,
                      fullName: editForm.name,
                      phone: editForm.phone,
                    },
                    education: {
                      ...profile?.education,
                      university: editForm.college,
                      branch: editForm.branch,
                      currentYear: editForm.year,
                      graduationYear: editForm.expectedGraduation
                    },
                    skills: skillsArray,
                    about: {
                      ...profile?.about,
                      bio: editForm.bio
                    },
                    socialLinks: editForm.socialLinks
                  });
                  updateUser({ name: editForm.name });
                  setIsEditModalOpen(false);
                  toast.success('Profile updated successfully');
                }}
                className="h-[48px] px-8 flex items-center gap-2 text-[14px] font-bold text-white bg-[#6C4CF1] hover:bg-[#5b3fda] rounded-xl transition-all shadow-[0_2px_10px_rgba(108,76,241,0.25)]"
              >
                <Save size={18} />
                Save Changes
              </button>
            </div>
            
          </div>
        </div>
      )}

    </div>
  );
}
