import React from 'react';
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer, Tooltip } from 'recharts';
import { Activity } from 'lucide-react';
import { motion } from 'framer-motion';
import { useCareer } from '../../contexts/CareerContext';
import { useResumeInsights } from '../../hooks/useResumeInsights';

export default function PlatformAnalysisRadar() {
  const { careerContext } = useCareer();
  const { atsScore } = useResumeInsights();

  const githubScore = careerContext?.githubScore || 0;
  // If no linkedin completeness is available, derive it roughly or set default
  const linkedinScore = careerContext?.linkedinScore || 0; 
  const alignmentScore = careerContext?.alignmentScore || 0;
  
  // Calculate proxy metrics
  const missingCount = careerContext?.missingSkills?.length || 5;
  const skillsScore = Math.max(0, 100 - (missingCount * 10)); // Simple proxy metric
  const projectScore = careerContext?.githubScore > 50 ? 80 : 40; // Proxy for projects
  const interviewScore = 30; // Proxy for interview prep
  const progressScore = Math.round((Math.max(0, 12 - missingCount) / 12) * 100) || 15; // Skill Gap Progress

  const data = [
    { subject: 'Resume', A: atsScore || 20, fullMark: 100 },
    { subject: 'GitHub', A: githubScore || 20, fullMark: 100 },
    { subject: 'Projects', A: projectScore, fullMark: 100 },
    { subject: 'Interview Prep', A: interviewScore, fullMark: 100 },
    { subject: 'Skill Progress', A: progressScore, fullMark: 100 },
    { subject: 'LinkedIn', A: linkedinScore || 20, fullMark: 100 },
    { subject: 'Alignment', A: alignmentScore || 20, fullMark: 100 },
    { subject: 'Tech Skills', A: skillsScore, fullMark: 100 },
  ];

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.1 }}
      className="bg-white rounded-[24px] border border-slate-100 shadow-sm p-6 flex flex-col h-full hover:shadow-md transition-shadow"
    >
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center shrink-0">
          <Activity size={20} className="text-blue-600" />
        </div>
        <div>
          <h3 className="text-sm font-bold text-slate-800">Platform Presence</h3>
          <p className="text-xs text-slate-500 font-medium mt-0.5">Cross-platform strength analysis</p>
        </div>
      </div>
      
      <div className="flex-1 w-full min-h-[250px] relative -mt-4">
        <ResponsiveContainer width="100%" height="100%">
          <RadarChart cx="50%" cy="50%" outerRadius="70%" data={data}>
            <PolarGrid stroke="#e2e8f0" />
            <PolarAngleAxis 
              dataKey="subject" 
              tick={{ fill: '#64748b', fontSize: 11, fontWeight: 600 }}
            />
            <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} axisLine={false} />
            <Tooltip 
              contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 20px rgba(0,0,0,0.08)' }}
              itemStyle={{ color: '#4f46e5', fontWeight: 'bold' }}
            />
            <Radar
              name="Score"
              dataKey="A"
              stroke="#6366f1"
              strokeWidth={2}
              fill="#818cf8"
              fillOpacity={0.3}
              isAnimationActive={true}
              animationBegin={200}
              animationDuration={1500}
              animationEasing="ease-out"
            />
          </RadarChart>
        </ResponsiveContainer>
      </div>
    </motion.div>
  );
}
