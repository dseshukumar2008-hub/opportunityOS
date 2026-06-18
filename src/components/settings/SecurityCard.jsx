import { Lock, ChevronRight } from 'lucide-react';

export default function SecurityCard() {
  return (
    <div className="card-standard p-8 h-full">
      <div className="flex items-start gap-4 mb-8">
        <div className="w-12 h-12 rounded-xl bg-[#F3F0FF] text-[#6C4CF1] flex items-center justify-center shrink-0">
          <Lock size={24} />
        </div>
        <div>
          <h2 className="text-[18px] font-bold text-slate-900">Security</h2>
          <p className="text-[13px] text-slate-500 font-medium mt-0.5">Manage your password and account security.</p>
        </div>
      </div>

      <div className="space-y-0">
        {/* Row 1 */}
        <button className="w-full flex items-center justify-between py-5 border-b border-slate-100 hover:bg-slate-50 px-2 -mx-2 rounded-lg transition-colors group">
          <div className="text-left">
            <h3 className="text-[14px] font-bold text-slate-900">Change Password</h3>
            <p className="text-[13px] text-slate-500 mt-0.5">Update your password regularly</p>
          </div>
          <ChevronRight size={18} className="text-slate-400 group-hover:text-slate-600 transition-colors" />
        </button>

        {/* Row 2 */}
        <button className="w-full flex items-center justify-be  tween py-5 border-b border-slate-100 hover:bg-slate-50 px-2 -mx-2 rounded-lg transition-colors group">
          <div className="text-left">
            <h3 className="text-[14px] font-bold text-slate-900">Two-Factor Authentication</h3>
            <p className="text-[13px] text-slate-500 mt-0.5">Add an extra layer of security</p>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-[13px] font-bold text-emerald-500">Enabled</span>
            <ChevronRight size={18} className="text-slate-400 group-hover:text-slate-600 transition-colors" />
          </div>
        </button>

        {/* Row 3 */}
        <button className="w-full flex items-center justify-between py-5 hover:bg-slate-50 px-2 -mx-2 rounded-lg transition-colors group">
          <div className="text-left">
            <h3 className="text-[14px] font-bold text-slate-900">Active Sessions</h3>
            <p className="text-[13px] text-slate-500 mt-0.5">Manage your active sessions</p>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-[14px] font-semibold text-slate-700">2</span>
            <ChevronRight size={18} className="text-slate-400 group-hover:text-slate-600 transition-colors" />
          </div>
        </button>
      </div>
    </div>
  );
}
