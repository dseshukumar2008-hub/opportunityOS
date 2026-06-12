import { 
  User, Bell, Shield, Lock, Palette, 
  Mail, Database, Link as LinkIcon 
} from 'lucide-react';

export default function SettingsSidebar({ activeTab, setActiveTab }) {
  const menuItems = [
    { id: 'account', label: 'Account', icon: User },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'privacy', label: 'Privacy', icon: Shield },
    { id: 'password', label: 'Password & Security', icon: Lock },
    { id: 'appearance', label: 'Appearance', icon: Palette },
    { id: 'email', label: 'Email Preferences', icon: Mail },
    { id: 'data', label: 'Data & Storage', icon: Database },
    { id: 'integrations', label: 'Integrations', icon: LinkIcon }
  ];

  return (
    <div className="w-full md:w-[260px] shrink-0">
      <nav role="navigation" aria-label="Settings Navigation" className="card-standard p-4 flex flex-col gap-1.5">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              aria-current={isActive ? 'page' : undefined}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-semibold text-[14px] transition-all duration-200 focus-visible:ring-2 focus-visible:ring-[#6C4CF1] focus-visible:outline-none ${
                isActive 
                  ? 'bg-[#F3F0FF] text-[#6C4CF1]' 
                  : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
              }`}
            >
              <Icon size={18} className={isActive ? 'text-[#6C4CF1]' : 'text-slate-500'} />
              {item.label}
            </button>
          );
        })}
      </nav>
    </div>
  );
}
