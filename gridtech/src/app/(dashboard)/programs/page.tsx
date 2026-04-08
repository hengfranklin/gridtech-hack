'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import { useAppStore } from '@/lib/store';
import { programs } from '@/data/programs';
import { getEligiblePrograms } from '@/lib/eligibility/engine';
import { formatCurrency, getCategoryLabel, getCategoryColor, getProviderLabel } from '@/lib/utils';
import { MagnifyingGlassIcon, CheckCircleIcon, ExclamationTriangleIcon, XCircleIcon } from '@heroicons/react/24/outline';
import { ProgramCategory } from '@/types/program';

const CATEGORIES: { value: '' | ProgramCategory; label: string }[] = [
  { value: '', label: 'All Categories' },
  { value: 'demand_response', label: 'Demand Response' },
  { value: 'ev_charging', label: 'EV Charging' },
  { value: 'weatherization', label: 'Weatherization' },
  { value: 'heat_pump', label: 'Heat Pump' },
  { value: 'solar', label: 'Solar' },
  { value: 'storage', label: 'Storage' },
  { value: 'tax_credit', label: 'Tax Credit' },
  { value: 'bill_assistance', label: 'Bill Assistance' },
  { value: 'building_performance', label: 'Building Performance' },
];

export default function ProgramsPage() {
  const { profile } = useAppStore();
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState<'' | ProgramCategory>('');
  const [showEligibleOnly, setShowEligibleOnly] = useState(true);

  const results = useMemo(() => {
    if (!profile) return [];
    return getEligiblePrograms(profile, programs);
  }, [profile]);

  const filtered = useMemo(() => {
    return results.filter((r) => {
      if (showEligibleOnly && !r.eligible) return false;
      if (category && r.program.category !== category) return false;
      if (search) {
        const q = search.toLowerCase();
        return (
          r.program.name.toLowerCase().includes(q) ||
          r.program.description.toLowerCase().includes(q) ||
          r.program.provider.toLowerCase().includes(q)
        );
      }
      return true;
    });
  }, [results, showEligibleOnly, category, search]);

  if (!profile) return null;

  return (
    <div className="p-6 lg:p-8 max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Energy Programs</h1>
        <p className="text-gray-500 mt-1">
          {results.filter((r) => r.eligible).length} programs you&apos;re eligible for out of {programs.length} total
        </p>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <div className="relative flex-1">
          <MagnifyingGlassIcon className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search programs..."
            className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none"
          />
        </div>
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value as '' | ProgramCategory)}
          className="px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none"
        >
          {CATEGORIES.map((c) => (
            <option key={c.value} value={c.value}>{c.label}</option>
          ))}
        </select>
        <button
          onClick={() => setShowEligibleOnly(!showEligibleOnly)}
          className={`px-4 py-2.5 rounded-xl font-medium text-sm transition ${
            showEligibleOnly
              ? 'bg-emerald-100 text-emerald-700 border border-emerald-200'
              : 'bg-gray-100 text-gray-600 border border-gray-200'
          }`}
        >
          {showEligibleOnly ? 'Eligible Only' : 'Show All'}
        </button>
      </div>

      {/* Results count */}
      <p className="text-sm text-gray-500 mb-4">{filtered.length} programs found</p>

      {/* Program Grid */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map((result) => (
          <Link
            key={result.program.id}
            href={`/programs/${result.program.id}`}
            className="bg-white rounded-xl border border-gray-100 p-5 shadow-sm hover:border-emerald-200 hover:shadow-md transition group"
          >
            <div className="flex items-start justify-between mb-3">
              <span className={`text-xs font-medium px-2 py-1 rounded-full ${getCategoryColor(result.program.category)}`}>
                {getCategoryLabel(result.program.category)}
              </span>
              {result.eligible ? (
                <CheckCircleIcon className="h-5 w-5 text-emerald-500" />
              ) : result.missingRequirements.length <= 2 ? (
                <ExclamationTriangleIcon className="h-5 w-5 text-amber-500" />
              ) : (
                <XCircleIcon className="h-5 w-5 text-gray-300" />
              )}
            </div>

            <h3 className="font-semibold text-gray-900 group-hover:text-emerald-700 transition">{result.program.name}</h3>
            <p className="text-sm text-gray-500 mt-1 line-clamp-2">{result.program.short_description}</p>

            <div className="mt-4 flex items-center justify-between">
              <span className="text-xs text-gray-400">{getProviderLabel(result.program.provider)}</span>
              {result.program.savings_estimate_annual > 0 && (
                <span className="text-sm font-bold text-emerald-600">{formatCurrency(result.program.savings_estimate_annual)}/yr</span>
              )}
            </div>

            {!result.eligible && result.missingRequirements.length > 0 && (
              <div className="mt-3 text-xs text-amber-700 bg-amber-50 rounded-lg px-3 py-2">
                Missing: {result.missingRequirements.slice(0, 2).join(', ')}
              </div>
            )}

            {result.program.enrollment_deadline && (
              <div className="mt-2 text-xs text-red-600 font-medium">
                Deadline: {new Date(result.program.enrollment_deadline).toLocaleDateString()}
              </div>
            )}
          </Link>
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="text-center py-16 text-gray-400">
          <p className="text-lg font-medium">No programs match your filters</p>
          <p className="mt-2">Try adjusting your search or showing all programs</p>
        </div>
      )}
    </div>
  );
}
