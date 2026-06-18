import { useState, useRef, useEffect } from 'react';
import { Sparkles, Send, RefreshCw, Zap, Target, FileText, TrendingUp, Briefcase, Code2, Users2, ArrowRight, ChevronDown } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { useProfile } from '../../contexts/ProfileContext';
import { useCareerRoadmap } from '../../hooks/useCareerRoadmap';
import { geminiService } from '../../services/geminiService';

const QUICK_PROMPTS = [
  { icon: FileText,   label: 'Resume Tips',           prompt: 'Give me 5 actionable tips to improve my resume for tech roles.' },
  { icon: Target,     label: 'Interview Prep',        prompt: 'Help me prepare for a technical software engineering interview.' },
  { icon: TrendingUp, label: 'Career Path',           prompt: 'What career path should I take to become a Senior Software Engineer?' },
  { icon: Briefcase,  label: 'Salary Negotiation',   prompt: 'How do I negotiate a better salary for a software engineering offer?' },
  { icon: Code2,      label: 'Skill Gaps',            prompt: 'What skills should I learn to become more competitive in today\'s job market?' },
  { icon: Users2,     label: 'Networking',            prompt: 'Give me a strategy for building my professional network effectively.' },
];

const WELCOME_MESSAGE = {
  role: 'assistant',
  content: `👋 Hi! I'm your **AI Career Copilot**, powered by Gemini.

I can help you with:
- 📄 **Resume optimization** and ATS improvements
- 🎯 **Interview preparation** and mock Q&As
- 📈 **Career planning** and skill gap analysis
- 💼 **Job search strategies** and salary negotiation
- 🤝 **Networking tips** and LinkedIn optimization

What would you like to work on today?`,
  timestamp: new Date().toISOString(),
};

