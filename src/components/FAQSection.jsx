import { useState } from 'react';
import { ChevronDown } from 'lucide-react';

const faqs = [
  { question: 'Is OpportunityOS free to use?', answer: 'Yes, the core platform is 100% free for students.' },
  { question: 'How are opportunities sourced?', answer: 'We aggregate from partner companies, verified lists, and community submissions.' },
  { question: 'Can I track multiple applications?', answer: 'Absolutely. You can track unlimited applications on the dashboard.' },
  { question: 'Is my data safe with OpportunityOS?', answer: 'We use industry-standard encryption and do not sell your personal data.' }
];

export default function FAQSection() {
  const [openId, setOpenId] = useState(0);

  return (
    <div id="resources" className="w-full">
      <h2 className="text-xl font-bold text-slate-900 mb-6">Frequently Asked Questions</h2>
      <div className="flex flex-col gap-3">
        {faqs.map((faq, i) => (
          <div key={i} className="bg-white border border-slate-200 rounded-xl overflow-hidden">
            <button 
              onClick={() => setOpenId(openId === i ? -1 : i)}
              className="w-full px-5 py-4 flex items-center justify-between text-left focus:outline-none"
            >
              <span className="font-semibold text-sm text-slate-800">{faq.question}</span>
              <ChevronDown size={18} className={`text-slate-400 transition-transform ${openId === i ? 'rotate-180' : ''}`} />
            </button>
            {openId === i && (
              <div className="px-5 pb-4 text-sm text-slate-600">
                {faq.answer}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
