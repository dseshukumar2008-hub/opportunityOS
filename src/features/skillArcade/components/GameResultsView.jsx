import { Trophy, Clock, Target, Flame, Play, X } from 'lucide-react';

export default function GameResultsView({ gameResult, onPlayAgain, onClose }) {
  const { game, score, accuracy, streak, isNewHighScore, xpEarned } = gameResult;

  return (
    <div className="flex flex-col items-center justify-center h-full p-8 bg-white text-center">
      <div className="w-20 h-20 bg-[#EBE8FF] rounded-[20px] flex items-center justify-center mb-6 shadow-sm shadow-[#6C4CF1]/20">
        <Trophy size={40} className="text-[#6C4CF1]" />
      </div>
      
      <h2 className="text-[28px] font-black text-slate-900 mb-2">Game Over!</h2>
      <p className="text-[16px] font-medium text-slate-500 mb-8">{game} Challenge Completed</p>
      
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 w-full max-w-2xl mb-10">
        <div className="bg-slate-50 border border-slate-100 rounded-2xl p-5 flex flex-col items-center">
          <p className="text-[12px] font-bold text-slate-400 uppercase tracking-wider mb-2">Score</p>
          <p className="text-[28px] font-black text-[#6C4CF1]">{score}</p>
          {isNewHighScore && <span className="text-[10px] font-bold text-white bg-[#6C4CF1] px-2 py-0.5 rounded-full mt-1">NEW HIGH!</span>}
        </div>
        <div className="bg-slate-50 border border-slate-100 rounded-2xl p-5 flex flex-col items-center">
          <p className="text-[12px] font-bold text-slate-400 uppercase tracking-wider mb-2">Accuracy</p>
          <p className="text-[28px] font-black text-green-500">{accuracy}</p>
        </div>
        <div className="bg-slate-50 border border-slate-100 rounded-2xl p-5 flex flex-col items-center">
          <p className="text-[12px] font-bold text-slate-400 uppercase tracking-wider mb-2">Streak</p>
          <p className="text-[28px] font-black text-slate-700 flex items-center gap-1">{streak} <span className="text-[20px]">🔥</span></p>
        </div>
        <div className="bg-slate-50 border border-slate-100 rounded-2xl p-5 flex flex-col items-center justify-center">
          <p className="text-[12px] font-bold text-slate-400 uppercase tracking-wider mb-2">XP Earned</p>
          <p className="text-[28px] font-black text-[#6C4CF1]">+{xpEarned || score}</p>
        </div>
      </div>

      <div className="flex items-center gap-4">
        <button 
          onClick={onPlayAgain}
          className="flex items-center gap-2 bg-gradient-to-r from-[#6C4CF1] to-[#5538EE] hover:from-[#5A3EE0] hover:to-[#4529CF] text-white px-8 py-3.5 rounded-xl font-bold text-[15px] transition-colors shadow-md shadow-[#6C4CF1]/30"
        >
          <Play size={18} className="fill-white" /> Play Again
        </button>
        <button 
          onClick={onClose}
          className="flex items-center gap-2 bg-white border-2 border-slate-200 hover:border-slate-300 hover:bg-slate-50 text-slate-600 px-8 py-3.5 rounded-xl font-bold text-[15px] transition-colors"
        >
          <X size={18} /> Back to Arcade
        </button>
      </div>
    </div>
  );
}
