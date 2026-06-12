import { Star, ChevronLeft, ChevronRight } from 'lucide-react';

const testimonials = [
  {
    name: 'Sneha Reddy',
    role: 'Software Engineering Student',
    feedback: '"OpportunityOS helped me find my dream internship at Microsoft. The application tracker is a game changer!"',
    avatar: 'https://api.dicebear.com/7.x/notionists/svg?seed=Sneha&backgroundColor=f87171'
  },
  {
    name: 'Arjun Patel',
    role: 'Final Year Student',
    feedback: '"The AI resume builder and career coach really improved my profile. Got 3 interview calls in a week!"',
    avatar: 'https://api.dicebear.com/7.x/notionists/svg?seed=Arjun&backgroundColor=60a5fa'
  },
  {
    name: 'Priya Sharma',
    role: 'Hackathon Winner',
    feedback: '"Found an amazing team for a hackathon through the team finder. We ended up winning the prize!"',
    avatar: 'https://api.dicebear.com/7.x/notionists/svg?seed=Priya&backgroundColor=34d399'
  }
];

export default function TestimonialsSection() {
  return (
    <section className="w-full max-w-[1400px] mx-auto px-6 py-24 flex flex-col items-center">
      <h2 className="text-2xl font-bold text-slate-900 mb-12 tracking-tight">Loved by students</h2>

      <div className="flex items-center gap-6 w-full max-w-6xl">
        <button 
          aria-label="Previous testimonials"
          className="w-10 h-10 rounded-full bg-white border border-slate-200 flex items-center justify-center text-slate-600 hover:bg-slate-50 shadow-sm shrink-0 focus-visible:ring-2 focus-visible:ring-[#6C4CF1] focus-visible:outline-none"
        >
          <ChevronLeft size={20} />
        </button>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full">
          {testimonials.map((test, i) => (
            <div key={i} className="bg-white border border-slate-100 rounded-2xl p-8 shadow-[0_4px_20px_rgba(0,0,0,0.03)] flex flex-col">
              <div className="flex items-center gap-4 mb-6">
                <img src={test.avatar} alt={test.name} className="w-12 h-12 rounded-full border border-slate-200 bg-slate-100 object-cover" />
                <div>
                  <h4 className="font-bold text-slate-900 text-sm">{test.name}</h4>
                  <p className="text-xs text-slate-500">{test.role}</p>
                </div>
              </div>
              <p className="text-sm text-slate-700 leading-relaxed mb-6 flex-1">
                {test.feedback}
              </p>
              <div className="flex text-amber-400 gap-1">
                {[1, 2, 3, 4, 5].map(star => <Star key={star} size={14} fill="currentColor" />)}
              </div>
            </div>
          ))}
        </div>

        <button 
          aria-label="Next testimonials"
          className="w-10 h-10 rounded-full bg-white border border-slate-200 flex items-center justify-center text-slate-600 hover:bg-slate-50 shadow-sm shrink-0 focus-visible:ring-2 focus-visible:ring-[#6C4CF1] focus-visible:outline-none"
        >
          <ChevronRight size={20} />
        </button>
      </div>
    </section>
  );
}
