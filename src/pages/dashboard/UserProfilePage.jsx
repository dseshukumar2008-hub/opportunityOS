import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useProfile } from '../../contexts/ProfileContext';
import { useResume } from '../../contexts/ResumeContext';
import { useApplications } from '../../contexts/ApplicationContext';
import { useTeam } from '../../contexts/TeamContext';
import StatusDot from '../../components/ui/StatusDot';
import { useOnlineStatus } from '../../contexts/OnlineStatusContext';
import { useConnections } from '../../contexts/ConnectionContext';
import { useNotifications } from '../../contexts/NotificationContext';
import {
  GraduationCap, BookOpen, Calendar, MapPin, MessageSquare,
  UserPlus, FileText, Code, Award, Globe, ExternalLink, Briefcase, Users,
  Star, BarChart3, Zap, Clock, ChevronRight, User,
  GitBranch, UserCheck, UserX, Link2, CheckCircle
} from 'lucide-react';
import RecommendedConnectionsWidget from '../../components/network/RecommendedConnectionsWidget';
import RecommendedForYouSection from '../../components/opportunities/RecommendedForYouSection';
import { useActivity } from '../../contexts/ActivityContext';
import { useEffect } from 'react';
import { useUserDirectory } from '../../hooks/useUserDirectory';

// ─── Helpers ───────────────────────────────────────────────────────────────
function SectionHeader({ icon: Icon, title }) {
  return (
    <div className="flex items-center gap-3 mb-5">
      <div className="w-9 h-9 bg-[#F4F2FF] text-[#6C4CF1] rounded-xl flex items-center justify-center shrink-0">
        <Icon size={17} />
      </div>
      <h2 className="text-[16px] font-bold text-slate-900">{title}</h2>
    </div>
  );
}

function Card({ children, className = '' }) {
  return (
    <div className={`bg-white rounded-2xl border border-slate-100 shadow-sm p-6 ${className}`}>
      {children}
    </div>
  );
}

function SkillChip({ label }) {
  return (
    <span className="px-3 py-1.5 bg-[#F4F2FF] text-[#6C4CF1] text-[12px] font-bold rounded-lg cursor-default hover:bg-indigo-100 transition-colors">
      {label}
    </span>
  );
}

