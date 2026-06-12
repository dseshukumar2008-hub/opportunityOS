import { motion } from 'framer-motion';
import { Link as LinkIcon, Globe } from 'lucide-react';

export default function IntegrationsSettings() {
  const integrations = [
    { 
      id: 'github', 
      name: 'GitHub', 
      desc: 'Connect your GitHub account to showcase your repositories.',
      connected: true,
      username: 'seshukumar',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4"></path><path d="M9 18c-4.51 2-5-2-7-2"></path></svg>
      )
    },
    { 
      id: 'linkedin', 
      name: 'LinkedIn', 
      desc: 'Import your experience and education from LinkedIn.',
      connected: false,
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path><rect x="2" y="9" width="4" height="12"></rect><circle cx="4" cy="4" r="2"></circle></svg>
      )
    },
    { 
      id: 'portfolio', 
      name: 'Portfolio Website', 
      desc: 'Link your personal website or portfolio.',
      connected: true,
      username: 'seshu.dev',
      icon: <Globe size={24} />
    }
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
          <LinkIcon size={24} />
        </div>
        <div>
          <h2 className="text-[18px] font-bold text-slate-900">Integrations</h2>
          <p className="text-[13px] text-slate-500 font-medium mt-0.5">Connect external accounts and services.</p>
        </div>
      </div>

      <div className="space-y-6">
        {integrations.map((app, index) => (
          <div key={app.id} className={`flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${index !== integrations.length - 1 ? 'pb-6 border-b border-slate-100' : ''}`}>
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-full bg-slate-50 border border-slate-200 flex items-center justify-center text-slate-700 shrink-0">
                {app.icon}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-[14px] font-bold text-slate-900">{app.name}</h3>
                  {app.connected && (
                    <span className="px-2 py-0.5 bg-emerald-50 text-emerald-600 text-[10px] font-bold rounded-full uppercase tracking-wider">Connected</span>
                  )}
                </div>
                <p className="text-[13px] text-slate-500 mt-0.5">{app.connected && app.username ? app.username : app.desc}</p>
              </div>
            </div>
            <button 
              className={`shrink-0 px-4 py-2 text-[13px] font-bold rounded-xl transition-colors ${
                app.connected 
                  ? 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50' 
                  : 'bg-[#F3F0FF] text-[#6C4CF1] hover:bg-[#EAE4FF]'
              }`}
            >
              {app.connected ? 'Disconnect' : 'Connect'}
            </button>
          </div>
        ))}
      </div>
    </motion.div>
  );
}
