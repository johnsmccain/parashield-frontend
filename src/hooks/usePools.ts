'use client';

import { useState, useEffect, useCallback } from 'react';
import { fetchPoolStats, fetchPoolById } from '@/lib/api';
import type { PoolStats } from '@/types';

export function usePools() {
  const [pools,   setPools]   = useState<PoolStats[]>([]);
  const [loading, setLoading] = useState(true);
  const [error,   setError]   = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchPoolStats();
      setPools(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load pool stats');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { void load(); }, [load]);

  return { pools, loading, error, refetch: load };
}

export function usePool(poolId: string | null) {
  const [pool,    setPool]    = useState<PoolStats | null>(null);
  const [loading, setLoading] = useState(false);
  const [error,   setError]   = useState<string | null>(null);

  useEffect(() => {
    if (!poolId) return;
    let cancelled = false;
    setLoading(true);
    fetchPoolById(poolId)
      .then((p) => { if (!cancelled) setPool(p); })
      .catch((err) => { if (!cancelled) setError(err instanceof Error ? err.message : 'Failed to load pool'); })
      .finally(() => { if (!cancelled) setLoading(false); });
    return () => { cancelled = true; };
  }, [poolId]);

  return { pool, loading, error };
}
