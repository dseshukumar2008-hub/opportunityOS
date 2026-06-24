import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Upload, BrainCircuit, Target } from 'lucide-react';

export default function HowItWorksModal({ isOpen, onClose }) {
  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.95, opacity: 0 }}
          onClick={(e) => e.stopPropagation()}
          className="bg-white rounded-3xl w-full max-w-lg overflow-hidden shadow-2xl relative border border-slate-100"
        >
          {/* Header */}
          <div className="px-6 py-5 border-b border-slate-100 flex items-center justify-between sticky top-0 bg-white/90 backdrop-blur-md z-10">
            <div>
              <h2 className="text-xl font-extrabold text-slate-900">How LinkedIn Analyzer Works</h2>
              <p className="text-sm font-medium text-slate-500 mt-1">Boost your profile visibility in 3 steps</p>
            </div>
            <button
              onClick={onClose}
              className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-full transition-colors focus-visible:ring-2 focus-visible:ring-[#6C4CF1] focus-visible:outline-none"
            >
              <X size={20} />
            </button>
          </div>

          {/* Body */}
          <div className="px-6 py-8">
            <div className="relative">
              {/* Vertical line connecting steps */}
              <div className="absolute left-[23px] top-4 bottom-8 w-[2px] bg-indigo-100 rounded-full" />
              
              <div className="space-y-8 relative">
                
                {/* Step 1 */}
                <div className="flex gap-5 relative">
                  <div className="w-12 h-12 rounded-full bg-white border-2 border-indigo-100 flex items-center justify-center shrink-0 z-10 shadow-sm">
                    <Upload size={20} className="text-[#6D4AFF]" />
                  </div>
                  <div className="pt-2">
                    <h3 className="text-base font-bold text-slate-900 mb-1">Upload or Paste</h3>
                    <p className="text-sm text-slate-600 leading-relaxed">
                      Download your LinkedIn profile as a PDF or simply copy and paste your profile text into the analyzer.
                    </p>
                  </div>
                </div>

                {/* Step 2 */}
                <div className="flex gap-5 relative">
                  <div className="w-12 h-12 rounded-full bg-white border-2 border-indigo-100 flex items-center justify-center shrink-0 z-10 shadow-sm">
                    <BrainCircuit size={20} className="text-[#6D4AFF]" />
                  </div>
                  <div className="pt-2">
                    <h3 className="text-base font-bold text-slate-900 mb-1">AI Analyzer Analysis</h3>
                    <p className="text-sm text-slate-600 leading-relaxed">
                      Our advanced AI evaluates your headline, about section, skills, experience, and projects like a real tech hiring manager.
                    </p>
                  </div>
                </div>

                {/* Step 3 */}
                <div className="flex gap-5 relative">
                  <div className="w-12 h-12 rounded-full bg-white border-2 border-indigo-100 flex items-center justify-center shrink-0 z-10 shadow-sm">
                    <Target size={20} className="text-[#6D4AFF]" />
                  </div>
                  <div className="pt-2">
                    <h3 className="text-base font-bold text-slate-900 mb-1">Get Actionable Feedback</h3>
                    <p className="text-sm text-slate-600 leading-relaxed">
                      Receive an overall score and top 5 high-priority suggestions to immediately improve your search visibility.
                    </p>
                  </div>
                </div>

              </div>
            </div>
          </div>

        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
