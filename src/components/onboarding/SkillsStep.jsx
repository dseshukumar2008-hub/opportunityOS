import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Check, Code2, ArrowRight, ArrowLeft, Layout, Server, Database, Cpu, Cloud, Settings, Smartphone, PieChart } from 'lucide-react';

const skillCategories = [
  {
    title: 'Frontend',
    icon: Layout,
    skills: ['React', 'JavaScript', 'TypeScript', 'HTML5', 'CSS3', 'Tailwind CSS', 'Next.js', 'Vue.js', 'Angular', 'Bootstrap', 'Redux', 'SASS']
  },
  {
    title: 'Backend',
    icon: Server,
    skills: ['Node.js', 'Express.js', 'Python', 'Django', 'Flask', 'FastAPI', 'Java', 'Spring Boot', 'C#', 'PHP', 'Go', 'C++']
  },
  {
    title: 'Databases',
    icon: Database,
    skills: ['MongoDB', 'PostgreSQL', 'MySQL', 'SQLite', 'Firebase', 'Supabase', 'Redis', 'Oracle', 'SQL Server']
  },
  {
    title: 'AI / Machine Learning',
    icon: Cpu,
    skills: ['Python', 'NumPy', 'Pandas', 'Scikit-Learn', 'TensorFlow', 'PyTorch', 'OpenCV', 'Hugging Face', 'LangChain', 'OpenAI API', 'Gemini API']
  },
  {
    title: 'Cloud & DevOps',
    icon: Cloud,
    skills: ['Git', 'GitHub', 'Docker', 'Kubernetes', 'AWS', 'Azure', 'Google Cloud (GCP)', 'Vercel', 'Netlify', 'Render', 'Railway', 'GitHub Actions']
  },
  {
    title: 'Tools & Platforms',
    icon: Settings,
    skills: ['VS Code', 'IntelliJ IDEA', 'Android Studio', 'PyCharm', 'Postman', 'Figma', 'Jira', 'Linux', 'Vite', 'npm', 'GitLab']
  },
  {
    title: 'Mobile Development',
    icon: Smartphone,
    skills: ['Flutter', 'React Native', 'Kotlin', 'Swift', 'Android', 'iOS']
  },
  {
    title: 'Data & Analytics',
    icon: PieChart,
    skills: ['Power BI', 'Tableau', 'Excel', 'Apache Spark', 'Hadoop']
  }
];

export default function SkillsStep({ onNext, onBack, data = [], updateData }) {
  const [selectedSkills, setSelectedSkills] = useState(data);

  useEffect(() => {
    if (updateData) {
      updateData(selectedSkills);
    }
  }, [selectedSkills]);

  const toggleSkill = (skill) => {
    setSelectedSkills(prev => 
      prev.includes(skill) 
        ? prev.filter(s => s !== skill)
        : [...prev, skill]
    );
  };

  return (
    <div className="flex flex-col w-full px-2 sm:px-6 relative">
      <motion.div 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="flex flex-col w-full mx-auto relative z-10 max-w-[760px]"
      >
        
        {/* Header */}
        <div className="mb-6 w-full pt-4">
          <h2 className="text-[32px] font-[800] leading-[1.05] tracking-[-0.02em] text-[#1F2435] flex items-center gap-[12px]">
            Skills & Tech Stack <span className="text-[24px] leading-none flex items-center">🛠️</span>
          </h2>
          <p className="text-[15px] font-[500] text-[#64748B] mt-[8px]">Select the technologies you work with.</p>
        </div>

        {/* Scrollable Form Container */}
        <div className="px-2 sm:px-4 pr-[8px] pb-8 flex flex-col gap-7">
          {skillCategories.map((category, idx) => {
            const Icon = category.icon;
            return (
              <motion.div 
                key={category.title}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.05 + 0.1, duration: 0.4 }}
                className={`flex flex-col gap-3.5 ${idx < skillCategories.length - 1 ? 'pb-7 border-b border-slate-100' : ''}`}
              >
                <div className="flex items-center gap-2 mb-1">
                   <Icon size={16} className="text-[#64748B]" />
                  <h3 className="text-[13px] font-bold text-[#64748B] uppercase tracking-wider ml-1">
                    {category.title}
                  </h3>
                </div>
                <div className="flex flex-wrap gap-2.5">
                  {category.skills.map(skill => {
                    const isSelected = selectedSkills.includes(skill);
                    return (
                      <motion.button
                        key={skill}
                        whileHover={{ y: -2 }}
                        whileTap={{ scale: 0.98 }}
                        animate={{ scale: isSelected ? 1.02 : 1 }}
                        onClick={() => toggleSkill(skill)}
                        className={`relative flex items-center justify-center px-5 py-2.5 rounded-xl border transition-all duration-200 ${isSelected ? 'border-transparent bg-gradient-to-r from-[#7C3AED] to-[#6D28D9] text-white shadow-[0_8px_20px_rgba(124,58,237,0.3)]' : 'border-[#E8EAF5] bg-white hover:border-[#C4B5FD] hover:bg-[#F5F2FF] hover:shadow-md shadow-sm'}`}
                      >
                        <span className={`text-[14px] font-semibold tracking-wide ${isSelected ? 'text-white' : 'text-[#475569]'}`}>{skill}</span>
                        {isSelected && <Check size={15} className="ml-1.5 text-white shrink-0" strokeWidth={3} />}
                      </motion.button>
                    );
                  })}
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-between w-full pt-4 pb-6 mt-auto">
          {onBack ? (
            <button 
              onClick={onBack}
              className="flex items-center gap-3 text-[#1F2435] font-bold text-[15px] hover:text-[#7C3AED] transition-colors group"
            >
              <div className="w-[58px] h-[58px] rounded-full border border-white/60 bg-white/40 backdrop-blur-md shadow-[0_2px_8px_rgba(0,0,0,0.04)] flex items-center justify-center group-hover:border-[#C4B5FD] group-hover:shadow-[0_0_15px_rgba(124,58,237,0.15)] transition-all duration-200">
                <ArrowLeft size={22} strokeWidth={2} className="text-slate-600 group-hover:text-[#7C3AED] transition-colors" />
              </div>
              Back
            </button>
          ) : <div></div>}
          
          <button
            onClick={onNext}
            className="h-[58px] px-8 bg-gradient-to-r from-[#7C3AED] to-[#6D28D9] text-white rounded-[18px] font-bold text-[16px] shadow-[0_12px_24px_rgba(124,58,237,0.25)] hover:-translate-y-[2px] hover:shadow-[0_16px_32px_rgba(124,58,237,0.35)] active:translate-y-0 active:scale-[0.98] active:shadow-[0_4px_12px_rgba(124,58,237,0.2)] transition-all duration-200 flex items-center justify-center gap-3"
          >
            Continue
            <ArrowRight size={22} strokeWidth={2} />
          </button>
        </div>

      </motion.div>
    </div>
  );
}
