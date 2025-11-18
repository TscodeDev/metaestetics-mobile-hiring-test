import { useCallback, useEffect, useRef, useState } from 'react';

type FetchFn<TData, TParams> = (params: TParams) => Promise<TData>;

interface CacheEntry<TData> {
  data: TData;
  timestamp: number;
}

interface UseDataFetchOptions<TData> {
  enableCache?: boolean;
  cacheTimeMs?: number;
  initialData?: TData;
}

export interface UseDataFetchResult<TData> {
  data: TData | null;
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

// Simple in-memory cache shared across hook instances
const dataCache = new Map<string, CacheEntry<unknown>>();

export function useDataFetch<TData, TParams = void>(
  key: string,
  fetchFn: FetchFn<TData, TParams>,
  params: TParams,
  options: UseDataFetchOptions<TData> = {}
): UseDataFetchResult<TData> {
  const { enableCache = true, cacheTimeMs = 5 * 60 * 1000, initialData } = options;

  const [data, setData] = useState<TData | null>(initialData ?? null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const keyRef = useRef(key);
  const paramsRef = useRef(params);

  useEffect(() => {
    keyRef.current = key;
    paramsRef.current = params;
  }, [key, params]);

  const load = useCallback(async () => {
    const cacheKey = keyRef.current;

    if (enableCache && dataCache.has(cacheKey)) {
      const entry = dataCache.get(cacheKey) as CacheEntry<TData>;
      const isFresh = Date.now() - entry.timestamp < cacheTimeMs;
      if (isFresh) {
        setData(entry.data);
        return;
      }
    }

    setLoading(true);
    setError(null);

    try {
      const result = await fetchFn(paramsRef.current);
      setData(result);

      if (enableCache) {
        dataCache.set(cacheKey, {
          data: result,
          timestamp: Date.now(),
        });
      }
    } catch (err: any) {
      setError(err?.message ?? 'Something went wrong');
    } finally {
      setLoading(false);
    }
  }, [enableCache, cacheTimeMs, fetchFn]);

  useEffect(() => {
    load();
  }, [load]);

  const refetch = useCallback(async () => {
    // Bypass cache on explicit refetch
    const cacheKey = keyRef.current;
    if (enableCache) {
      dataCache.delete(cacheKey);
    }
    await load();
  }, [enableCache, load]);

  return {
    data,
    loading,
    error,
    refetch,
  };
}


