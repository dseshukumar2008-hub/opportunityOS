import { motion } from 'framer-motion';
import { Mail } from 'lucide-react';

export default function EmailPreferencesSettings({ settings, updateSetting }) {
  const toggles = [
    { id: 'newsletter', label: 'Newsletter', desc: 'Receive our weekly newsletter with top opportunities and advice.' },
    { id: 'marketing', label: 'Marketing Emails', desc: 'Receive offers and promotions from OpportunityOS partners.' },
    { id: 'productUpdates', label: 'Product Updates', desc: 'Get notified about new features and platform improvements.' }
  ];

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
          <Mail size={24} />
        </div>
        <div>
          <h2 className="text-[18px] font-bold text-slate-900">Email Preferences</h2>
          <p className="text-[13px] text-slate-500 font-medium mt-0.5">Control which emails you receive from us.</p>
        </div>
      </div>

      <div className="space-y-6">
        {toggles.map((toggle, index) => (
          <div key={toggle.id} className={`flex items-center justify-between gap-4 ${index !== toggles.length - 1 ? 'pb-6 border-b border-slate-100' : ''}`}>
            <div>
              <h3 className="text-[14px] font-bold text-slate-900">{toggle.label}</h3>
              <p className="text-[13px] text-slate-500">{toggle.desc}</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer shrink-0">
              <input 
                type="checkbox" 
                className="sr-only peer" 
                checked={settings[toggle.id] ?? true}
                onChange={(e) => updateSetting(toggle.id, e.target.checked)}
                aria-label={toggle.label}
              />
              <div className="w-12 h-6 bg-slate-200 peer-focus:outline-none peer-focus-visible:ring-2 peer-focus-visible:ring-[#6C4CF1] peer-focus-visible:ring-offset-2 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#6C4CF1]"></div>
            </label>
          </div>
        ))}
      </div>
    </motion.div>
  );
}
