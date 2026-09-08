import { X } from 'lucide-react';
import Modal from './Modal';

export default function HowItWorksModal({ isOpen, onClose, title, subtitle, steps, zIndex = 50 }) {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      zIndex={zIndex}
      maxWidth="max-w-lg"
      ariaLabelledby="how-it-works-title"
      animateY={20}
    >
      <div className="flex items-center justify-between p-6 border-b border-slate-100">
        <div>
          <h2 id="how-it-works-title" className="text-xl font-bold text-slate-900">{title}</h2>
          {subtitle && <p className="text-sm text-slate-500 mt-1">{subtitle}</p>}
        </div>
        <button
          onClick={onClose}
          aria-label="Close modal"
          className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-full transition-colors"
        >
          <X size={20} />
        </button>
      </div>

      <div className="p-6">
        <div className="space-y-6 relative z-10">
          {/* Vertical line connecting steps */}
          <div className="absolute left-[21px] top-4 bottom-4 w-0.5 bg-slate-100 -z-10" />
          
          {steps.map((step) => (
            <div key={step.id} className="flex gap-4 relative">
              <div className="w-11 h-11 rounded-full bg-indigo-50 border-4 border-white flex items-center justify-center text-[#6D4AFF] shrink-0 shadow-sm z-10">
                <step.icon size={18} />
              </div>
              <div className="pt-1">
                <h4 className="font-bold text-slate-900 text-sm">Step {step.id}: {step.title}</h4>
                <p className="text-xs text-slate-500 mt-1 font-medium">{step.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="p-6 bg-slate-50 border-t border-slate-100 flex justify-end">
        <button
          onClick={onClose}
          className="px-6 py-2.5 bg-slate-900 text-white text-sm font-bold rounded-xl hover:bg-slate-800 transition-colors"
        >
          Got it
        </button>
      </div>
    </Modal>
  );
}
