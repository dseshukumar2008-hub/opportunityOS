import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useCareer } from '../../contexts/CareerContext';
import { geminiService } from '../../services/geminiService';
import { saveInterviewSession } from '../../services/interviewRepository';
import { toast } from 'react-hot-toast';

import RoleSelection from './RoleSelection';
import InterviewSession from './InterviewSession';
import SessionResults from './SessionResults';
import ContextualBackButton from '../../components/navigation/ContextualBackButton';

const STEPS = {
  ROLE_SELECTION: 'ROLE_SELECTION',
  SESSION: 'SESSION',
  RESULTS: 'RESULTS'
};

export default function InterviewPrepPage() {
  const { user } = useAuth();
  const { careerContext } = useCareer();
  const location = useLocation();
  const isContextMode = !!location.state?.sourceName;
  
  const [currentStep, setCurrentStep] = useState(STEPS.ROLE_SELECTION);
  const [loading, setLoading] = useState(false);
  
  const [selectedRole, setSelectedRole] = useState(isContextMode ? (careerContext?.targetRole || '') : '');
  const [questions, setQuestions] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [sessionResults, setSessionResults] = useState([]);

  const handleSelectRole = async (role) => {
    if (role === selectedRole && questions.length > 0) {
      setCurrentStep(STEPS.SESSION);
      return;
    }

    setSelectedRole(role);
    setLoading(true);
    try {
      const generatedQuestions = await geminiService.generateInterviewQuestions(role);
      
      if (!Array.isArray(generatedQuestions)) {
        throw new Error("API returned non-array result");
      }
      
      setQuestions(generatedQuestions);
      setCurrentQuestionIndex(0);
      setSessionResults([]);
      setCurrentStep(STEPS.SESSION);
    } catch (error) {
      console.error("Gemini Error during Question Generation:", error);
      
      // Fallback questions
      const fallbackQuestions = [
        { type: "Behavioral", question: "Tell me about a time you had to overcome a significant challenge in a project." },
        { type: "Technical", question: "Can you explain a complex technical concept you recently learned to someone without a technical background?" },
        { type: "Scenario", question: "If you found a critical bug in production right before a major release, how would you handle it?" },
        { type: "Behavioral", question: "Describe a situation where you disagreed with a team member. How did you resolve it?" },
        { type: "Technical", question: `What are the core technical skills you believe are most important for a ${role}?` }
      ];
      setQuestions(fallbackQuestions);
      setCurrentQuestionIndex(0);
      setSessionResults([]);
      setCurrentStep(STEPS.SESSION);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveEvaluation = (question, answer, evaluation) => {
    setSessionResults(prev => [
      ...prev,
      {
        question,
        answer,
        evaluation
      }
    ]);
  };

  const handleNextQuestion = () => {
    setCurrentQuestionIndex(prev => prev + 1);
  };

  const handleFinishSession = async () => {
    if (user) {
      try {
        await saveInterviewSession(user.uid, {
          role: selectedRole,
          results: sessionResults
        });
        toast.success("Interview session saved!");
      } catch (error) {
        console.error("Failed to save session:", error);
      }
    }
    setCurrentStep(STEPS.RESULTS);
  };

  const handleRestart = () => {
    setSelectedRole('');
    setQuestions([]);
    setCurrentQuestionIndex(0);
    setSessionResults([]);
    setCurrentStep(STEPS.ROLE_SELECTION);
  };

  return (
    <div className="min-h-screen bg-slate-50/50 pb-20 pt-6 px-4">
      <div className="max-w-6xl mx-auto">
        <ContextualBackButton />
      </div>
      {currentStep === STEPS.ROLE_SELECTION && (
        <RoleSelection 
          onSelectRole={handleSelectRole} 
          loading={loading} 
          activeSessionRole={questions.length > 0 ? selectedRole : null}
          initialRole={isContextMode ? (careerContext?.targetRole || '') : ''}
        />
      )}

      {currentStep === STEPS.SESSION && Array.isArray(questions) && questions.length > 0 && (
        <InterviewSession
          questions={questions}
          currentQuestionIndex={currentQuestionIndex}
          role={selectedRole}
          onNextQuestion={handleNextQuestion}
          onFinishSession={handleFinishSession}
          onSaveEvaluation={handleSaveEvaluation}
          onBackToRoles={() => setCurrentStep(STEPS.ROLE_SELECTION)}
        />
      )}

      {currentStep === STEPS.RESULTS && (
        <SessionResults 
          sessionData={{ role: selectedRole, results: sessionResults }} 
          onRestart={handleRestart} 
        />
      )}
    </div>
  );
}
