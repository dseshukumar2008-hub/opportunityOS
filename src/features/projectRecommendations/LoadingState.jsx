import React from 'react';
import { motion } from 'framer-motion';

export default function LoadingState() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col items-center justify-center py-12">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
          className="w-12 h-12 border-4 border-indigo-200 border-t-indigo-600 rounded-full mb-6"
        />
        <h3 className="text-lg font-bold text-slate-900 mb-2">Generating Project Ideas...</h3>
        <p className="text-slate-500">Creating projects tailored to your specialization and career goal...</p>
      </div>

      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="bg-white border border-slate-200 rounded-xl p-6 animate-pulse">
            <div className="flex justify-between items-start mb-4">
              <div className="space-y-3 w-2/3">
                <div className="h-6 bg-slate-200 rounded w-3/4"></div>
                <div className="h-4 bg-slate-100 rounded w-full"></div>
                <div className="h-4 bg-slate-100 rounded w-5/6"></div>
              </div>
              <div className="w-16 h-8 bg-slate-100 rounded-full"></div>
            </div>
            <div className="flex gap-2 mt-6">
              <div className="h-6 bg-slate-100 rounded-full w-20"></div>
              <div className="h-6 bg-slate-100 rounded-full w-24"></div>
              <div className="h-6 bg-slate-100 rounded-full w-16"></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
