import { useState, useEffect, useCallback } from 'react';
import { opportunityAggregator } from '../services/opportunityAggregator';

export function useLiveOpportunities() {
  const [opportunities, setOpportunities] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchOpportunities = useCallback(async (forceRefresh = false) => {
    if (forceRefresh) {
      opportunityAggregator.invalidateCache();
    }
    setIsLoading(true);
    setError(null);
    try {
      const data = await opportunityAggregator.getOpportunities();
      setOpportunities(data);
    } catch (err) {
      console.error('Error fetching live opportunities:', err);
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchOpportunities();
  }, [fetchOpportunities]);

  return {
    opportunities,
    isLoading,
    error,
    refresh: () => fetchOpportunities(true)
  };
}

