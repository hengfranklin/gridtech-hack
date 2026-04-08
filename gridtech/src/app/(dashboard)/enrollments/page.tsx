'use client';

import { useAppStore } from '@/lib/store';
import { programs } from '@/data/programs';
import { getCategoryLabel, getCategoryColor, formatCurrency, getProviderLabel } from '@/lib/utils';
import { ClipboardDocumentListIcon, CheckCircleIcon, ClockIcon, ArrowPathIcon } from '@heroicons/react/24/outline';
import Link from 'next/link';

const STATUS_CONFIG: Record<string, { label: string; color: string; icon: typeof CheckCircleIcon }> = {
  interested: { label: 'Interested', color: 'bg-gray-100 text-gray-600', icon: ClipboardDocumentListIcon },
  in_progress: { label: 'In Progress', color: 'bg-blue-100 text-blue-700', icon: ArrowPathIcon },
  submitted: { label: 'Submitted', color: 'bg-amber-100 text-amber-700', icon: ClockIcon },
  approved: { label: 'Approved', color: 'bg-emerald-100 text-emerald-700', icon: CheckCircleIcon },
  active: { label: 'Active', color: 'bg-emerald-100 text-emerald-700', icon: CheckCircleIcon },
  rejected: { label: 'Rejected', color: 'bg-red-100 text-red-700', icon: ClipboardDocumentListIcon },
};

export default function EnrollmentsPage() {
  const { enrollments } = useAppStore();

  return (
    <div className="p-6 lg:p-8 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold text-gray-900 mb-2">My Enrollments</h1>
      <p className="text-gray-500 mb-8">Track your program enrollment progress</p>

      {enrollments.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-2xl border border-gray-100">
          <ClipboardDocumentListIcon className="h-12 w-12 text-gray-300 mx-auto mb-4" />
          <p className="text-lg font-medium text-gray-500">No enrollments yet</p>
          <p className="text-gray-400 mt-2">Browse programs to find ones you qualify for</p>
          <Link
            href="/programs"
            className="mt-6 inline-flex px-6 py-2.5 bg-emerald-600 text-white rounded-xl font-medium hover:bg-emerald-700 transition"
          >
            Browse Programs
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {enrollments.map((enrollment) => {
            const program = programs.find((p) => p.id === enrollment.program_id);
            if (!program) return null;
            const statusConfig = STATUS_CONFIG[enrollment.status];
            const progress = enrollment.total_steps > 0
              ? Math.round((enrollment.current_step / enrollment.total_steps) * 100)
              : 0;

            return (
              <Link
                key={enrollment.id}
                href={`/programs/${program.id}`}
                className="block bg-white rounded-xl border border-gray-100 p-5 shadow-sm hover:border-emerald-200 hover:shadow-md transition"
              >
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${getCategoryColor(program.category)}`}>
                        {getCategoryLabel(program.category)}
                      </span>
                      <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${statusConfig.color}`}>
                        {statusConfig.label}
                      </span>
                    </div>
                    <h3 className="font-semibold text-gray-900">{program.name}</h3>
                    <p className="text-sm text-gray-500">{getProviderLabel(program.provider)}</p>
                  </div>
                  {program.savings_estimate_annual > 0 && (
                    <span className="text-emerald-600 font-bold text-sm">{formatCurrency(program.savings_estimate_annual)}/yr</span>
                  )}
                </div>

                {/* Progress bar */}
                <div className="mt-3">
                  <div className="flex items-center justify-between text-xs text-gray-500 mb-1">
                    <span>Step {enrollment.current_step} of {enrollment.total_steps}</span>
                    <span>{progress}%</span>
                  </div>
                  <div className="w-full bg-gray-100 rounded-full h-2">
                    <div
                      className="bg-emerald-500 h-2 rounded-full transition-all"
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
