import React, { useEffect, useState } from 'react';
import { TrendingUp, CheckCircle2, ArrowRight, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';
import { useCareer } from '../../contexts/CareerContext';
import { useResumeInsights } from '../../hooks/useResumeInsights';
import { useNavigate } from 'react-router-dom';

export default function CareerGrowthForecastWidget() {
  const { careerContext } = useCareer();
  const { atsScore } = useResumeInsights();
  const navigate = useNavigate();
  
  const [currentReadiness, setCurrentReadiness] = useState(0);
  
  // Calculate mock current readiness
  const calcCurrent = Math.round(((atsScore || 20) * 0.4) + ((careerContext?.githubScore || 0) * 0.3) + 20);
  const potentialReadiness = Math.min(100, calcCurrent + 35); // Simple mock calculation

  useEffect(() => {
    // Animate up to the calcCurrent
    const timer = setTimeout(() => setCurrentReadiness(calcCurrent), 100);
    return () => clearTimeout(timer);
  }, [calcCurrent]);

  const actionSteps = [
    { text: 'Complete 2 target projects', path: '/dashboard/projects' },
    { text: 'Close 4 priority skill gaps', path: '/dashboard/skills' },
    { text: 'Complete mock interview prep', path: '/dashboard/interview' },
    { text: 'Improve GitHub profile score', path: '/dashboard/github' }
  ];

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
      className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-[24px] border border-slate-700 shadow-xl p-6 relative overflow-hidden text-white h-full flex flex-col"
    >
      {/* Decorative background grid/blur */}
      <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-10 mix-blend-overlay pointer-events-none"></div>
      <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/20 rounded-full blur-3xl pointer-events-none -translate-y-1/2 translate-x-1/3"></div>

      <div className="relative z-10 flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-indigo-500/20 flex items-center justify-center border border-indigo-400/30">
            <TrendingUp size={20} className="text-indigo-400" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              Growth Forecast
              <Sparkles size={12} className="text-amber-400" />
            </h3>
            <p className="text-xs text-slate-400 font-medium mt-0.5">Predictive AI projection</p>
          </div>
        </div>
      </div>

      <div className="relative z-10 flex gap-4 mb-8">
        <div className="flex-1 bg-white/5 rounded-2xl p-4 border border-white/10">
          <span className="text-xs text-slate-400 font-bold uppercase tracking-wider block mb-1">Current Readiness</span>
          <div className="flex items-baseline gap-1">
            <span className="text-3xl font-black text-white">{currentReadiness}</span>
            <span className="text-sm text-slate-400 font-bold">%</span>
          </div>
        </div>
        <div className="flex items-center justify-center text-slate-500">
          <ArrowRight size={24} className="animate-pulse" />
        </div>
        <div className="flex-1 bg-indigo-500/10 rounded-2xl p-4 border border-indigo-500/20 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full animate-[shimmer_2s_infinite]"></div>
          <span className="text-xs text-indigo-300 font-bold uppercase tracking-wider block mb-1">Potential Peak</span>
          <div className="flex items-baseline gap-1">
            <span className="text-3xl font-black text-indigo-400">{potentialReadiness}</span>
            <span className="text-sm text-indigo-500 font-bold">%</span>
          </div>
        </div>
      </div>

      <div className="relative z-10 flex-1 flex flex-col gap-1">
        <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">To reach this peak:</h4>
        <div className="space-y-2.5">
          {actionSteps.map((step, idx) => (
            <motion.div 
              key={idx}
              whileHover={{ x: 4, backgroundColor: 'rgba(255,255,255,0.1)' }}
              onClick={() => navigate(step.path)}
              className="flex items-center gap-3 p-2.5 rounded-xl bg-white/5 border border-white/5 hover:border-indigo-400/30 transition-all cursor-pointer group"
            >
              <CheckCircle2 size={16} className="text-emerald-400 shrink-0" />
              <span className="text-sm font-medium text-slate-200 flex-1">{step.text}</span>
              <ArrowRight size={14} className="text-slate-500 group-hover:text-indigo-400 transition-colors opacity-0 group-hover:opacity-100" />
            </motion.div>
          ))}
        </div>
      </div>
    </motion.div>
  );
}
