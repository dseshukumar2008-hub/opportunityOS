import { BaseAdapter } from './BaseAdapter';

export class UnstopAdapter extends BaseAdapter {
  constructor() {
    super('Unstop', 'Competition');
  }

  async fetchOpportunities(options = {}) {
    try {
      // Proxying Unstop's public opportunities API
      // Since unstop uses heavy anti-scraping, this might fail, so we catch it gracefully.
      const url = 'https://unstop.com/api/public/opportunities/search?opportunity=competitions&page=1&per_page=10';
      const rawData = await this.fetchWithProxy(url);
      
      let data = [];
      try {
        const parsed = JSON.parse(rawData);
        if (parsed?.data?.data) {
          data = parsed.data.data;
        }
      } catch (e) {
        throw new Error('Failed to parse Unstop JSON response');
      }

      if (!Array.isArray(data) || data.length === 0) {
        return [];
      }

      return data.map(comp => this.normalize({
        id: `unstop_${comp.id || comp.seo_url}`,
        title: comp.title,
        company: comp.organization?.name || 'Unstop Organizer',
        location: comp.region || 'Online/Global',
        description: comp.details || comp.short_description || 'Participate in this competition on Unstop to showcase your skills.',
        url: `https://unstop.com/${comp.seo_url}`,
        logo: comp.logoUrl || comp.bannerUrl,
        deadline: comp.regnn_end_date,
        skills: comp.categories || ['Problem Solving', 'Competition'],
      }));
    } catch (error) {
      console.warn('UnstopAdapter: API unavailable or blocked. Returning empty array.', error);
      return [];
    }
  }
}
