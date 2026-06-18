import { JSearchAdapter } from './adapters/JSearchAdapter';
import { DevpostAdapter } from './adapters/DevpostAdapter';
import { UnstopAdapter } from './adapters/UnstopAdapter';
import { ScholarshipAdapter } from './adapters/ScholarshipAdapter';

class OpportunityIngestionService {
  constructor() {
    this.adapters = [
      new JSearchAdapter(),
      new DevpostAdapter(),
      new UnstopAdapter(),
      new ScholarshipAdapter()
      // Note: Kaggle/Devfolio adapters can be added here easily
    ];
  }

  /**
   * Run all adapters concurrently. If one fails, it resolves with an empty array
   * so the entire feed doesn't crash.
   * @param {Object} options 
   * @returns {Promise<Array>} Combined array of normalized opportunities
   */
  async ingestAll(options = {}) {
    console.log('IngestionService: Starting ingestion across all adapters...');
    
    const fetchPromises = this.adapters.map(adapter => 
      adapter.fetchOpportunities(options).catch(err => {
        console.error(`IngestionService: Adapter ${adapter.name} failed.`, err);
        return [];
      })
    );

    const results = await Promise.allSettled(fetchPromises);
    
    const combined = [];
    results.forEach(result => {
      if (result.status === 'fulfilled' && Array.isArray(result.value)) {
        combined.push(...result.value);
      }
    });

    console.log(`IngestionService: Ingestion complete. Fetched ${combined.length} opportunities total.`);
    return combined;
  }
}

export const ingestionService = new OpportunityIngestionService();
