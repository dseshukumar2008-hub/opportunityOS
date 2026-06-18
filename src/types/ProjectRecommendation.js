/**
 * @typedef {Object} ProjectRecommendation
 * @property {string} id - Unique identifier for the recommendation
 * @property {string} title - Project title
 * @property {string} description - Detailed project description
 * @property {string[]} technologies - Array of technologies to use
 * @property {string} whyThisProject - Why this project was recommended
 * @property {any} createdAt - Timestamp of when this was generated
 */

export const createRecommendation = (data) => {
  return {
    ...data,
    id: data.id || crypto.randomUUID(),
    createdAt: data.createdAt || new Date()
  };
};
