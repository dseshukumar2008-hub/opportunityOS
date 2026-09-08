
import { CheckCircle2, XCircle } from 'lucide-react';

export const AnswerOption = ({
  option,
  isSelected,
  isCorrect,
  isFeedbackState,
  isPendingEvaluation,
  isDisabled,
  onSelect,
  questionType,
}) => {
  let btnClass = "text-left p-3 rounded-xl border-2 font-medium transition-all duration-200 outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 ";
  
  if (isPendingEvaluation) {
    if (isSelected) {
      btnClass += "border-indigo-500 bg-indigo-50 text-indigo-900 shadow-sm";
    } else {
      btnClass += "border-slate-100 bg-slate-50 text-slate-400 opacity-60";
    }
  } else if (!isFeedbackState) {
    btnClass += "border-slate-100 bg-white hover:border-indigo-200 hover:bg-slate-50 text-slate-700 shadow-sm";
  } else {
    if (isCorrect) {
      btnClass += "border-emerald-500 bg-emerald-50 text-emerald-800 shadow-sm";
    } else if (isSelected && !isCorrect) {
      btnClass += "border-rose-500 bg-rose-50 text-rose-800 shadow-sm";
    } else {
      btnClass += "border-slate-100 bg-slate-50 text-slate-400 opacity-60";
    }
  }

  if (isDisabled && !isPendingEvaluation) {
    btnClass += " cursor-default";
  }

  return (
    <button
      onClick={() => {
        if (!isDisabled) {
          onSelect(option);
        }
      }}
      className={btnClass}
      disabled={isDisabled}
      aria-disabled={isDisabled}
      aria-pressed={isSelected}
    >
      <div className="flex items-center justify-between gap-4">
        <span className={questionType === 'code-output' ? 'font-mono text-sm' : ''}>{option}</span>
        {isFeedbackState && isCorrect && <CheckCircle2 size={20} className="text-emerald-600 shrink-0" aria-hidden="true" />}
        {isFeedbackState && isSelected && !isCorrect && <XCircle size={20} className="text-rose-600 shrink-0" aria-hidden="true" />}
      </div>
    </button>
  );
};
