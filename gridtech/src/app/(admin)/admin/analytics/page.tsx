'use client';

import dynamic from 'next/dynamic';

const EnrollmentByTypeChart = dynamic(() => import('@/components/dashboard/AnalyticsCharts').then(m => ({ default: m.EnrollmentByTypeChart })), { ssr: false });
const UserTypeDistChart = dynamic(() => import('@/components/dashboard/AnalyticsCharts').then(m => ({ default: m.UserTypeDistChart })), { ssr: false });
const IncomeDistChart = dynamic(() => import('@/components/dashboard/AnalyticsCharts').then(m => ({ default: m.IncomeDistChart })), { ssr: false });
const GeoDistChart = dynamic(() => import('@/components/dashboard/AnalyticsCharts').then(m => ({ default: m.GeoDistChart })), { ssr: false });

const COLORS = ['#059669', '#10b981', '#34d399', '#6ee7b7', '#a7f3d0', '#2563eb', '#7c3aed', '#dc2626'];

const enrollmentByMonth = [
  { month: 'Jul', residential: 450, business: 120, building: 80 },
  { month: 'Aug', residential: 520, business: 135, building: 95 },
  { month: 'Sep', residential: 680, business: 150, building: 110 },
  { month: 'Oct', residential: 590, business: 180, building: 120 },
  { month: 'Nov', residential: 720, business: 200, building: 140 },
  { month: 'Dec', residential: 480, business: 160, building: 100 },
  { month: 'Jan', residential: 780, business: 220, building: 150 },
  { month: 'Feb', residential: 890, business: 250, building: 180 },
  { month: 'Mar', residential: 1050, business: 290, building: 210 },
];

const userTypeDist = [
  { name: 'Residential', value: 8420 },
  { name: 'Business', value: 2840 },
  { name: 'Building Owner', value: 1587 },
];

const incomeDist = [
  { bracket: 'Low', count: 3200 },
  { bracket: 'Moderate', count: 4100 },
  { bracket: 'Middle', count: 3800 },
  { bracket: 'High', count: 1747 },
];

const geoDist = [
  { area: 'Manhattan', count: 2840 },
  { area: 'Brooklyn', count: 2450 },
  { area: 'Queens', count: 1890 },
  { area: 'Bronx', count: 1620 },
  { area: 'Staten Island', count: 580 },
  { area: 'Westchester', count: 1200 },
  { area: 'Long Island', count: 1480 },
  { area: 'Upstate', count: 787 },
];

const funnelData = [
  { stage: 'Eligible', count: 245000, pct: 100 },
  { stage: 'Aware', count: 89000, pct: 36 },
  { stage: 'Interested', count: 34000, pct: 14 },
  { stage: 'Started Enrollment', count: 18500, pct: 8 },
  { stage: 'Completed', count: 12847, pct: 5 },
  { stage: 'Active', count: 9200, pct: 4 },
];

export default function AdminAnalyticsPage() {
  return (
    <div className="p-6 lg:p-8 max-w-7xl mx-auto">
      <h1 className="text-2xl font-bold text-gray-900 mb-1">Analytics</h1>
      <p className="text-gray-500 mb-8">Detailed enrollment and demographic analytics</p>

      {/* Enrollment Funnel */}
      <div className="bg-white rounded-xl border border-gray-100 p-5 shadow-sm mb-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Enrollment Funnel</h3>
        <div className="space-y-3">
          {funnelData.map((stage, i) => (
            <div key={stage.stage} className="flex items-center gap-4">
              <div className="w-36 text-sm font-medium text-gray-700">{stage.stage}</div>
              <div className="flex-1">
                <div className="w-full bg-gray-100 rounded-full h-8 relative">
                  <div
                    className="h-8 rounded-full flex items-center justify-end pr-3 text-sm font-bold text-white transition-all"
                    style={{
                      width: `${Math.max(stage.pct, 5)}%`,
                      backgroundColor: COLORS[i % COLORS.length],
                    }}
                  >
                    {stage.count.toLocaleString()}
                  </div>
                </div>
              </div>
              <div className="w-12 text-right text-sm font-medium text-gray-500">{stage.pct}%</div>
            </div>
          ))}
        </div>
        <div className="mt-4 p-3 bg-amber-50 rounded-lg text-sm text-amber-800">
          Only <strong>5%</strong> of eligible users complete enrollment. The biggest drop-off is from Eligible to Aware (64% loss) —
          this highlights the critical need for better outreach and awareness campaigns.
        </div>
      </div>

      {/* Charts Grid */}
      <div className="grid lg:grid-cols-2 gap-6 mb-6">
        {/* Enrollment by Month by User Type */}
        <div className="bg-white rounded-xl border border-gray-100 p-5 shadow-sm">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Enrollment by User Type</h3>
          <div className="h-64">
            <EnrollmentByTypeChart data={enrollmentByMonth} />
          </div>
        </div>

        {/* User Type Distribution */}
        <div className="bg-white rounded-xl border border-gray-100 p-5 shadow-sm">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">User Type Distribution</h3>
          <div className="h-48">
            <UserTypeDistChart data={userTypeDist} />
          </div>
          <div className="mt-2 space-y-1">
            {userTypeDist.map((item, i) => (
              <div key={item.name} className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[i] }} />
                  <span className="text-gray-600">{item.name}</span>
                </div>
                <span className="font-medium text-gray-900">{item.value.toLocaleString()}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* More Charts */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Income Distribution */}
        <div className="bg-white rounded-xl border border-gray-100 p-5 shadow-sm">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Income Distribution</h3>
          <div className="h-64">
            <IncomeDistChart data={incomeDist} />
          </div>
        </div>

        {/* Geographic Distribution */}
        <div className="bg-white rounded-xl border border-gray-100 p-5 shadow-sm">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Geographic Distribution</h3>
          <div className="h-64">
            <GeoDistChart data={geoDist} />
          </div>
        </div>
      </div>
    </div>
  );
}
