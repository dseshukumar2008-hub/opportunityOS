import { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useProfile } from '../../contexts/ProfileContext';
import {
  User, Mail, BookOpen, GraduationCap, Calendar,
  Edit, FileText, Award,
  Code, BarChart3, Trophy, Globe, GitBranch
} from 'lucide-react';
import UserAvatar from '../../components/ui/UserAvatar';
import { getUserFullName } from '../../utils/userUtils';
import { useDashboardInsights } from '../../hooks/useDashboardInsights';
import { useResumeInsights } from '../../hooks/useResumeInsights';
import { useCareerReadiness } from '../../hooks/useCareerReadiness';
import EditProfileModal from './components/EditProfileModal';
import { parseSkillsString } from '../../utils/formatUtils';
export default function ProfilePage() {
  const { user } = useAuth();
  const { profile } = useProfile();
  const { profileCompletion } = useDashboardInsights();
  const { hasInsights, atsScore } = useResumeInsights();
  const { score: readinessScore } = useCareerReadiness();

  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  const profileData = {
    name: profile?.name || profile?.profile?.fullName || user?.name || getUserFullName(user, null),
    email: profile?.email || user?.email || '',
    phone: profile?.phone || profile?.profile?.phone || user?.phone || '',
    college: profile?.college || profile?.education?.university || user?.college || '',
    branch: profile?.branch || profile?.education?.branch || user?.branch || '',
    year: profile?.year || profile?.education?.currentYear || user?.year || '',
    expectedGraduation: profile?.expectedGraduation || profile?.education?.graduationYear || user?.expectedGraduation || '',
    country: profile?.country || user?.country || user?.profile?.country || '',
    state: profile?.state || user?.state || user?.profile?.state || '',
    city: profile?.city || user?.city || user?.profile?.city || '',
    location: profile?.location || user?.location || '',
    bio: profile?.bio || profile?.about?.bio || user?.bio || '',
    skills: profile?.skills?.join(', ') || user?.skills || '',
    socialLinks: {
      linkedin: profile?.socialLinks?.linkedin || '',
      github: profile?.socialLinks?.github || '',
      portfolio: profile?.socialLinks?.portfolio || '',
      twitter: profile?.socialLinks?.twitter || ''
    }
  };

  const handleEditClick = () => {
    setIsEditModalOpen(true);
  };

  const skillsList = parseSkillsString(profileData.skills);

  const hasGithub = !!profile?.githubAnalysis;
  const githubScore = profile?.githubAnalysis?.alignmentScore || 0;

  const stats = [
    { label: 'Resume Score', value: hasInsights && atsScore ? `${atsScore}%` : 'Not analyzed', icon: FileText, color: 'text-[#6C4CF1]', bg: 'bg-[#F4F2FF]' },
    { label: 'Profile Completion', value: `${profileCompletion?.score ?? 0}%`, icon: Trophy, color: 'text-[#6C4CF1]', bg: 'bg-[#F4F2FF]' },
    { label: 'AI Readiness', value: `${readinessScore || 0}%`, icon: BarChart3, color: 'text-[#6C4CF1]', bg: 'bg-[#F4F2FF]' },
    { label: 'GitHub Alignment', value: hasGithub ? `${githubScore}%` : 'Not Analyzed', icon: GitBranch, color: 'text-[#6C4CF1]', bg: 'bg-[#F4F2FF]' },
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
                <UserAvatar
                  src={profile?.avatar_url || profile?.avatarUrl || profile?.photoURL || user?.photoURL}
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
              <div className="flex justify-between items-center py-4 bdaworder-b border-slate-100">
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
                      {stat.label.split(' ')[0]}<br />{stat.label.split(' ')[1]}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

      </div>
      {/* Edit Profile Modal */}
      <EditProfileModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        initialData={profileData}
      />

    </div>
  );
}
