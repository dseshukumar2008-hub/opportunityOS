import { collection, getDocs, writeBatch, doc } from 'firebase/firestore';
import { db } from '../config/firebase';

const CACHE_KEY = 'opportunityos_aggregator_sync';
const SESSION_CACHE_KEY = 'opportunityos_aggregator_opps';
const SYNC_INTERVAL_MS = 24 * 60 * 60 * 1000; // 24 hours
const SESSION_CACHE_TTL_MS = 10 * 60 * 1000;  // 10 minutes

// Level-1: in-memory singleton for the current page lifecycle
let _memoryCache = null;
let _memoryCacheTime = 0;

function readSessionCache() {
  try {
    const raw = sessionStorage.getItem(SESSION_CACHE_KEY);
    if (!raw) return null;
    const { ts, data } = JSON.parse(raw);
    if (Date.now() - ts < SESSION_CACHE_TTL_MS) return data;
    sessionStorage.removeItem(SESSION_CACHE_KEY);
  } catch {}
  return null;
}

function writeSessionCache(data) {
  try {
    sessionStorage.setItem(SESSION_CACHE_KEY, JSON.stringify({ ts: Date.now(), data }));
  } catch {}
}

export const opportunityAggregator = {
  async getOpportunities() {
    // Level 1: In-memory cache (same page lifecycle — zero latency)
    if (_memoryCache && Date.now() - _memoryCacheTime < SESSION_CACHE_TTL_MS) {
      return _memoryCache;
    }

    // Level 2: sessionStorage cache (survives dashboard tab switches, 10 min TTL)
    const sessionCached = readSessionCache();
    if (sessionCached) {
      _memoryCache = sessionCached;
      _memoryCacheTime = Date.now();
      return sessionCached;
    }

    // Level 3: Firestore + conditional JSearch sync
    try {
      const oppsRef = collection(db, 'opportunities');

      const snapshot = await Promise.race([
        getDocs(oppsRef),
        new Promise((_, reject) => setTimeout(() => reject(new Error('Firestore timeout')), 5000))
      ]);

      let opportunities = [];
      snapshot.forEach(d => {
        opportunities.push({ id: d.id, ...d.data() });
      });

      const lastSync = localStorage.getItem(CACHE_KEY);
      const isStale = !lastSync || (Date.now() - parseInt(lastSync, 10) > SYNC_INTERVAL_MS);

      if ((opportunities || []).length === 0 || isStale) {
        try {
          const syncedJobs = await this.syncJSearchToFirestore();
          if (syncedJobs.length > 0) {
            const newIds = new Set(syncedJobs.map(j => j.id));
            opportunities = [...syncedJobs, ...opportunities.filter(o => !newIds.has(o.id))];
            localStorage.setItem(CACHE_KEY, Date.now().toString());
          }
        } catch (syncError) {
          console.error('Aggregator: JSearch Sync Failed:', syncError);
        }
      }

      // Populate both cache layers
      _memoryCache = opportunities;
      _memoryCacheTime = Date.now();
      writeSessionCache(opportunities);

      return opportunities;

    } catch (error) {
      console.error('Aggregator Error fetching from Firestore:', error);
      return [];
    }
  },

  /** Invalidate all cache layers (call after a user-triggered refresh) */
  invalidateCache() {
    _memoryCache = null;
    _memoryCacheTime = 0;
    try { sessionStorage.removeItem(SESSION_CACHE_KEY); } catch {}
  },



  async syncJSearchToFirestore() {
    const apiKey = import.meta.env.VITE_RAPIDAPI_KEY;
    if (!apiKey) {
      throw new Error("Missing VITE_RAPIDAPI_KEY environment variable.");
    }

    const queries = [
      'Internships',
      'Entry-Level Jobs',
      'Software Engineering Roles',
      'AI/ML Roles',
      'Web Development Roles'
    ];
    
    // Pick a random query to keep things fresh without blowing through rate limits on a single page load
    const randomQuery = queries[Math.floor(Math.random() * queries.length)];
    const url = `https://jsearch.p.rapidapi.com/search?query=${encodeURIComponent(randomQuery)}&page=1&num_pages=1`;
    
    const options = {
      method: 'GET',
      headers: {
        'X-RapidAPI-Key': apiKey,
        'X-RapidAPI-Host': 'jsearch.p.rapidapi.com'
      }
    };

    
    const response = await fetch(url, options);

    if (!response.ok) {
      throw new Error(`JSearch API responded with status: ${response.status}`);
    }

    const data = await response.json();
    if (!data || !data.data) {
       return [];
    }

    const mappedJobs = data.data.map(job => {
      // Normalize to Unified Opportunity Model
      return {
        id: `jsearch_${job.job_id}`,
        title: job.job_title || 'Unknown Title',
        company: job.employer_name || 'Unknown Company',
        location: job.job_city ? `${job.job_city}, ${job.job_country}` : (job.job_is_remote ? 'Remote' : 'Location Not Specified'),
        description: job.job_description || 'No description provided.',
        skills: job.job_required_skills || [], // Some jsearch endpoints return this, otherwise fallback in UI
        type: job.job_employment_type === 'INTERN' ? 'Internship' : 'Job',
        source: 'JSearch',
        url: job.job_apply_link || job.job_google_link || '#',
        logo: job.employer_logo || `https://ui-avatars.com/api/?name=${encodeURIComponent(job.employer_name || 'C')}&background=random`,
        postedDate: job.job_posted_at_datetime_utc || new Date().toISOString()
      };
    });

    if (mappedJobs.length > 0) {
      const batch = writeBatch(db);
      mappedJobs.forEach(job => {
        const jobRef = doc(collection(db, 'opportunities'), job.id);
        batch.set(jobRef, job, { merge: true });
      });
      batch.commit().catch(err => console.error("Aggregator: Failed to commit batch to Firestore:", err));
    }

    return mappedJobs;
  }
};
