'use client';

import { useState, useMemo } from 'react';
import { formatCurrency } from '@/lib/utils';
import dynamic from 'next/dynamic';

const ROICharts = dynamic(() => import('@/components/dashboard/ROICharts'), { ssr: false });

const UPGRADES = [
  { id: 'heat_pump', name: 'Air Source Heat Pump', cost: 25000, annualSavings: 2500, incentives: 18000, lifespan: 20 },
  { id: 'ground_hp', name: 'Ground Source Heat Pump', cost: 45000, annualSavings: 3500, incentives: 28000, lifespan: 25 },
  { id: 'solar', name: 'Solar Panel System (10kW)', cost: 30000, annualSavings: 2000, incentives: 15000, lifespan: 25 },
  { id: 'battery', name: 'Battery Storage (13.5kWh)', cost: 15000, annualSavings: 800, incentives: 7500, lifespan: 15 },
  { id: 'insulation', name: 'Insulation & Air Sealing', cost: 8000, annualSavings: 1200, incentives: 5000, lifespan: 30 },
  { id: 'windows', name: 'Energy Efficient Windows', cost: 20000, annualSavings: 1000, incentives: 6000, lifespan: 20 },
  { id: 'led', name: 'LED Lighting Retrofit', cost: 5000, annualSavings: 1500, incentives: 2000, lifespan: 15 },
  { id: 'boiler', name: 'High-Efficiency Boiler', cost: 12000, annualSavings: 1800, incentives: 4000, lifespan: 20 },
];

export default function ROICalculatorPage() {
  const [selected, setSelected] = useState('heat_pump');
  const [customCost, setCustomCost] = useState<number | null>(null);
  const [customSavings, setCustomSavings] = useState<number | null>(null);

  const upgrade = UPGRADES.find((u) => u.id === selected)!;
  const cost = customCost ?? upgrade.cost;
  const annualSavings = customSavings ?? upgrade.annualSavings;
  const netCost = cost - upgrade.incentives;
  const paybackYears = netCost > 0 ? (netCost / annualSavings).toFixed(1) : '< 1';

  const chartData = useMemo(() => {
    const data = [];
    let cumSavings = 0;
    for (let y = 0; y <= 10; y++) {
      cumSavings += y === 0 ? 0 : annualSavings;
      data.push({
        year: `Yr ${y}`,
        'Cumulative Savings': cumSavings,
        'Net Cost': y === 0 ? netCost : netCost,
        'Net Value': cumSavings - netCost,
      });
    }
    return data;
  }, [netCost, annualSavings]);

  return (
    <div className="p-6 lg:p-8 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold text-gray-900 mb-2">ROI Calculator</h1>
      <p className="text-gray-500 mb-8">Calculate the return on investment for energy upgrades</p>

      {/* Upgrade Selection */}
      <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm mb-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Select Upgrade</h2>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 mb-6">
          {UPGRADES.map((u) => (
            <button
              key={u.id}
              onClick={() => { setSelected(u.id); setCustomCost(null); setCustomSavings(null); }}
              className={`p-3 rounded-xl border-2 text-left text-sm transition ${
                selected === u.id ? 'border-emerald-600 bg-emerald-50' : 'border-gray-100 hover:border-gray-200'
              }`}
            >
              <div className="font-medium text-gray-900">{u.name}</div>
              <div className="text-xs text-gray-500 mt-1">{formatCurrency(u.cost)}</div>
            </button>
          ))}
        </div>

        {/* Custom inputs */}
        <div className="grid sm:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Upfront Cost</label>
            <input
              type="number"
              value={customCost ?? cost}
              onChange={(e) => setCustomCost(Number(e.target.value))}
              className="w-full px-3 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Available Incentives</label>
            <div className="px-3 py-2.5 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-700 font-medium">
              {formatCurrency(upgrade.incentives)}
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Est. Annual Savings</label>
            <input
              type="number"
              value={customSavings ?? annualSavings}
              onChange={(e) => setCustomSavings(Number(e.target.value))}
              className="w-full px-3 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none"
            />
          </div>
        </div>
      </div>

      {/* Results */}
      <div className="grid sm:grid-cols-4 gap-4 mb-6">
        <div className="bg-white rounded-xl border border-gray-100 p-4 shadow-sm text-center">
          <div className="text-sm text-gray-500">Upfront Cost</div>
          <div className="text-xl font-bold text-gray-900">{formatCurrency(cost)}</div>
        </div>
        <div className="bg-emerald-50 rounded-xl border border-emerald-200 p-4 text-center">
          <div className="text-sm text-emerald-700">After Incentives</div>
          <div className="text-xl font-bold text-emerald-700">{formatCurrency(netCost)}</div>
        </div>
        <div className="bg-white rounded-xl border border-gray-100 p-4 shadow-sm text-center">
          <div className="text-sm text-gray-500">Annual Savings</div>
          <div className="text-xl font-bold text-gray-900">{formatCurrency(annualSavings)}/yr</div>
        </div>
        <div className="bg-blue-50 rounded-xl border border-blue-200 p-4 text-center">
          <div className="text-sm text-blue-700">Payback Period</div>
          <div className="text-xl font-bold text-blue-700">{paybackYears} years</div>
        </div>
      </div>

      {/* Chart */}
      <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm mb-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">10-Year Financial Projection</h2>
        <div className="h-72">
          <ROICharts data={chartData} />
        </div>
      </div>

      {/* Applicable Programs */}
      <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Applicable Incentive Programs</h2>
        <div className="space-y-3">
          {[
            { name: 'NYSERDA Clean Heat / Comfort Home', amount: 'Up to $18,000', applies: ['heat_pump', 'ground_hp', 'insulation'] },
            { name: 'IRA 25C Federal Tax Credit', amount: '30% (up to $3,200/yr)', applies: ['heat_pump', 'ground_hp', 'insulation', 'windows'] },
            { name: 'IRA 25D Federal Tax Credit', amount: '30% (no cap)', applies: ['solar', 'battery'] },
            { name: 'NY-Sun Rebate', amount: '~$1,380 average', applies: ['solar'] },
            { name: 'NYSERDA Storage Incentive', amount: '$200-400/kWh', applies: ['battery'] },
            { name: 'Con Edison Rebates', amount: 'Varies', applies: ['heat_pump', 'ground_hp', 'led', 'boiler'] },
          ].filter((p) => p.applies.includes(selected)).map((p) => (
            <div key={p.name} className="flex items-center justify-between p-3 border border-gray-100 rounded-lg">
              <span className="text-sm font-medium text-gray-900">{p.name}</span>
              <span className="text-sm font-bold text-emerald-600">{p.amount}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
