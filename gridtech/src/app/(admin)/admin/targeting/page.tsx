'use client';

import { useState } from 'react';
import { programs } from '@/data/programs';
import { getCategoryLabel, getProviderLabel, formatCurrency } from '@/lib/utils';
import { MegaphoneIcon, MapPinIcon, UsersIcon, ArrowTrendingUpIcon } from '@heroicons/react/24/outline';

const UNDERSERVED_AREAS = [
  { area: 'South Bronx (10451-10460)', eligible: 18500, enrolled: 920, gap: 95, opportunity: 'High income-eligible population for EmPower+, HEAP, and bill assistance programs' },
  { area: 'East Brooklyn (11207-11239)', eligible: 15200, enrolled: 1100, gap: 93, opportunity: 'Large renter population; target landlords for AMEEP and building upgrades' },
  { area: 'Central Harlem (10026-10040)', eligible: 12800, enrolled: 840, gap: 93, opportunity: 'DAC-eligible area with enhanced incentives available' },
  { area: 'Southeast Queens (11412-11436)', eligible: 9400, enrolled: 780, gap: 92, opportunity: 'Homeowner area good for heat pumps, solar, and SmartCharge NY' },
  { area: 'North Shore SI (10301-10310)', eligible: 5600, enrolled: 320, gap: 94, opportunity: 'Mixed housing; focus on weatherization and EV programs' },
  { area: 'Syracuse (13200-13290)', eligible: 8200, enrolled: 1200, gap: 85, opportunity: 'National Grid territory; high heating costs make efficiency programs attractive' },
  { area: 'Buffalo (14200-14280)', eligible: 11500, enrolled: 1500, gap: 87, opportunity: 'Cold climate means high savings from weatherization and heat pumps' },
];

export default function AdminTargetingPage() {
  const [goalMetric, setGoalMetric] = useState('enrollments');
  const [goalTarget, setGoalTarget] = useState(5000);
  const [goalPeriod, setGoalPeriod] = useState('Q2 2026');

  return (
    <div className="p-6 lg:p-8 max-w-7xl mx-auto">
      <h1 className="text-2xl font-bold text-gray-900 mb-1">Marketing & Targeting</h1>
      <p className="text-gray-500 mb-8">Identify underserved areas and set enrollment goals</p>

      {/* Goal Setting */}
      <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm mb-8">
        <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <ArrowTrendingUpIcon className="h-5 w-5 text-emerald-600" /> Set Enrollment Goal
        </h2>
        <div className="grid sm:grid-cols-3 gap-4 mb-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Metric</label>
            <select value={goalMetric} onChange={(e) => setGoalMetric(e.target.value)}
              className="w-full px-3 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none">
              <option value="enrollments">New Enrollments</option>
              <option value="peak_reduction">Peak Demand Reduction (MW)</option>
              <option value="kwh_saved">Energy Saved (MWh)</option>
              <option value="dac_enrollments">DAC Community Enrollments</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Target</label>
            <input type="number" value={goalTarget} onChange={(e) => setGoalTarget(Number(e.target.value))}
              className="w-full px-3 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Period</label>
            <select value={goalPeriod} onChange={(e) => setGoalPeriod(e.target.value)}
              className="w-full px-3 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none">
              <option>Q2 2026</option>
              <option>Q3 2026</option>
              <option>Q4 2026</option>
              <option>FY 2026</option>
            </select>
          </div>
        </div>

        {/* Progress (mock) */}
        <div className="p-4 bg-gray-50 rounded-xl">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-700">Progress toward {goalPeriod} goal</span>
            <span className="text-sm font-bold text-emerald-600">2,340 / {goalTarget.toLocaleString()}</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-3">
            <div className="bg-emerald-500 h-3 rounded-full transition-all" style={{ width: `${Math.min(100, (2340 / goalTarget) * 100)}%` }} />
          </div>
          <p className="text-xs text-gray-500 mt-2">{Math.round((2340 / goalTarget) * 100)}% complete &middot; {goalTarget - 2340} remaining</p>
        </div>
      </div>

      {/* Underserved Areas */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm mb-8">
        <div className="p-6 border-b border-gray-100">
          <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
            <MapPinIcon className="h-5 w-5 text-red-500" /> Underserved Areas (Highest Gap)
          </h2>
          <p className="text-sm text-gray-500 mt-1">Areas with high eligibility but low enrollment — priority for marketing outreach</p>
        </div>
        <div className="divide-y divide-gray-50">
          {UNDERSERVED_AREAS.map((area) => (
            <div key={area.area} className="p-5 hover:bg-gray-50">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3">
                    <h4 className="font-semibold text-gray-900">{area.area}</h4>
                    <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-red-100 text-red-700">{area.gap}% gap</span>
                  </div>
                  <p className="text-sm text-gray-500 mt-1">{area.opportunity}</p>
                </div>
                <div className="text-right ml-4">
                  <div className="text-sm text-gray-500">Eligible: <span className="font-medium text-gray-900">{area.eligible.toLocaleString()}</span></div>
                  <div className="text-sm text-gray-500">Enrolled: <span className="font-medium text-emerald-600">{area.enrolled.toLocaleString()}</span></div>
                </div>
              </div>
              <div className="mt-3 w-full bg-gray-100 rounded-full h-2">
                <div className="bg-red-400 h-2 rounded-full" style={{ width: `${100 - area.gap}%` }} />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Recommended Actions */}
      <div className="bg-gradient-to-r from-emerald-50 to-teal-50 rounded-2xl border border-emerald-200 p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <MegaphoneIcon className="h-5 w-5 text-emerald-600" /> Recommended Marketing Actions
        </h2>
        <div className="space-y-3">
          {[
            { action: 'Community Outreach Events', detail: 'Partner with CBOs in South Bronx and East Brooklyn for in-person enrollment assistance. Trust-building is the #1 barrier in these areas.', priority: 'High' },
            { action: 'Multilingual Materials', detail: 'Develop Spanish, Chinese, and Haitian Creole program materials. 48% of target areas have non-English primary speakers.', priority: 'High' },
            { action: 'Landlord Engagement Campaign', detail: 'Target multifamily building owners in Brooklyn and Queens about AMEEP ($2,000/unit) and PACE financing.', priority: 'Medium' },
            { action: 'EV Program Awareness', detail: 'SmartCharge NY has only 27% penetration among registered EV owners. Digital ads targeting EV forums and charging stations.', priority: 'Medium' },
            { action: 'LL97 Compliance Workshops', detail: 'Free workshops for building owners on LL97 deadlines, penalties, and available programs to achieve compliance.', priority: 'Medium' },
          ].map((rec) => (
            <div key={rec.action} className="bg-white rounded-xl p-4 border border-emerald-100">
              <div className="flex items-start justify-between">
                <div>
                  <h4 className="font-semibold text-gray-900">{rec.action}</h4>
                  <p className="text-sm text-gray-600 mt-1">{rec.detail}</p>
                </div>
                <span className={`text-xs font-medium px-2 py-1 rounded-full whitespace-nowrap ml-3 ${
                  rec.priority === 'High' ? 'bg-red-100 text-red-700' : 'bg-amber-100 text-amber-700'
                }`}>
                  {rec.priority}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
