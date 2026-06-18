import { BaseAdapter } from './BaseAdapter';

export class ScholarshipAdapter extends BaseAdapter {
  constructor() {
    super('Scholarships.com', 'Scholarship');
  }

  async fetchOpportunities(options = {}) {
    try {
      // Proxied request to a public scholarship RSS or JSON endpoint
      const url = 'https://www.scholarships.com/api/public/v1/scholarships'; // Example endpoint
      const rawData = await this.fetchWithProxy(url);
      
      let data = [];
      try {
        const parsed = JSON.parse(rawData);
        data = parsed.data || parsed;
      } catch (e) {
        throw new Error('Failed to parse Scholarship JSON response');
      }

      if (!Array.isArray(data) || data.length === 0) {
        return [];
      }

      return data.map(schol => this.normalize({
        id: `scholarship_${schol.id || Math.random().toString(36).substring(7)}`,
        title: schol.title || schol.name,
        company: schol.provider || schol.sponsor || 'Scholarship Provider',
        location: schol.location || 'Global',
        description: schol.description || 'A merit or need-based scholarship to support your academic journey.',
        url: schol.url || schol.link || 'https://www.scholarships.com',
        logo: schol.logo_url || '',
        deadline: schol.deadline,
        skills: schol.tags || ['Academics', 'Scholarship'],
      }));
    } catch (error) {
      console.warn('ScholarshipAdapter: API unavailable or blocked. Returning empty array.', error);
      return [];
    }
  }
}
