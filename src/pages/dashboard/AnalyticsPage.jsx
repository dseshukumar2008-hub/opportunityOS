import { 
  Target,
  Trophy,
// eslint-disable-next-line no-unused-vars
  BrainCircuit,
  FileText,
// eslint-disable-next-line no-unused-vars
  CheckCircle2,
  ChevronRight,
  Code2,
  Briefcase,
  Clock,
  FileCheck,
  GitBranch,
  Sparkles,
  Lightbulb,
  Rocket,
  Calendar,
  User,
  TrendingUp
} from 'lucide-react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useCareerReadiness } from '../../hooks/useCareerReadiness';
import { useResumeInsights } from '../../hooks/useResumeInsights';
import { useCareer } from '../../contexts/CareerContext';
import { useActivity } from '../../contexts/ActivityContext';
import { useUserProfile } from '../../hooks/useUserProfile';

// Helper for relative timestamps
function timeAgo(dateString) {
  if (!dateString) return 'Just now';
  const date = new Date(dateString);
  const now = new Date();
  const seconds = Math.floor((now - date) / 1000);
  
  if (seconds < 60) return 'Just now';
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes} minute${minutes > 1 ? 's' : ''} ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours} hour${hours > 1 ? 's' : ''} ago`;
  const days = Math.floor(hours / 24);
  if (days < 30) return `${days} day${days > 1 ? 's' : ''} ago`;
  const months = Math.floor(days / 30);
  if (months < 12) return `${months} month${months > 1 ? 's' : ''} ago`;
  return `${Math.floor(months / 12)} year${Math.floor(months / 12) > 1 ? 's' : ''} ago`;
}

// Helper for activity icons
const getActivityIcon = (category) => {
  const map = {
    'resume': { icon: FileCheck, color: "text-emerald-600", bg: "bg-emerald-50" },
    'github': { icon: GitBranch, color: "text-blue-600", bg: "bg-blue-50" },
    'skills': { icon: Sparkles, color: "text-purple-600", bg: "bg-purple-50" },
    'projects': { icon: Briefcase, color: "text-orange-600", bg: "bg-orange-50" },
    'profile': { icon: Target, color: "text-indigo-600", bg: "bg-indigo-50" }
  };
  return map[category?.toLowerCase()] || { icon: Clock, color: "text-slate-600", bg: "bg-slate-50" };
};

export default function AnalyticsPage() {
  const readinessData = useCareerReadiness();
  const { atsScore, hasInsights } = useResumeInsights();
  const { careerContext } = useCareer();
  const { activities } = useActivity();
  const { profile } = useUserProfile();
  const navigate = useNavigate();

  // Determine Profile Setup Progress (5 Core Milestones)
  const hasBasicProfile = !!(profile?.bio || profile?.college || profile?.name);
  const hasSkills = !!(profile?.skills?.length > 0);
  const hasTargetRole = !!(careerContext?.targetRole);
  const hasResume = !!hasInsights;
  const githubScore = profile?.githubAnalysis?.githubScore || careerContext?.githubScore || 0;
  const hasGithub = !!(githubScore > 0);

  const steps = [
    { id: 'profile', completed: hasBasicProfile, title: 'Complete your Profile', desc: 'Add your education, experience and career interests.', path: '/dashboard/settings', icon: User, priority: 'High Priority', color: 'text-indigo-600', bg: 'bg-indigo-50', priorityBg: 'bg-rose-50 text-rose-600' },
    { id: 'skills', completed: hasSkills, title: 'Add Your Skills', desc: 'Add relevant skills to match your career goals.', path: '/dashboard/skill-gap', icon: Code2, priority: 'High Priority', color: 'text-emerald-600', bg: 'bg-emerald-50', priorityBg: 'bg-rose-50 text-rose-600' },
    { id: 'resume', completed: hasResume, title: 'Upload Your Resume', desc: 'Upload your resume to get AI-powered insights.', path: '/dashboard/resume', icon: Briefcase, priority: 'Medium Priority', color: 'text-amber-600', bg: 'bg-amber-50', priorityBg: 'bg-amber-50 text-amber-600' },
    { id: 'github', completed: hasGithub, title: 'Analyze GitHub Profile', desc: 'Enter your GitHub username to analyze your repositories, skills, and development activity.', path: '/github-analyzer', icon: GitBranch, priority: 'Medium Priority', color: 'text-blue-600', bg: 'bg-blue-50', priorityBg: 'bg-amber-50 text-amber-600' },
    { id: 'interests', completed: hasTargetRole, title: 'Set Career Interests', desc: 'Define your target role for better recommendations.', path: '/dashboard/settings', icon: Target, priority: 'Low Priority', color: 'text-purple-600', bg: 'bg-purple-50', priorityBg: 'bg-slate-100 text-slate-600' }
  ];

  const completedStepsCount = steps.filter(s => s.completed).length;
  const progressPercentage = (completedStepsCount / 5) * 100;
  
  const incompleteSteps = steps.filter(s => !s.completed);
  const nextStep = incompleteSteps[0] || { title: "Analyze Your Resume", desc: "Get AI-powered feedback on your resume.", path: "/dashboard/resume-review", icon: FileText, color: "text-emerald-600", bg: "bg-emerald-50" };

  const overviewCards = [
    {
      id: 1,
      title: 'Career Readiness',
      value: completedStepsCount < 3 ? 'Getting Started' : `${readinessData?.score || 0}%`,
      subtext: completedStepsCount < 3 ? 'Complete your profile to see your score' : (readinessData?.status || 'Good Progress'),
      subtextColor: completedStepsCount < 3 ? 'text-slate-500' : 'text-indigo-600',
      valueClass: completedStepsCount < 3 ? 'text-[24px]' : 'text-[40px]',
      icon: Target,
      iconColor: 'text-indigo-500',
      iconBg: 'bg-indigo-50'
    },
    {
      id: 2,
      title: 'Resume Score',
      value: !hasResume ? 'Not Analyzed' : `${atsScore || 0}%`,
      subtext: !hasResume ? 'Upload your resume to get started' : (atsScore > 75 ? 'Good' : 'Needs Improvement'),
      subtextColor: !hasResume ? 'text-slate-500' : (atsScore > 75 ? 'text-emerald-500' : 'text-amber-500'),
      valueClass: !hasResume ? 'text-[24px]' : 'text-[40px]',
      icon: FileText,
      iconColor: 'text-emerald-500',
      iconBg: 'bg-emerald-50'
    },
    {
      id: 3,
      title: 'GitHub Alignment',
      value: !hasGithub ? 'Not Analyzed' : `${profile?.githubAnalysis?.alignmentScore || careerContext?.alignmentScore || 0}%`,
      subtext: !hasGithub ? 'Analyze your GitHub profile' : 'Moderate',
      subtextColor: !hasGithub ? 'text-slate-500' : 'text-amber-500',
      valueClass: !hasGithub ? 'text-[24px]' : 'text-[40px]',
      icon: GitBranch, 
      iconColor: 'text-orange-500',
      iconBg: 'bg-orange-50'
    },
    {
      id: 4,
      title: 'Skill Coverage',
      value: !hasSkills ? 'Building Profile' : `${Math.max(0, 100 - ((careerContext?.missingSkills?.length || 5) * 10))}%`,
      subtext: !hasSkills ? 'Add skills to see your coverage' : (careerContext?.missingSkills?.length > 0 ? 'Needs Improvement' : 'Excellent'),
      subtextColor: !hasSkills ? 'text-slate-500' : (careerContext?.missingSkills?.length > 0 ? 'text-rose-500' : 'text-emerald-500'),
      valueClass: !hasSkills ? 'text-[24px]' : 'text-[40px]',
      icon: Trophy,
      iconColor: 'text-blue-500',
      iconBg: 'bg-blue-50'
    }
  ];

  // Dynamic Prioritization Engine (Max 3 items)
  const improvementCards = incompleteSteps.slice(0, 3);

  // If user completed everything, give them advanced tasks
  if (improvementCards.length < 3) {
    if (improvementCards.length < 3) improvementCards.push({ title: "Build Projects", desc: "Get AI recommendations for side projects.", priority: "Medium Priority", icon: Code2, color: "text-purple-600", bg: "bg-purple-50", priorityBg: "bg-amber-50 text-amber-600", path: "/project-recommendations" });
    if (improvementCards.length < 3) improvementCards.push({ title: "Build Projects", desc: "Add real-world projects to showcase your skills.", priority: "Low Priority", icon: Briefcase, color: "text-orange-600", bg: "bg-orange-50", priorityBg: "bg-slate-100 text-slate-600", path: "/dashboard/projects" });
    if (improvementCards.length < 3) improvementCards.push({ title: "Expand Network", desc: "Connect with peers and mentors in your field.", priority: "Low Priority", icon: Target, color: "text-blue-600", bg: "bg-blue-50", priorityBg: "bg-slate-100 text-slate-600", path: "/dashboard/network" });
  }

  const recentActivities = activities?.slice(0, 5) || [];

  return (
    <div className="max-w-6xl mx-auto flex flex-col h-full relative space-y-8 pb-12 p-4 lg:p-8">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-2">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 mb-2">Career Intelligence</h1>
          <p className="text-slate-500 font-medium">Your personalized career insights will grow as you build your profile.</p>
        </div>
      </div>

      {/* Section 1: Overview Cards */}
      <section>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {overviewCards.map((card, index) => {
            const Icon = card.icon;
            return (
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
                key={card.id} 
                className="bg-white px-6 py-5 md:px-8 md:py-6 rounded-[32px] border border-slate-100 shadow-[0_2px_10px_rgba(0,0,0,0.02)] hover:shadow-md transition-shadow flex flex-col h-[220px] justify-between"
              >
                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center shrink-0 ${card.iconBg} mb-6`}>
                  <Icon size={24} strokeWidth={2.5} className={card.iconColor} />
                </div>
                <div className="flex-1 flex flex-col justify-end">
                  <h4 className="text-[15px] font-bold text-slate-900 mb-3">{card.title}</h4>
                  <div className="flex items-end justify-between mb-4">
                    <span className={`${card.valueClass} font-extrabold text-slate-700 leading-none tracking-tight`}>
                      {card.value}
                    </span>
                  </div>
                  <span className={`text-[14px] font-medium leading-relaxed ${card.subtextColor}`}>{card.subtext}</span>
                </div>
              </motion.div>
            );
          })}
        </div>
      </section>

      {/* Section 2: Career Insights Card */}
      <section>
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.2 }}
          className="bg-white rounded-[32px] border border-slate-100 p-8 shadow-[0_2px_10px_rgba(0,0,0,0.02)]"
        >
          <div className="flex items-center gap-3 mb-8">
            <TrendingUp size={22} className="text-indigo-600" />
            <h3 className="text-[18px] font-bold text-slate-900">Career Insights</h3>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-0 md:divide-x divide-slate-100">
            {/* Left Side */}
            <div className="flex flex-col justify-between md:pr-12">
              <div className="flex items-start gap-5">
                <div className="w-16 h-16 rounded-full bg-indigo-50 flex items-center justify-center shrink-0 shadow-sm">
                  <Rocket className="text-indigo-600" size={28} />
                </div>
                <div className="pt-1">
                  <h4 className="text-[18px] font-bold text-indigo-600 mb-2">Your Career Journey Starts Here!</h4>
                  <p className="text-slate-500 font-medium text-[15px] leading-relaxed max-w-sm">Complete a few steps to unlock personalized insights and accelerate your growth.</p>
                </div>
              </div>
              
              <div className="mt-10">
                <div className="flex justify-between items-center mb-3">
                  <span className="text-[14px] font-bold text-slate-900">Profile Setup Progress</span>
                  <span className="text-[14px] font-medium text-slate-500">{completedStepsCount} of 5 completed</span>
                </div>
                <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden">
                  <div className="h-full bg-indigo-600 rounded-full transition-all duration-1000 ease-out" style={{ width: `${progressPercentage}%` }}></div>
                </div>
              </div>
            </div>
            
            {/* Right Side */}
            <div className="md:pl-12 flex flex-col justify-center">
              <h4 className="text-[15px] font-bold text-slate-900 mb-6">Recommended Next Step</h4>
              <div className="flex items-center justify-between group cursor-pointer" onClick={() => navigate(nextStep.path)}>
                <div className="flex items-start gap-4">
                  <div className={`w-14 h-14 rounded-2xl ${nextStep.bg} flex items-center justify-center shrink-0`}>
                    <nextStep.icon className={nextStep.color} size={26} />
                  </div>
                  <div className="pt-0.5">
                    <p className="text-slate-900 font-bold text-[17px] mb-1.5">{nextStep.title}</p>
                    <p className="text-slate-500 font-medium text-[14px] max-w-xs leading-relaxed">{nextStep.desc}</p>
                  </div>
                </div>
                <div className="w-12 h-12 rounded-2xl bg-indigo-50 flex items-center justify-center group-hover:bg-indigo-100 transition-colors shrink-0 ml-4">
                  <ChevronRight className="text-indigo-600 group-hover:translate-x-1 transition-transform" size={24} />
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </section>

      {/* Section 3 & 4: What to Improve Next / Recent Activity */}
      <section>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          
          {/* What to Improve Next */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.3 }}
            className="bg-white rounded-[32px] border border-slate-100 p-8 shadow-[0_2px_10px_rgba(0,0,0,0.02)] flex flex-col min-h-[420px]"
          >
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-3">
                <Target size={22} className="text-indigo-600" />
                <h3 className="text-[18px] font-bold text-slate-900">What to Improve Next</h3>
              </div>
              <button className="text-indigo-600 font-bold text-[14px] flex items-center hover:text-indigo-700">View All <ChevronRight size={16}/></button>
            </div>
            
            <div className="space-y-6 flex-1">
              {improvementCards.map((card, index) => {
                const CardIcon = card.icon;
                return (
                  <div key={index} className="flex items-center justify-between group cursor-pointer border-b border-slate-50 pb-6 last:pb-0 last:border-0" onClick={() => navigate(card.path)}>
                    <div className="flex items-start gap-4">
                        <div className={`w-12 h-12 rounded-full ${card.bg} flex items-center justify-center shrink-0`}>
                          <CardIcon className={card.color} size={20} />
                        </div>
                        <div className="pt-0.5">
                          <h4 className="text-[16px] font-bold text-slate-900 mb-1.5">{card.title}</h4>
                          <p className="text-slate-500 text-[14px] font-medium max-w-[220px] leading-relaxed">{card.desc}</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className={`inline-block px-3 py-1.5 text-[12px] font-bold rounded-xl ${card.priorityBg}`}>{card.priority}</span>
                      <ChevronRight size={20} className="text-slate-400 group-hover:text-slate-600 transition-colors"/>
                    </div>
                  </div>
                )
              })}
            </div>
          </motion.div>

          {/* Recent Activity */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.4 }}
            className="bg-white rounded-[32px] border border-slate-100 p-8 shadow-[0_2px_10px_rgba(0,0,0,0.02)] flex flex-col min-h-[420px]"
          >
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-3">
                <Clock size={22} className="text-indigo-600" />
                <h3 className="text-[18px] font-bold text-slate-900">Recent Activity</h3>
              </div>
              <button className="text-indigo-600 font-bold text-[14px] flex items-center hover:text-indigo-700">View All <ChevronRight size={16}/></button>
            </div>
            
            <div className="flex-1 flex flex-col">
              {recentActivities.length === 0 ? (
                <div className="flex-1 flex flex-col items-center justify-center text-center py-10">
                  <div className="w-[84px] h-[84px] bg-indigo-50 rounded-full flex items-center justify-center mb-6">
                      <Calendar className="text-indigo-500" size={36} strokeWidth={1.5} />
                  </div>
                  <h4 className="text-[18px] font-bold text-slate-900 mb-3">No activity yet</h4>
                  <p className="text-slate-500 text-[15px] font-medium max-w-[240px] leading-relaxed">Start using features to see your activity and progress here.</p>
                </div>
              ) : (
                <div className="space-y-6">
                  {recentActivities.map((act) => {
                    const ui = getActivityIcon(act.category);
                    const ActIcon = ui.icon;
                    return (
                      <div key={act.id} className="flex items-center gap-5 group cursor-pointer border-b border-slate-50 pb-6 last:pb-0 last:border-0">
                        <div className={`w-12 h-12 rounded-full ${ui.bg} flex items-center justify-center shrink-0`}>
                          <ActIcon className={ui.color} size={20} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="font-bold text-slate-900 text-[15px] mb-1">{act.title}</h4>
                          <p className="text-slate-500 text-[14px] truncate">{act.description}</p>
                        </div>
                        <span className="text-slate-400 text-[13px] font-medium whitespace-nowrap pl-4">
                          {timeAgo(act.timestamp)}
                        </span>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </motion.div>

        </div>
      </section>

      {/* Footer Motivational Text */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.4, delay: 0.5 }}
        className="flex items-center justify-center gap-2 text-slate-500 font-bold text-[15px] pt-8 pb-4"
      >
        <Lightbulb size={20} className="text-indigo-500" />
        Every step you take helps us understand your career journey better.
      </motion.div>
    </div>
  );
}
