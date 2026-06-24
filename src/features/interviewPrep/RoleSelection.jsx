import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Bot, Target, MessageSquare, Sparkles, FileText, CheckCircle, AlertTriangle, 
  ChevronRight, BrainCircuit, Activity, BarChart3, HelpCircle, Code, Shield, Cloud, Play,
  Layers, Layout, Database, Cpu, Smartphone
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { useProfile } from '../../contexts/ProfileContext';
import { getUserFirstName } from '../../utils/userUtils';
import HowItWorksModal from './HowItWorksModal';

const ROLES = [
  { 
    name: 'Software Engineer', 
    focus: 'DSA • OOP • System Design', 
    questions: '30+', 
    difficulty: 'Intermediate',
    icon: Code
  },
  { 
    name: 'Full Stack Developer', 
    focus: 'Frontend • Backend • Databases', 
    questions: '30+', 
    difficulty: 'Intermediate',
    icon: Layers
  },
  { 
    name: 'Frontend Developer', 
    focus: 'React • UI/UX • Web Perf', 
    questions: '25+', 
    difficulty: 'Intermediate',
    icon: Layout
  },
  { 
    name: 'Backend Developer', 
    focus: 'APIs • Node.js • Architecture', 
    questions: '25+', 
    difficulty: 'Intermediate',
    icon: Database
  },
  { 
    name: 'AI Engineer', 
    focus: 'LLMs • RAG • Agents • ML', 
    questions: '25+', 
    difficulty: 'Advanced',
    icon: BrainCircuit
  },
  { 
    name: 'Machine Learning Engineer', 
    focus: 'Deep Learning • NLP • MLOps', 
    questions: '25+', 
    difficulty: 'Advanced',
    icon: Cpu
  },
  { 
    name: 'Data Scientist', 
    focus: 'ML • Statistics • Data Analysis', 
    questions: '25+', 
    difficulty: 'Intermediate',
    icon: Activity
  },
  { 
    name: 'Data Analyst', 
    focus: 'SQL • Tableau • Analytics', 
    questions: '20+', 
    difficulty: 'Intermediate',
    icon: BarChart3
  },
  { 
    name: 'Cloud Engineer', 
    focus: 'AWS • Azure • Infrastructure', 
    questions: '20+', 
    difficulty: 'Intermediate',
    icon: Cloud
  },
  { 
    name: 'DevOps Engineer', 
    focus: 'CI/CD • Docker • Kubernetes', 
    questions: '20+', 
    difficulty: 'Intermediate',
    icon: Target
  },
  { 
    name: 'Cyber Security Engineer', 
    focus: 'Network Security • Threats', 
    questions: '25+', 
    difficulty: 'Advanced',
    icon: Shield
  },
  { 
    name: 'Mobile App Developer', 
    focus: 'React Native • iOS • Android', 
    questions: '20+', 
    difficulty: 'Intermediate',
    icon: Smartphone
  }
];

export default function RoleSelection({ onSelectRole, loading, activeSessionRole, initialRole }) {
  const { user } = useAuth();
  const { profile } = useProfile();
  const userName = getUserFirstName(user, profile) || 'there';
  const [selectedRole, setSelectedRole] = useState(() => {
    if (initialRole) {
      const match = ROLES.find(r => r.name === initialRole);
      return match || null;
    }
    return null;
  });
  const [showHowItWorks, setShowHowItWorks] = useState(false);

  const handleStart = () => {
    if (selectedRole) {
      onSelectRole(selectedRole.name);
    }
  };

  const isResuming = activeSessionRole && selectedRole?.name === activeSessionRole;

  return (
    <div className="max-w-6xl mx-auto px-4 py-0 space-y-6">
      
      {/* Hero Section */}
      <section className="text-center space-y-3 pt-0">
        <div className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-50 text-[#6D4AFF] rounded-full text-sm font-bold tracking-wide">
          <Bot size={18} /> OpportunityOS Premium Feature
        </div>
        <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 tracking-tight">
          AI Interview Coach
        </h1>
        <p className="text-lg md:text-xl text-slate-600 max-w-3xl mx-auto leading-relaxed">
          Prepare for real-world interviews with AI-generated questions, instant feedback, ideal answers, and personalized improvement suggestions.
        </p>
        <p className="text-[#6D4AFF] font-semibold text-lg">
          Practice. Improve. Get interview-ready.
        </p>
      </section>





      {/* Main Content Area: Roles */}
      <section className="max-w-4xl mx-auto">
        
        {/* Role Cards List */}
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-bold text-slate-900 flex items-center gap-2">
              <Target size={20} className="text-[#6D4AFF]" /> Select Your Target Role
            </h3>
            <button 
              onClick={() => setShowHowItWorks(true)}
              className="px-4 py-2.5 bg-white border border-slate-200 text-slate-700 text-sm font-bold rounded-xl hover:bg-slate-50 transition-colors shadow-sm hidden sm:block"
            >
              How It Works
            </button>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {ROLES.map((role, idx) => (
              <motion.button
                key={role.name}
                initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: idx * 0.05 }}
                onClick={() => setSelectedRole(role)}
                className={`text-left p-4 rounded-2xl border-2 transition-all group relative overflow-hidden ${
                  selectedRole?.name === role.name 
                    ? 'border-[#6D4AFF] bg-indigo-50/50 shadow-md' 
                    : 'border-slate-200 bg-white hover:border-[#6D4AFF]/50 hover:shadow-sm'
                }`}
              >
                <div className="flex justify-between items-start mb-2">
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${
                    selectedRole?.name === role.name ? 'bg-[#6D4AFF] text-white' : 'bg-slate-100 text-slate-600 group-hover:bg-[#6D4AFF]/10 group-hover:text-[#6D4AFF]'
                  } transition-colors`}>
                    <role.icon size={16} />
                  </div>
                  <div className="text-right">
                    <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider ${
                      role.difficulty === 'Advanced' ? 'bg-rose-50 text-rose-600' : 'bg-blue-50 text-blue-600'
                    }`}>
                      {role.difficulty}
                    </span>
                  </div>
                </div>
                <h4 className="font-bold text-slate-900 mb-0.5 text-sm">{role.name}</h4>
                <p className="text-[11px] text-slate-500 font-medium mb-3 line-clamp-1">{role.focus}</p>
                <div className="flex items-center gap-1.5 text-[11px] font-bold text-slate-400">
                  <HelpCircle size={12} /> {role.questions} Questions
                </div>
              </motion.button>
            ))}
          </div>

          <div className="flex gap-4 pt-4">
            <button
              onClick={handleStart}
              disabled={!selectedRole || loading}
              className="w-full flex items-center justify-center gap-2 bg-[#6D4AFF] text-white py-4 rounded-xl font-bold hover:bg-[#5B3DE6] transition-colors shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  Generating Session...
                </>
              ) : (
                <>
                  <Play size={18} fill="currentColor" /> {isResuming ? 'Continue Interview' : 'Start Interview'}
                </>
              )}
            </button>
          </div>
        </div>

      </section>

      <HowItWorksModal 
        isOpen={showHowItWorks} 
        onClose={() => setShowHowItWorks(false)} 
      />
    </div>
  );
}
