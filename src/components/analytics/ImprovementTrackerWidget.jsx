import React from 'react';
import { Target, CheckCircle2, Circle, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useCareer } from '../../contexts/CareerContext';

export default function ImprovementTrackerWidget() {
  const navigate = useNavigate();
  const { careerContext } = useCareer();
  
  const goals = [
    { title: 'Update Resume Summary', category: 'ATS Optimization', status: 'done', path: '/dashboard/resume' },
    { title: 'Learn ' + (careerContext?.missingSkills?.[0] || 'System Design'), category: 'Skill Acquisition', status: 'in-progress', path: '/dashboard/skills' },
    { title: 'Complete Mock Interview', category: 'Interview Prep', status: 'pending', path: '/dashboard/interview' },
    { title: 'Add 2 Projects to GitHub', category: 'Portfolio', status: 'pending', path: '/dashboard/projects' }
  ];

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
      className="bg-white rounded-[24px] border border-slate-100 shadow-sm p-6 hover:shadow-md transition-shadow flex flex-col h-full"
    >
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 rounded-xl bg-orange-50 flex items-center justify-center shrink-0">
          <Target size={20} className="text-orange-600" />
        </div>
        <div>
          <h3 className="text-sm font-bold text-slate-800">Action Plan</h3>
          <p className="text-xs text-slate-500 font-medium mt-0.5">Short-term growth objectives</p>
        </div>
      </div>

      <div className="flex flex-col gap-3 flex-1 justify-center">
        {goals.map((goal, idx) => (
          <motion.div 
            key={idx}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 + (idx * 0.1) }}
            onClick={() => goal.path && navigate(goal.path)}
            className={`flex items-start gap-3 p-3 rounded-xl transition-colors group ${goal.path ? 'hover:bg-slate-50 cursor-pointer' : ''}`}
          >
            <div className="mt-0.5 shrink-0">
              {goal.status === 'done' ? (
                <CheckCircle2 size={16} className="text-emerald-500" />
              ) : goal.status === 'in-progress' ? (
                <div className="w-4 h-4 rounded-full border-2 border-orange-500 border-t-transparent animate-spin" />
              ) : (
                <Circle size={16} className="text-slate-300 group-hover:border-indigo-400 transition-colors" />
              )}
            </div>
            <div className="flex-1">
              <h4 className={`text-sm font-bold ${goal.status === 'done' ? 'text-slate-400 line-through' : 'text-slate-700'}`}>
                {goal.title}
              </h4>
              <p className="text-[11px] font-medium text-slate-400 mt-0.5">{goal.category}</p>
            </div>
            {goal.status !== 'done' && goal.path && (
              <button className="opacity-0 group-hover:opacity-100 transition-opacity p-1.5 hover:bg-white rounded-lg text-slate-400 hover:text-indigo-600 shadow-sm border border-transparent hover:border-slate-200">
                <ArrowRight size={14} />
              </button>
            )}
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}
