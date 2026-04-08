'use client';

import { programs } from '@/data/programs';
import { formatCurrency, getCategoryLabel, getProviderLabel } from '@/lib/utils';
import { UsersIcon, BoltIcon, CurrencyDollarIcon, ArrowTrendingDownIcon } from '@heroicons/react/24/outline';
import dynamic from 'next/dynamic';

const AdminEnrollmentTrend = dynamic(() => import('@/components/dashboard/AdminCharts').then(m => ({ default: m.EnrollmentTrendChart })), { ssr: false });
const AdminCategoryBar = dynamic(() => import('@/components/dashboard/AdminCharts').then(m => ({ default: m.CategoryBarChart })), { ssr: false });

// Mock admin data
const MOCK_ENROLLMENTS = 12847;
const MOCK_ACTIVE_PROGRAMS = programs.filter((p) => p.is_active).length;
const MOCK_AVG_SAVINGS = 2340;
const MOCK_PEAK_REDUCTION = 145; // MW

const enrollmentTrend = [
  { month: 'Oct', enrollments: 890 },
  { month: 'Nov', enrollments: 1020 },
  { month: 'Dec', enrollments: 780 },
  { month: 'Jan', enrollments: 1150 },
  { month: 'Feb', enrollments: 1340 },
  { month: 'Mar', enrollments: 1580 },
];

const programPerformance = programs
  .filter((p) => p.is_active)
  .map((p) => ({
    name: p.name.length > 25 ? p.name.slice(0, 25) + '...' : p.name,
    fullName: p.name,
    enrollments: Math.floor(Math.random() * 2000) + 100,
    utilization: Math.floor(Math.random() * 80) + 10,
    category: p.category,
    provider: p.provider,
  }))
  .sort((a, b) => a.utilization - b.utilization);

const categoryBreakdown = [
  { category: 'EV Charging', count: 3420, pct: 27 },
  { category: 'Weatherization', count: 2840, pct: 22 },
  { category: 'Tax Credits', count: 2150, pct: 17 },
  { category: 'Heat Pump', count: 1680, pct: 13 },
  { category: 'Demand Response', count: 1290, pct: 10 },
  { category: 'Bill Assistance', count: 890, pct: 7 },
  { category: 'Solar/Storage', count: 577, pct: 4 },
];

export default function AdminOverviewPage() {
  return (
    <div className="p-6 lg:p-8 max-w-7xl mx-auto">
      <h1 className="text-2xl font-bold text-gray-900 mb-1">Utility Admin Dashboard</h1>
      <p className="text-gray-500 mb-8">Program performance overview and analytics</p>

      {/* KPI Cards */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <div className="bg-white rounded-xl border border-gray-100 p-5 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-100 rounded-lg"><UsersIcon className="h-6 w-6 text-blue-600" /></div>
            <div>
              <div className="text-sm text-gray-500">Total Enrollments</div>
              <div className="text-2xl font-bold text-gray-900">{MOCK_ENROLLMENTS.toLocaleString()}</div>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl border border-gray-100 p-5 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-emerald-100 rounded-lg"><BoltIcon className="h-6 w-6 text-emerald-600" /></div>
            <div>
              <div className="text-sm text-gray-500">Active Programs</div>
              <div className="text-2xl font-bold text-gray-900">{MOCK_ACTIVE_PROGRAMS}</div>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl border border-gray-100 p-5 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-purple-100 rounded-lg"><CurrencyDollarIcon className="h-6 w-6 text-purple-600" /></div>
            <div>
              <div className="text-sm text-gray-500">Avg Savings/User</div>
              <div className="text-2xl font-bold text-gray-900">{formatCurrency(MOCK_AVG_SAVINGS)}</div>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl border border-gray-100 p-5 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-orange-100 rounded-lg"><ArrowTrendingDownIcon className="h-6 w-6 text-orange-600" /></div>
            <div>
              <div className="text-sm text-gray-500">Peak Demand Reduction</div>
              <div className="text-2xl font-bold text-gray-900">{MOCK_PEAK_REDUCTION} MW</div>
            </div>
          </div>
        </div>
      </div>

      {/* Charts */}
      <div className="grid lg:grid-cols-2 gap-6 mb-8">
        <div className="bg-white rounded-xl border border-gray-100 p-5 shadow-sm">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Enrollment Trend</h3>
          <div className="h-64">
            <AdminEnrollmentTrend data={enrollmentTrend} />
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-100 p-5 shadow-sm">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Enrollments by Category</h3>
          <div className="h-64">
            <AdminCategoryBar data={categoryBreakdown} />
          </div>
        </div>
      </div>

      {/* Underutilized Programs */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm">
        <div className="p-5 border-b border-gray-100">
          <h3 className="text-lg font-semibold text-gray-900">Program Utilization (Lowest First)</h3>
          <p className="text-sm text-gray-500 mt-1">Sorted by utilization rate to identify underperforming programs</p>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-100">
                <th className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider p-4">Program</th>
                <th className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider p-4">Provider</th>
                <th className="text-right text-xs font-medium text-gray-500 uppercase tracking-wider p-4">Enrollments</th>
                <th className="text-right text-xs font-medium text-gray-500 uppercase tracking-wider p-4">Utilization</th>
              </tr>
            </thead>
            <tbody>
              {programPerformance.map((p, i) => (
                <tr key={i} className="border-b border-gray-50 hover:bg-gray-50">
                  <td className="p-4">
                    <div className="font-medium text-gray-900 text-sm">{p.fullName}</div>
                    <div className="text-xs text-gray-400">{getCategoryLabel(p.category)}</div>
                  </td>
                  <td className="p-4 text-sm text-gray-600">{getProviderLabel(p.provider)}</td>
                  <td className="p-4 text-sm text-gray-900 text-right font-medium">{p.enrollments.toLocaleString()}</td>
                  <td className="p-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <div className="w-20 bg-gray-100 rounded-full h-2">
                        <div
                          className={`h-2 rounded-full ${p.utilization < 30 ? 'bg-red-500' : p.utilization < 60 ? 'bg-amber-500' : 'bg-emerald-500'}`}
                          style={{ width: `${p.utilization}%` }}
                        />
                      </div>
                      <span className={`text-sm font-medium ${p.utilization < 30 ? 'text-red-600' : p.utilization < 60 ? 'text-amber-600' : 'text-emerald-600'}`}>
                        {p.utilization}%
                      </span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
