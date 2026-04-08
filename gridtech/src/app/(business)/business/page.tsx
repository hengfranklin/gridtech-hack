'use client';

import { useMemo } from 'react';
import Link from 'next/link';
import { useAppStore } from '@/lib/store';
import { programs } from '@/data/programs';
import { getEligiblePrograms, getTotalSavings } from '@/lib/eligibility/engine';
import { formatCurrency, getCategoryLabel, getCategoryColor, getProviderLabel } from '@/lib/utils';
import { CurrencyDollarIcon, BuildingOfficeIcon, BoltIcon, DocumentCheckIcon } from '@heroicons/react/24/outline';
import dynamic from 'next/dynamic';

const BusinessCharts = dynamic(() => import('@/components/dashboard/BusinessCharts'), { ssr: false });

export default function BusinessDashboardPage() {
  const { profile } = useAppStore();

  const results = useMemo(() => {
    if (!profile) return [];
    return getEligiblePrograms(profile, programs);
  }, [profile]);

  const eligible = results.filter((r) => r.eligible);
  const totalSavings = getTotalSavings(results);

  // Mock ROI data
  const roiData = [
    { year: 'Yr 1', cost: -25000, savings: totalSavings, net: totalSavings - 25000 },
    { year: 'Yr 2', cost: 0, savings: totalSavings, net: totalSavings * 2 - 25000 },
    { year: 'Yr 3', cost: 0, savings: totalSavings, net: totalSavings * 3 - 25000 },
    { year: 'Yr 5', cost: 0, savings: totalSavings, net: totalSavings * 5 - 25000 },
    { year: 'Yr 10', cost: 0, savings: totalSavings, net: totalSavings * 10 - 25000 },
  ];

  if (!profile) return null;

  const isLL97 = (profile.building_sqft || 0) >= 25000;

  return (
    <div className="p-6 lg:p-8 max-w-7xl mx-auto">
      <h1 className="text-2xl font-bold text-gray-900 mb-1">Business Dashboard</h1>
      <p className="text-gray-500 mb-8">{getProviderLabel(profile.utility_provider)} territory &middot; {profile.zip_code}</p>

      {/* Stats */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <div className="bg-white rounded-xl border border-gray-100 p-5 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-emerald-100 rounded-lg"><CurrencyDollarIcon className="h-6 w-6 text-emerald-600" /></div>
            <div>
              <div className="text-sm text-gray-500">Annual Savings Potential</div>
              <div className="text-2xl font-bold text-gray-900">{formatCurrency(totalSavings)}</div>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl border border-gray-100 p-5 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-100 rounded-lg"><BoltIcon className="h-6 w-6 text-blue-600" /></div>
            <div>
              <div className="text-sm text-gray-500">Eligible Programs</div>
              <div className="text-2xl font-bold text-gray-900">{eligible.length}</div>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl border border-gray-100 p-5 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-indigo-100 rounded-lg"><BuildingOfficeIcon className="h-6 w-6 text-indigo-600" /></div>
            <div>
              <div className="text-sm text-gray-500">Building Size</div>
              <div className="text-2xl font-bold text-gray-900">{(profile.building_sqft || 0).toLocaleString()} sqft</div>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl border border-gray-100 p-5 shadow-sm">
          <div className="flex items-center gap-3">
            <div className={`p-2 rounded-lg ${isLL97 ? 'bg-red-100' : 'bg-green-100'}`}>
              <DocumentCheckIcon className={`h-6 w-6 ${isLL97 ? 'text-red-600' : 'text-green-600'}`} />
            </div>
            <div>
              <div className="text-sm text-gray-500">LL97 Status</div>
              <div className="text-lg font-bold text-gray-900">{isLL97 ? 'Applicable' : 'Not Required'}</div>
            </div>
          </div>
        </div>
      </div>

      {/* ROI Chart */}
      <div className="bg-white rounded-xl border border-gray-100 p-5 shadow-sm mb-8">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Projected ROI (10 Year)</h2>
        <div className="h-64">
          <BusinessCharts data={roiData} />
        </div>
      </div>

      {/* Quick Links */}
      <div className="grid sm:grid-cols-2 gap-4 mb-8">
        {isLL97 && (
          <Link href="/compliance" className="bg-gradient-to-r from-red-50 to-orange-50 rounded-xl border border-red-100 p-5 hover:shadow-md transition">
            <h3 className="font-semibold text-gray-900">LL97 Compliance Tracker</h3>
            <p className="text-sm text-gray-600 mt-1">Check your building&apos;s emission limits and find compliance pathways</p>
          </Link>
        )}
        <Link href="/roi-calculator" className="bg-gradient-to-r from-emerald-50 to-teal-50 rounded-xl border border-emerald-100 p-5 hover:shadow-md transition">
          <h3 className="font-semibold text-gray-900">ROI Calculator</h3>
          <p className="text-sm text-gray-600 mt-1">Calculate payback periods for energy upgrades</p>
        </Link>
      </div>

      {/* Eligible Programs */}
      <h2 className="text-lg font-semibold text-gray-900 mb-4">Eligible Programs</h2>
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {eligible.slice(0, 9).map((r) => (
          <div key={r.program.id} className="bg-white rounded-xl border border-gray-100 p-4 shadow-sm">
            <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${getCategoryColor(r.program.category)}`}>
              {getCategoryLabel(r.program.category)}
            </span>
            <h4 className="font-semibold text-gray-900 mt-2">{r.program.name}</h4>
            <p className="text-sm text-gray-500 mt-1">{r.program.short_description}</p>
            {r.savingsEstimate > 0 && (
              <div className="mt-2 text-emerald-600 font-bold text-sm">{formatCurrency(r.savingsEstimate)}/yr</div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
