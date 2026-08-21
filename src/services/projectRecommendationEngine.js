import { geminiService } from './geminiService';
import { createRecommendation } from '../types/ProjectRecommendation';


export const generateProjectRecommendations = async (profileData, forceRefresh = false, excludedProjects = []) => {
  const specialization = profileData?.specialization || "Computer Science / Software Engineering";
  const targetRole = profileData?.targetRole || profileData?.careerGoal || "Software Engineer";
  const missingSkills = profileData?.missingSkills || [];

  // Create a unique cache key based on inputs
  const skillsKey = Array.isArray(missingSkills) ? missingSkills.join(',') : '';
  const cacheKey = `gemini_proj_recs_${specialization}_${targetRole}_${skillsKey}`;

  if (!forceRefresh) {
    const cachedData = sessionStorage.getItem(cacheKey);
    if (cachedData) {
      try {
        console.log(`[Project Engine] Cache hit for key: ${cacheKey}`);
        const parsed = JSON.parse(cachedData);
        // Ensure they are proper recommendation objects
        return parsed.map(proj => createRecommendation(proj));
      } catch (_e) {
        console.warn("Invalid cache data, fetching fresh.");
      }
    }
  }

  // Track request count
  let requestCount = parseInt(sessionStorage.getItem('gemini_request_count') || '0', 10);
  requestCount += 1;
  sessionStorage.setItem('gemini_request_count', requestCount.toString());
  console.log(`[Project Engine] Gemini Request Count: ${requestCount}`);

  try {
    const rawProjects = await geminiService.generateProjectRecommendations({
      specialization,
      targetRole,
      missingSkills,
      excludedProjects
    });

    if (!Array.isArray(rawProjects)) {
      throw new Error("Invalid response from Gemini API");
    }

    const formattedProjects = rawProjects.map(proj => createRecommendation({
      title: proj.title,
      description: proj.description,
      technologies: proj.technologies || [],
      whyThisProject: proj.whyThisProject,
      isMock: false
    }));

    // Save successful generation to cache
    sessionStorage.setItem(cacheKey, JSON.stringify(formattedProjects));

    // Also save a fallback copy in case another request fails
    sessionStorage.setItem('gemini_proj_recs_fallback', JSON.stringify(formattedProjects));

    return formattedProjects;
  } catch (error) {
    console.error("Gemini Project Recommendations Error:", error);

    // Attempt to use ANY previously cached recommendations as a fallback
    const fallbackData = sessionStorage.getItem('gemini_proj_recs_fallback');
    if (fallbackData) {
      try {
        console.log("[Project Engine] Using fallback cached data due to Gemini failure.");
        const parsedFallback = JSON.parse(fallbackData);
        return parsedFallback.map(proj => createRecommendation(proj));
      } catch (_e) {
        console.warn("Invalid fallback cache data.");
      }
    }

    console.warn("[Project Engine] AI service busy and no cache available.");
    throw error;
  }
};
