import { Trash2, ChevronRight } from 'lucide-react';

export default function AccountActionsCard() {
  const handleDeleteClick = () => {
    if (window.confirm("Are you sure you want to permanently delete your account? This action cannot be undone.")) {
      alert("Account deletion simulated.");
    }
  };

  return (
    <div className="card-standard p-8 h-full">
      <div className="flex items-start gap-4 mb-8">
        <div className="w-12 h-12 rounded-xl bg-red-50 text-red-500 flex items-center justify-center shrink-0">
          <Trash2 size={24} />
        </div>
        <div>
          <h2 className="text-[18px] font-bold text-slate-900">Account Actions</h2>
          <p className="text-[13px] text-slate-500 font-medium mt-0.5">Manage your account and data.</p>
        </div>
      </div>

      <div className="space-y-0">
        {/* Row 1 */}
        <button className="w-full flex items-center justify-between py-5 border-b border-slate-100 hover:bg-slate-50 px-2 -mx-2 rounded-lg transition-colors group">
          <div className="text-left">
            <h3 className="text-[14px] font-bold text-slate-900">Download Your Data</h3>
            <p className="text-[13px] text-slate-500 mt-0.5">Download a copy of your data</p>
          </div>
          <ChevronRight size={18} className="text-slate-400 group-hover:text-slate-600 transition-colors" />
        </button>

        {/* Row 2 */}
        <button 
          onClick={handleDeleteClick}
          className="w-full flex items-center justify-between py-5 hover:bg-red-50 px-2 -mx-2 rounded-lg transition-colors group"
        >
          <div className="text-left">
            <h3 className="text-[14px] font-bold text-red-600">Delete Account</h3>
            <p className="text-[13px] text-slate-500 mt-0.5">Permanently delete your account and all data</p>
          </div>
          <ChevronRight size={18} className="text-slate-400 group-hover:text-red-600 transition-colors" />
        </button>
      </div>
    </div>
  );
}
