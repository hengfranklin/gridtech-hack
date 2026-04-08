'use client';

import { useMemo } from 'react';
import Link from 'next/link';
import { useAppStore } from '@/lib/store';
import { programs } from '@/data/programs';
import { getEligiblePrograms, getNearEligiblePrograms } from '@/lib/eligibility/engine';
import { formatCurrency, getCategoryLabel, getCategoryColor, getProviderLabel } from '@/lib/utils';
import { SparklesIcon, ArrowTrendingUpIcon, LightBulbIcon, ExclamationTriangleIcon } from '@heroicons/react/24/outline';

export default function RecommendationsPage() {
  const { profile, enrollments } = useAppStore();

  const enrolledIds = new Set(enrollments.map((e) => e.program_id));

  const eligibleNotEnrolled = useMemo(() => {
    if (!profile) return [];
    return getEligiblePrograms(profile, programs)
      .filter((r) => r.eligible && !enrolledIds.has(r.program.id));
  }, [profile, enrolledIds]);

  const nearEligible = useMemo(() => {
    if (!profile) return [];
    return getNearEligiblePrograms(profile, programs);
  }, [profile]);

  // Stacking opportunities: programs that complement each other
  const stackOpportunities = useMemo(() => {
    const stacks: { title: string; programs: string[]; totalSavings: number; description: string }[] = [];

    const eligible = new Set(eligibleNotEnrolled.map((r) => r.program.id));

    // Heat pump + IRA credit stack
    if (eligible.has('nys-clean-heat') && eligible.has('ira-25c-heat-pump')) {
      stacks.push({
        title: 'Heat Pump Triple Stack',
        programs: ['nys-clean-heat', 'ira-25c-heat-pump', 'con-ed-heat-pump'].filter((id) => eligible.has(id)),
        totalSavings: 0,
        description: 'Combine NYSERDA Clean Heat, federal IRA 25C tax credit, and Con Edison rebate for maximum heat pump savings.',
      });
    }

    // Solar + storage + IRA stack
    if (eligible.has('ny-sun') && eligible.has('ira-25d-solar')) {
      stacks.push({
        title: 'Solar + Storage Stack',
        programs: ['ny-sun', 'ira-25d-solar', 'nyserda-storage'].filter((id) => eligible.has(id)),
        totalSavings: 0,
        description: 'Stack NY-Sun rebate, federal 30% tax credit, and NYSERDA storage incentive.',
      });
    }

    // EV stack
    if (eligible.has('smartcharge-ny') && eligible.has('ira-30c-ev-charger')) {
      stacks.push({
        title: 'EV Savings Stack',
        programs: ['smartcharge-ny', 'drive-clean-rebate', 'ira-30c-ev-charger'].filter((id) => eligible.has(id)),
        totalSavings: 0,
        description: 'Combine SmartCharge NY rewards with Drive Clean rebate and EV charger tax credit.',
      });
    }

    // Calculate total savings
    stacks.forEach((stack) => {
      stack.totalSavings = stack.programs.reduce((sum, id) => {
        const p = programs.find((pr) => pr.id === id);
        return sum + (p?.savings_estimate_annual || 0);
      }, 0);
    });

    return stacks.sort((a, b) => b.totalSavings - a.totalSavings);
  }, [eligibleNotEnrolled]);

  if (!profile) return null;

  return (
    <div className="p-6 lg:p-8 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold text-gray-900 mb-2">Recommendations</h1>
      <p className="text-gray-500 mb-8">Personalized program suggestions based on your profile</p>

      {/* Top Picks */}
      <div className="mb-10">
        <div className="flex items-center gap-2 mb-4">
          <SparklesIcon className="h-5 w-5 text-emerald-600" />
          <h2 className="text-lg font-semibold text-gray-900">Top Picks For You</h2>
        </div>
        {eligibleNotEnrolled.length > 0 ? (
          <div className="grid sm:grid-cols-2 gap-4">
            {eligibleNotEnrolled.slice(0, 4).map((result) => (
              <Link
                key={result.program.id}
                href={`/programs/${result.program.id}`}
                className="bg-white rounded-xl border border-gray-100 p-5 shadow-sm hover:border-emerald-200 hover:shadow-md transition"
              >
                <span className={`text-xs font-medium px-2 py-1 rounded-full ${getCategoryColor(result.program.category)}`}>
                  {getCategoryLabel(result.program.category)}
                </span>
                <h3 className="font-semibold text-gray-900 mt-3">{result.program.name}</h3>
                <p className="text-sm text-gray-500 mt-1">{result.program.short_description}</p>
                <div className="mt-3 flex items-center justify-between">
                  <span className="text-xs text-gray-400">{getProviderLabel(result.program.provider)}</span>
                  {result.savingsEstimate > 0 && (
                    <span className="text-sm font-bold text-emerald-600">{formatCurrency(result.savingsEstimate)}/yr</span>
                  )}
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="bg-emerald-50 rounded-xl p-6 text-center">
            <p className="text-emerald-700 font-medium">You&apos;ve enrolled in all eligible programs!</p>
          </div>
        )}
      </div>

      {/* Stacking Opportunities */}
      {stackOpportunities.length > 0 && (
        <div className="mb-10">
          <div className="flex items-center gap-2 mb-4">
            <ArrowTrendingUpIcon className="h-5 w-5 text-purple-600" />
            <h2 className="text-lg font-semibold text-gray-900">Stack Your Savings</h2>
          </div>
          <div className="space-y-4">
            {stackOpportunities.map((stack) => (
              <div key={stack.title} className="bg-gradient-to-r from-purple-50 to-indigo-50 rounded-xl border border-purple-100 p-5">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="font-semibold text-gray-900">{stack.title}</h3>
                    <p className="text-sm text-gray-600 mt-1">{stack.description}</p>
                  </div>
                  <span className="text-lg font-bold text-purple-700 whitespace-nowrap ml-4">
                    {formatCurrency(stack.totalSavings)}/yr
                  </span>
                </div>
                <div className="mt-3 flex flex-wrap gap-2">
                  {stack.programs.map((id) => {
                    const p = programs.find((pr) => pr.id === id);
                    return p ? (
                      <Link
                        key={id}
                        href={`/programs/${id}`}
                        className="text-xs px-3 py-1.5 bg-white rounded-lg border border-purple-200 text-purple-700 font-medium hover:bg-purple-50 transition"
                      >
                        {p.name}
                      </Link>
                    ) : null;
                  })}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Near Eligible */}
      {nearEligible.length > 0 && (
        <div className="mb-10">
          <div className="flex items-center gap-2 mb-4">
            <LightBulbIcon className="h-5 w-5 text-amber-600" />
            <h2 className="text-lg font-semibold text-gray-900">Almost There</h2>
          </div>
          <div className="space-y-3">
            {nearEligible.slice(0, 4).map((result) => (
              <Link
                key={result.program.id}
                href={`/programs/${result.program.id}`}
                className="block bg-amber-50 rounded-xl border border-amber-100 p-4 hover:border-amber-200 transition"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="font-semibold text-gray-900">{result.program.name}</h3>
                    <p className="text-sm text-gray-600 mt-1">{result.program.short_description}</p>
                  </div>
                  {result.program.savings_estimate_annual > 0 && (
                    <span className="text-amber-700 font-bold text-sm whitespace-nowrap ml-4">
                      {formatCurrency(result.program.savings_estimate_annual)}/yr
                    </span>
                  )}
                </div>
                <div className="mt-2 flex items-center gap-2 text-sm text-amber-700">
                  <ExclamationTriangleIcon className="h-4 w-4" />
                  Missing: {result.missingRequirements.join(', ')}
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
