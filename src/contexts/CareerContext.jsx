import React, { createContext, useContext, useState, useEffect } from 'react';

const CareerContext = createContext({});

export const useCareer = () => useContext(CareerContext);

export const CareerProvider = ({ children }) => {
  const [careerContext, setCareerContext] = useState(() => {
    const saved = localStorage.getItem('oppOs_career_context');
    return saved ? JSON.parse(saved) : {
      targetRole: '',
      githubScore: 0,
      linkedinScore: 0,
      alignmentScore: 0,
      strengths: [],
      weaknesses: [],
      missingSkills: [],
      missingProjects: [],
      technologyAnalysis: null,
      portfolioDiversity: null
    };
  });

  useEffect(() => {
    localStorage.setItem('oppOs_career_context', JSON.stringify(careerContext));
  }, [careerContext]);

  const updateCareerContext = (updates) => {
    setCareerContext(prev => ({ ...prev, ...updates }));
  };

  const clearCareerContext = () => {
    setCareerContext({
      targetRole: '',
      githubScore: 0,
      linkedinScore: 0,
      alignmentScore: 0,
      strengths: [],
      weaknesses: [],
      missingSkills: [],
      missingProjects: [],
      technologyAnalysis: null,
      portfolioDiversity: null
    });
  };

  return (
    <CareerContext.Provider value={{ careerContext, updateCareerContext, clearCareerContext }}>
      {children}
    </CareerContext.Provider>
  );
};
