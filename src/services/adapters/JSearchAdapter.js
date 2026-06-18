import { BaseAdapter } from './BaseAdapter';

export class JSearchAdapter extends BaseAdapter {
  constructor() {
    super('JSearch', 'Job');
    this.apiKey = import.meta.env.VITE_RAPIDAPI_KEY || import.meta.env.VITE_JSEARCH_API_KEY || '5b71946afcmsh9782ce47e9be1c4p1dbed1jsn40afc8888b14';
  }

  async fetchOpportunities(options = {}) {
    if (!this.apiKey) {
      console.warn('JSearchAdapter: No API key provided.');
      return [];
    }

    const { preferredLocations = [] } = options;
    const locQuery = preferredLocations.length > 0 ? preferredLocations.join(' or ') : 'USA or India';
    const query = `software engineer ${locQuery}`;

    const url = `https://jsearch.p.rapidapi.com/search?query=${encodeURIComponent(query)}&page=1&num_pages=1`;
    const fetchOptions = {
      method: 'GET',
      headers: {
        'x-rapidapi-key': this.apiKey,
        'x-rapidapi-host': 'jsearch.p.rapidapi.com'
      }
    };

    try {
      const response = await fetch(url, fetchOptions);
      if (!response.ok) {
        throw new Error(`JSearch API responded with status: ${response.status}`);
      }

      const data = await response.json();
      if (!data || !data.data) {
        return [];
      }

      return data.data.map(job => this.normalize({
        id: `jsearch_${job.job_id}`,
        title: job.job_title,
        company: job.employer_name,
        location: job.job_city ? `${job.job_city}, ${job.job_country}` : (job.job_is_remote ? 'Remote' : 'Location Not Specified'),
        country: job.job_country,
        description: job.job_description,
        skills: job.job_required_skills,
        type: job.job_employment_type === 'INTERN' ? 'Internship' : 'Job',
        url: job.job_apply_link || job.job_google_link,
        logo: job.employer_logo,
        postedDate: job.job_posted_at_datetime_utc
      }));
    } catch (error) {
      console.error('JSearchAdapter: Error fetching jobs:', error);
      throw error;
    }
  }
}
