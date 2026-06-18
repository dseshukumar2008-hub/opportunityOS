import { useState, useEffect, useRef } from 'react';
import { Bot, X, Send, Sparkles, Loader2 } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../contexts/AuthContext';
import { geminiService } from '../../services/geminiService';
import ReactMarkdown from 'react-markdown';
import toast from 'react-hot-toast';
import { analyticsService } from '../../services/analyticsService';

export default function OpportunityOSCopilot({ mode = 'student', contextData }) {
  const { user } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);
  const [queryCache, setQueryCache] = useState({});

  
  useEffect(() => {
    if (user && isOpen) {
      loadHistory();
    }
  }, [user, isOpen]);

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isOpen) {
        setIsOpen(false);
      }
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen]);

  const loadHistory = async () => {
    try {
      const { data, error } = await supabase
        .from('copilot_messages')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: true });

      if (error) {
        // Table might not exist, fallback to empty array but don't crash
        if (error.code === '42P01') {
          console.warn('copilot_messages table missing, using local session state.');
          return;
        }
        throw error;
      }

      if (data && data.length > 0) {
        setMessages(data);
      } else {
        const userName = contextData?.user?.name ? ` ${contextData.user.name.split(' ')[0]}` : '';
        const welcome = {
          id: 'welcome',
          role: 'assistant',
          content: `Hi${userName}! I'm your OpportunityOS Copilot. I have analyzed your ${mode === 'student' ? 'Profile, Resume, and Applications' : 'Company Profile, Opportunities, and Applicants'}. How can I help you today?`
        };
        setMessages([welcome]);
      }
    } catch (err) {
      console.error('Failed to load copilot history', err);
    }
  };

  const saveMessage = async (role, content) => {
    try {
      const { data, error } = await supabase
        .from('copilot_messages')
        .insert([{ user_id: user.id, role, content }])
        .select()
        .single();
        
      if (error) {
        if (error.code === '42P01') return { id: Date.now().toString(), role, content }; // Fallback
        throw error;
      }
      return data;
    } catch (err) {
      console.error('Failed to save message', err);
      return { id: Date.now().toString(), role, content };
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSubmit = async (e) => {
    e?.preventDefault();
    if (!input.trim() || isTyping) return;

    const userText = input.trim();
    setInput('');
    analyticsService.trackEvent('Message Sent', { mode, messageLength: userText.length });
    
    // Optimistic UI
    const tempUserMsg = { id: Date.now().toString(), role: 'user', content: userText };
    setMessages(prev => [...prev, tempUserMsg]);
    setIsTyping(true);

    // Save user message to DB asynchronously
    saveMessage('user', userText).then(saved => {
      setMessages(prev => prev.map(m => m.id === tempUserMsg.id ? saved : m));
    });

    // Check cache
    if (queryCache[userText.toLowerCase()]) {
      const cachedResponse = queryCache[userText.toLowerCase()];
      const tempAstMsg = { id: Date.now().toString() + 'a', role: 'assistant', content: cachedResponse };
      setMessages(prev => [...prev, tempAstMsg]);
      setIsTyping(false);
      saveMessage('assistant', cachedResponse).then(saved => {
        setMessages(prev => prev.map(m => m.id === tempAstMsg.id ? saved : m));
      });
      return;
    }

    try {
      const recentHistory = messages.slice(-10).map(m => ({ role: m.role, content: m.content }));
      
      const result = await geminiService.chatWithCopilot({
        mode,
        contextData,
        history: recentHistory,
        message: userText
      });

      const responseText = result.response || "I'm sorry, I couldn't process that.";

      // Update cache
      setQueryCache(prev => ({ ...prev, [userText.toLowerCase()]: responseText }));

      const tempAstMsg = { id: Date.now().toString() + 'a', role: 'assistant', content: responseText };
      setMessages(prev => [...prev, tempAstMsg]);
      
      saveMessage('assistant', responseText).then(saved => {
        setMessages(prev => prev.map(m => m.id === tempAstMsg.id ? saved : m));
      });

    } catch (err) {
      console.error(err);
      
      let errorMessage = "Sorry, I'm having trouble connecting right now.";
      
      if (err.message && err.message.includes('VITE_GEMINI_API_KEY')) {
        errorMessage = "Configuration Error: Gemini API Key is missing. Please configure VITE_GEMINI_API_KEY in your .env.local file.";
      } else if (err.message) {
        errorMessage = `Error: ${err.message}`;
      }

      toast.error(errorMessage);
      setMessages(prev => [...prev, { id: Date.now().toString(), role: 'assistant', content: errorMessage }]);
    } finally {
      setIsTyping(false);
    }
  };

  const studentPrompts = [
    "How can I improve my ATS score?",
    "What skills should I learn next?",
    "Which opportunity is best for me?"
  ];

  const employerPrompts = [
    "Who is my strongest applicant?",
    "What skills are missing in my applicant pool?",
    "Which applicants should I interview first?"
  ];

  const suggestedPrompts = mode === 'student' ? studentPrompts : employerPrompts;

  return (
    <>
      {/* Floating Button */}
      <button
        onClick={() => {
          setIsOpen(true);
          analyticsService.trackEvent('Chat Started', { mode });
        }}
        aria-expanded={isOpen}
        aria-label="Toggle Copilot"
        className={`fixed bottom-6 right-6 w-14 h-14 bg-gradient-to-r from-[#6C4CF1] to-[#8b73f5] rounded-full shadow-lg shadow-indigo-500/30 flex items-center justify-center text-white hover:scale-105 active:scale-95 transition-all z-40 ${isOpen ? 'opacity-0 pointer-events-none translate-y-4' : 'opacity-100 translate-y-0'}`}
      >
        <Sparkles size={24} />
      </button>

      {/* Slide-out Panel Backdrop */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-slate-900/20 backdrop-blur-sm z-40 lg:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Slide-out Chat Panel */}
      <div 
        className={`fixed top-0 right-0 h-full w-full sm:w-[400px] bg-white shadow-2xl z-50 flex flex-col transition-transform duration-300 ease-in-out ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}
      >
        {/* Header */}
        <div className="h-[72px] px-6 bg-gradient-to-r from-[#6C4CF1] to-[#8b73f5] flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3 text-white">
            <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
              <Bot size={22} />
            </div>
            <div>
              <h2 className="text-base font-bold leading-tight">OpportunityOS Copilot</h2>
              <p className="text-[12px] text-indigo-100 font-medium">Context-Aware AI Assistant</p>
            </div>
          </div>
          <button 
            onClick={() => setIsOpen(false)}
            aria-label="Close Copilot"
            className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors focus-visible:ring-2 focus-visible:ring-white focus-visible:outline-none"
          >
            <X size={18} />
          </button>
        </div>

        {/* Messages */}
        <div 
          className="flex-1 overflow-y-auto p-5 bg-[#F8FAFC] flex flex-col gap-4"
          aria-live="polite"
          aria-atomic="false"
        >
          {(messages || []).length === 0 && !isTyping && (
             <div className="flex flex-col items-center justify-center h-full text-center px-4">
                <div className="w-16 h-16 bg-indigo-50 rounded-2xl flex items-center justify-center text-[#6C4CF1] mb-4">
                  <Bot size={32} />
                </div>
                <h3 className="text-[16px] font-bold text-slate-900 mb-2">Ready to assist you</h3>
                <p className="text-[13px] text-slate-500 mb-6">Ask me anything about your data, goals, or platform features.</p>
             </div>
          )}

          {(messages || []).map((msg, index) => {
            const isUser = msg.role === 'user';
            return (
              <div key={msg.id || index} className={`flex ${isUser ? 'justify-end' : 'justify-start'} group/msg`}>
                <div className={`max-w-[85%] rounded-2xl px-4 py-3 text-[14px] relative ${
                  isUser 
                    ? 'bg-[#6C4CF1] text-white rounded-br-none shadow-md shadow-indigo-500/10' 
                    : 'bg-white text-slate-700 rounded-bl-none shadow-sm border border-slate-100'
                }`}>
                  {isUser ? (
                    <p>{msg.content}</p>
                  ) : (
                    <>
                      <button
                        onClick={() => {
                          navigator.clipboard.writeText(msg.content);
                          import('react-hot-toast').then(m => m.toast.success('Copied response to clipboard ✓'));
                        }}
                        className="absolute -top-3 -right-3 p-1.5 bg-white border border-slate-200 rounded-lg shadow-sm text-slate-400 hover:text-indigo-600 hover:border-indigo-200 hover:bg-indigo-50 opacity-0 group-hover/msg:opacity-100 transition-all z-10 focus-visible:opacity-100"
                        title="Copy Response"
                      >
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path></svg>
                      </button>
                      <div className="prose prose-sm prose-slate max-w-none prose-p:leading-relaxed prose-a:text-[#6C4CF1] prose-strong:text-slate-900">
                        <ReactMarkdown>{msg.content}</ReactMarkdown>
                      </div>
                    </>
                  )}
                </div>
              </div>
            );
          })}

          {isTyping && (
            <div className="flex justify-start">
              <div className="bg-white border border-slate-100 rounded-2xl rounded-bl-none px-4 py-3 shadow-sm flex items-center gap-1.5 h-[44px]">
                <div className="w-1.5 h-1.5 bg-[#6C4CF1]/60 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
                <div className="w-1.5 h-1.5 bg-[#6C4CF1]/60 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
                <div className="w-1.5 h-1.5 bg-[#6C4CF1]/60 rounded-full animate-bounce"></div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <div className="p-4 bg-white border-t border-slate-100 shrink-0">
          {(messages || []).length <= 1 && (
            <div className="mb-4 flex flex-wrap gap-2">
              {suggestedPrompts.map((prompt, i) => (
                <button
                  key={i}
                  onClick={() => { setInput(prompt); }}
                  className="px-3 py-1.5 bg-slate-50 hover:bg-indigo-50 hover:text-[#6C4CF1] border border-slate-200 hover:border-indigo-200 rounded-full text-[12px] font-semibold text-slate-600 transition-colors"
                >
                  {prompt}
                </button>
              ))}
            </div>
          )}

          <form onSubmit={handleSubmit} className="relative">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask Copilot..."
              className="w-full pl-4 pr-12 py-3.5 bg-slate-50 border border-slate-200 rounded-xl text-[14px] text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-[#6C4CF1] focus:ring-4 focus:ring-[#6C4CF1]/10 transition-all"
            />
            <button
              type="submit"
              disabled={!input.trim() || isTyping}
              aria-label="Send Message"
              className="absolute right-2 top-1/2 -translate-y-1/2 w-10 h-10 bg-[#6C4CF1] hover:bg-indigo-600 disabled:bg-slate-200 disabled:text-slate-400 text-white rounded-lg flex items-center justify-center transition-colors shadow-sm focus-visible:ring-2 focus-visible:ring-indigo-400 focus-visible:outline-none"
            >
              {isTyping ? <Loader2 size={18} className="animate-spin" /> : <Send size={18} />}
            </button>
          </form>
        </div>
      </div>
    </>
  );
}
