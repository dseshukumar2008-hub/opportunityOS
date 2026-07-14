import { useState } from 'react';
import { X, Target, Calendar } from 'lucide-react';
import { useGoals } from '../../contexts/GoalContext';


const CATEGORIES = [
  'Applications',
  'Skills',
  'Resume',
  'Networking',
  'Teams',
  'Certifications'
];

export default function CreateGoalModal({ isOpen, onClose }) {
  const { addGoal } = useGoals();
  const [formData, setFormData] = useState({
    title: '',
    category: 'Applications',
    targetValue: '',
    targetDate: ''
  });

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    addGoal({
      title: formData.title,
      category: formData.category,
      targetValue: Number(formData.targetValue),
      targetDate: formData.targetDate
    });
    // Reset and close
    setFormData({
      title: '',
      category: 'Applications',
      targetValue: '',
      targetDate: ''
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6">
      <div 
        className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
        onClick={onClose}
      />
      
      <div className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50/50">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-indigo-100 flex items-center justify-center">
              <Target size={16} className="text-indigo-600" />
            </div>
            <h2 className="text-[16px] font-extrabold text-slate-900">Create Career Goal</h2>
          </div>
          <button 
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-full transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 overflow-y-auto custom-scrollbar">
          <form id="goal-form" onSubmit={handleSubmit} className="space-y-5">
            {/* Title */}
            <div>
              <label className="block text-[13px] font-bold text-slate-700 mb-1.5">Goal Title</label>
              <input 
                type="text" 
                required
                placeholder="e.g. Apply to 20 Opportunities"
                value={formData.title}
                onChange={e => setFormData({...formData, title: e.target.value})}
                className="w-full bg-white border border-slate-200 text-slate-900 text-[14px] rounded-xl px-4 py-2.5 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition-all placeholder:text-slate-400 font-medium"
              />
            </div>

            {/* Category */}
            <div>
              <label className="block text-[13px] font-bold text-slate-700 mb-1.5">Category</label>
              <select 
                value={formData.category}
                onChange={e => setFormData({...formData, category: e.target.value})}
                className="w-full bg-white border border-slate-200 text-slate-900 text-[14px] rounded-xl px-4 py-2.5 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition-all font-medium appearance-none"
              >
                {CATEGORIES.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              {/* Target Value */}
              <div>
                <label className="block text-[13px] font-bold text-slate-700 mb-1.5">Target Value</label>
                <input 
                  type="number" 
                  required
                  min="1"
                  placeholder="e.g. 20"
                  value={formData.targetValue}
                  onChange={e => setFormData({...formData, targetValue: e.target.value})}
                  className="w-full bg-white border border-slate-200 text-slate-900 text-[14px] rounded-xl px-4 py-2.5 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition-all placeholder:text-slate-400 font-medium"
                />
              </div>

              {/* Target Date */}
              <div>
                <label className="block text-[13px] font-bold text-slate-700 mb-1.5">Target Date</label>
                <div className="relative">
                  <input 
                    type="date" 
                    required
                    value={formData.targetDate}
                    onChange={e => setFormData({...formData, targetDate: e.target.value})}
                    className="w-full bg-white border border-slate-200 text-slate-900 text-[14px] rounded-xl pl-10 pr-4 py-2.5 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition-all font-medium"
                  />
                  <Calendar size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                </div>
              </div>
            </div>

          </form>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-100 bg-slate-50 flex justify-end gap-3 shrink-0">
          <button 
            type="button"
            onClick={onClose}
            className="px-5 py-2.5 text-[14px] font-bold text-slate-600 hover:bg-slate-200 bg-slate-100 rounded-xl transition-colors"
          >
            Cancel
          </button>
          <button 
            type="submit"
            form="goal-form"
            className="px-5 py-2.5 text-[14px] font-bold text-white bg-[#6C4CF1] hover:bg-[#5b3fda] rounded-xl transition-colors shadow-sm"
          >
            Create Goal
          </button>
        </div>

      </div>
    </div>
  );
}
