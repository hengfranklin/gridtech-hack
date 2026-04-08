'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useAppStore } from '@/lib/store';
import { BoltIcon, HomeIcon, BuildingOfficeIcon, CalculatorIcon, ArrowRightOnRectangleIcon } from '@heroicons/react/24/outline';
import { cn } from '@/lib/utils';
import { useEffect } from 'react';

const navItems = [
  { href: '/business', label: 'Dashboard', icon: HomeIcon },
  { href: '/compliance', label: 'LL97 Compliance', icon: BuildingOfficeIcon },
  { href: '/roi-calculator', label: 'ROI Calculator', icon: CalculatorIcon },
];

export default function BusinessLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { profile, isAuthenticated, logout } = useAppStore();

  useEffect(() => {
    if (!isAuthenticated) router.push('/onboarding');
  }, [isAuthenticated, router]);

  if (!isAuthenticated) return null;

  return (
    <div className="flex h-screen bg-gray-50">
      <aside className="hidden md:flex md:flex-col w-64 bg-white border-r border-gray-200">
        <div className="p-4 border-b border-gray-100">
          <Link href="/business" className="flex items-center gap-2">
            <BoltIcon className="h-7 w-7 text-emerald-600" />
            <span className="text-lg font-bold">Grid<span className="text-emerald-600">Claim</span></span>
          </Link>
          <div className="mt-2 text-xs text-gray-400 font-medium uppercase tracking-wider">Business Portal</div>
        </div>
        <nav className="flex-1 p-3 space-y-1">
          {navItems.map((item) => {
            const active = pathname === item.href;
            return (
              <Link key={item.href} href={item.href}
                className={cn('flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition',
                  active ? 'bg-emerald-50 text-emerald-700' : 'text-gray-600 hover:bg-gray-50'
                )}>
                <item.icon className="h-5 w-5" />{item.label}
              </Link>
            );
          })}
        </nav>
        <div className="p-3 border-t border-gray-100">
          <button onClick={() => { logout(); router.push('/'); }}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-gray-600 hover:bg-gray-50 transition">
            <ArrowRightOnRectangleIcon className="h-5 w-5" /> Sign Out
          </button>
        </div>
      </aside>
      <main className="flex-1 overflow-y-auto">{children}</main>
    </div>
  );
}
