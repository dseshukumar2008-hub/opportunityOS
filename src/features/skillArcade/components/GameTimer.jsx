import { useState, useEffect, useRef } from 'react';
import { Clock } from 'lucide-react';

export const GameTimer = ({ isActive, duration, onExpire, setTimerAnnouncement }) => {
  const [timeLeft, setTimeLeft] = useState(duration);
  const timerRef = useRef(null);

  useEffect(() => {
    if (isActive) {
      timerRef.current = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            clearInterval(timerRef.current);
            onExpire();
            return 0;
          }
          if (prev === 300) setTimerAnnouncement('5 minutes remaining');
          else if (prev === 60) setTimerAnnouncement('1 minute remaining');
          else if (prev === 30) setTimerAnnouncement('30 seconds remaining');
          else if (prev === 10) setTimerAnnouncement('10 seconds remaining, hurry up!');
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(timerRef.current);
  }, [isActive, onExpire, setTimerAnnouncement]);

  const m = Math.floor(timeLeft / 60);
  const s = timeLeft % 60;
  const formatted = `${m}:${s.toString().padStart(2, '0')}`;

  const isCritical = timeLeft > 0 && timeLeft <= 15;
  const isWarning = timeLeft > 15 && timeLeft <= 60;

  let stateStyle = 'bg-white border-slate-200 text-slate-700';
  let iconStyle = 'text-slate-400';

  if (isCritical) {
    stateStyle = 'bg-rose-50 border-rose-200 text-rose-700 transition-colors duration-500 animate-pulse';
    iconStyle = 'text-rose-500';
  } else if (isWarning) {
    stateStyle = 'bg-amber-50 border-amber-200 text-amber-700 transition-colors duration-500';
    iconStyle = 'text-amber-500';
  }

  const progressPercent = (timeLeft / duration) * 100;

  return (
    <div className={`relative overflow-hidden flex items-center gap-2 px-3 py-1.5 rounded-lg border font-bold tabular-nums ${stateStyle}`}>
      <Clock size={16} className={iconStyle} />
      <span className="relative z-10" aria-live="polite" aria-atomic="true">
        {formatted}
      </span>
      <div
        className={`absolute bottom-0 left-0 h-1 transition-all duration-1000 ease-linear ${isCritical ? 'bg-rose-500/30' : isWarning ? 'bg-amber-500/30' : 'bg-slate-300/30'}`}
        style={{ width: `${progressPercent}%` }}
      />
    </div>
  );
};
