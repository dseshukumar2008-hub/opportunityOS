import { geminiService } from './geminiService';
import { createRecommendation } from '../types/ProjectRecommendation';

/**
 * Orchestrates fetching profile data and generating AI recommendations via Gemini.
 */
const generateMockRecommendations = (specialization, targetRole) => {
  const mocks = [
    {
      title: "AI Resume Analyzer",
      description: "Build an NLP-powered tool that analyzes resumes against job descriptions, extracting key skills and generating an ATS match score.",
      technologies: ["Python", "Spacy", "React", "FastAPI"],
      whyThisProject: `Highly relevant for a ${targetRole} in ${specialization}. Demonstrates practical text processing and API integration.`,
      isMock: true
    },
    {
      title: "RAG Knowledge Assistant",
      description: "Create a Retrieval-Augmented Generation chatbot that can answer questions based on a specific set of uploaded PDF documents.",
      technologies: ["LangChain", "Pinecone", "OpenAI", "Next.js"],
      whyThisProject: "RAG is a highly sought-after pattern in the industry right now. Shows you can build production-ready LLM pipelines.",
      isMock: true
    },
    {
      title: "AI Interview Coach",
      description: "Develop a system that takes audio input, transcribes it, and evaluates interview responses using an LLM, providing actionable feedback.",
      technologies: ["Whisper API", "GPT-4", "Node.js", "WebRTC"],
      whyThisProject: "Combines multimodal AI with real-time feedback mechanisms, a key skill for modern AI engineers.",
      isMock: true
    },
    {
      title: "Learning Copilot",
      description: "A personalized tutoring system that tracks user progress and generates adaptive quizzes based on their weakest topics.",
      technologies: ["React", "Firebase", "Vector DB", "Express"],
      whyThisProject: "Demonstrates ability to manage user state and generate dynamic AI content based on context.",
      isMock: true
    },
    {
      title: "Multi-Agent Research System",
      description: "Build a framework where multiple AI agents collaborate to research a topic, verify facts, and compile a final summary report.",
      technologies: ["Python", "AutoGen", "Docker", "REST APIs"],
      whyThisProject: "Agentic workflows are the cutting edge of AI development. Highlights advanced orchestration skills.",
      isMock: true
    }
  ];

  return mocks.map(proj => createRecommendation(proj));
};

export const generateProjectRecommendations = async (profileData) => {
  const specialization = profileData?.specialization || "Computer Science / Software Engineering";
  const targetRole = profileData?.targetRole || profileData?.careerGoal || "Software Engineer";
  
  try {
    const rawProjects = await geminiService.generateProjectRecommendations({
      specialization,
      targetRole
    });

    if (!Array.isArray(rawProjects)) {
      throw new Error("Invalid response from Gemini API");
    }

    return rawProjects.map(proj => createRecommendation({
      title: proj.title,
      description: proj.description,
      technologies: proj.technologies || [],
      whyThisProject: proj.whyThisProject,
      isMock: false
    }));
  } catch (error) {
    const isQuotaError = error.status === 429 || 
      error.status === 403 || // Also catch 403 for API key disabled state during dev
      error.message?.toLowerCase().includes('quota') || 
      error.message?.toLowerCase().includes('rate limit');

    if (isQuotaError) {
      console.warn("[Dev Fallback] Gemini API quota exceeded. Generating mock recommendations.");
      return generateMockRecommendations(specialization, targetRole);
    }
    
    throw error;
  }
};
