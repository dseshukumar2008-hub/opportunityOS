import { motion } from 'framer-motion';
import { Palette, Sun, Moon, Monitor } from 'lucide-react';

export default function AppearanceSettings({ settings, updateSetting }) {
  const modes = [
    { id: 'light', label: 'Light Mode', icon: Sun },
    { id: 'dark', label: 'Dark Mode', icon: Moon },
    { id: 'system', label: 'System Mode', icon: Monitor },
  ];

  const currentMode = settings.theme || 'light';

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.2 }}
      className="card-standard p-8"
    >
      <div className="flex items-start gap-4 mb-8">
        <div className="w-12 h-12 rounded-xl bg-[#F3F0FF] text-[#6C4CF1] flex items-center justify-center shrink-0">
          <Palette size={24} />
        </div>
        <div>
          <h2 className="text-[18px] font-bold text-slate-900">Appearance</h2>
          <p className="text-[13px] text-slate-500 font-medium mt-0.5">Customize how OpportunityOS looks.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {modes.map((mode) => {
          const Icon = mode.icon;
          const isActive = currentMode === mode.id;
          
          return (
            <button
              key={mode.id}
              onClick={() => updateSetting('theme', mode.id)}
              className={`flex flex-col items-center justify-center p-6 rounded-xl border-2 transition-all ${
                isActive 
                  ? 'border-[#6C4CF1] bg-[#F3F0FF]' 
                  : 'border-slate-100 hover:border-slate-300 hover:bg-slate-50'
              }`}
            >
              <Icon size={32} className={`mb-3 ${isActive ? 'text-[#6C4CF1]' : 'text-slate-400'}`} />
              <span className={`text-[14px] font-bold ${isActive ? 'text-[#6C4CF1]' : 'text-slate-700'}`}>
                {mode.label}
              </span>
            </button>
          );
        })}
      </div>
    </motion.div>
  );
}
