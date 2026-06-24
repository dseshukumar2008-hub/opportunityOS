import React, { useMemo } from 'react';
import { AlertCircle, Code, Server, LayoutTemplate, Shield, Database, Cpu } from 'lucide-react';
import { motion } from 'framer-motion';
import { useCareer } from '../../contexts/CareerContext';

export default function TopMissingSkillsWidget() {
  const { careerContext } = useCareer();
  const targetRole = careerContext?.targetRole || 'Software Engineer';
  
  // Role-specific mock data generator
  const generatedSkills = useMemo(() => {
    if (careerContext?.missingSkills && careerContext.missingSkills.length > 0) {
      return careerContext.missingSkills;
    }
    
    const roleMap = {
      'AI Engineer': ['RAG', 'Vector Databases', 'MLOps', 'Docker'],
      'Software Engineer': ['System Design', 'Testing', 'API Design', 'Scalability'],
      'Cyber Security': ['Threat Detection', 'SIEM', 'Penetration Testing', 'Network Auth'],
      'Data Scientist': ['Spark', 'PyTorch', 'Data Pipelines', 'A/B Testing']
    };
    
    // Find closest match or default
    const matchedRole = Object.keys(roleMap).find(r => targetRole.toLowerCase().includes(r.toLowerCase()));
    return roleMap[matchedRole] || roleMap['Software Engineer'];
  }, [careerContext?.missingSkills, targetRole]);

  const missingSkills = generatedSkills;

  const getIconForSkill = (skill) => {
    const s = skill.toLowerCase();
    if (s.includes('react') || s.includes('css') || s.includes('ui')) return <LayoutTemplate size={14} className="text-pink-500" />;
    if (s.includes('node') || s.includes('sql') || s.includes('api') || s.includes('server')) return <Server size={14} className="text-emerald-500" />;
    if (s.includes('threat') || s.includes('security') || s.includes('siem') || s.includes('auth')) return <Shield size={14} className="text-red-500" />;
    if (s.includes('data') || s.includes('vector') || s.includes('spark')) return <Database size={14} className="text-blue-500" />;
    if (s.includes('ml') || s.includes('rag') || s.includes('ai') || s.includes('torch')) return <Cpu size={14} className="text-purple-500" />;
    return <Code size={14} className="text-indigo-500" />;
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
      className="bg-white rounded-[24px] border border-slate-100 shadow-sm p-6 hover:shadow-md transition-shadow h-full flex flex-col"
    >
      <div className="flex items-center gap-3 mb-5">
        <div className="w-10 h-10 rounded-xl bg-rose-50 flex items-center justify-center shrink-0">
          <AlertCircle size={20} className="text-rose-600" />
        </div>
        <div>
          <h3 className="text-sm font-bold text-slate-800">Priority Missing Skills</h3>
          <p className="text-xs text-slate-500 font-medium mt-0.5">Identified from market analysis</p>
        </div>
      </div>

      <div className="flex-1 flex flex-col justify-center gap-3 mt-2">
        {missingSkills.slice(0, 4).map((skill, index) => (
          <motion.div 
            key={index} 
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 + (index * 0.1) }}
            whileHover={{ scale: 1.02 }}
            className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-100 hover:bg-slate-100 transition-all cursor-default"
          >
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-white shadow-sm flex items-center justify-center border border-slate-100">
                {getIconForSkill(skill)}
              </div>
              <span className="text-sm font-bold text-slate-700">{skill}</span>
            </div>
            <span className="text-[10px] font-bold px-2 py-1 bg-white border border-slate-200 rounded-md text-slate-500 uppercase">
              High Priority
            </span>
          </motion.div>
        ))}
        {missingSkills.length === 0 && (
          <div className="text-center p-4 bg-emerald-50 rounded-xl border border-emerald-100">
            <p className="text-sm font-bold text-emerald-700">No critical missing skills!</p>
            <p className="text-xs text-emerald-600 mt-1">Your profile perfectly aligns with your target role.</p>
          </div>
        )}
      </div>
    </motion.div>
  );
}
