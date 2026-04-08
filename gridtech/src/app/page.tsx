'use client';

import Link from 'next/link';
import { BoltIcon, CurrencyDollarIcon, GlobeAltIcon, ChartBarIcon, ShieldCheckIcon, ClockIcon } from '@heroicons/react/24/outline';

const stats = [
  { label: 'Programs Available', value: '30+' },
  { label: 'Potential Annual Savings', value: '$5,000+' },
  { label: 'NY Households Eligible', value: '8M+' },
  { label: 'Programs Underutilized', value: '80%' },
];

const features = [
  {
    icon: BoltIcon,
    title: 'Instant Eligibility Check',
    description: 'Tell us about your home and we\'ll match you with every program you qualify for — in seconds.',
  },
  {
    icon: CurrencyDollarIcon,
    title: 'See Your Savings',
    description: 'Get a clear picture of how much you could save on energy bills, taxes, and home upgrades.',
  },
  {
    icon: ClockIcon,
    title: 'Simple Enrollment',
    description: 'Step-by-step guided enrollment. No jargon, no confusion. We walk you through every program.',
  },
  {
    icon: ShieldCheckIcon,
    title: 'Trusted Information',
    description: 'All program data comes directly from NYSERDA, Con Edison, and official utility sources.',
  },
  {
    icon: ChartBarIcon,
    title: 'Track Your Impact',
    description: 'Monitor your energy savings, cost reduction, and carbon footprint over time.',
  },
  {
    icon: GlobeAltIcon,
    title: 'Personalized Recommendations',
    description: 'Get smart suggestions based on your location, building type, and energy profile.',
  },
];

const steps = [
  { num: '1', title: 'Tell Us About Yourself', desc: 'Zip code, building type, energy usage — takes 2 minutes' },
  { num: '2', title: 'See Your Programs', desc: 'We match you with every program you\'re eligible for' },
  { num: '3', title: 'Enroll & Save', desc: 'Follow our guided enrollment and start saving' },
];

export default function HomePage() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Nav */}
      <nav className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <BoltIcon className="h-8 w-8 text-emerald-600" />
            <span className="text-xl font-bold text-gray-900">Grid<span className="text-emerald-600">Claim</span></span>
          </div>
          <div className="flex items-center gap-4">
            <Link href="/onboarding" className="text-sm font-medium text-gray-600 hover:text-gray-900">
              Log In
            </Link>
            <Link
              href="/onboarding"
              className="bg-emerald-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-emerald-700 transition"
            >
              Get Started Free
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="bg-gradient-to-br from-emerald-600 via-emerald-700 to-teal-800 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-28">
          <div className="max-w-3xl">
            <h1 className="text-4xl lg:text-6xl font-bold leading-tight">
              Discover energy programs you&apos;re already eligible for
            </h1>
            <p className="mt-6 text-lg lg:text-xl text-emerald-100 leading-relaxed">
              New York has over 30 energy savings programs — most people don&apos;t know they qualify.
              GridClaim matches you with programs, guides you through enrollment, and tracks your savings.
            </p>
            <div className="mt-10 flex flex-col sm:flex-row gap-4">
              <Link
                href="/onboarding"
                className="inline-flex items-center justify-center px-8 py-4 bg-white text-emerald-700 rounded-xl text-lg font-semibold hover:bg-emerald-50 transition shadow-lg"
              >
                Check My Eligibility
              </Link>
              <a
                href="#how-it-works"
                className="inline-flex items-center justify-center px-8 py-4 border-2 border-emerald-300 text-white rounded-xl text-lg font-semibold hover:bg-emerald-600 transition"
              >
                How It Works
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Stats bar */}
      <section className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((stat) => (
              <div key={stat.label} className="text-center">
                <div className="text-3xl font-bold text-emerald-600">{stat.value}</div>
                <div className="text-sm text-gray-500 mt-1">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section id="how-it-works" className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center text-gray-900">How It Works</h2>
          <p className="mt-4 text-lg text-gray-500 text-center max-w-2xl mx-auto">
            Three simple steps to start saving on your energy costs
          </p>
          <div className="mt-16 grid md:grid-cols-3 gap-8">
            {steps.map((step) => (
              <div key={step.num} className="relative bg-white rounded-2xl p-8 shadow-sm border border-gray-100">
                <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center text-xl font-bold">
                  {step.num}
                </div>
                <h3 className="mt-4 text-xl font-semibold text-gray-900">{step.title}</h3>
                <p className="mt-2 text-gray-500">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center text-gray-900">Everything You Need</h2>
          <p className="mt-4 text-lg text-gray-500 text-center max-w-2xl mx-auto">
            From discovery to enrollment to savings tracking — all in one place
          </p>
          <div className="mt-16 grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature) => (
              <div key={feature.title} className="p-6 rounded-xl border border-gray-100 hover:border-emerald-200 hover:shadow-md transition">
                <feature.icon className="h-10 w-10 text-emerald-600" />
                <h3 className="mt-4 text-lg font-semibold text-gray-900">{feature.title}</h3>
                <p className="mt-2 text-gray-500">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Program types */}
      <section className="py-20 bg-emerald-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center text-gray-900">Programs We Cover</h2>
          <div className="mt-12 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {[
              'SmartCharge NY', 'Con Edison DR', 'NYSERDA EmPower+', 'Clean Heat',
              'IRA Tax Credits', 'NY-Sun Solar', 'Battery Storage', 'HEAP',
              'Energy Affordability', 'LL97 Compliance', 'PACE Financing', 'NYC Accelerator',
            ].map((name) => (
              <div key={name} className="bg-white rounded-lg px-4 py-3 text-center text-sm font-medium text-gray-700 shadow-sm border border-emerald-100">
                {name}
              </div>
            ))}
          </div>
          <p className="mt-8 text-center text-gray-500">
            ...and 20+ more programs across all NY utilities
          </p>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-gradient-to-r from-emerald-600 to-teal-700 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl lg:text-4xl font-bold">Ready to start saving?</h2>
          <p className="mt-4 text-lg text-emerald-100">
            It takes less than 2 minutes to check your eligibility. No account required.
          </p>
          <Link
            href="/onboarding"
            className="mt-8 inline-flex items-center justify-center px-10 py-4 bg-white text-emerald-700 rounded-xl text-lg font-semibold hover:bg-emerald-50 transition shadow-lg"
          >
            Check My Eligibility Now
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-400 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-2 mb-6">
            <BoltIcon className="h-6 w-6 text-emerald-500" />
            <span className="text-lg font-bold text-white">Grid<span className="text-emerald-500">Claim</span></span>
          </div>
          <p className="text-sm max-w-md">
            Helping New Yorkers discover and enroll in energy savings programs.
            Built for the Cross-Columbia GridTech Hackathon.
          </p>
          <div className="mt-6 text-sm">
            Data sourced from NYSERDA, Con Edison, National Grid, PSEG Long Island, and other NY utilities.
          </div>
        </div>
      </footer>
    </div>
  );
}