function StatCard({ icon: Icon, label, value, color }) {
  return (
    <div className="bg-white border border-slate-100 rounded-2xl p-5 flex items-center gap-4 shadow-sm hover:shadow-md transition-shadow">
      <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${color}`}>
        <Icon size={22} />
      </div>
      <div>
        <p className="text-2xl font-extrabold text-slate-900 leading-none">{value}</p>
        <p className="text-[12px] font-semibold text-slate-500 mt-1">{label}</p>
      </div>
    </div>
  );
}

const timeAgo = (isoString) => {
  if (!isoString) return '';
  const date = new Date(isoString);
  const now = new Date();
  const diff = Math.floor((now - date) / 60000);
  if (diff < 60) return `${Math.max(1, diff)}m ago`;
  if (diff < 1440) return `${Math.floor(diff / 60)}h ago`;
  return `${Math.floor(diff / 1440)}d ago`;
};

// ─── Main Component ────────────────────────────────────────────────────────
export default function UserProfilePage() {
  const navigate = useNavigate();
  const { userId } = useParams();
  const { user } = useAuth();
  const { profile: ownProfile, fetchUserProfile } = useProfile();
  const { resumeData, getResumeStrength } = useResume();
  const { applications } = useApplications();
  const { teams, currentUserId } = useTeam();
  const { myStatus } = useOnlineStatus();
  const {
    getRelationship,
    getIncomingRequestId,
    getConnectionCount,
    sendConnectionRequest,
    acceptConnectionRequest,
    rejectConnectionRequest,
    removeConnection,
    connections,
  } = useConnections();
  const { users: allUsers } = useUserDirectory();
  const { addNotification } = useNotifications();
  const { getUserActivities } = useActivity();

  const [viewedProfile, setViewedProfile] = useState(null);

  // Resolve which user we're viewing
  const isOwnProfile = !userId || userId === 'me' || userId === user?.id || userId === user?.email;
  
  useEffect(() => {
    if (isOwnProfile) {
      setViewedProfile(ownProfile);
    } else {
      // User lookup first, if not found then Supabase fetch
      const mock = allUsers.find(u => u.id === userId);
      if (mock) {
        setViewedProfile(mock);
      } else {
        fetchUserProfile(userId).then(res => {
          if (res.data) setViewedProfile(res.data);
        });
      }
    }
  }, [isOwnProfile, ownProfile, userId]);

  // For other users, look them up; for own profile use auth user
  const viewedMockUser = !isOwnProfile ? allUsers.find(u => u.id === userId) : null;

  // Connection state for the viewed user
  const targetUserId = isOwnProfile ? null : userId;
  const relationship = targetUserId ? getRelationship(targetUserId) : 'self';
  const incomingRequestId = targetUserId ? getIncomingRequestId(targetUserId) : null;
  const myConnectionCount = getConnectionCount();
  const viewedUserConnectionCount = targetUserId ? getConnectionCount(targetUserId) : myConnectionCount;

  const handleConnect = () => {
    if (!targetUserId) return;
    const p = viewedMockUser || viewedProfile || { name: userId };
    sendConnectionRequest(targetUserId);
    addNotification({
      category: 'Connections',
      title: 'Connection Request Sent',
      message: `Connection request sent to ${p.full_name || p.name}.`,
    });
  };

  const handleAccept = () => {
    if (!incomingRequestId) return;
    const p = viewedMockUser || viewedProfile || { name: userId };
    acceptConnectionRequest(incomingRequestId);
    addNotification({
      category: 'Connections',
      title: 'Connection Accepted',
      message: `You and ${p.full_name || p.name} are now connected.`,
    });
  };

  const handleReject = () => {
    if (!incomingRequestId) return;
    rejectConnectionRequest(incomingRequestId);
    addNotification({
      category: 'Connections',
      title: 'Connection Request Declined',
      message: 'Connection request declined.',
    });
  };

  const handleDisconnect = () => {
    const conn = connections.find(
      c => (c.userId1 === (user?.id || 'me') && c.userId2 === targetUserId) ||
           (c.userId1 === targetUserId && c.userId2 === (user?.id || 'me'))
    );
    if (conn) removeConnection(conn.id);
  };

  // ── Pull all data from contexts ─────────────────────────────
  const pi = resumeData.personalInfo;

  const location      = pi.location                    || 'India';
  const github        = pi.github;
  const linkedin      = pi.linkedin;
  const portfolio     = pi.portfolio;

  // Profile fields from AuthContext (set via ProfilePage)
  const fullName      = viewedProfile?.full_name || pi.fullName    || user?.name   || 'Your Name';
  const college       = viewedProfile?.education?.[0]?.institution || viewedProfile?.college || 'NIAT';
  const branch        = viewedProfile?.education?.[0]?.field || viewedProfile?.branch || 'Computer Science Engineering';
  const gradYear      = viewedProfile?.education?.[0]?.endYear || viewedProfile?.expectedGraduation  || '2029';
  const bio           = viewedProfile?.bio || 'Passionate Computer Science student building impactful web applications. Open to collaborations, hackathons, and innovative projects.';
  const skillsStr     = viewedProfile?.skills?.join(', ') || 'React, JavaScript, Python, HTML, CSS, Node.js';
  const headline      = viewedProfile?.headline || `${branch} Student | Full Stack Developer`;

  const skillsList = skillsList => skillsList.split(',').map(s => s.trim()).filter(Boolean);
  const skills = isOwnProfile && resumeData.skills.length > 0
    ? resumeData.skills
    : viewedProfile?.skills?.map(s => ({ name: s })) || skillsList(skillsStr).map(s => ({ name: s }));

  const myTeams = (teams || []).filter(t => t.members.includes(currentUserId));
  const resumeScore = getResumeStrength();

  // ── Activity feed from ActivityContext ───────────────────────
  const [activityFilter, setActivityFilter] = useState('All');
  
  const allActivities = getUserActivities(isOwnProfile ? currentUserId : targetUserId);
  const activities = allActivities.filter(a => activityFilter === 'All' || a.category === activityFilter).slice(0, 5);

  const ICON_MAP = {
    Briefcase,
    Users,
    FileText,
    UserPlus,
    Award,
    CheckCircle,
    User
  };

  // ── Message handler ─────────────────────────────────────────
  const handleMessage = () => navigate('/messages');

  return (
    <div className="bg-[#F8FAFC] pb-20 font-sans p-4 lg:p-6">
      <div className="max-w-[1100px] mx-auto px-4 sm:px-6 lg:px-8 py-8">

        {/* ── HERO CARD ─────────────────────────────────────────── */}
        <div className="relative bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden mb-6">
          {/* Banner */}
          <div className="h-36 bg-gradient-to-br from-[#6C4CF1] via-indigo-600 to-violet-500" />

          <div className="px-6 sm:px-8 pb-6 -mt-16 relative">
            {/* Avatar */}
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
              <div className="flex items-end gap-4">
                <div className="relative shrink-0">
                  <img
                    src={`https://api.dicebear.com/7.x/notionists/svg?seed=${fullName}&backgroundColor=e2e8f0`}
                    alt={fullName}
                    className="w-28 h-28 sm:w-32 sm:h-32 rounded-2xl border-4 border-white shadow-md bg-slate-100 object-cover"
                  />
                  <span className="absolute bottom-1 right-1">
                    <StatusDot status={myStatus} size="md" />
                  </span>
                </div>

                <div className="pb-2">
                  <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight leading-tight">
                    {fullName}
                  </h1>
                  <p className="text-[13px] font-semibold text-slate-500 mt-1">{headline}</p>
                  <div className="flex flex-wrap items-center gap-3 mt-2 text-[12px] font-semibold text-slate-500">
                    <span className="flex items-center gap-1.5">
                      <GraduationCap size={13} className="text-[#6C4CF1]" /> {college}
                    </span>
                    <span className="flex items-center gap-1.5">
                      <BookOpen size={13} className="text-[#6C4CF1]" /> {branch}
                    </span>
                    <span className="flex items-center gap-1.5">
                      <Calendar size={13} className="text-[#6C4CF1]" /> {gradYear} Batch
                    </span>
                    {location && (
                      <span className="flex items-center gap-1.5">
                        <MapPin size={13} className="text-[#6C4CF1]" /> {location}
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-2 flex-wrap pb-2">
                {/* Own profile: show connections link */}
                {isOwnProfile ? (
                  <button
                    onClick={() => navigate('/network/connections')}
                    className="flex items-center gap-2 px-5 h-10 rounded-xl text-[13px] font-bold bg-white border border-[#6C4CF1]/30 text-[#6C4CF1] hover:bg-indigo-50 transition-all"
                  >
                    <Link2 size={15} />
                    {myConnectionCount} Connection{myConnectionCount !== 1 ? 's' : ''}
                  </button>
                ) : (
                  <>
                    {/* Not connected */}
                    {relationship === 'none' && (
                      <button
                        onClick={handleConnect}
                        className="flex items-center gap-2 px-5 h-10 rounded-xl text-[13px] font-bold bg-[#6C4CF1] text-white border-transparent hover:bg-indigo-700 shadow-[0_2px_10px_rgba(108,76,241,0.25)] transition-all"
                      >
                        <UserPlus size={15} />
                        Connect
                      </button>
                    )}
                    {/* Request sent */}
                    {relationship === 'request_sent' && (
                      <button
                        disabled
                        className="flex items-center gap-2 px-5 h-10 rounded-xl text-[13px] font-bold bg-amber-50 text-amber-600 border border-amber-200 cursor-default"
                      >
                        <Clock size={15} />
                        Pending
                      </button>
                    )}
                    {/* Request received */}
                    {relationship === 'request_received' && (
                      <>
                        <button
                          onClick={handleAccept}
                          className="flex items-center gap-2 px-5 h-10 rounded-xl text-[13px] font-bold bg-[#6C4CF1] text-white hover:bg-indigo-700 shadow-[0_2px_10px_rgba(108,76,241,0.25)] transition-all"
                        >
                          <UserCheck size={15} />
                          Accept
                        </button>
                        <button
                          onClick={handleReject}
                          className="flex items-center gap-2 px-5 h-10 rounded-xl text-[13px] font-bold bg-white border border-slate-200 text-slate-700 hover:bg-red-50 hover:border-red-200 hover:text-red-600 transition-all"
                        >
                          <UserX size={15} />
                          Reject
                        </button>
                      </>
                    )}
                    {/* Connected */}
                    {relationship === 'connected' && (
                      <button
                        onClick={handleDisconnect}
                        className="group flex items-center gap-2 px-5 h-10 rounded-xl text-[13px] font-bold bg-white border border-[#6C4CF1]/30 text-[#6C4CF1] hover:bg-red-50 hover:border-red-200 hover:text-red-600 transition-all"
                      >
                        <UserCheck size={15} className="group-hover:hidden" />
                        <UserX size={15} className="hidden group-hover:block" />
                        <span className="group-hover:hidden">Connected</span>
                        <span className="hidden group-hover:inline">Disconnect</span>
                      </button>
                    )}
                  </>
                )}
                <button
                  onClick={handleMessage}
                  className="flex items-center gap-2 px-5 h-10 rounded-xl text-[13px] font-bold bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 transition-colors shadow-sm"
                >
                  <MessageSquare size={15} />
                  Message
                </button>
                {(isOwnProfile && resumeData.personalInfo.fullName) && (
                  <button
                    onClick={() => navigate('/resume-builder')}
                    className="flex items-center gap-2 px-5 h-10 rounded-xl text-[13px] font-bold bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 transition-colors shadow-sm"
                  >
                    <FileText size={15} />
                    View Resume
                  </button>
                )}
              </div>
            </div>

            {/* Social Links */}
            {(github || linkedin || portfolio) && (
              <div className="flex items-center gap-3 mt-5 flex-wrap">
                {linkedin && (
                  <a href={linkedin} target="_blank" rel="noreferrer" className="flex items-center gap-1.5 text-[12px] font-bold text-slate-500 hover:text-[#6C4CF1] transition-colors">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/><rect x="2" y="9" width="4" height="12"/><circle cx="4" cy="4" r="2"/></svg> LinkedIn
                  </a>
                )}
                {github && (
                  <a href={github} target="_blank" rel="noreferrer" className="flex items-center gap-1.5 text-[12px] font-bold text-slate-500 hover:text-[#6C4CF1] transition-colors">
                    <GitBranch size={14} /> GitHub
                  </a>
                )}
                {portfolio && (
                  <a href={portfolio} target="_blank" rel="noreferrer" className="flex items-center gap-1.5 text-[12px] font-bold text-slate-500 hover:text-[#6C4CF1] transition-colors">
                    <Globe size={14} /> Portfolio
                  </a>
                )}
              </div>
            )}
          </div>
        </div>

        {/* ── BODY GRID ─────────────────────────────────────────── */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

          {/* LEFT COLUMN */}
          <div className="lg:col-span-2 flex flex-col gap-6">

            {/* Stats */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <StatCard icon={Briefcase}  label="Opportunities Applied" value={(applications || []).length}          color="bg-blue-50 text-blue-600" />
              <StatCard icon={Users}      label="Teams Joined"          value={myTeams.length}               color="bg-emerald-50 text-emerald-600" />
              <StatCard icon={Link2}      label="Connections"           value={isOwnProfile ? myConnectionCount : viewedUserConnectionCount}  color="bg-amber-50 text-amber-600" />
              <StatCard icon={Star}       label="Resume Score"          value={`${resumeScore}%`}             color="bg-purple-50 text-purple-600" />
            </div>

            {/* About */}
            <Card>
              <SectionHeader icon={User} title="About" />
              <p className="text-[14px] text-slate-600 leading-relaxed font-medium">
                {bio}
              </p>
            </Card>

            {/* Skills */}
            <Card>
              <SectionHeader icon={Code} title="Skills" />
              {skills.length > 0 ? (
                <div className="flex flex-wrap gap-2">
                  {skills.map((skill, i) => (
                    <SkillChip key={i} label={typeof skill === 'string' ? skill : skill.name} />
                  ))}
                </div>
              ) : (
                <p className="text-[13px] text-slate-400 font-medium">No skills added yet. Update your Resume Builder.</p>
              )}
            </Card>

            {/* Projects */}
            {resumeData.projects.length > 0 && (
              <Card>
                <SectionHeader icon={Zap} title="Projects" />
                <div className="flex flex-col gap-5">
                  {resumeData.projects.map((proj, i) => (
                    <div key={proj.id || i} className={`${i < resumeData.projects.length - 1 ? 'pb-5 border-b border-slate-100' : ''}`}>
                      <div className="flex items-start justify-between gap-2 mb-1.5">
                        <h3 className="text-[15px] font-bold text-slate-900">{proj.name || proj.title}</h3>
                        {(proj.link || proj.github) && (
                          <a
                            href={proj.link || proj.github}
                            target="_blank"
                            rel="noreferrer"
                            className="flex items-center gap-1 text-[11px] font-bold text-[#6C4CF1] hover:underline shrink-0"
                          >
                            <GitBranch size={12} /> GitHub <ExternalLink size={10} />
                          </a>
                        )}
                      </div>
                      {proj.description && (
                        <p className="text-[13px] text-slate-500 font-medium leading-relaxed mb-2">{proj.description}</p>
                      )}
                      {(proj.tech || proj.technologies) && (
                        <div className="flex flex-wrap gap-1.5">
                          {(proj.tech || proj.technologies || '').split(',').map((t, ti) => t.trim() && (
                            <span key={ti} className="px-2 py-0.5 bg-slate-100 text-slate-600 rounded text-[11px] font-semibold">{t.trim()}</span>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </Card>
            )}

            {/* Certifications */}
            {resumeData.certifications.length > 0 && (
              <Card>
                <SectionHeader icon={Award} title="Certifications" />
                <div className="flex flex-col gap-4">
                  {resumeData.certifications.map((cert, i) => (
                    <div key={cert.id || i} className={`flex items-start gap-4 ${i < resumeData.certifications.length - 1 ? 'pb-4 border-b border-slate-100' : ''}`}>
                      <div className="w-10 h-10 bg-amber-50 text-amber-500 rounded-xl flex items-center justify-center shrink-0">
                        <Award size={18} />
                      </div>
                      <div>
                        <p className="text-[14px] font-bold text-slate-900">{cert.name}</p>
                        <p className="text-[12px] font-semibold text-slate-500 mt-0.5">
                          {cert.issuer}{cert.year ? ` · ${cert.year}` : ''}
                          {cert.date ? ` · ${cert.date}` : ''}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </Card>
            )}

            {/* Recent Activity */}
            <Card>
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5">
                <SectionHeader icon={BarChart3} title="Recent Activity" />
                <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-hide">
                  {['All', 'Opportunities', 'Teams', 'Resume', 'Networking'].map(filter => (
                    <button
                      key={filter}
                      onClick={() => setActivityFilter(filter)}
                      className={`px-3 py-1 rounded-lg text-[11px] font-bold whitespace-nowrap transition-colors ${
                        activityFilter === filter
                          ? 'bg-[#6C4CF1] text-white'
                          : 'bg-slate-50 text-slate-500 hover:bg-slate-100'
                      }`}
                    >
                      {filter}
                    </button>
                  ))}
                </div>
              </div>
              
              {activities.length > 0 ? (
                <div className="flex flex-col gap-3">
                  {activities.map(act => {
                    const Icon = ICON_MAP[act.iconType] || Briefcase;
                    return (
                      <div key={act.id} className="flex items-center gap-3 py-2.5 border-b border-slate-50 last:border-0">
                        <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${act.color}`}>
                          <Icon size={15} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-[13px] font-bold text-slate-700 truncate">{act.title}</p>
                          <p className="text-[11px] font-medium text-slate-500 truncate">{act.description}</p>
                        </div>
                        {act.timestamp && (
                          <span className="text-[11px] font-medium text-slate-400 shrink-0">{timeAgo(act.timestamp)}</span>
                        )}
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="py-4 text-center">
                  <p className="text-[13px] text-slate-500 font-bold mb-1">No activity yet.</p>
                  <p className="text-[12px] text-slate-400 font-medium">Start exploring opportunities and building your profile.</p>
                </div>
              )}
            </Card>

          </div>

          {/* RIGHT COLUMN */}
          <div className="flex flex-col gap-6">

            {/* Education */}
            {resumeData.education.length > 0 ? (
              <Card>
                <SectionHeader icon={GraduationCap} title="Education" />
                <div className="flex flex-col gap-5">
                  {resumeData.education.map((edu, i) => (
                    <div key={edu.id || i} className={i < resumeData.education.length - 1 ? 'pb-5 border-b border-slate-100' : ''}>
                      <p className="text-[14px] font-bold text-slate-900">{edu.institution || edu.school}</p>
                      <p className="text-[12px] font-semibold text-[#6C4CF1] mt-0.5">{edu.degree}{edu.field ? ` · ${edu.field}` : ''}</p>
                      <p className="text-[11px] font-medium text-slate-400 mt-0.5">
                        {edu.startYear || edu.from}{(edu.startYear || edu.from) && (edu.endYear || edu.to) && ' — '}{edu.endYear || edu.to}
                      </p>
                    </div>
                  ))}
                </div>
              </Card>
            ) : (
              <Card>
                <SectionHeader icon={GraduationCap} title="Education" />
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 bg-[#F4F2FF] rounded-xl flex items-center justify-center shrink-0">
                    <GraduationCap size={18} className="text-[#6C4CF1]" />
                  </div>
                  <div>
                    <p className="text-[14px] font-bold text-slate-900">{college}</p>
                    <p className="text-[12px] font-semibold text-[#6C4CF1] mt-0.5">{branch}</p>
                    <p className="text-[11px] font-medium text-slate-400 mt-0.5">Class of {gradYear}</p>
                  </div>
                </div>
              </Card>
            )}

            {/* Teams */}
            {myTeams.length > 0 && (
              <Card>
                <SectionHeader icon={Users} title="Teams" />
                <div className="flex flex-col gap-3">
                  {myTeams.slice(0, 4).map(team => (
                    <button
                      key={team.id}
                      onClick={() => navigate(`/team/${team.id}`)}
                      className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-slate-50 transition-colors text-left group"
                    >
                      <div className="w-9 h-9 rounded-xl bg-[#F4F2FF] flex items-center justify-center shrink-0">
                        <Users size={16} className="text-[#6C4CF1]" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-[13px] font-bold text-slate-900 truncate">{team.name}</p>
                        <p className="text-[11px] font-medium text-slate-500">{team.category}</p>
                      </div>
                      <ChevronRight size={14} className="text-slate-300 group-hover:text-slate-500 transition-colors shrink-0" />
                    </button>
                  ))}
                </div>
              </Card>
            )}

            {/* Resume Score */}
            <Card>
              <SectionHeader icon={FileText} title="Resume Score" />
              <div className="flex items-center gap-4 mb-4">
                <div className="relative w-20 h-20 shrink-0">
                  <svg className="w-20 h-20 -rotate-90" viewBox="0 0 80 80">
                    <circle cx="40" cy="40" r="32" fill="none" stroke="#F1F5F9" strokeWidth="8" />
                    <circle
                      cx="40" cy="40" r="32" fill="none"
                      stroke="#6C4CF1" strokeWidth="8" strokeLinecap="round"
                      strokeDasharray={`${2 * Math.PI * 32}`}
                      strokeDashoffset={`${2 * Math.PI * 32 * (1 - resumeScore / 100)}`}
                      className="transition-all duration-700"
                    />
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-[17px] font-extrabold text-slate-900">{resumeScore}%</span>
                  </div>
                </div>
                <div>
                  <p className="text-[14px] font-bold text-slate-900 mb-1">
                    {resumeScore >= 80 ? 'Excellent' : resumeScore >= 60 ? 'Good' : resumeScore >= 40 ? 'Fair' : 'Needs Work'}
                  </p>
                  <p className="text-[12px] font-medium text-slate-500 leading-relaxed">
                    {resumeScore < 80 ? 'Complete more sections in Resume Builder to improve your score.' : 'Your profile is strong and ready to impress recruiters!'}
                  </p>
                </div>
              </div>
              <button
                onClick={() => navigate('/resume-builder')}
                className="w-full h-10 flex items-center justify-center gap-2 bg-[#F4F2FF] text-[#6C4CF1] text-[13px] font-bold rounded-xl hover:bg-indigo-100 transition-colors"
              >
                <FileText size={14} /> Edit Resume
              </button>
            </Card>

            <div className="bg-white rounded-[20px] border border-slate-100 p-5 shadow-sm">
              <RecommendedForYouSection limit={3} layout="list" />
            </div>

            {!isOwnProfile && (
              <RecommendedConnectionsWidget />
            )}

          </div>
        </div>
      </div>
    </div>
  );
}
