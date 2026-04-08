'use client';

import { useAppStore } from '@/lib/store';
import { programs } from '@/data/programs';
import { getEligiblePrograms, getTotalSavings, getNearEligiblePrograms } from '@/lib/eligibility/engine';
import { formatCurrency, getCategoryLabel, getCategoryColor, getProviderLabel } from '@/lib/utils';
import { BoltIcon, CurrencyDollarIcon, FireIcon, SparklesIcon } from '@heroicons/react/24/outline';
import Link from 'next/link';
import { useMemo, useState, useEffect } from 'react';
import dynamic from 'next/dynamic';

const DashboardCharts = dynamic(() => import('@/components/dashboard/DashboardCharts'), { ssr: false });

const PIE_COLORS = ['#059669', '#10b981', '#34d399', '#6ee7b7', '#a7f3d0', '#d1fae5', '#047857', '#065f46'];
const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

export default function DashboardPage() {
  const { profile, enrollments } = useAppStore();

  const eligibilityResults = useMemo(() => {
    if (!profile) return [];
    return getEligiblePrograms(profile, programs);
  }, [profile]);

  const eligiblePrograms = eligibilityResults.filter((r) => r.eligible);
  const nearEligible = useMemo(() => {
    if (!profile) return [];
    return getNearEligiblePrograms(profile, programs);
  }, [profile]);

  const totalSavings = getTotalSavings(eligibilityResults);
  const enrolledCount = enrollments.length;

  const monthlySavings = useMemo(() => {
    const base = totalSavings / 12;
    return MONTHS.map((month, i) => {
      const seasonal = i >= 4 && i <= 8 ? 1.3 : 0.85;
      return { month, savings: Math.round(base * seasonal * (0.9 + Math.random() * 0.2)) };
    });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [totalSavings]);

  const categoryBreakdown = useMemo(() => {
    const m = new Map<string, number>();
    eligiblePrograms.forEach((r) => {
      const cat = getCategoryLabel(r.program.category);
      m.set(cat, (m.get(cat) || 0) + r.savingsEstimate);
    });
    return Array.from(m.entries()).map(([name, value]) => ({ name, value })).sort((a, b) => b.value - a.value);
  }, [eligiblePrograms]);

  if (!profile) return null;

  return (
    <div className="p-6 lg:p-8 max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Welcome back, {profile.display_name}</h1>
        <p className="text-gray-500 mt-1">
          {profile.borough ? `${profile.borough}, ` : ''}
          {profile.zip_code} &middot; {getProviderLabel(profile.utility_provider)}
          {profile.dac_eligible && <span className="ml-2 inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-amber-100 text-amber-800">DAC Eligible</span>}
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <div className="bg-white rounded-xl border border-gray-100 p-5 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-emerald-100 rounded-lg"><CurrencyDollarIcon className="h-6 w-6 text-emerald-600" /></div>
            <div>
              <div className="text-sm text-gray-500">Potential Annual Savings</div>
              <div className="text-2xl font-bold text-gray-900">{formatCurrency(totalSavings)}</div>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl border border-gray-100 p-5 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-100 rounded-lg"><BoltIcon className="h-6 w-6 text-blue-600" /></div>
            <div>
              <div className="text-sm text-gray-500">Eligible Programs</div>
              <div className="text-2xl font-bold text-gray-900">{eligiblePrograms.length}</div>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl border border-gray-100 p-5 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-purple-100 rounded-lg"><SparklesIcon className="h-6 w-6 text-purple-600" /></div>
            <div>
              <div className="text-sm text-gray-500">Enrolled Programs</div>
              <div className="text-2xl font-bold text-gray-900">{enrolledCount}</div>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl border border-gray-100 p-5 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-orange-100 rounded-lg"><FireIcon className="h-6 w-6 text-orange-600" /></div>
            <div>
              <div className="text-sm text-gray-500">Est. CO2 Avoided</div>
              <div className="text-2xl font-bold text-gray-900">{formatCurrency(totalSavings * 0.8).replace('$', '')} lbs</div>
            </div>
          </div>
        </div>
      </div>

      {/* Charts */}
      <DashboardCharts
        monthlySavings={monthlySavings}
        categoryBreakdown={categoryBreakdown}
        pieColors={PIE_COLORS}
      />

      {/* Top Eligible Programs */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">Top Programs For You</h3>
          <Link href="/programs" className="text-sm text-emerald-600 font-medium hover:text-emerald-700">
            View All Programs &rarr;
          </Link>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {eligiblePrograms.slice(0, 6).map((result) => (
            <Link
              key={result.program.id}
              href={`/programs/${result.program.id}`}
              className="bg-white rounded-xl border border-gray-100 p-5 shadow-sm hover:border-emerald-200 hover:shadow-md transition"
            >
              <div className="flex items-start justify-between mb-3">
                <span className={`text-xs font-medium px-2 py-1 rounded-full ${getCategoryColor(result.program.category)}`}>
                  {getCategoryLabel(result.program.category)}
                </span>
                {result.savingsEstimate > 0 && (
                  <span className="text-emerald-600 font-bold text-sm">{formatCurrency(result.savingsEstimate)}/yr</span>
                )}
              </div>
              <h4 className="font-semibold text-gray-900">{result.program.name}</h4>
              <p className="text-sm text-gray-500 mt-1">{result.program.short_description}</p>
              <div className="mt-3 text-xs text-gray-400">{getProviderLabel(result.program.provider)}</div>
            </Link>
          ))}
        </div>
      </div>

      {nearEligible.length > 0 && (
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Almost Eligible</h3>
          <div className="space-y-3">
            {nearEligible.slice(0, 3).map((result) => (
              <div key={result.program.id} className="bg-amber-50 rounded-xl border border-amber-100 p-4">
                <div className="flex items-start justify-between">
                  <div>
                    <h4 className="font-semibold text-gray-900">{result.program.name}</h4>
                    <p className="text-sm text-gray-600 mt-1">{result.program.short_description}</p>
                  </div>
                  {result.program.savings_estimate_annual > 0 && (
                    <span className="text-amber-700 font-bold text-sm whitespace-nowrap ml-4">{formatCurrency(result.program.savings_estimate_annual)}/yr</span>
                  )}
                </div>
                <div className="mt-2 text-sm text-amber-800">
                  Missing: {result.missingRequirements.join(', ')}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
