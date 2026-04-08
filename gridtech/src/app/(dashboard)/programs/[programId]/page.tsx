'use client';

import { useParams, useRouter } from 'next/navigation';
import { useAppStore } from '@/lib/store';
import { programs } from '@/data/programs';
import { checkEligibility } from '@/lib/eligibility/engine';
import { formatCurrency, getCategoryLabel, getCategoryColor, getProviderLabel } from '@/lib/utils';
import { ArrowLeftIcon, CheckCircleIcon, XCircleIcon, ArrowTopRightOnSquareIcon, ClockIcon } from '@heroicons/react/24/outline';
import Link from 'next/link';
import { useMemo, useState } from 'react';
import { Enrollment } from '@/types/enrollment';

export default function ProgramDetailPage() {
  const { programId } = useParams();
  const router = useRouter();
  const { profile, enrollments, addEnrollment, updateEnrollment } = useAppStore();

  const program = programs.find((p) => p.id === programId);
  const enrollment = enrollments.find((e) => e.program_id === programId);
  const [currentStep, setCurrentStep] = useState(enrollment?.current_step || 0);
  const [enrolling, setEnrolling] = useState(false);

  const eligibility = useMemo(() => {
    if (!profile || !program) return null;
    return checkEligibility(profile, program);
  }, [profile, program]);

  if (!program || !profile || !eligibility) {
    return (
      <div className="p-8 text-center text-gray-500">
        <p>Program not found</p>
        <Link href="/programs" className="text-emerald-600 mt-2 inline-block">Back to Programs</Link>
      </div>
    );
  }

  const handleStartEnrollment = () => {
    const newEnrollment: Enrollment = {
      id: crypto.randomUUID(),
      user_id: profile.id,
      program_id: program.id,
      status: 'in_progress',
      current_step: 0,
      total_steps: program.enrollment_steps.length,
      documents_submitted: [],
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    addEnrollment(newEnrollment);
    setEnrolling(true);
  };

  const handleCompleteStep = () => {
    const nextStep = currentStep + 1;
    setCurrentStep(nextStep);
    if (enrollment) {
      updateEnrollment(enrollment.id, {
        current_step: nextStep,
        status: nextStep >= program.enrollment_steps.length ? 'submitted' : 'in_progress',
        updated_at: new Date().toISOString(),
      });
    }
  };

  return (
    <div className="p-6 lg:p-8 max-w-4xl mx-auto">
      {/* Back */}
      <button
        onClick={() => router.push('/programs')}
        className="flex items-center gap-2 text-sm text-gray-500 hover:text-gray-900 mb-6"
      >
        <ArrowLeftIcon className="h-4 w-4" /> Back to Programs
      </button>

      {/* Header */}
      <div className="bg-white rounded-2xl border border-gray-100 p-6 lg:p-8 shadow-sm mb-6">
        <div className="flex flex-wrap items-start gap-3 mb-4">
          <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${getCategoryColor(program.category)}`}>
            {getCategoryLabel(program.category)}
          </span>
          <span className="text-xs font-medium px-2.5 py-1 rounded-full bg-gray-100 text-gray-600">
            {getProviderLabel(program.provider)}
          </span>
          {program.enrollment_deadline && (
            <span className="text-xs font-medium px-2.5 py-1 rounded-full bg-red-100 text-red-700 flex items-center gap-1">
              <ClockIcon className="h-3 w-3" />
              Deadline: {new Date(program.enrollment_deadline).toLocaleDateString()}
            </span>
          )}
        </div>

        <h1 className="text-2xl lg:text-3xl font-bold text-gray-900">{program.name}</h1>
        <p className="mt-3 text-gray-600 leading-relaxed">{program.description}</p>

        {program.savings_estimate_annual > 0 && (
          <div className="mt-6 p-4 bg-emerald-50 rounded-xl">
            <div className="text-sm text-emerald-700 font-medium">Estimated Annual Savings</div>
            <div className="text-3xl font-bold text-emerald-700">{formatCurrency(program.savings_estimate_annual)}</div>
            <div className="text-sm text-emerald-600 mt-1 capitalize">{program.savings_type.replace(/_/g, ' ')}</div>
          </div>
        )}
      </div>

      {/* Eligibility */}
      <div className="bg-white rounded-2xl border border-gray-100 p-6 lg:p-8 shadow-sm mb-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">
          {eligibility.eligible ? (
            <span className="flex items-center gap-2 text-emerald-700">
              <CheckCircleIcon className="h-6 w-6" /> You&apos;re Eligible!
            </span>
          ) : (
            <span className="flex items-center gap-2 text-amber-700">
              <XCircleIcon className="h-6 w-6" /> Not Yet Eligible
            </span>
          )}
        </h2>

        {eligibility.reasons.length > 0 && (
          <div className="space-y-2 mb-4">
            {eligibility.reasons.map((reason, i) => (
              <div key={i} className="flex items-center gap-2 text-sm text-emerald-700">
                <CheckCircleIcon className="h-4 w-4 flex-shrink-0" />
                {reason}
              </div>
            ))}
          </div>
        )}

        {eligibility.missingRequirements.length > 0 && (
          <div className="space-y-2">
            {eligibility.missingRequirements.map((req, i) => (
              <div key={i} className="flex items-center gap-2 text-sm text-red-600">
                <XCircleIcon className="h-4 w-4 flex-shrink-0" />
                {req}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Enrollment */}
      {eligibility.eligible && (
        <div className="bg-white rounded-2xl border border-gray-100 p-6 lg:p-8 shadow-sm mb-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Enrollment Steps</h2>

          {!enrollment && !enrolling ? (
            <button
              onClick={handleStartEnrollment}
              className="w-full bg-emerald-600 text-white py-3 rounded-xl font-semibold hover:bg-emerald-700 transition"
            >
              Start Enrollment
            </button>
          ) : (
            <div className="space-y-4">
              {program.enrollment_steps.map((step, i) => {
                const completed = i < currentStep;
                const active = i === currentStep;
                return (
                  <div
                    key={i}
                    className={`p-4 rounded-xl border-2 ${
                      completed ? 'border-emerald-200 bg-emerald-50' :
                      active ? 'border-emerald-600 bg-white' :
                      'border-gray-100 bg-gray-50 opacity-50'
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <div className={`mt-0.5 w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                        completed ? 'bg-emerald-600 text-white' : active ? 'bg-emerald-100 text-emerald-700' : 'bg-gray-200 text-gray-400'
                      }`}>
                        {completed ? <CheckCircleIcon className="h-4 w-4" /> : i + 1}
                      </div>
                      <div className="flex-1">
                        <div className="font-semibold text-gray-900">{step.title}</div>
                        <p className="text-sm text-gray-500 mt-1">{step.description}</p>
                        {active && step.url && (
                          <a
                            href={step.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 mt-2 text-sm text-emerald-600 font-medium hover:underline"
                          >
                            Open Link <ArrowTopRightOnSquareIcon className="h-4 w-4" />
                          </a>
                        )}
                        {active && (
                          <button
                            onClick={handleCompleteStep}
                            className="mt-3 px-4 py-2 bg-emerald-600 text-white rounded-lg text-sm font-medium hover:bg-emerald-700 transition"
                          >
                            {i === program.enrollment_steps.length - 1 ? 'Submit Enrollment' : 'Mark Complete'}
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}

              {currentStep >= program.enrollment_steps.length && (
                <div className="p-4 bg-emerald-100 rounded-xl text-center">
                  <CheckCircleIcon className="h-8 w-8 text-emerald-600 mx-auto mb-2" />
                  <p className="font-semibold text-emerald-800">Enrollment Submitted!</p>
                  <p className="text-sm text-emerald-700 mt-1">You&apos;ll receive confirmation once your enrollment is processed.</p>
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* Required Documents */}
      {program.required_documents.length > 0 && (
        <div className="bg-white rounded-2xl border border-gray-100 p-6 lg:p-8 shadow-sm">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Required Documents</h2>
          <ul className="space-y-2">
            {program.required_documents.map((doc, i) => (
              <li key={i} className="flex items-center gap-2 text-sm text-gray-600">
                <div className="w-1.5 h-1.5 rounded-full bg-gray-400" />
                {doc}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
