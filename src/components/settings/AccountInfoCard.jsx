import { User, Edit2 } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { useProfile } from '../../contexts/ProfileContext';

export default function AccountInfoCard({ onEditClick }) {
  const { user } = useAuth();
  const { profile } = useProfile();
  
  const displayData = {
    name: profile?.full_name || user?.name || 'User',
    email: user?.email || 'user@example.com',
    location: user?.location || 'New Delhi, India',
    memberSince: user?.memberSince || 'June 2, 2025'
  };

  return (
    <div className="card-standard p-8 relative">
      {/* Edit Button */}
      <button 
        onClick={onEditClick}
        className="btn-primary absolute top-8 right-8 px-4 py-2 text-[13px] flex items-center gap-1.5"
      >
        <Edit2 size={14} />
        Edit
      </button>

      <div className="flex items-start gap-4 mb-8">
        <div className="w-12 h-12 rounded-xl bg-[#F3F0FF] text-[#6C4CF1] flex items-center justify-center shrink-0">
          <User size={24} />
        </div>
        <div>
          <h2 className="text-[18px] font-bold text-slate-900">Account Information</h2>
          <p className="text-[13px] text-slate-500 font-medium mt-0.5">Update your personal information and how others see you on OpportunityOS.</p>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row items-center sm:items-start gap-10 sm:gap-16 pl-0 sm:pl-[64px]">
        {/* Avatar */}
        <div className="shrink-0 relative">
          <img 
            src={profile?.avatar_url || `https://api.dicebear.com/7.x/notionists/svg?seed=${user?.name || 'User'}&backgroundColor=e2e8f0`} 
            alt="Profile Avatar" 
            className="w-[120px] h-[120px] rounded-full border border-slate-200 object-cover bg-slate-100"
          />
        </div>

        {/* Fields */}
        <div className="flex-1 space-y-5 w-full">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
            <span className="text-[13px] text-slate-500 font-medium">Full Name</span>
            <span className="text-[14px] text-slate-900 font-bold sm:col-span-2">{displayData.name}</span>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
            <span className="text-[13px] text-slate-500 font-medium">Email Address</span>
            <span className="text-[14px] text-slate-900 font-bold sm:col-span-2">{displayData.email}</span>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
            <span className="text-[13px] text-slate-500 font-medium">Location</span>
            <span className="text-[14px] text-slate-900 font-bold sm:col-span-2">{displayData.location}</span>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
            <span className="text-[13px] text-slate-500 font-medium">Member Since</span>
            <span className="text-[14px] text-slate-900 font-bold sm:col-span-2">{displayData.memberSince}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
