import { Settings2, ChevronDown } from 'lucide-react';

export default function PreferencesCard({ settings, updateSetting }) {
  return (
    <div className="card-standard p-8">
      <div className="flex items-start gap-4 mb-8">
        <div className="w-12 h-12 rounded-xl bg-[#F3F0FF] text-[#6C4CF1] flex items-center justify-center shrink-0">
          <Settings2 size={24} />
        </div>
        <div>
          <h2 className="text-[18px] font-bold text-slate-900">Preferences</h2>
          <p className="text-[13px] text-slate-500 font-medium mt-0.5">Customize your experience and default preferences.</p>
        </div>
      </div>

      <div className="space-y-6">
        {/* Dropdown 1 */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-100">
          <div>
            <h3 className="text-[14px] font-bold text-slate-900">Default Opportunity Type</h3>
            <p className="text-[13px] text-slate-500">Choose your preferred opportunity type</p>
          </div>
          <div className="relative w-full sm:w-[240px] shrink-0">
            <select 
              value={settings.defaultOpportunityType || 'Internships'}
              onChange={(e) => updateSetting('defaultOpportunityType', e.target.value)}
              className="w-full h-[44px] px-4 pr-10 bg-white border border-slate-200 focus:border-[#6C4CF1] rounded-xl text-[13px] font-semibold text-slate-700 outline-none transition-all appearance-none cursor-pointer"
            >
              <option>Internships</option>
              <option>Hackathons</option>
              <option>Scholarships</option>
              <option>Competitions</option>
            </select>
            <ChevronDown size={16} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
          </div>
        </div>

        {/* Dropdown 2 */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-100">
          <div>
            <h3 className="text-[14px] font-bold text-slate-900">Default Location Preference</h3>
            <p className="text-[13px] text-slate-500">Choose your preferred location type</p>
          </div>
          <div className="relative w-full sm:w-[240px] shrink-0">
            <select 
              value={settings.defaultLocation || 'Remote'}
              onChange={(e) => updateSetting('defaultLocation', e.target.value)}
              className="w-full h-[44px] px-4 pr-10 bg-white border border-slate-200 focus:border-[#6C4CF1] rounded-xl text-[13px] font-semibold text-slate-700 outline-none transition-all appearance-none cursor-pointer"
            >
              <option>Remote</option>
              <option>Hybrid</option>
              <option>Onsite</option>
            </select>
            <ChevronDown size={16} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
          </div>
        </div>

        {/* Toggle 1 */}
        <div className="flex items-center justify-between gap-4 pb-6 border-b border-slate-100">
          <div>
            <h3 className="text-[14px] font-bold text-slate-900">Email Notifications</h3>
            <p className="text-[13px] text-slate-500">Receive email updates about new opportunities</p>
          </div>
          <label className="relative inline-flex items-center cursor-pointer shrink-0">
            <input 
              type="checkbox" 
              className="sr-only peer" 
              checked={settings.emailNotifications ?? true}
              onChange={(e) => updateSetting('emailNotifications', e.target.checked)}
            />
            <div className="w-12 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#6C4CF1]"></div>
          </label>
        </div>

        {/* Toggle 2 */}
        <div className="flex items-center justify-between gap-4">
          <div>
            <h3 className="text-[14px] font-bold text-slate-900">Push Notifications</h3>
            <p className="text-[13px] text-slate-500">Receive push notifications on your device</p>
          </div>
          <label className="relative inline-flex items-center cursor-pointer shrink-0">
            <input 
              type="checkbox" 
              className="sr-only peer" 
              checked={settings.pushNotifications ?? true}
              onChange={(e) => updateSetting('pushNotifications', e.target.checked)}
            />
            <div className="w-12 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#6C4CF1]"></div>
          </label>
        </div>
      </div>
    </div>
  );
}
