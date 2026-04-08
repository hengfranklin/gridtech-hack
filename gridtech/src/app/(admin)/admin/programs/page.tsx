'use client';

import { programs } from '@/data/programs';
import { getCategoryLabel, getCategoryColor, getProviderLabel, formatCurrency } from '@/lib/utils';
import { useState } from 'react';
import { MagnifyingGlassIcon, CheckCircleIcon, XCircleIcon } from '@heroicons/react/24/outline';

export default function AdminProgramsPage() {
  const [search, setSearch] = useState('');

  const filtered = programs.filter((p) =>
    !search || p.name.toLowerCase().includes(search.toLowerCase()) || p.provider.includes(search.toLowerCase())
  );

  return (
    <div className="p-6 lg:p-8 max-w-7xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Program Management</h1>
          <p className="text-gray-500 mt-1">{programs.length} programs in database</p>
        </div>
      </div>

      <div className="relative mb-6 max-w-md">
        <MagnifyingGlassIcon className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
        <input type="text" value={search} onChange={(e) => setSearch(e.target.value)}
          placeholder="Search programs..." className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none" />
      </div>

      <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-100 bg-gray-50">
              <th className="text-left text-xs font-medium text-gray-500 uppercase p-4">Program</th>
              <th className="text-left text-xs font-medium text-gray-500 uppercase p-4">Category</th>
              <th className="text-left text-xs font-medium text-gray-500 uppercase p-4">Provider</th>
              <th className="text-right text-xs font-medium text-gray-500 uppercase p-4">Savings Est.</th>
              <th className="text-center text-xs font-medium text-gray-500 uppercase p-4">Status</th>
              <th className="text-left text-xs font-medium text-gray-500 uppercase p-4">Deadline</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((p) => (
              <tr key={p.id} className="border-b border-gray-50 hover:bg-gray-50">
                <td className="p-4">
                  <div className="font-medium text-gray-900 text-sm">{p.name}</div>
                  <div className="text-xs text-gray-400 mt-0.5 line-clamp-1">{p.short_description}</div>
                </td>
                <td className="p-4">
                  <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${getCategoryColor(p.category)}`}>
                    {getCategoryLabel(p.category)}
                  </span>
                </td>
                <td className="p-4 text-sm text-gray-600">{getProviderLabel(p.provider)}</td>
                <td className="p-4 text-sm text-gray-900 text-right font-medium">
                  {p.savings_estimate_annual > 0 ? formatCurrency(p.savings_estimate_annual) : '—'}
                </td>
                <td className="p-4 text-center">
                  {p.is_active
                    ? <CheckCircleIcon className="h-5 w-5 text-emerald-500 mx-auto" />
                    : <XCircleIcon className="h-5 w-5 text-gray-300 mx-auto" />}
                </td>
                <td className="p-4 text-sm text-gray-500">
                  {p.enrollment_deadline ? new Date(p.enrollment_deadline).toLocaleDateString() : '—'}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
