import { 
  Target,
  Trophy,
  BrainCircuit,
  Bookmark,
  FileText,
  AlertTriangle
} from 'lucide-react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useCareerReadiness } from '../../hooks/useCareerReadiness';
import { useResumeInsights } from '../../hooks/useResumeInsights';
import { useCareer } from '../../contexts/CareerContext';

import CareerReadinessWidget from '../../components/analytics/CareerReadinessWidget';
import PlatformAnalysisRadar from '../../components/analytics/PlatformAnalysisRadar';
import SkillGapProgressWidget from '../../components/analytics/SkillGapProgressWidget';
import TopMissingSkillsWidget from '../../components/analytics/TopMissingSkillsWidget';
import AIInsightsSummary from '../../components/analytics/AIInsightsSummary';
import CareerGrowthTimeline from '../../components/analytics/CareerGrowthTimeline';
import ImprovementTrackerWidget from '../../components/analytics/ImprovementTrackerWidget';
import CareerGrowthForecastWidget from '../../components/analytics/CareerGrowthForecastWidget';

export default function AnalyticsPage() {
  const readinessData = useCareerReadiness();
  const { atsScore, hasInsights } = useResumeInsights();
  const { careerContext } = useCareer();
  const navigate = useNavigate();

  const isProfileEmpty = !hasInsights && !careerContext?.githubScore;

  const overviewCards = [
    {
      id: 1,
      title: 'Career Readiness',
      value: `${readinessData?.score || 0}%`,
      subtext: readinessData?.status || 'Beginner',
      subtextColor: 'text-indigo-600',
      icon: Target,
      iconColor: 'text-indigo-500',
      iconBg: 'bg-indigo-50'
    },
    {
      id: 2,
      title: 'Resume ATS Score',
      value: `${atsScore || 0}%`,
      subtext: atsScore > 75 ? 'Highly Competitive' : 'Needs Improvement',
      subtextColor: atsScore > 75 ? 'text-emerald-500' : 'text-amber-500',
      icon: FileText,
      iconColor: 'text-emerald-500',
      iconBg: 'bg-emerald-50'
    },
    {
      id: 3,
      title: 'GitHub Alignment',
      value: `${careerContext?.alignmentScore || 0}%`,
      subtext: careerContext?.githubScore > 0 ? 'Analyzed' : 'Pending Link',
      subtextColor: careerContext?.githubScore > 0 ? 'text-emerald-500' : 'text-slate-400',
      icon: BrainCircuit,
      iconColor: 'text-amber-500',
      iconBg: 'bg-amber-50'
    },
    {
      id: 4,
      title: 'Skill Coverage',
      value: `${Math.max(0, 100 - ((careerContext?.missingSkills?.length || 5) * 10))}%`,
      subtext: `${careerContext?.missingSkills?.length || 0} Critical Missing`,
      subtextColor: 'text-rose-500',
      icon: Trophy,
      iconColor: 'text-blue-500',
      iconBg: 'bg-blue-50'
    }
  ];

  return (
    <div className="max-w-7xl mx-auto flex flex-col h-full relative space-y-8 pb-12 p-4 lg:p-6">
      {/* Page Header */}
      <div className="mb-2">
        <h1 className="page-header mb-1">Career Intelligence</h1>
        <p className="page-subheader">Holistic insights into your skills, profile strength, and career trajectory.</p>
      </div>

      {isProfileEmpty ? (
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex-1 flex flex-col items-center justify-center min-h-[400px] text-center bg-white rounded-[24px] border border-slate-200 border-dashed"
        >
          <div className="w-16 h-16 bg-indigo-50 rounded-2xl flex items-center justify-center mb-4">
            <AlertTriangle className="text-indigo-500" size={32} />
          </div>
          <h2 className="text-xl font-bold text-slate-800 mb-2">Not Enough Data</h2>
          <p className="text-slate-500 max-w-md mx-auto mb-6">
            To generate your Career Intelligence dashboard, we need to analyze your current profile.
          </p>
          <div className="flex flex-col sm:flex-row gap-3">
            <button onClick={() => navigate('/dashboard/resume')} className="px-5 py-2.5 bg-indigo-600 text-white font-bold rounded-xl hover:bg-indigo-700 transition-colors">
              Analyze Resume
            </button>
            <button onClick={() => navigate('/dashboard/github')} className="px-5 py-2.5 bg-white text-slate-700 border border-slate-200 font-bold rounded-xl hover:bg-slate-50 transition-colors">
              Connect GitHub
            </button>
          </div>
        </motion.div>
      ) : (
        <>
          {/* Section 1: Overview Cards */}
          <section>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {overviewCards.map((card, index) => {
                const Icon = card.icon;
                return (
                  <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: index * 0.1 }}
                    key={card.id} 
                    className="bg-white p-5 rounded-[20px] border border-slate-100 shadow-sm hover:-translate-y-[2px] hover:shadow-md transition-all duration-300 flex flex-col h-[130px] justify-between"
                  >
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-[12px] flex items-center justify-center shrink-0 ${card.iconBg}`}>
                    <Icon size={20} strokeWidth={2.5} className={card.iconColor} />
                  </div>
                  <span className="text-[14px] font-bold text-slate-700">{card.title}</span>
                </div>
                
                  <div className="flex flex-col gap-1 mt-3">
                    <span className="text-[32px] font-extrabold text-slate-900 leading-none tracking-tight">
                      {card.value}
                    </span>
                    <div className="flex items-center gap-1.5 mt-1">
                      <span className={`text-[12px] font-bold ${card.subtextColor}`}>{card.subtext}</span>
                    </div>
                  </div>
                  </motion.div>
                );
              })}
            </div>
          </section>

          {/* Section 2: AI Insights & Radar */}
          <section className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-3">
              <AIInsightsSummary />
            </div>
            
            <div className="lg:col-span-1">
              <CareerReadinessWidget />
            </div>
            
            <div className="lg:col-span-1">
              <PlatformAnalysisRadar />
            </div>

            <div className="lg:col-span-1">
              <CareerGrowthForecastWidget />
            </div>
          </section>

          {/* Section 3: Detailed Trackers */}
          <section className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-1 flex flex-col gap-6">
              <TopMissingSkillsWidget />
              <ImprovementTrackerWidget />
            </div>

            <div className="lg:col-span-2">
              <CareerGrowthTimeline />
            </div>
          </section>
        </>
      )}
    </div>
  );
}
