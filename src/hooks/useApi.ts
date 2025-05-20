import { useState, useCallback, useEffect } from 'react';
import { ApiResponse, ApiError } from '../types/api';

interface ApiState<T> {
  data: T | null;
  loading: boolean;
  error: ApiError | null;
}

interface UseApiOptions {
  initialData?: unknown;
  cacheTime?: number;
  refetchInterval?: number;
}

export function useApi<T>(
  apiCall: () => Promise<ApiResponse<T>>,
  options: UseApiOptions = {}
) {
  const { initialData = null, cacheTime = 5 * 60 * 1000, refetchInterval } = options;
  const [state, setState] = useState<ApiState<T>>({
    data: initialData as T,
    loading: false,
    error: null,
  });

  const fetchData = useCallback(async () => {
    setState((prev) => ({ ...prev, loading: true, error: null }));

    try {
      const response = await apiCall();
      setState({
        data: response.data,
        loading: false,
        error: null,
      });

      // Cache the data
      if (cacheTime > 0) {
        const cacheKey = `api_cache_${apiCall.name}`;
        const cacheData = {
          data: response.data,
          timestamp: Date.now(),
        };
        localStorage.setItem(cacheKey, JSON.stringify(cacheData));
      }
    } catch (error) {
      setState({
        data: null,
        loading: false,
        error: error as ApiError,
      });
    }
  }, [apiCall, cacheTime]);

  // Load cached data on mount
  useEffect(() => {
    if (cacheTime > 0) {
      const cacheKey = `api_cache_${apiCall.name}`;
      const cachedData = localStorage.getItem(cacheKey);

      if (cachedData) {
        const { data, timestamp } = JSON.parse(cachedData);
        const isExpired = Date.now() - timestamp > cacheTime;

        if (!isExpired) {
          setState((prev) => ({ ...prev, data }));
        } else {
          localStorage.removeItem(cacheKey);
        }
      }
    }
  }, [apiCall.name, cacheTime]);

  // Set up refetch interval
  useEffect(() => {
    if (refetchInterval) {
      const intervalId = setInterval(fetchData, refetchInterval);
      return () => clearInterval(intervalId);
    }
  }, [fetchData, refetchInterval]);

  const refetch = useCallback(() => {
    fetchData();
  }, [fetchData]);

  return {
    ...state,
    refetch,
  };
}

// Example usage:
/*
const { data, loading, error, refetch } = useApi(
  () => callService.getActiveCalls(),
  {
    cacheTime: 5 * 60 * 1000, // 5 minutes
    refetchInterval: 30 * 1000, // 30 seconds
  }
);
*/ 