import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { MessageSquare, Send, Clock, User, ArrowLeft } from 'lucide-react';
import EvaluationFeedback from './EvaluationFeedback';
import { geminiService } from '../../services/geminiService';
import { toast } from 'react-hot-toast';

export default function InterviewSession({ 
  questions, 
  currentQuestionIndex, 
  role, 
  onNextQuestion, 
  onFinishSession,
  onSaveEvaluation,
  onBackToRoles
}) {
  const [answer, setAnswer] = useState('');
  const [isEvaluating, setIsEvaluating] = useState(false);
  const [evaluation, setEvaluation] = useState(null);
  const [showExitConfirm, setShowExitConfirm] = useState(false);

  const question = questions[currentQuestionIndex];
  const isLastQuestion = currentQuestionIndex === questions.length - 1;

  const handleSubmit = async () => {
    if (!answer.trim()) {
      toast.error("Please provide an answer.");
      return;
    }

    setIsEvaluating(true);
    try {
      const result = await geminiService.evaluateInterviewAnswer(question.question, answer, role);
      setEvaluation(result);
      onSaveEvaluation(question, answer, result);
    } catch (error) {
      console.error("Gemini Error during Answer Evaluation:", error);
      // Fallback state handled silently
      const fallbackResult = {
        score: 7,
        strengths: ["Clear communication", "Provided an answer"],
        improvements: ["AI detailed evaluation is currently unavailable"],
        feedback: "Good attempt! The AI evaluation service is currently busy, but please continue with the interview.",
        idealAnswer: "An ideal answer would directly address the question with specific examples using the STAR method.",
        missingConcepts: [],
        topicsToRevise: []
      };
      setEvaluation(fallbackResult);
      onSaveEvaluation(question, answer, fallbackResult);
    } finally {
      setIsEvaluating(false);
    }
  };

  const handleNext = () => {
    setAnswer('');
    setEvaluation(null);
    if (isLastQuestion) {
      onFinishSession();
    } else {
      onNextQuestion();
    }
  };

  const handleRetry = () => {
    setEvaluation(null);
  };

  const handleBackClick = () => {
    if (currentQuestionIndex > 0 || evaluation) {
      setShowExitConfirm(true);
    } else {
      onBackToRoles();
    }
  };

  return (
    <div className="max-w-4xl mx-auto mt-6 px-4 pb-12">
      <button 
        onClick={handleBackClick}
        className="flex items-center gap-2 text-slate-500 hover:text-slate-800 font-bold mb-6 transition-colors"
      >
        <ArrowLeft size={18} /> Back to Roles
      </button>

      {/* Progress Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">{role} Interview</h2>
          <p className="text-slate-500">Question {currentQuestionIndex + 1} of {questions.length}</p>
        </div>
        <div className="flex gap-1">
          {questions.map((_, idx) => (
            <div 
              key={idx} 
              className={`h-2 rounded-full transition-all duration-300 ${
                idx === currentQuestionIndex ? 'w-8 bg-[#6D4AFF]' : 
                idx < currentQuestionIndex ? 'w-4 bg-[#6D4AFF]/40' : 'w-4 bg-slate-200'
              }`}
            />
          ))}
        </div>
      </div>

      {/* Compact Header & Question Card */}
      <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 sm:p-5 mb-6">
        <div className="flex items-center gap-2 mb-2">
          <span className="text-xs font-bold text-[#6D4AFF] uppercase tracking-wider">
            Question {currentQuestionIndex + 1} / {questions.length}
          </span>
          <span className="text-slate-300">•</span>
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
            Question Type: {question.type}
          </span>
        </div>
        <div className="flex items-start gap-3">
          <MessageSquare size={18} className="text-slate-400 shrink-0 mt-1" />
          <h3 className="text-base sm:text-lg font-medium text-slate-800 leading-relaxed">
            {question.question}
          </h3>
        </div>
      </div>

      {/* Answer Area or Feedback */}
      {!evaluation ? (
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white border-2 border-indigo-100 shadow-md rounded-2xl overflow-hidden focus-within:border-[#6D4AFF] focus-within:ring-4 focus-within:ring-indigo-50 transition-all duration-300"
        >
          <div className="bg-slate-50 border-b border-slate-200 px-6 py-4 flex items-center gap-3">
            <User size={18} className="text-[#6D4AFF]" />
            <span className="font-bold text-slate-800">Your Answer</span>
          </div>
          <div className="p-6">
            <textarea
              value={answer}
              onChange={(e) => setAnswer(e.target.value)}
              placeholder="Type your answer here... Take your time and be as detailed as possible."
              className="w-full h-[350px] sm:h-[450px] md:h-[500px] resize-none outline-none text-slate-800 text-lg leading-relaxed bg-transparent placeholder:text-slate-400"
              disabled={isEvaluating}
            />
          </div>
          <div className="bg-slate-50 border-t border-slate-200 px-6 py-4 flex justify-between items-center">
            <div className="flex items-center gap-2 text-sm text-slate-500">
              <Clock size={16} /> Take your time
            </div>
            <button
              onClick={handleSubmit}
              disabled={isEvaluating || !answer.trim()}
              className="flex items-center gap-2 px-6 py-2.5 bg-[#6D4AFF] text-white font-bold rounded-xl hover:bg-[#5B3DE6] transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
            >
              {isEvaluating ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  Evaluating...
                </>
              ) : (
                <>
                  Submit Answer <Send size={16} />
                </>
              )}
            </button>
          </div>
        </motion.div>
      ) : (
        <EvaluationFeedback 
          evaluation={evaluation} 
          userAnswer={answer} 
          onNext={handleNext} 
          onRetry={handleRetry}
          isLastQuestion={isLastQuestion}
        />
      )}

      {showExitConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm px-4">
          <div className="bg-white rounded-2xl p-6 w-full max-w-sm shadow-xl">
            <h3 className="text-lg font-bold text-slate-900 mb-2">Leave Interview?</h3>
            <p className="text-slate-600 mb-6">Leave interview and return to role selection?</p>
            <div className="flex gap-3">
              <button 
                onClick={() => setShowExitConfirm(false)} 
                className="flex-1 py-2.5 bg-slate-100 text-slate-700 font-bold rounded-xl hover:bg-slate-200 transition-colors"
              >
                Continue Interview
              </button>
              <button 
                onClick={onBackToRoles} 
                className="flex-1 py-2.5 bg-rose-600 text-white font-bold rounded-xl hover:bg-rose-700 transition-colors"
              >
                Leave
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
