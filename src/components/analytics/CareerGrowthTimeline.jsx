import React from 'react';
import { Milestone, FileText, Code2, BrainCircuit, Play, Briefcase, Map } from 'lucide-react';
import { motion } from 'framer-motion';
import { useCareer } from '../../contexts/CareerContext';
import { useResumeInsights } from '../../hooks/useResumeInsights';

export default function CareerGrowthTimeline() {
  const { careerContext } = useCareer();
  const { hasInsights } = useResumeInsights();

  const hasGithub = careerContext?.githubScore > 0;
  
  const timelineEvents = [
    {
      id: 1,
      title: 'Profile Created',
      date: 'Aug 15, 2025',
      description: 'Joined OpportunityOS.',
      icon: Milestone,
      color: 'bg-emerald-500',
      done: true
    },
    {
      id: 2,
      title: 'Resume Analyzed',
      date: hasInsights ? 'Recent' : 'Pending',
      description: hasInsights ? 'ATS scoring and keyword extraction completed.' : 'Upload your resume for AI review.',
      icon: FileText,
      color: hasInsights ? 'bg-indigo-500' : 'bg-slate-300',
      done: hasInsights
    },
    {
      id: 3,
      title: 'GitHub Connected',
      date: hasGithub ? 'Recent' : 'Pending',
      description: hasGithub ? 'Analyzed project portfolio and tech stack.' : 'Link GitHub for code analysis.',
      icon: Code2,
      color: hasGithub ? 'bg-[#24292e]' : 'bg-slate-300',
      done: hasGithub
    },
    {
      id: 4,
      title: 'Skill Gap Generated',
      date: (hasInsights || hasGithub) ? 'Recent' : 'Pending',
      description: 'Personalized skill mapping created.',
      icon: BrainCircuit,
      color: (hasInsights || hasGithub) ? 'bg-blue-500' : 'bg-slate-300',
      done: (hasInsights || hasGithub)
    },
    {
      id: 5,
      title: 'Project Recommendations Generated',
      date: 'Pending',
      description: 'Curated projects to close skill gaps.',
      icon: Briefcase,
      color: 'bg-slate-300',
      done: false
    },
    {
      id: 6,
      title: 'Interview Prep Pending',
      date: 'Pending',
      description: 'Mock interviews based on target role.',
      icon: Play,
      color: 'bg-slate-300',
      done: false
    },
    {
      id: 7,
      title: 'Career Roadmap Pending',
      date: 'Pending',
      description: 'Your ultimate path to your dream job.',
      icon: Map,
      color: 'bg-slate-300',
      done: false
    }
  ];

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.3 }}
      className="bg-white rounded-[24px] border border-slate-100 shadow-sm p-6 lg:col-span-2 hover:shadow-md transition-shadow h-full"
    >
      <div className="flex items-center gap-3 mb-8">
        <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center shrink-0">
          <Milestone size={20} className="text-slate-600" />
        </div>
        <div>
          <h3 className="text-sm font-bold text-slate-800">Career Trajectory</h3>
          <p className="text-xs text-slate-500 font-medium mt-0.5">Your progression milestones</p>
        </div>
      </div>

      <div className="relative pl-3">
        <div className="absolute left-[27px] top-4 bottom-4 w-0.5 bg-slate-100"></div>
        <div className="space-y-6">
          {timelineEvents.map((event, idx) => {
            const Icon = event.icon;
            return (
              <motion.div 
                key={event.id} 
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 + (idx * 0.1) }}
                className="relative flex gap-5"
              >
                <div className={`relative z-10 w-10 h-10 rounded-full flex items-center justify-center shrink-0 text-white shadow-sm ring-4 ring-white ${event.color}`}>
                  <Icon size={18} />
                </div>
                <div className={`flex-1 pt-1 ${!event.done && 'opacity-60'}`}>
                  <div className="flex flex-col sm:flex-row sm:justify-between sm:items-baseline gap-1 mb-1">
                    <h4 className="text-sm font-bold text-slate-800">{event.title}</h4>
                    <span className="text-[11px] font-bold text-slate-400">{event.date}</span>
                  </div>
                  <p className="text-xs text-slate-500 font-medium">{event.description}</p>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </motion.div>
  );
}
