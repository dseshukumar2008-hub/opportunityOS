import { useState } from 'react';
import { Bot, Sparkles, Send, FileSearch, Target, Briefcase, Lightbulb } from 'lucide-react';

export default function AICopilotPanel() {
  const [query, setQuery] = useState('');

  return (
    <div className="bg-gradient-to-br from-[#6D5DF6] to-[#5a4add] rounded-[20px] p-6 text-white shadow-[0_8px_24px_-12px_rgba(109,93,246,0.5)] w-full">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-white/20 backdrop-blur-md flex items-center justify-center">
            <Bot size={20} className="text-white" />
          </div>
          <h2 className="text-[16px] font-bold">AI Copilot</h2>
        </div>
        <div className="flex items-center gap-1.5 bg-white/20 px-2 py-1 rounded-full backdrop-blur-md">
          <span className="w-1.5 h-1.5 rounded-full bg-[#00D084] animate-pulse"></span>
          <span className="text-[10px] font-bold tracking-wider uppercase">Online</span>
        </div>
      </div>

      {/* Greeting message */}
      <div className="mb-6">
        <p className="text-[13px] font-medium leading-relaxed text-white/90">
          Hey D! I'm here to help you achieve your dream career.
        </p>
      </div>

      {/* Suggested Actions */}
      <div className="space-y-2.5 mb-6">
        <button className="w-full flex items-center gap-3 p-3 rounded-[12px] bg-white/10 hover:bg-white/20 transition-colors border border-white/5 text-left">
          <FileSearch size={16} className="text-white/80" />
          <span className="text-[13px] font-semibold text-white">Review my resume</span>
        </button>
        <button className="w-full flex items-center gap-3 p-3 rounded-[12px] bg-white/10 hover:bg-white/20 transition-colors border border-white/5 text-left">
          <Briefcase size={16} className="text-white/80" />
          <span className="text-[13px] font-semibold text-white">Find me high-match jobs</span>
        </button>
        <button className="w-full flex items-center gap-3 p-3 rounded-[12px] bg-white/10 hover:bg-white/20 transition-colors border border-white/5 text-left">
          <Lightbulb size={16} className="text-white/80" />
          <span className="text-[13px] font-semibold text-white">Which skills should I learn?</span>
        </button>
        <button className="w-full flex items-center gap-3 p-3 rounded-[12px] bg-white/10 hover:bg-white/20 transition-colors border border-white/5 text-left">
          <Target size={16} className="text-white/80" />
          <span className="text-[13px] font-semibold text-white">How to prepare for interviews?</span>
        </button>
      </div>

      {/* Input Field */}
      <div className="relative">
        <input 
          type="text" 
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Ask anything..." 
          className="w-full bg-white/10 border border-white/20 text-white placeholder-white/50 rounded-[14px] pl-4 pr-10 py-3 text-[13px] font-medium focus:outline-none focus:ring-2 focus:ring-white/30 backdrop-blur-md"
        />
        <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1">
          <button className="p-1.5 text-white/50 hover:text-white transition-colors">
            <Sparkles size={16} />
          </button>
          <button className="p-1.5 bg-white text-[#6D5DF6] rounded-[8px] shadow-sm hover:scale-105 transition-transform">
            <Send size={14} className="ml-0.5" />
          </button>
        </div>
      </div>
    </div>
  );
}
