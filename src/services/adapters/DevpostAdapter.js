import { BaseAdapter } from './BaseAdapter';

export class DevpostAdapter extends BaseAdapter {
  constructor() {
    super('Devpost', 'Hackathon');
  }

  async fetchOpportunities(options = {}) {
    try {
      // Note: Devpost doesn't have an official public JSON API with CORS enabled.
      // We are attempting to use an undocumented API via a proxy or fallback to a known public RSS/JSON.
      // If this fails, the IngestionService will handle the failure gracefully.
      const url = 'https://devpost.com/api/hackathons';
      const rawData = await this.fetchWithProxy(url);
      
      let data = [];
      try {
        const parsed = JSON.parse(rawData);
        if (parsed.hackathons) data = parsed.hackathons;
      } catch (e) {
        throw new Error('Failed to parse Devpost JSON response');
      }

      if (!Array.isArray(data) || data.length === 0) {
        return [];
      }

      return data.map(hack => this.normalize({
        id: `devpost_${hack.id}`,
        title: hack.title,
        company: hack.organization_name || 'Devpost Community',
        location: hack.displayed_location || 'Online',
        description: hack.description || 'Join this exciting hackathon on Devpost!',
        url: hack.url,
        logo: hack.thumbnail_url,
        deadline: hack.submission_period_dates,
        skills: ['Software Development', 'Innovation', 'Hackathon'],
      }));
    } catch (error) {
      console.warn('DevpostAdapter: API unavailable or blocked. Returning empty array.', error);
      // Returning empty array so we don't crash the orchestrator
      return [];
    }
  }
}
