import { Sparkles, FileText, Target, TrendingUp, Briefcase, Code2, Users2, Send } from 'lucide-react';

const QUICK_PROMPTS = [
  { icon: FileText,   label: 'Resume Tips',           prompt: 'Give me 5 actionable tips to improve my resume for tech roles.' },
  { icon: Target,     label: 'Interview Prep',        prompt: 'Help me prepare for a technical software engineering interview.' },
  { icon: TrendingUp, label: 'Career Path',           prompt: 'What career path should I take to become a Senior Software Engineer?' },
  { icon: Briefcase,  label: 'Salary Negotiation',   prompt: 'How do I negotiate a better salary for a software engineering offer?' },
  { icon: Code2,      label: 'Skill Gaps',            prompt: 'What skills should I learn to become more competitive?' },
  { icon: Users2,     label: 'Networking',            prompt: 'Give me a strategy for building my professional network.' },
];

function MessageBubble({ isUser, content }) {
  return (
    <div className={`flex gap-3 mb-6 ${isUser ? 'flex-row-reverse' : 'flex-row'}`}>
      {!isUser && (
        <div className="w-9 h-9 rounded-2xl bg-gradient-to-br from-[#6C4CF1] to-indigo-500 flex items-center justify-center shrink-0 shadow-md shadow-indigo-200">
          <Sparkles size={16} className="text-white" />
        </div>
      )}
      <div className={`max-w-[75%] rounded-[20px] px-5 py-4 shadow-sm ${
        isUser
          ? 'bg-gradient-to-br from-[#6C4CF1] to-indigo-500 text-white rounded-tr-sm'
          : 'bg-white border border-slate-100 text-slate-800 rounded-tl-sm'
      }`}>
        <p className="text-[15px] leading-relaxed whitespace-pre-wrap">{content}</p>
      </div>
    </div>
  );
}

export default function Step5AICoach() {
  return (
    <div className="h-[700px] max-w-4xl mx-auto w-full flex flex-col bg-[#F9FAFB] rounded-2xl shadow-sm border border-slate-200 overflow-hidden animate-in fade-in duration-500">
      <div className="bg-white border-b border-slate-200 px-6 py-4 flex items-center justify-between z-10 shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-[#6C4CF1] to-indigo-500 flex items-center justify-center shadow-sm shadow-indigo-200">
            <Sparkles size={20} className="text-white" />
          </div>
          <div>
            <h1 className="text-lg font-black text-slate-900 leading-tight">AI Career Copilot</h1>
            <p className="text-[13px] font-medium text-slate-500">Powered by OpportunityOS</p>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-6 scroll-smooth custom-scrollbar">
        <MessageBubble 
          isUser={false} 
          content={"👋 Hi! I'm your AI Career Copilot, powered by OpportunityOS Intelligence.\n\nI can help you with:\n- 📄 Resume optimization and ATS improvements\n- 🎯 Interview preparation and mock Q&As\n- 📈 Career planning and skill gap analysis\n\nWhat would you like to work on today?"} 
        />
        <MessageBubble 
          isUser={true} 
          content="Give me 5 actionable tips to improve my resume for tech roles." 
        />
        <MessageBubble 
          isUser={false} 
          content={"Here are 5 actionable tips to improve your resume for tech roles:\n\n1. Use the XYZ Formula: Detail your accomplishments by saying 'Accomplished [X] as measured by [Y], by doing [Z].'\n2. Highlight Tech Stack: Add a clear 'Skills' section listing languages, frameworks, and tools.\n3. Add GitHub Links: Include links to open-source contributions or personal projects.\n4. Tailor Keywords: Ensure your resume matches the job description to pass ATS filters.\n5. Keep it Concise: Limit to one page unless you have 10+ years of experience."} 
        />
      </div>

      <div className="bg-white border-t border-slate-200 p-4 shrink-0 z-10">
        <div className="max-w-4xl mx-auto">
          <div className="flex gap-2 overflow-x-auto pb-4 pt-1 hide-scrollbar">
            {QUICK_PROMPTS.map((qp, i) => (
              <button key={i} className="flex items-center gap-2 px-4 py-2 bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-700 rounded-xl text-[13px] font-semibold whitespace-nowrap transition-colors shrink-0">
                <qp.icon size={14} className="text-[#6C4CF1]" /> {qp.label}
              </button>
            ))}
          </div>
          <div className="relative flex items-end gap-3 bg-slate-50 border border-slate-200 rounded-[24px] p-2 pr-2.5 focus-within:border-[#6C4CF1] focus-within:ring-4 focus-within:ring-indigo-500/10 transition-all">
            <textarea
              disabled
              placeholder="Ask anything about your career..."
              className="w-full bg-transparent resize-none max-h-32 px-4 py-2.5 outline-none text-[15px] text-slate-700 placeholder:text-slate-400 min-h-[44px]"
            />
            <button disabled className="w-10 h-10 rounded-xl bg-[#6C4CF1] text-white flex items-center justify-center shrink-0 shadow-sm transition-transform opacity-50 cursor-not-allowed">
              <Send size={18} className="ml-1" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
