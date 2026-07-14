import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, ArrowLeft } from 'lucide-react';

export default function QuestionRenderer({ 
  children, 
  title, 
  subtitle, 
  icon: Icon,
  onNext, 
  onBack, 
  canGoNext, 
  themeColor = 'blue' 
}) {
  
  const themeColors = {
    blue: 'from-blue-600 to-cyan-500 hover:from-blue-500 hover:to-cyan-400',
    purple: 'from-purple-600 to-fuchsia-500 hover:from-purple-500 hover:to-fuchsia-400',
    pink: 'from-pink-600 to-rose-500 hover:from-pink-500 hover:to-rose-400',
    orange: 'from-orange-600 to-amber-500 hover:from-orange-500 hover:to-amber-400',
    green: 'from-emerald-600 to-teal-500 hover:from-emerald-500 hover:to-teal-400',
  };

  const bgGradient = themeColors[themeColor] || themeColors.blue;

  return (
    <div className="flex flex-col h-full w-full relative p-6 sm:p-10 z-10 overflow-hidden">
      
      {/* Question Content with Animation */}
      <div className="flex-1 flex flex-col justify-center max-w-[500px] w-full mx-auto relative mt-4 mb-24">
        <AnimatePresence mode="wait">
          <motion.div
            key={title} // Animates when title changes (new question)
            initial={{ opacity: 0, x: 20, scale: 0.98 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: -20, scale: 0.98 }}
            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
            className="flex flex-col w-full"
          >
            <div className="text-center mb-10">
              {Icon && (
                <div className="mx-auto w-16 h-16 bg-slate-50 border border-slate-100 rounded-2xl flex items-center justify-center mb-6 shadow-sm">
                  <Icon size={32} className={`text-${themeColor}-500`} />
                </div>
              )}
              <h2 className="text-3xl font-bold text-slate-900 tracking-tight mb-3">{title}</h2>
              {subtitle && <p className="text-base text-slate-500 font-medium">{subtitle}</p>}
            </div>

            <div className="w-full">
              {children}
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Fixed Bottom Navigation */}
      <div className="absolute bottom-0 left-0 right-0 p-6 sm:p-8 bg-gradient-to-t from-white via-white to-transparent pointer-events-none flex justify-center">
        <div className="w-full max-w-[500px] flex items-center justify-between pointer-events-auto">
          {onBack ? (
            <button 
              onClick={onBack}
              className="w-12 h-12 flex items-center justify-center rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 transition-colors"
            >
              <ArrowLeft size={20} />
            </button>
          ) : (
            <div className="w-12 h-12" /> // Spacer
          )}

          <button
            onClick={onNext}
            disabled={!canGoNext}
            className={`
              flex items-center gap-2 px-8 py-3.5 rounded-full font-bold text-white shadow-lg transition-all duration-300
              ${canGoNext 
                ? `bg-gradient-to-r ${bgGradient} hover:shadow-xl hover:scale-105 cursor-pointer` 
                : 'bg-slate-200 text-slate-400 shadow-none cursor-not-allowed'}
            `}
          >
            Next <ArrowRight size={18} />
          </button>
        </div>
      </div>
    </div>
  );
}
