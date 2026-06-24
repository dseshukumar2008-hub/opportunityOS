import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Target, Bot, MessageSquare, Sparkles, BookOpen, FileText } from 'lucide-react';

const STEPS = [
  { id: 1, title: 'Select Target Role', desc: 'Choose the role you want to prepare for.', icon: Target },
  { id: 2, title: 'AI Generates Questions', desc: 'Role-specific technical, behavioral, and scenario questions.', icon: Bot },
  { id: 3, title: 'Submit Answers', desc: 'Answer each question like a real interview.', icon: MessageSquare },
  { id: 4, title: 'AI Evaluation', desc: 'Receive scores, strengths, weaknesses, and detailed feedback.', icon: Sparkles },
  { id: 5, title: 'Ideal Answer & Learning', desc: 'View ideal answers, missing concepts, and topics to revise.', icon: BookOpen },
  { id: 6, title: 'Interview Report', desc: 'Get a complete performance report and improvement roadmap.', icon: FileText },
];

export default function HowItWorksModal({ isOpen, onClose }) {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50"
            onClick={onClose}
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-lg bg-white rounded-2xl shadow-xl z-50 overflow-hidden max-h-[90vh] flex flex-col"
          >
            <div className="flex items-center justify-between p-6 border-b border-slate-100 shrink-0">
              <div>
                <h2 className="text-xl font-bold text-slate-900">How AI Interview Coach Works</h2>
                <p className="text-sm text-slate-500 mt-1">Your journey to becoming interview-ready.</p>
              </div>
              <button
                onClick={onClose}
                className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-full transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            <div className="p-6 overflow-y-auto no-scrollbar">
              <div className="space-y-6 relative z-10">
                {/* Vertical line connecting steps */}
                <div className="absolute left-[21px] top-4 bottom-4 w-0.5 bg-slate-100 -z-10" />
                
                {STEPS.map((step) => (
                  <div key={step.id} className="flex gap-4 relative">
                    <div className="w-11 h-11 rounded-full bg-indigo-50 border-4 border-white flex items-center justify-center text-[#6D4AFF] shrink-0 shadow-sm z-10">
                      <step.icon size={18} />
                    </div>
                    <div className="pt-1">
                      <h4 className="font-bold text-slate-900 text-sm">Step {step.id}: {step.title}</h4>
                      <p className="text-xs text-slate-500 mt-1 font-medium leading-relaxed">{step.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
