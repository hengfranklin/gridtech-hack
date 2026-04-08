'use client';

import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { formatCurrency } from '@/lib/utils';

interface Props {
  monthlySavings: { month: string; savings: number }[];
  categoryBreakdown: { name: string; value: number }[];
  pieColors: string[];
}

export default function DashboardCharts({ monthlySavings, categoryBreakdown, pieColors }: Props) {
  return (
    <div className="grid lg:grid-cols-3 gap-6 mb-8">
      <div className="lg:col-span-2 bg-white rounded-xl border border-gray-100 p-5 shadow-sm">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Projected Monthly Savings</h3>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={monthlySavings}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="month" tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 12 }} tickFormatter={(v) => `$${v}`} />
              <Tooltip formatter={(value) => [`$${value}`, 'Monthly Savings']} />
              <Area type="monotone" dataKey="savings" stroke="#059669" fill="#d1fae5" strokeWidth={2} />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-gray-100 p-5 shadow-sm">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Savings by Category</h3>
        <div className="h-48">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie data={categoryBreakdown} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={70} label={false}>
                {categoryBreakdown.map((_, i) => (
                  <Cell key={i} fill={pieColors[i % pieColors.length]} />
                ))}
              </Pie>
              <Tooltip formatter={(value) => formatCurrency(Number(value))} />
            </PieChart>
          </ResponsiveContainer>
        </div>
        <div className="mt-2 space-y-1">
          {categoryBreakdown.slice(0, 4).map((cat, i) => (
            <div key={cat.name} className="flex items-center justify-between text-sm">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: pieColors[i] }} />
                <span className="text-gray-600">{cat.name}</span>
              </div>
              <span className="font-medium text-gray-900">{formatCurrency(cat.value)}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
