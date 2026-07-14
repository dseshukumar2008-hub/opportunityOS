import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { UserRoundPen, ArrowRight, ArrowLeft } from 'lucide-react';

export default function AboutStep({ onNext, onBack, data = {}, updateData }) {
  const [focused, setFocused] = useState(false);
  const maxLength = 300;
  
  // Local state as fallback if FloatingOnboarding isn't passing data yet
  const [localText, setLocalText] = useState(data.about || '');

  const text = data.about !== undefined ? data.about : localText;
  
  const handleChange = (e) => {
    const val = e.target.value;
    if (val.length <= maxLength) {
      if (updateData) {
        updateData({ about: val });
      }
      setLocalText(val);
    }
  };

  return (
    <div className="flex flex-col w-full px-2 sm:px-6 relative">
      <motion.div 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="flex flex-col w-full mx-auto relative z-10 max-w-[640px]"
      >
        
        {/* Header */}
        <div className="mb-6 w-full pt-4">
          <h2 className="text-[32px] font-[800] leading-[1.05] tracking-[-0.02em] text-[#1F2435] flex items-center gap-[12px]">
            About Me <span className="text-[24px] leading-none flex items-center">✍️</span>
          </h2>
          <p className="text-[15px] font-[500] text-[#64748B] mt-[8px]">Write a short introduction.</p>
        </div>

        {/* Form Container */}
        <div className="px-2 sm:px-4 pr-[8px] pb-8 flex flex-col">
          
          <div className="flex flex-col relative w-full group">
            <div className={`relative flex flex-col bg-gradient-to-b from-[#ffffff] to-[#fcfcff] border rounded-[18px] transition-all duration-300 ease-in-out overflow-hidden shadow-sm ${focused ? 'border-[#C4B5FD] shadow-[0_0_0_4px_rgba(124,58,237,0.08)]' : 'border-[#E8EAF5] hover:border-[#C4B5FD] hover:shadow-md'}`}>
              
              <textarea
                value={text}
                onChange={handleChange}
                onFocus={() => setFocused(true)}
                onBlur={() => setFocused(false)}
                className="w-full min-h-[200px] max-h-[360px] bg-transparent border-none focus:ring-0 text-[16px] font-medium text-[#1F2435] p-6 outline-none placeholder:text-[#94A3B8] resize-y"
                placeholder="Example:&#10;I'm a Computer Science student passionate about web development, AI, and solving real-world problems through technology. I enjoy learning new tools, collaborating on projects, and continuously improving my skills."
              />
              
              <div className="flex items-center justify-between px-5 pb-4 pt-1">
                <span className="text-[13px] font-medium text-[#94A3B8]">
                  Write 2–5 sentences about yourself.
                </span>
                <span className={`text-[13px] font-bold ${text.length === maxLength ? 'text-red-500' : 'text-[#94A3B8]'}`}>
                  {text.length} / {maxLength}
                </span>
              </div>
            </div>
          </div>
          
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-between w-full pt-4 mt-auto">
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
