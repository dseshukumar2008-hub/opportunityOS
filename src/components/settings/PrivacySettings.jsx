import { motion } from 'framer-motion';
import { Shield } from 'lucide-react';

export default function PrivacySettings({ settings, updateSetting }) {
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
          <Shield size={24} />
        </div>
        <div>
          <h2 className="text-[18px] font-bold text-slate-900">Privacy Settings</h2>
          <p className="text-[13px] text-slate-500 font-medium mt-0.5">Manage who can see your profile and data.</p>
        </div>
      </div>

      <div className="space-y-6">
        <div className="flex items-center justify-between gap-4 pb-6 border-b border-slate-100">
          <div>
            <h3 className="text-[14px] font-bold text-slate-900">Profile Visibility</h3>
            <p className="text-[13px] text-slate-500">Allow your profile to be discovered by other users.</p>
          </div>
          <label className="relative inline-flex items-center cursor-pointer shrink-0">
            <input 
              type="checkbox" 
              className="sr-only peer" 
              checked={settings.publicProfile ?? true}
              onChange={(e) => updateSetting('publicProfile', e.target.checked)}
            />
            <div className="w-12 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#6C4CF1]"></div>
          </label>
        </div>

        <div className="flex items-center justify-between gap-4 pb-6 border-b border-slate-100">
          <div>
            <h3 className="text-[14px] font-bold text-slate-900">Recruiter Visibility</h3>
            <p className="text-[13px] text-slate-500">Allow verified recruiters to view your full resume and contact details.</p>
          </div>
          <label className="relative inline-flex items-center cursor-pointer shrink-0">
            <input 
              type="checkbox" 
              className="sr-only peer" 
              checked={settings.recruiterVisibility ?? true}
              onChange={(e) => updateSetting('recruiterVisibility', e.target.checked)}
            />
            <div className="w-12 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#6C4CF1]"></div>
          </label>
        </div>
      </div>
    </motion.div>
  );
}