function MessageBubble({ message }) {
  const isUser = message.role === 'user';
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
        {message.content.split('\n').map((line, i) => {
          // Bold markdown
          const parts = line.split(/\*\*(.*?)\*\*/g);
          return (
            <p key={i} className={`text-[14px] font-medium leading-[1.7] ${i > 0 ? 'mt-2' : ''} ${isUser ? 'text-white' : 'text-slate-700'}`}>
              {parts.map((part, j) =>
                j % 2 === 1
                  ? <strong key={j} className={isUser ? 'text-white font-black' : 'text-slate-900 font-black'}>{part}</strong>
                  : part
              )}
            </p>
          );
        })}
        <p className={`text-[10px] font-medium mt-2 ${isUser ? 'text-white/60' : 'text-slate-400'}`}>
          {new Date(message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </p>
      </div>
      {isUser && (
        <div className="w-9 h-9 rounded-2xl bg-slate-100 border border-slate-200 flex items-center justify-center shrink-0 overflow-hidden">
          <span className="text-[14px] font-black text-slate-600">U</span>
        </div>
      )}
    </div>
  );
}

function TypingIndicator() {
  return (
    <div className="flex gap-3 mb-6">
      <div className="w-9 h-9 rounded-2xl bg-gradient-to-br from-[#6C4CF1] to-indigo-500 flex items-center justify-center shrink-0 shadow-md shadow-indigo-200">
        <Sparkles size={16} className="text-white" />
      </div>
      <div className="bg-white border border-slate-100 rounded-[20px] rounded-tl-sm px-5 py-4 shadow-sm">
        <div className="flex items-center gap-1.5">
          {[0, 1, 2].map(i => (
            <div
              key={i}
              className="w-2 h-2 rounded-full bg-indigo-400"
              style={{ animation: `bounce 1.2s ease-in-out ${i * 0.2}s infinite` }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

export default function CareerCoachPage() {
  const { user } = useAuth();
  const { profile } = useProfile();
  const { state: roadmapState } = useCareerRoadmap();
  const [messages, setMessages] = useState([WELCOME_MESSAGE]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [showPrompts, setShowPrompts] = useState(true);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  const firstName = profile?.name?.split(' ')[0] || user?.displayName?.split(' ')[0] || 'there';

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  const sendMessage = async (text) => {
    if (!text.trim()) return;

    const userMessage = { role: 'user', content: text, timestamp: new Date().toISOString() };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsTyping(true);
    setShowPrompts(false);

    try {
      const history = messages.slice(-10).map(m => ({ role: m.role, content: m.content }));
      
      const result = await geminiService.chatWithCopilot({
        mode: 'career_coach',
        contextData: { profile },
        history: history,
        message: text
      });

      const responseText = result.response || "I'm sorry, I couldn't process that.";
      const aiMessage = { role: 'assistant', content: responseText, timestamp: new Date().toISOString() };
      setMessages(prev => [...prev, aiMessage]);
    } catch (err) {
      console.error("AI Coach Error:", err);
      const aiMessage = { role: 'assistant', content: "Sorry, I am having trouble connecting to the network right now.", timestamp: new Date().toISOString() };
      setMessages(prev => [...prev, aiMessage]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    sendMessage(input);
  };

  const clearChat = () => {
    setMessages([WELCOME_MESSAGE]);
    setShowPrompts(true);
  };

  return (
    <div className="flex flex-col h-full max-h-[calc(100vh-64px)] bg-[#F8FAFC]">

      {/* ── Header ── */}
      <div className="shrink-0 bg-white border-b border-slate-100 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-[#6C4CF1] to-indigo-500 flex items-center justify-center shadow-md shadow-indigo-200">
            <Sparkles size={20} className="text-white" />
          </div>
          <div>
            <h1 className="text-[18px] font-black text-slate-900 leading-tight">AI Career Copilot</h1>
            <div className="flex items-center gap-1.5">
              <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></div>
              <p className="text-[12px] font-bold text-slate-500">Powered by Gemini · Always available</p>
            </div>
          </div>
        </div>
        <button
          onClick={clearChat}
          className="flex items-center gap-1.5 px-4 py-2 bg-white border border-slate-200 hover:bg-slate-50 hover:border-slate-300 rounded-xl text-[13px] font-bold text-slate-600 transition-all"
        >
          <RefreshCw size={14} /> New Chat
        </button>
      </div>

      {/* ── Context Bar ── */}
      <div className="shrink-0 bg-indigo-50/50 border-b border-indigo-100/50 px-6 py-2.5 flex items-center gap-4 lg:gap-6 overflow-x-auto hide-scrollbar">
        <span className="text-[11px] font-black text-slate-500 uppercase tracking-widest shrink-0">Profile Context:</span>
        <div className="flex items-center gap-4 lg:gap-6">
          <div className="flex items-center gap-1.5 shrink-0 text-slate-600">
            <Target size={14} className="text-indigo-500" />
            <span className="text-[12px] font-bold">{profile?.targetRole || profile?.title || 'Target Role Not Set'}</span>
          </div>
          <div className="flex items-center gap-1.5 shrink-0 text-slate-600">
            <FileText size={14} className="text-emerald-500" />
            <span className="text-[12px] font-bold">{profile?.extractedSkills?.length || 0} Resume Skills</span>
          </div>
          <div className="flex items-center gap-1.5 shrink-0 text-slate-600">
            <Zap size={14} className="text-amber-500" />
            <span className="text-[12px] font-bold">{profile?.missingSkills?.length || 0} Missing Skills</span>
          </div>
          <div className="flex items-center gap-1.5 shrink-0 text-slate-600">
            <TrendingUp size={14} className="text-blue-500" />
            <span className="text-[12px] font-bold">
              Roadmap: {roadmapState?.roadmap?.roadmapData?.header?.currentPhase || 'Not Started'}
            </span>
          </div>
        </div>
      </div>

      {/* ── Messages Area ── */}
      <div className="flex-1 overflow-y-auto px-4 lg:px-8 py-6 scrollbar-thin scrollbar-thumb-slate-200">
        <div className="max-w-3xl mx-auto">

          {messages.map((msg, i) => (
            <MessageBubble key={i} message={msg} />
          ))}

          {isTyping && <TypingIndicator />}

          {/* Quick Prompts */}
          {showPrompts && messages.length === 1 && (
            <div className="mt-6">
              <p className="text-[12px] font-bold text-slate-400 uppercase tracking-wider mb-4 text-center">
                Suggested Topics
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {QUICK_PROMPTS.map((prompt, i) => (
                  <button
                    key={i}
                    onClick={() => sendMessage(prompt.prompt)}
                    className="flex items-center gap-3 p-4 bg-white border border-slate-200 hover:border-indigo-200 hover:shadow-md rounded-2xl text-left transition-all group"
                  >
                    <div className="w-9 h-9 rounded-xl bg-indigo-50 flex items-center justify-center shrink-0 group-hover:bg-indigo-100 transition-colors">
                      <prompt.icon size={16} className="text-indigo-600" />
                    </div>
                    <div>
                      <p className="text-[13px] font-bold text-slate-900">{prompt.label}</p>
                      <p className="text-[11px] font-medium text-slate-500 truncate max-w-[200px]">{prompt.prompt.slice(0, 45)}…</p>
                    </div>
                    <ArrowRight size={14} className="text-slate-300 ml-auto shrink-0 group-hover:text-indigo-400 transition-colors" />
                  </button>
                ))}
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* ── Input Bar ── */}
      <div className="shrink-0 bg-white border-t border-slate-100 px-4 lg:px-8 py-4">
        <div className="max-w-3xl mx-auto">
          <form onSubmit={handleSubmit} className="flex items-center gap-3">
            <div className="flex-1 relative">
              <input
                ref={inputRef}
                type="text"
                value={input}
                onChange={e => setInput(e.target.value)}
                placeholder="Ask your career coach anything…"
                className="w-full px-5 py-3.5 bg-slate-50 border border-slate-200 hover:border-indigo-200 focus:border-indigo-400 focus:bg-white rounded-2xl text-[14px] font-medium text-slate-900 placeholder:text-slate-400 outline-none transition-all pr-12"
                disabled={isTyping}
              />
              {input && (
                <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1">
                  <kbd className="text-[10px] font-bold text-slate-400 bg-slate-100 px-1.5 py-0.5 rounded">↵</kbd>
                </div>
              )}
            </div>
            <button
              type="submit"
              disabled={!input.trim() || isTyping}
              className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#6C4CF1] to-indigo-500 text-white flex items-center justify-center hover:from-indigo-600 hover:to-indigo-600 disabled:opacity-40 disabled:cursor-not-allowed transition-all shadow-md shadow-indigo-200 shrink-0"
            >
              <Send size={18} />
            </button>
          </form>
          <p className="text-[11px] font-medium text-slate-400 text-center mt-2">
            AI responses are suggestions — always verify important career decisions.
          </p>
        </div>
      </div>

      <style>{`
        @keyframes bounce {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-4px); }
        }
      `}</style>
    </div>
  );
}
