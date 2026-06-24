import React from 'react';
import { Target, Trophy, Award, TrendingUp } from 'lucide-react';
import { useCareerReadiness } from '../../hooks/useCareerReadiness';
import { motion } from 'framer-motion';

export default function CareerReadinessWidget() {
  const readinessData = useCareerReadiness();
  const { score = 0, status = 'Beginner' } = readinessData || {};

  const getStatusColor = (s) => {
    if (s === 'Career Ready') return 'text-emerald-600 bg-emerald-50 border-emerald-200';
    if (s === 'Advanced') return 'text-blue-600 bg-blue-50 border-blue-200';
    if (s === 'Intermediate') return 'text-indigo-600 bg-indigo-50 border-indigo-200';
    return 'text-amber-600 bg-amber-50 border-amber-200';
  };

  const getStatusIcon = (s) => {
    if (s === 'Career Ready') return <Trophy size={20} className="text-emerald-600" />;
    if (s === 'Advanced') return <Award size={20} className="text-blue-600" />;
    if (s === 'Intermediate') return <TrendingUp size={20} className="text-indigo-600" />;
    return <Target size={20} className="text-amber-600" />;
  };

  // Calculate stroke properties
  const radius = 36;
  const circumference = 2 * Math.PI * radius;
  // Initialize to full circumference (0% progress)
  const [strokeDashoffset, setStrokeDashoffset] = React.useState(circumference);
  const [displayScore, setDisplayScore] = React.useState(0);

  React.useEffect(() => {
    // Animate stroke
    const timer = setTimeout(() => {
      setStrokeDashoffset(circumference - (score / 100) * circumference);
      setDisplayScore(score);
    }, 100);
    return () => clearTimeout(timer);
  }, [score, circumference]);

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-white rounded-[24px] border border-slate-100 shadow-sm p-6 flex flex-col justify-between h-full hover:shadow-md transition-shadow relative overflow-hidden"
    >
      {/* Decorative background circle */}
      <div className="absolute -right-8 -top-8 w-32 h-32 bg-indigo-50/50 rounded-full blur-2xl pointer-events-none"></div>

      <div className="flex items-center justify-between mb-4 relative z-10">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-indigo-50 flex items-center justify-center">
            <Target size={20} className="text-indigo-600" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-800">Career Readiness</h3>
            <div className="flex items-center gap-2 group relative">
              <p className="text-xs text-slate-500 font-medium mt-0.5 border-b border-dashed border-slate-300 cursor-help">Overall Profile Score</p>
              
              {/* Tooltip */}
              <div className="absolute top-full left-0 mt-2 w-56 p-3 bg-slate-800 rounded-xl shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50 text-white border border-slate-700 pointer-events-none">
                <div className="absolute -top-1 left-4 w-3 h-3 bg-slate-800 transform rotate-45 border-t border-l border-slate-700"></div>
                <h4 className="text-[11px] font-bold text-slate-300 uppercase tracking-wider mb-2 border-b border-slate-700 pb-1">Calculation Weights</h4>
                <ul className="space-y-1.5 text-xs">
                  <li className="flex justify-between"><span>Resume Score</span><span className="font-bold text-indigo-300">25%</span></li>
                  <li className="flex justify-between"><span>GitHub Strength</span><span className="font-bold text-indigo-300">20%</span></li>
                  <li className="flex justify-between"><span>Skill Coverage</span><span className="font-bold text-indigo-300">20%</span></li>
                  <li className="flex justify-between"><span>Projects</span><span className="font-bold text-indigo-300">15%</span></li>
                  <li className="flex justify-between"><span>Interview Readiness</span><span className="font-bold text-indigo-300">10%</span></li>
                  <li className="flex justify-between"><span>LinkedIn Presence</span><span className="font-bold text-indigo-300">10%</span></li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-6 mt-2 relative z-10">
        <div className="relative w-24 h-24 shrink-0 flex items-center justify-center">
          <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
            <circle
              className="text-slate-100"
              strokeWidth="8"
              stroke="currentColor"
              fill="transparent"
              r={radius}
              cx="50"
              cy="50"
            />
            <circle
              className="text-indigo-600 transition-all duration-1000 ease-out"
              strokeWidth="8"
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
              strokeLinecap="round"
              stroke="currentColor"
              fill="transparent"
              r={radius}
              cx="50"
              cy="50"
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <motion.span 
              className="text-2xl font-black text-slate-800"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3 }}
            >
              {displayScore}
            </motion.span>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-[-2px]">/100</span>
          </div>
        </div>

        <div className="flex flex-col gap-3 flex-1">
          <div className={`px-3 py-2 rounded-lg border flex items-center gap-2 w-fit ${getStatusColor(status)}`}>
            {getStatusIcon(status)}
            <span className="text-sm font-bold">{status}</span>
          </div>
          <p className="text-xs text-slate-500 font-medium leading-relaxed">
            {score >= 80 ? "You're in the top percentile! Your profile is highly competitive." :
             score >= 50 ? "You're making great progress. Keep building your portfolio and skills." :
             "Let's get started. Complete your profile and upload your resume."}
          </p>
        </div>
      </div>
    </motion.div>
  );
}
