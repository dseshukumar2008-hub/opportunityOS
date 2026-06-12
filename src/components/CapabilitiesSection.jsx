import { Sparkles, ShieldCheck, Users, Building, Bot, Wand2, Database, MonitorSmartphone } from 'lucide-react';

export default function CapabilitiesSection() {
  const capabilities = [
    { icon: Sparkles, title: "AI Powered", desc: "Smart matching & recommendations" },
    { icon: ShieldCheck, title: "Secure Cloud", desc: "Enterprise-grade data protection" },
    { icon: Users, title: "Realtime Sync", desc: "Collaborate seamlessly with teams" },
    { icon: Building, title: "Employer Portal", desc: "Direct access to top talent" },
    { icon: Bot, title: "AI Recruiter", desc: "Automated candidate screening" },
    { icon: Wand2, title: "Opportunity Copilot", desc: "Your personal career assistant" },
    { icon: Database, title: "Supabase Backend", desc: "Scalable & reliable database" },
    { icon: MonitorSmartphone, title: "Responsive UI", desc: "Flawless experience on any device" },
  ];

  return (
    <section className="w-full max-w-[1400px] mx-auto px-6 py-12 lg:py-16 border-t border-slate-100">
      <div className="text-center mb-10">
        <p className="text-sm font-semibold text-indigo-600 tracking-wider uppercase mb-2">Platform Capabilities</p>
        <h2 className="text-2xl lg:text-3xl font-bold text-slate-900">Powered by modern technology</h2>
      </div>
      
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 lg:gap-6">
        {capabilities.map((cap, i) => (
          <div key={i} className="bg-white border border-slate-100 shadow-[0_2px_10px_rgba(0,0,0,0.02)] hover:shadow-lg hover:-translate-y-1 transition-all duration-300 rounded-2xl p-6 flex flex-col items-center text-center gap-4 group">
            <div className="w-14 h-14 rounded-2xl bg-slate-50 group-hover:bg-indigo-50 text-slate-600 group-hover:text-indigo-600 flex items-center justify-center shrink-0 transition-colors duration-300">
              <cap.icon size={28} strokeWidth={1.5} />
            </div>
            <div>
              <h4 className="text-sm font-bold text-slate-900 mb-1.5">{cap.title}</h4>
              <p className="text-xs text-slate-500 leading-relaxed">{cap.desc}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
