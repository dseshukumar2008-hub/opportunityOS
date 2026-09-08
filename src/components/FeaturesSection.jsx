import { ArrowRight, FileText, MessageCircle, BarChart2, Wand2 } from 'lucide-react';

export default function FeaturesSection() {
  const showcases = [
    {
      title: 'Analyze Resume',
      desc: 'Get instant feedback on your resume. Optimize for ATS tracking with precise keyword suggestions and action verb improvements.',
      icon: <FileText size={24} />,
      colorClass: 'bg-indigo-50 text-indigo-600',
    },
    {
      title: 'AI Career Coach',
      desc: 'Receive personalized guidance, skill gap analysis, and tailored roadmaps to land your dream role faster.',
      icon: <MessageCircle size={24} />,
      colorClass: 'bg-emerald-50 text-emerald-600',
    },
    {
      title: 'AI Analyzer',
      desc: 'For employers: instantly rank candidates based on precise match scores analyzing skills, experience, and project quality.',
      icon: <BarChart2 size={24} />,
      colorClass: 'bg-amber-50 text-amber-700',
    },
    {
      title: 'OpportunityOS Copilot',
      desc: 'Navigate the platform via a natural language interface. Ask questions, discover opportunities, and execute actions instantly.',
      icon: <Wand2 size={24} />,
      colorClass: 'bg-rose-50 text-rose-600',
    }
  ];

  return (
    <section id="features" className="w-full max-w-[1400px] mx-auto px-6 py-24 flex flex-col items-center">
      <div className="text-center max-w-3xl mx-auto mb-16 lg:mb-24 px-4">
        <h2 className="text-3xl lg:text-4xl font-bold text-slate-900 mb-6 tracking-tight">Tools to advance your career.</h2>
        <p className="text-lg text-slate-600 leading-relaxed max-w-2xl mx-auto">A workspace that doesn't just store your data, but actively works to accelerate your career.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-5xl">
        {showcases.map((feature, idx) => (
          <div key={idx} className="bg-white rounded-2xl border border-slate-200 p-8 shadow-sm flex flex-col">
            <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-6 ${feature.colorClass}`}>
              {feature.icon}
            </div>
            <h3 className="text-[20px] font-bold text-slate-900 mb-2">{feature.title}</h3>
            <p className="text-slate-600 text-[15px] leading-relaxed mb-6 flex-1">{feature.desc}</p>
            <button className="text-indigo-600 font-bold text-[15px] flex items-center gap-1.5 w-max hover:gap-2 transition-all outline-none">
              Learn More <ArrowRight size={18} />
            </button>
          </div>
        ))}
      </div>
    </section>
  );
}
