'use client';

import { useState, useEffect } from 'react';
import { fetchPoolStats } from '@/lib/api';
import type { PoolStats } from '@/types';
import { formatUSDC, utilizationColor, basisPointsToPercent } from '@/lib/format';
import { Badge } from '@/components/Badge';
import { ProgressBar } from '@/components/ProgressBar';
import { FullPageSpinner } from '@/components/LoadingSpinner';
import { EmptyState } from '@/components/EmptyState';
import { CATEGORY_ICONS, CATEGORY_LABELS } from '@/lib/constants';

export default function PoolsPage() {
  const [pools,   setPools]   = useState<PoolStats[]>([]);
  const [loading, setLoading] = useState(true);
  const [error,   setError]   = useState<string | null>(null);

  useEffect(() => {
    fetchPoolStats()
      .then(setPools)
      .catch((err) => setError(err instanceof Error ? err.message : 'Failed to load pools'))
      .finally(() => setLoading(false));
  }, []);

  return (
    <main className="mx-auto max-w-7xl px-6 py-12">
      <h1 className="text-2xl font-bold">Risk Pools</h1>
      <p className="mt-1 text-sm text-gray-400">
        Provide liquidity, underwrite risk, and earn yield on USDC premiums
      </p>

      <div className="mt-3 rounded-xl border border-amber-500/20 bg-amber-500/5 px-4 py-3 text-xs text-amber-400">
        Liquidity provisioning is coming in v2. Stake your interest below.
      </div>

      {loading && <FullPageSpinner />}

      {error && (
        <div className="mt-8 rounded-2xl border border-red-500/20 bg-red-500/5 p-6 text-sm text-red-400">
          {error}
        </div>
      )}

      {!loading && !error && pools.length === 0 && (
        <EmptyState
          icon="💧"
          title="No pools active yet"
          description="Risk pools will open when the first insurance products go live on mainnet."
          className="mt-12"
        />
      )}

      {!loading && pools.length > 0 && (
        <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {pools.map((pool) => (
            <div key={pool.poolId} className="rounded-2xl border border-white/10 bg-white/[0.03] p-6">
              <div className="flex items-center gap-3">
                <span className="text-2xl">{CATEGORY_ICONS[pool.category] ?? '🛡️'}</span>
                <div>
                  <h3 className="font-semibold text-white">{CATEGORY_LABELS[pool.category] ?? pool.category} Pool</h3>
                  <Badge label={pool.category} variant="teal" />
                </div>
              </div>

              <dl className="mt-5 space-y-3 text-sm">
                <div className="flex justify-between">
                  <dt className="text-gray-500">Liquidity</dt>
                  <dd className="font-semibold text-white">{formatUSDC(pool.totalLiquidity)}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-gray-500">Active policies</dt>
                  <dd className="font-semibold text-white">{pool.activePolicies}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-gray-500">APY</dt>
                  <dd className="font-semibold text-emerald-400">{(pool.apy * 100).toFixed(1)}%</dd>
                </div>
              </dl>

              <div className="mt-4">
                <ProgressBar
                  value={pool.utilizationRate * 100}
                  label="Utilization"
                  colour={pool.utilizationRate > 0.8 ? 'red' : pool.utilizationRate > 0.5 ? 'amber' : 'teal'}
                />
              </div>

              <button
                disabled
                className="mt-5 w-full rounded-xl border border-white/10 py-2 text-xs font-semibold text-gray-500 cursor-not-allowed"
              >
                Provide liquidity (coming soon)
              </button>
            </div>
          ))}
        </div>
      )}
    </main>
  );
}
