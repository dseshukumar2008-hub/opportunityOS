/**
 * Base Adapter interface for all Opportunity Providers
 */
export class BaseAdapter {
  constructor(name, type) {
    this.name = name;
    this.type = type; // Job, Internship, Hackathon, Competition, Scholarship
  }

  /**
   * Primary method to fetch and normalize opportunities.
   * Should be overridden by subclasses.
   * @param {Object} options - Configuration options (e.g., preferredLocations)
   * @returns {Promise<Array>} Array of normalized Opportunity objects
   */
  async fetchOpportunities(options = {}) {
    throw new Error(`fetchOpportunities() not implemented in ${this.name}`);
  }

  /**
   * Helper to normalize raw data into the standard Opportunity schema
   * @param {Object} raw 
   * @returns {Object} Normalized Opportunity
   */
  normalize(raw) {
    return {
      id: raw.id || `${this.name.toLowerCase()}_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`,
      title: raw.title || 'Unknown Title',
      company: raw.company || raw.organizer || 'Unknown Provider',
      description: raw.description || 'No description provided.',
      logo: raw.logo || '',
      location: raw.location || 'Location Not Specified',
      country: raw.country || '',
      deadline: raw.deadline || null,
      url: raw.url || '#',
      source: this.name,
      type: raw.type || this.type,
      skills: raw.skills || [],
      tags: raw.tags || [],
      postedDate: raw.postedDate || new Date().toISOString()
    };
  }

  /**
   * Helper to fetch via CORS proxy if direct fetch is blocked
   */
  async fetchWithProxy(url, options = {}) {
    const proxyUrl = `https://api.allorigins.win/get?url=${encodeURIComponent(url)}`;
    const response = await fetch(proxyUrl, options);
    if (!response.ok) {
      throw new Error(`Proxy fetch failed for ${url} with status: ${response.status}`);
    }
    const data = await response.json();
    return data.contents;
  }
}
