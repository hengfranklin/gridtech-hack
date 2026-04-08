'use client';

import { useState, useMemo } from 'react';
import { useAppStore } from '@/lib/store';
import { formatCurrency } from '@/lib/utils';
import { ExclamationTriangleIcon, CheckCircleIcon } from '@heroicons/react/24/outline';

// LL97 emission limits (tCO2e per sq ft per year) — simplified
const LL97_LIMITS: Record<string, { phase1: number; phase2: number }> = {
  office: { phase1: 0.00846, phase2: 0.00453 },
  residential: { phase1: 0.00675, phase2: 0.00407 },
  retail: { phase1: 0.01181, phase2: 0.00574 },
  hotel: { phase1: 0.00987, phase2: 0.00526 },
  healthcare: { phase1: 0.02381, phase2: 0.01274 },
  education: { phase1: 0.00758, phase2: 0.00407 },
  warehouse: { phase1: 0.00574, phase2: 0.00308 },
};

const PENALTY_PER_TON = 268;

export default function CompliancePage() {
  const { profile } = useAppStore();
  const [buildingUse, setBuildingUse] = useState('office');
  const [sqft, setSqft] = useState(profile?.building_sqft || 50000);
  const [currentEmissions, setCurrentEmissions] = useState(500); // tCO2e/year

  const limits = LL97_LIMITS[buildingUse] || LL97_LIMITS.office;
  const phase1Limit = limits.phase1 * sqft;
  const phase2Limit = limits.phase2 * sqft;

  const phase1Over = Math.max(0, currentEmissions - phase1Limit);
  const phase2Over = Math.max(0, currentEmissions - phase2Limit);
  const phase1Penalty = phase1Over * PENALTY_PER_TON;
  const phase2Penalty = phase2Over * PENALTY_PER_TON;
  const phase1Compliant = phase1Over === 0;

  return (
    <div className="p-6 lg:p-8 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold text-gray-900 mb-2">LL97 Compliance Tracker</h1>
      <p className="text-gray-500 mb-8">Check your building&apos;s carbon emission compliance under Local Law 97</p>

      {/* Inputs */}
      <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm mb-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Building Details</h2>
        <div className="grid sm:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Building Use Type</label>
            <select value={buildingUse} onChange={(e) => setBuildingUse(e.target.value)}
              className="w-full px-3 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none">
              {Object.keys(LL97_LIMITS).map((k) => (
                <option key={k} value={k}>{k.charAt(0).toUpperCase() + k.slice(1)}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Gross Square Footage</label>
            <input type="number" value={sqft} onChange={(e) => setSqft(Number(e.target.value))}
              className="w-full px-3 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Current Emissions (tCO2e/yr)</label>
            <input type="number" value={currentEmissions} onChange={(e) => setCurrentEmissions(Number(e.target.value))}
              className="w-full px-3 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none" />
          </div>
        </div>
      </div>

      {/* Results */}
      <div className="grid sm:grid-cols-2 gap-6 mb-6">
        {/* Phase 1 */}
        <div className={`rounded-2xl border p-6 ${phase1Compliant ? 'bg-emerald-50 border-emerald-200' : 'bg-red-50 border-red-200'}`}>
          <div className="flex items-center gap-2 mb-3">
            {phase1Compliant
              ? <CheckCircleIcon className="h-6 w-6 text-emerald-600" />
              : <ExclamationTriangleIcon className="h-6 w-6 text-red-600" />
            }
            <h3 className="text-lg font-semibold">Phase 1 (2024–2030)</h3>
          </div>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-600">Emission Limit:</span>
              <span className="font-semibold">{phase1Limit.toFixed(1)} tCO2e/yr</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Your Emissions:</span>
              <span className="font-semibold">{currentEmissions} tCO2e/yr</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">{phase1Compliant ? 'Under by:' : 'Over by:'}</span>
              <span className={`font-bold ${phase1Compliant ? 'text-emerald-700' : 'text-red-700'}`}>
                {Math.abs(currentEmissions - phase1Limit).toFixed(1)} tCO2e
              </span>
            </div>
            {!phase1Compliant && (
              <div className="flex justify-between pt-2 border-t border-red-200">
                <span className="text-red-700 font-medium">Annual Penalty:</span>
                <span className="font-bold text-red-700">{formatCurrency(phase1Penalty)}</span>
              </div>
            )}
          </div>
        </div>

        {/* Phase 2 */}
        <div className="rounded-2xl border bg-amber-50 border-amber-200 p-6">
          <div className="flex items-center gap-2 mb-3">
            <ExclamationTriangleIcon className="h-6 w-6 text-amber-600" />
            <h3 className="text-lg font-semibold">Phase 2 (2030–2035)</h3>
          </div>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-600">Emission Limit:</span>
              <span className="font-semibold">{phase2Limit.toFixed(1)} tCO2e/yr</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Your Emissions:</span>
              <span className="font-semibold">{currentEmissions} tCO2e/yr</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Over by:</span>
              <span className="font-bold text-amber-700">{phase2Over.toFixed(1)} tCO2e</span>
            </div>
            <div className="flex justify-between pt-2 border-t border-amber-200">
              <span className="text-amber-700 font-medium">Projected Penalty:</span>
              <span className="font-bold text-amber-700">{formatCurrency(phase2Penalty)}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Compliance Pathways */}
      <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm mb-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Compliance Pathways</h2>
        <div className="space-y-3">
          {[
            { title: 'Energy Efficiency Upgrades', desc: 'Reduce consumption through building envelope, lighting, and HVAC improvements', reduction: '20-40%', programs: ['NYSERDA FlexTech', 'Con Edison C&I Rebates'] },
            { title: 'Electrification (Heat Pumps)', desc: 'Switch from fossil fuels to electric heat pumps', reduction: '30-60%', programs: ['NYS Clean Heat', 'IRA 25C Tax Credit'] },
            { title: 'On-site Solar + Storage', desc: 'Generate clean energy on-site', reduction: '10-30%', programs: ['NY-Sun', 'IRA 25D Tax Credit', 'NYSERDA Storage'] },
            { title: 'PACE Financing', desc: 'Finance improvements with no upfront cost through property tax assessment', reduction: 'Enables above', programs: ['NYC PACE'] },
            { title: 'Carbon Offsets', desc: 'Purchase offsets for up to 10% of required reductions', reduction: 'Up to 10%', programs: [] },
          ].map((pathway) => (
            <div key={pathway.title} className="p-4 border border-gray-100 rounded-xl">
              <div className="flex items-start justify-between">
                <div>
                  <h4 className="font-semibold text-gray-900">{pathway.title}</h4>
                  <p className="text-sm text-gray-500 mt-1">{pathway.desc}</p>
                  {pathway.programs.length > 0 && (
                    <div className="flex flex-wrap gap-1 mt-2">
                      {pathway.programs.map((p) => (
                        <span key={p} className="text-xs px-2 py-0.5 bg-emerald-100 text-emerald-700 rounded-full">{p}</span>
                      ))}
                    </div>
                  )}
                </div>
                <span className="text-sm font-bold text-emerald-600 whitespace-nowrap ml-4">{pathway.reduction}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Timeline */}
      <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">LL97 Timeline</h2>
        <div className="space-y-4">
          {[
            { year: '2024', event: 'Phase 1 emission limits take effect', status: 'active' },
            { year: '2025', event: 'Penalties begin for non-compliant buildings', status: 'active' },
            { year: '2030', event: 'Phase 2 stricter limits begin', status: 'upcoming' },
            { year: '2035', event: 'Phase 3 (anticipated further reductions)', status: 'future' },
            { year: '2050', event: 'Net zero emissions target', status: 'future' },
          ].map((item, i) => (
            <div key={i} className="flex items-start gap-4">
              <div className={`w-3 h-3 rounded-full mt-1.5 ${
                item.status === 'active' ? 'bg-red-500' : item.status === 'upcoming' ? 'bg-amber-500' : 'bg-gray-300'
              }`} />
              <div>
                <span className="font-bold text-gray-900">{item.year}</span>
                <span className="text-gray-600 ml-2">{item.event}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
