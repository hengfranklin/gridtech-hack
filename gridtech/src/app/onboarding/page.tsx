'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAppStore } from '@/lib/store';
import { getUtilityFromZip, isDACZip } from '@/data/zip-to-utility';
import { BoltIcon, ArrowLeftIcon, ArrowRightIcon, CheckIcon } from '@heroicons/react/24/outline';
import { UserType, BuildingType, OwnershipStatus } from '@/types/program';

const STEPS = ['User Type', 'Location', 'Building', 'Energy Profile', 'Income (Optional)'];

export default function OnboardingPage() {
  const router = useRouter();
  const { login, updateProfile, profile, setOnboardingStep, onboardingStep } = useAppStore();
  const [step, setStep] = useState(onboardingStep);

  // Local form state
  const [userType, setUserType] = useState<UserType>('resident');
  const [zipCode, setZipCode] = useState('');
  const [buildingType, setBuildingType] = useState<BuildingType>('single_family');
  const [ownershipStatus, setOwnershipStatus] = useState<OwnershipStatus>('owner');
  const [heatingFuel, setHeatingFuel] = useState<'gas' | 'oil' | 'electric' | 'steam'>('gas');
  const [buildingSqft, setBuildingSqft] = useState<number>(1500);
  const [buildingUnits, setBuildingUnits] = useState<number>(1);
  const [yearBuilt, setYearBuilt] = useState<number>(1980);
  const [hasEV, setHasEV] = useState(false);
  const [hasSmartMeter, setHasSmartMeter] = useState(false);
  const [hasCentralAC, setHasCentralAC] = useState(false);
  const [monthlyEnergyCost, setMonthlyEnergyCost] = useState(150);
  const [incomeRange, setIncomeRange] = useState<'low' | 'moderate' | 'middle' | 'high' | ''>('');

  const handleStart = () => {
    login(userType);
    setStep(1);
    setOnboardingStep(1);
  };

  const next = () => {
    const nextStep = step + 1;
    setStep(nextStep);
    setOnboardingStep(nextStep);
  };

  const back = () => {
    const prevStep = step - 1;
    setStep(prevStep);
    setOnboardingStep(prevStep);
  };

  const handleFinish = () => {
    const utilityInfo = getUtilityFromZip(zipCode);
    updateProfile({
      zip_code: zipCode,
      borough: utilityInfo?.borough,
      utility_provider: utilityInfo?.provider || 'con_edison',
      building_type: buildingType,
      ownership_status: ownershipStatus,
      heating_fuel: heatingFuel,
      building_sqft: buildingSqft,
      building_units: buildingUnits,
      year_built: yearBuilt,
      has_ev: hasEV,
      has_smart_meter: hasSmartMeter,
      has_central_ac: hasCentralAC,
      monthly_energy_cost: monthlyEnergyCost,
      income_range: incomeRange || undefined,
      dac_eligible: isDACZip(zipCode),
      onboarding_complete: true,
      display_name: userType === 'resident' ? 'NY Resident' : userType === 'building_owner' ? 'Building Owner' : 'Business User',
    });

    if (userType === 'admin') {
      router.push('/admin');
    } else if (userType === 'business' || userType === 'building_owner') {
      router.push('/business');
    } else {
      router.push('/dashboard');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-4 py-4">
        <div className="max-w-2xl mx-auto flex items-center gap-2">
          <BoltIcon className="h-7 w-7 text-emerald-600" />
          <span className="text-lg font-bold">Grid<span className="text-emerald-600">Claim</span></span>
        </div>
      </div>

      {/* Progress */}
      {step > 0 && (
        <div className="bg-white border-b border-gray-100 px-4 py-3">
          <div className="max-w-2xl mx-auto">
            <div className="flex items-center justify-between mb-2">
              {STEPS.map((s, i) => (
                <div key={s} className="flex items-center">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                    i + 1 < step ? 'bg-emerald-600 text-white' :
                    i + 1 === step ? 'bg-emerald-100 text-emerald-700 ring-2 ring-emerald-600' :
                    'bg-gray-100 text-gray-400'
                  }`}>
                    {i + 1 < step ? <CheckIcon className="h-4 w-4" /> : i + 1}
                  </div>
                  {i < STEPS.length - 1 && (
                    <div className={`hidden sm:block w-12 h-0.5 mx-1 ${i + 1 < step ? 'bg-emerald-600' : 'bg-gray-200'}`} />
                  )}
                </div>
              ))}
            </div>
            <p className="text-sm text-gray-500 text-center">Step {step} of {STEPS.length}: {STEPS[step - 1]}</p>
          </div>
        </div>
      )}

      {/* Content */}
      <div className="flex-1 flex items-start justify-center py-12 px-4">
        <div className="w-full max-w-2xl">
          {/* Step 0: User Type */}
          {step === 0 && (
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
              <h1 className="text-2xl font-bold text-gray-900">Welcome to GridClaim</h1>
              <p className="mt-2 text-gray-500">Let&apos;s find energy savings programs for you. First, tell us who you are.</p>

              <div className="mt-8 space-y-3">
                {([
                  { value: 'resident', label: 'Resident', desc: 'Homeowner or renter looking for personal energy savings' },
                  { value: 'building_owner', label: 'Building Owner / Manager', desc: 'Managing a multifamily building or property portfolio' },
                  { value: 'business', label: 'Business', desc: 'Commercial or industrial facility operator' },
                  { value: 'admin', label: 'Utility Administrator', desc: 'Utility program manager (admin dashboard)' },
                ] as const).map((opt) => (
                  <button
                    key={opt.value}
                    onClick={() => setUserType(opt.value)}
                    className={`w-full text-left p-4 rounded-xl border-2 transition ${
                      userType === opt.value
                        ? 'border-emerald-600 bg-emerald-50'
                        : 'border-gray-100 hover:border-gray-200'
                    }`}
                  >
                    <div className="font-semibold text-gray-900">{opt.label}</div>
                    <div className="text-sm text-gray-500">{opt.desc}</div>
                  </button>
                ))}
              </div>

              <button
                onClick={handleStart}
                className="mt-8 w-full bg-emerald-600 text-white py-3 rounded-xl font-semibold hover:bg-emerald-700 transition flex items-center justify-center gap-2"
              >
                Continue <ArrowRightIcon className="h-4 w-4" />
              </button>
            </div>
          )}

          {/* Step 1: Location */}
          {step === 1 && (
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
              <h2 className="text-2xl font-bold text-gray-900">Where are you located?</h2>
              <p className="mt-2 text-gray-500">Your zip code determines which utility programs are available to you.</p>

              <div className="mt-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">Zip Code</label>
                <input
                  type="text"
                  value={zipCode}
                  onChange={(e) => setZipCode(e.target.value.replace(/\D/g, '').slice(0, 5))}
                  placeholder="e.g., 10001"
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl text-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none"
                />
                {zipCode.length === 5 && (
                  <div className="mt-3 p-3 bg-emerald-50 rounded-lg text-sm">
                    <p className="font-medium text-emerald-800">
                      Utility: {getUtilityFromZip(zipCode)?.provider?.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase()) || 'Unknown'}
                    </p>
                    {getUtilityFromZip(zipCode)?.borough && (
                      <p className="text-emerald-700">Borough: {getUtilityFromZip(zipCode)?.borough}</p>
                    )}
                    {isDACZip(zipCode) && (
                      <p className="text-emerald-700 font-medium mt-1">You may qualify for enhanced Disadvantaged Community benefits!</p>
                    )}
                  </div>
                )}
              </div>

              <div className="mt-8 flex gap-3">
                <button onClick={back} className="px-6 py-3 border border-gray-200 rounded-xl text-gray-600 hover:bg-gray-50 transition flex items-center gap-2">
                  <ArrowLeftIcon className="h-4 w-4" /> Back
                </button>
                <button
                  onClick={next}
                  disabled={zipCode.length !== 5}
                  className="flex-1 bg-emerald-600 text-white py-3 rounded-xl font-semibold hover:bg-emerald-700 transition disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  Continue <ArrowRightIcon className="h-4 w-4" />
                </button>
              </div>
            </div>
          )}

          {/* Step 2: Building Info */}
          {step === 2 && (
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
              <h2 className="text-2xl font-bold text-gray-900">Tell us about your building</h2>
              <p className="mt-2 text-gray-500">This helps us match you with the right programs.</p>

              <div className="mt-6 space-y-5">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Building Type</label>
                  <select
                    value={buildingType}
                    onChange={(e) => setBuildingType(e.target.value as BuildingType)}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none"
                  >
                    <option value="single_family">Single Family Home</option>
                    <option value="multi_family">Multi-Family (2-4 units)</option>
                    <option value="coop_condo">Co-op / Condo</option>
                    <option value="commercial">Commercial Building</option>
                    <option value="industrial">Industrial Facility</option>
                    <option value="mixed_use">Mixed Use</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Ownership Status</label>
                  <div className="flex gap-3">
                    {(['owner', 'renter', 'manager'] as const).map((s) => (
                      <button
                        key={s}
                        onClick={() => setOwnershipStatus(s)}
                        className={`flex-1 py-3 rounded-xl border-2 font-medium capitalize transition ${
                          ownershipStatus === s ? 'border-emerald-600 bg-emerald-50 text-emerald-700' : 'border-gray-100 text-gray-600 hover:border-gray-200'
                        }`}
                      >
                        {s}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Approx. Square Footage</label>
                    <input
                      type="number"
                      value={buildingSqft}
                      onChange={(e) => setBuildingSqft(Number(e.target.value))}
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Year Built</label>
                    <input
                      type="number"
                      value={yearBuilt}
                      onChange={(e) => setYearBuilt(Number(e.target.value))}
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none"
                    />
                  </div>
                </div>

                {(buildingType === 'multi_family' || buildingType === 'mixed_use') && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Number of Units</label>
                    <input
                      type="number"
                      value={buildingUnits}
                      onChange={(e) => setBuildingUnits(Number(e.target.value))}
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none"
                    />
                  </div>
                )}

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Primary Heating Fuel</label>
                  <select
                    value={heatingFuel}
                    onChange={(e) => setHeatingFuel(e.target.value as typeof heatingFuel)}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none"
                  >
                    <option value="gas">Natural Gas</option>
                    <option value="oil">Oil</option>
                    <option value="electric">Electric</option>
                    <option value="steam">Steam</option>
                  </select>
                </div>
              </div>

              <div className="mt-8 flex gap-3">
                <button onClick={back} className="px-6 py-3 border border-gray-200 rounded-xl text-gray-600 hover:bg-gray-50 transition flex items-center gap-2">
                  <ArrowLeftIcon className="h-4 w-4" /> Back
                </button>
                <button onClick={next} className="flex-1 bg-emerald-600 text-white py-3 rounded-xl font-semibold hover:bg-emerald-700 transition flex items-center justify-center gap-2">
                  Continue <ArrowRightIcon className="h-4 w-4" />
                </button>
              </div>
            </div>
          )}

          {/* Step 3: Energy Profile */}
          {step === 3 && (
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
              <h2 className="text-2xl font-bold text-gray-900">Your Energy Profile</h2>
              <p className="mt-2 text-gray-500">A few more details to fine-tune your program matches.</p>

              <div className="mt-6 space-y-5">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Monthly Energy Cost: <span className="text-emerald-600 font-bold">${monthlyEnergyCost}</span>
                  </label>
                  <input
                    type="range"
                    min="50"
                    max="1000"
                    step="10"
                    value={monthlyEnergyCost}
                    onChange={(e) => setMonthlyEnergyCost(Number(e.target.value))}
                    className="w-full accent-emerald-600"
                  />
                  <div className="flex justify-between text-xs text-gray-400 mt-1">
                    <span>$50</span><span>$500</span><span>$1,000</span>
                  </div>
                </div>

                <div className="space-y-3">
                  <label className="block text-sm font-medium text-gray-700">Check all that apply:</label>
                  {[
                    { key: 'ev', label: 'I own an electric vehicle', checked: hasEV, set: setHasEV },
                    { key: 'meter', label: 'I have a smart meter', checked: hasSmartMeter, set: setHasSmartMeter },
                    { key: 'ac', label: 'I have central air conditioning', checked: hasCentralAC, set: setHasCentralAC },
                  ].map((item) => (
                    <label key={item.key} className="flex items-center gap-3 p-3 rounded-xl border border-gray-100 hover:bg-gray-50 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={item.checked}
                        onChange={(e) => item.set(e.target.checked)}
                        className="h-5 w-5 text-emerald-600 rounded border-gray-300 focus:ring-emerald-500"
                      />
                      <span className="text-gray-700">{item.label}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div className="mt-8 flex gap-3">
                <button onClick={back} className="px-6 py-3 border border-gray-200 rounded-xl text-gray-600 hover:bg-gray-50 transition flex items-center gap-2">
                  <ArrowLeftIcon className="h-4 w-4" /> Back
                </button>
                <button onClick={next} className="flex-1 bg-emerald-600 text-white py-3 rounded-xl font-semibold hover:bg-emerald-700 transition flex items-center justify-center gap-2">
                  Continue <ArrowRightIcon className="h-4 w-4" />
                </button>
              </div>
            </div>
          )}

          {/* Step 4: Income (Optional) */}
          {step === 4 && (
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
              <h2 className="text-2xl font-bold text-gray-900">Income Range (Optional)</h2>
              <p className="mt-2 text-gray-500">
                Some programs offer enhanced benefits for lower-income households. This is completely optional — skip if you prefer.
              </p>

              <div className="mt-6 space-y-3">
                {([
                  { value: 'low', label: 'Low Income', desc: 'Below 60% of Area Median Income' },
                  { value: 'moderate', label: 'Moderate Income', desc: '60–80% of Area Median Income' },
                  { value: 'middle', label: 'Middle Income', desc: '80–120% of Area Median Income' },
                  { value: 'high', label: 'Above Median', desc: 'Above 120% of Area Median Income' },
                ] as const).map((opt) => (
                  <button
                    key={opt.value}
                    onClick={() => setIncomeRange(incomeRange === opt.value ? '' : opt.value)}
                    className={`w-full text-left p-4 rounded-xl border-2 transition ${
                      incomeRange === opt.value
                        ? 'border-emerald-600 bg-emerald-50'
                        : 'border-gray-100 hover:border-gray-200'
                    }`}
                  >
                    <div className="font-semibold text-gray-900">{opt.label}</div>
                    <div className="text-sm text-gray-500">{opt.desc}</div>
                  </button>
                ))}
              </div>

              <div className="mt-8 flex gap-3">
                <button onClick={back} className="px-6 py-3 border border-gray-200 rounded-xl text-gray-600 hover:bg-gray-50 transition flex items-center gap-2">
                  <ArrowLeftIcon className="h-4 w-4" /> Back
                </button>
                <button
                  onClick={handleFinish}
                  className="flex-1 bg-emerald-600 text-white py-3 rounded-xl font-semibold hover:bg-emerald-700 transition flex items-center justify-center gap-2"
                >
                  {incomeRange ? 'See My Programs' : 'Skip & See My Programs'} <ArrowRightIcon className="h-4 w-4" />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
