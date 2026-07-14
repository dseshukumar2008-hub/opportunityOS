import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Rocket, Bot, Sparkles, ArrowRight, FileText, Target, LayoutDashboard, BrainCircuit, Check } from 'lucide-react';

export default function SuccessStep({ onFinish, data }) {
  const [confetti, setConfetti] = useState([]);

  useEffect(() => {
    const pieces = Array.from({ length: 40 }).map((_, i) => ({
      id: i,
      x: (Math.random() - 0.5) * (window.innerWidth * 0.8),
      y: (Math.random() - 0.5) * (window.innerHeight * 0.8) - 100,
      color: ['#7C3AED', '#3B82F6', '#10B981', '#F59E0B', '#EC4899', '#8B5CF6'][Math.floor(Math.random() * 6)],
      rotation: Math.random() * 720,
      scale: Math.random() * 0.6 + 0.4,
      shape: Math.random() > 0.5 ? '50%' : '2px'
    }));
    const timer = setTimeout(() => setConfetti(pieces), 800);
    return () => clearTimeout(timer);
  }, []);

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.12, delayChildren: 0.1 }
    }
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] } }
  };

  const firstName = data?.profile?.fullName?.split(' ')[0] || 'User';
  const branch = data?.education?.branch || 'Student';
  const skillsCount = data?.skills?.length || 0;
  const interestsCount = data?.careerInterests?.length || 0;
  const hasResume = !!data?.resume?.fileUrl;

  return (
    <div className="flex flex-col w-full h-full relative overflow-hidden px-8 pb-8 pt-8 bg-white">
      
      {/* Background (Reduced purple glow by 15%) */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
        <div className="absolute top-[-20%] right-[-10%] w-[500px] h-[500px] bg-[#9333EA]/[0.04] rounded-full blur-[120px] animate-pulse" />
        <div className="absolute bottom-[-10%] left-[-20%] w-[400px] h-[400px] bg-[#3B82F6]/5 rounded-full blur-[100px] animate-pulse" style={{ animationDelay: '2s' }} />
      </div>

      <div className="absolute inset-0 pointer-events-none z-50 flex items-center justify-center">
        {confetti.map(c => (
          <motion.div
            key={c.id}
            initial={{ opacity: 0, scale: 0, x: 0, y: 0 }}
            animate={{ opacity: [0, 1, 1, 0], scale: c.scale, x: c.x, y: c.y, rotate: c.rotation }}
            transition={{ duration: 2.5, ease: "easeOut" }}
            className="absolute w-3 h-3"
            style={{ backgroundColor: c.color, borderRadius: c.shape }}
          />
        ))}
      </div>

      <motion.div 
        variants={container}
        initial="hidden"
        animate="show"
        className="flex flex-col w-full h-full mx-auto relative z-10 max-w-[850px] justify-between"
      >
        
        {/* 2. HERO SECTION */}
        <div className="flex flex-col items-center justify-center shrink-0 mt-2 mb-8">
          <motion.div variants={item} className="relative mx-auto mb-5 flex items-center justify-center">
            <div className="absolute inset-0 bg-[#7C3AED]/10 blur-[30px] rounded-full animate-pulse" />
            
            <motion.div 
              animate={{ y: [0, -6, 0] }} 
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
              className="w-20 h-20 bg-gradient-to-br from-white to-purple-50 backdrop-blur-xl rounded-[28px] flex items-center justify-center relative z-10 border border-white/80 shadow-[0_8px_30px_rgba(124,58,237,0.12)]"
            >
              <div className="relative flex items-center justify-center">
                <Rocket size={28} className="text-[#7C3AED] mr-1" strokeWidth={1.5} />
                <Bot size={20} className="text-blue-500 absolute -bottom-1 -right-2" strokeWidth={2.5} />
              </div>
            </motion.div>
            
            <motion.div animate={{ y: [0, -4, 0], opacity: [0.4, 1, 0.4] }} transition={{ duration: 3, repeat: Infinity }} className="absolute -top-3 -right-3 text-purple-400">
              <Sparkles size={18}/>
            </motion.div>
            <motion.div animate={{ y: [0, 4, 0], opacity: [0.4, 1, 0.4] }} transition={{ duration: 3.5, repeat: Infinity, delay: 1 }} className="absolute bottom-0 -left-5 text-blue-400">
              <Sparkles size={14}/>
            </motion.div>
          </motion.div>

          <motion.div variants={item} className="text-center flex flex-col items-center">
            <h2 className="text-[28px] font-[800] text-slate-900 tracking-tight mb-[18px]">
              🎉 Welcome to OpportunityOS
            </h2>
            <p className="text-[15px] text-slate-500 font-medium leading-relaxed max-w-[400px]">
              Your AI Career Workspace is ready.<br/>Everything is personalized and waiting for you.
            </p>
          </motion.div>
        </div>

        {/* 3 & 4. CONTENT ALIGNMENT & FEATURE CARDS */}
        <div className="flex-1 min-h-0 flex flex-col justify-center gap-[32px]">
          
          <div className="grid grid-cols-2 gap-8 h-auto min-h-[240px]">
            {/* SUCCESS CARD */}
            <motion.div variants={item} className="bg-white/70 backdrop-blur-2xl border border-white/60 shadow-[0_8px_30px_rgba(0,0,0,0.04),inset_0_1px_0_rgba(255,255,255,0.8)] rounded-[24px] p-7 flex flex-col h-full relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-400/5 blur-[40px] rounded-full" />
              
              <h3 className="text-[16px] font-extrabold text-slate-900 mb-6 flex items-center gap-2">
                ✨ Everything is Ready
              </h3>
              <div className="space-y-[14px] relative z-10 flex-1 flex flex-col justify-center">
                {[
                  'Profile Created',
                  'Education Added',
                  'Skills Indexed',
                  'Career Interests Saved',
                  'AI Career Coach Activated',
                  'Dashboard Personalized'
                ].map((text, i) => (
                  <motion.div 
                    initial={{ opacity: 0, x: -10, filter: 'blur(4px)' }}
                    animate={{ opacity: 1, x: 0, filter: 'blur(0px)' }}
                    transition={{ delay: 0.8 + (i * 0.12), duration: 0.5, ease: "easeOut" }}
                    key={i} 
                    className="flex items-center gap-3.5 group"
                  >
                    <div className="w-[24px] h-[24px] rounded-full bg-emerald-50 border border-emerald-100 flex items-center justify-center shrink-0 shadow-[0_0_10px_rgba(16,185,129,0.15)] group-hover:scale-110 transition-transform">
                      <Check size={13} className="text-emerald-500" strokeWidth={3} />
                    </div>
                    <span className="text-[14px] font-semibold text-slate-700 tracking-tight">{text}</span>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* FEATURE CARDS */}
            <motion.div variants={item} className="grid grid-cols-2 grid-rows-2 gap-4 h-full">
              {[
                { icon: FileText, title: "AI Resume Analysis", desc: "Analyze ATS score and improve.", color: "text-blue-500", bg: "bg-blue-50/80" },
                { icon: Target, title: "Smart Matching", desc: "Internships tailored to you.", color: "text-purple-500", bg: "bg-purple-50/80" },
                { icon: BrainCircuit, title: "Career Copilot", desc: "Ask AI anything about your career.", color: "text-orange-500", bg: "bg-orange-50/80" },
                { icon: LayoutDashboard, title: "Personalized Dash", desc: "Track all applications.", color: "text-emerald-500", bg: "bg-emerald-50/80" }
              ].map((feat, i) => (
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 1.5 + (i * 0.1), duration: 0.5 }}
                  key={i} 
                  className="bg-white/60 backdrop-blur-xl border border-white/80 hover:border-[#7C3AED]/30 rounded-[24px] p-5 shadow-[0_4px_15px_rgba(0,0,0,0.03)] hover:shadow-[0_8px_25px_rgba(124,58,237,0.1)] hover:-translate-y-1 transition-all duration-300 flex flex-col relative overflow-hidden h-full w-full"
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-white/40 to-transparent pointer-events-none" />
                  
                  <div className="flex items-start justify-between mb-auto relative z-10">
                    <div className={`w-9 h-9 rounded-[12px] ${feat.bg} flex items-center justify-center group-hover:scale-110 transition-transform duration-300 shadow-sm border border-white shrink-0`}>
                      <feat.icon size={16} className={feat.color} />
                    </div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-100 shrink-0">
                      Ready
                    </span>
                  </div>
                  
                  <div className="relative z-10 mt-3">
                    <h4 className="text-[13px] font-bold text-slate-900 mb-1 leading-tight">{feat.title}</h4>
                    <p className="text-[12px] text-slate-500 font-medium leading-snug line-clamp-2">{feat.desc}</p>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </div>

          {/* 5. PROFILE SUMMARY */}
          <motion.div variants={item} className="w-full bg-white/70 backdrop-blur-xl border border-slate-200/50 shadow-sm rounded-[20px] py-4 px-6 flex items-center justify-center gap-6 sm:gap-8 flex-wrap">
            <div className="flex items-center gap-2">
              <span className="text-[16px]">👤</span>
              <span className="text-[13px] font-bold text-slate-800">{firstName}</span>
            </div>
            {branch && (
              <div className="flex items-center gap-2">
                <span className="text-[16px]">🎓</span>
                <span className="text-[13px] font-semibold text-slate-600">{branch}</span>
              </div>
            )}
            <div className="flex items-center gap-2">
              <span className="text-[16px]">💻</span>
              <span className="text-[13px] font-semibold text-slate-600">{skillsCount} Skills</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-[16px]">🎯</span>
              <span className="text-[13px] font-semibold text-slate-600">{interestsCount} Interests</span>
            </div>
            {hasResume && (
              <div className="flex items-center gap-2">
                <span className="text-[16px]">📄</span>
                <span className="text-[13px] font-semibold text-slate-600">Resume Uploaded</span>
              </div>
            )}
            <div className="flex items-center gap-2">
              <span className="text-[16px]">🤖</span>
              <span className="text-[13px] font-semibold text-purple-600">AI Ready</span>
            </div>
          </motion.div>

        </div>

        {/* 6. CTA BUTTON */}
        <div className="flex flex-col items-center shrink-0 w-full mt-10 mb-2">
          <motion.div variants={item} className="w-full flex flex-col items-center">
            <button 
              onClick={onFinish}
              className="w-full max-w-[360px] h-[56px] bg-gradient-to-r from-[#7C3AED] to-[#6D28D9] hover:from-[#6D28D9] hover:to-[#5B21B6] text-white rounded-[20px] font-bold text-[15px] transition-all shadow-[0_8px_25px_rgba(124,58,237,0.3)] hover:shadow-[0_12px_35px_rgba(124,58,237,0.4)] hover:-translate-y-1 active:translate-y-0 active:scale-[0.98] flex items-center justify-center gap-2.5 group relative overflow-hidden mb-4"
            >
              <div className="absolute inset-0 bg-white/20 translate-y-[-100%] group-hover:translate-y-[100%] transition-transform duration-700 ease-in-out" />
              🚀 Launch My Dashboard 
              <ArrowRight size={18} strokeWidth={2.5} className="group-hover:translate-x-1 transition-transform" />
            </button>
            
            <button className="text-[13px] font-semibold text-slate-400 hover:text-slate-700 transition-colors px-6 py-2 rounded-full hover:bg-slate-50">
              Take a Quick Product Tour
            </button>
          </motion.div>
        </div>

      </motion.div>
    </div>
  );
}
