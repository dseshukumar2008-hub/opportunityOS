import { collection, getDocs, writeBatch, doc } from 'firebase/firestore';
import { db } from '../config/firebase';
import { ingestionService } from './OpportunityIngestionService';

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
  async getOpportunities(preferredLocations = []) {
    // Level 1: In-memory cache
    if (_memoryCache && Date.now() - _memoryCacheTime < SESSION_CACHE_TTL_MS) {
      return _memoryCache;
    }

    // Level 2: sessionStorage cache
    const sessionCached = readSessionCache();
    if (sessionCached) {
      _memoryCache = sessionCached;
      _memoryCacheTime = Date.now();
      return sessionCached;
    }

    // Level 3: Firestore + Ingestion Service Sync
    try {
      const oppsRef = collection(db, 'opportunities');
      let snapshot = { forEach: () => {} };
      try {
        snapshot = await Promise.race([
          getDocs(oppsRef),
          new Promise((_, reject) => setTimeout(() => reject(new Error('Firestore timeout')), 5000))
        ]);
      } catch (fbError) {
        console.warn('Aggregator: Firestore fetch failed or timed out, bypassing to live sync.', fbError);
      }

      let opportunities = [];
      snapshot.forEach(d => {
        opportunities.push({ id: d.id, ...d.data() });
      });

      // One-time cleanup of MockSeeder data has been disabled
      // so the app retains fallback data if live APIs fail.
      /*
      const mockIds = opportunities.filter(o => o.source === 'MockSeeder').map(o => o.id);
      if (mockIds.length > 0) {
        console.log(`Cleaning up ${mockIds.length} MockSeeder opportunities from Firestore...`);
        const cleanupBatch = writeBatch(db);
        mockIds.forEach(id => {
          cleanupBatch.delete(doc(db, 'opportunities', id));
        });
        cleanupBatch.commit().catch(e => console.error("Aggregator: Failed to cleanup mocks:", e));
        opportunities = opportunities.filter(o => o.source !== 'MockSeeder');
      }
      */

      const lastSync = localStorage.getItem(CACHE_KEY);
      const isStale = !lastSync || (Date.now() - parseInt(lastSync, 10) > SYNC_INTERVAL_MS);

      // We no longer rely on mock data counting.
      // If data is stale or completely empty, we run full ingestion.
      if ((opportunities || []).length === 0 || isStale) {
        try {
          const syncedOpps = await ingestionService.ingestAll({ preferredLocations });
          if (syncedOpps.length > 0) {
            const newIds = new Set(syncedOpps.map(j => j.id));
            opportunities = [...syncedOpps, ...opportunities.filter(o => !newIds.has(o.id))];
            localStorage.setItem(CACHE_KEY, Date.now().toString());

            // Write new records to Firestore
            const batch = writeBatch(db);
            syncedOpps.forEach(opp => {
              const oppRef = doc(collection(db, 'opportunities'), opp.id);
              batch.set(oppRef, opp, { merge: true });
            });
            batch.commit().catch(err => console.error("Aggregator: Failed to commit batch to Firestore:", err));
          }
        } catch (syncError) {
          console.error('Aggregator: Ingestion Service Sync Failed:', syncError);
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
  }
};
