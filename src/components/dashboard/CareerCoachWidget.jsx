import { useState, useRef, useEffect } from 'react';
import { Compass, Sparkles, Loader2, Send, Trash2, AlertTriangle, Bot, User, ArrowRight } from 'lucide-react';
import { useCareerCoach } from '../../hooks/useCareerCoach';
import { useDashboardInsights } from '../../hooks/useDashboardInsights';
import { Link } from 'react-router-dom';

function formatTime(iso) {
  try {
    return new Date(iso).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  } catch (err) {
    console.warn('Failed to parse date string:', err);
    return '';
  }
}

export default function CareerCoachWidget() {
  const { messages, isLoading, error, sendMessage, clearChat, suggestedPrompts } = useCareerCoach();
  const { nextBestAction } = useDashboardInsights();
  const [inputText, setInputText] = useState('');
  const bottomRef = useRef(null);

  // Auto-scroll to latest message
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  const handleSend = () => {
    const text = inputText.trim();
    if (!text || isLoading) return;
    setInputText('');
    sendMessage(text);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleSuggestedPrompt = (prompt) => {
    if (isLoading) return;
    sendMessage(prompt);
  };

  return (
    <div className="card-standard w-full mb-6 flex flex-col" style={{ minHeight: '480px', maxHeight: '600px' }}>
      {/* Header with Up Next Actions */}
      <div className="p-5 pb-4 border-b border-slate-100 shrink-0 bg-slate-50/50">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-[#6D5DF6] flex items-center justify-center shrink-0 shadow-md shadow-indigo-500/20">
              <Compass size={16} className="text-white" />
            </div>
            <div>
              <h3 className="text-[15px] font-bold text-slate-900 leading-tight">AI Career Copilot</h3>
              <p className="text-[11px] text-slate-400 font-medium">Powered by OpportunityOS Intelligence</p>
            </div>
          </div>
          {(messages || []).length > 0 && (
            <button
              onClick={clearChat}
              className="flex items-center gap-1.5 text-[12px] font-bold text-slate-400 hover:text-red-500 transition-colors px-2 py-1 rounded-lg"
              title="Clear chat"
            >
              <Trash2 size={13} />
            </button>
          )}
        </div>

        {/* Up Next Action Card */}
        {nextBestAction && (
          <div className="bg-white border border-indigo-100 rounded-xl p-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-sm relative overflow-hidden">
            <div className="absolute top-0 left-0 w-1 h-full bg-[#6D5DF6]"></div>
            <div>
              <p className="text-[10px] font-extrabold text-indigo-500 uppercase tracking-wider mb-0.5 flex items-center gap-1">
                <Sparkles size={10} /> Up Next
              </p>
              <p className="text-[13px] font-bold text-slate-800 leading-tight">{nextBestAction.text}</p>
            </div>
            <Link 
              to={nextBestAction.link || "/"}
              className="inline-flex items-center gap-1.5 bg-[#6D5DF6] text-white hover:bg-[#5a4add] font-bold text-[11px] px-3 py-1.5 rounded-lg transition-colors whitespace-nowrap shrink-0"
            >
              {nextBestAction.cta}
              <ArrowRight size={12} />
            </Link>
          </div>
        )}
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-5 space-y-4 scrollbar-hide">
        {/* Suggested Prompts — shown when no messages */}
        {(messages || []).length === 0 && !isLoading && (
          <div className="flex flex-col gap-3">
            <div className="flex items-center gap-2 mb-1">
              <Sparkles size={14} className="text-[#6D5DF6]" />
              <span className="text-[12px] font-extrabold text-[#6D5DF6] uppercase tracking-wider">Suggested Questions</span>
            </div>
            {suggestedPrompts.map((prompt, i) => (
              <button
                key={i}
                onClick={() => handleSuggestedPrompt(prompt)}
                className="text-left px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-[13px] font-medium text-slate-700 hover:border-indigo-300 hover:bg-indigo-50 hover:text-indigo-700 transition-all"
              >
                {prompt}
              </button>
            ))}
          </div>
        )}

        {/* Message Bubbles */}
        {(messages || []).map((msg, i) => (
          <div key={i} className={`flex gap-2.5 ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
            {/* Avatar */}
            <div className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 mt-0.5 ${
              msg.role === 'user'
                ? 'bg-slate-200'
                : 'bg-[#6D5DF6]'
            }`}>
              {msg.role === 'user'
                ? <User size={13} className="text-slate-600" />
                : <Bot size={13} className="text-white" />
              }
            </div>

            {/* Bubble */}
            <div className={`max-w-[80%] flex flex-col gap-1 ${msg.role === 'user' ? 'items-end' : 'items-start'}`}>
              <div className={`px-4 py-3 rounded-2xl text-[13px] font-medium leading-relaxed whitespace-pre-wrap ${
                msg.role === 'user'
                  ? 'bg-[#6D5DF6] text-white rounded-tr-sm'
                  : 'bg-slate-50 border border-slate-200 text-slate-800 rounded-tl-sm'
              }`}>
                {msg.content}
              </div>
              <span className="text-[10px] text-slate-400 font-medium px-1">{formatTime(msg.timestamp)}</span>
            </div>
          </div>
        ))}

        {/* Loading indicator */}
        {isLoading && (
          <div className="flex gap-2.5">
            <div className="w-7 h-7 rounded-full bg-[#6D5DF6] flex items-center justify-center shrink-0">
              <Bot size={13} className="text-white" />
            </div>
            <div className="bg-slate-50 border border-slate-200 px-4 py-3 rounded-2xl rounded-tl-sm flex items-center gap-2">
              <Loader2 size={14} className="animate-spin text-indigo-500" />
              <span className="text-[13px] text-slate-500 font-medium">Thinking...</span>
            </div>
          </div>
        )}

        {/* Error state */}
        {error && (
          <div className="flex items-start gap-2 bg-red-50 border border-red-100 rounded-xl p-3">
            <AlertTriangle size={16} className="text-red-500 shrink-0 mt-0.5" />
            <p className="text-[13px] text-red-700 font-medium">{error}</p>
          </div>
        )}

        <div ref={bottomRef} />
      </div>

      {/* Input Area */}
      <div className="p-4 pt-3 border-t border-slate-100 shrink-0">
        <div className="flex items-end gap-2">
          <textarea
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Ask your Career Coach anything..."
            rows={1}
            className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-[13px] text-slate-800 placeholder-slate-400 focus:outline-none focus:border-[#6D5DF6] focus:ring-2 focus:ring-[#6D5DF6]/20 transition-all resize-none"
            style={{ maxHeight: '80px', overflowY: 'auto' }}
            disabled={isLoading}
          />
          <button
            onClick={handleSend}
            disabled={!inputText.trim() || isLoading}
            className="w-10 h-10 flex items-center justify-center bg-[#6D5DF6] hover:bg-[#5a4add] disabled:opacity-40 text-white rounded-xl transition-colors shrink-0"
          >
            <Send size={15} />
          </button>
        </div>
        <p className="text-[10px] text-slate-400 font-medium mt-2 text-center">Press Enter to send · Shift+Enter for new line</p>
      </div>
    </div>
  );
}
