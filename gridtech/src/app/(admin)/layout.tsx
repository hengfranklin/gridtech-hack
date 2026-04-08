'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useAppStore } from '@/lib/store';
import { BoltIcon, HomeIcon, ChartBarIcon, MegaphoneIcon, ClipboardDocumentListIcon, ArrowRightOnRectangleIcon } from '@heroicons/react/24/outline';
import { cn } from '@/lib/utils';
import { useEffect } from 'react';

const navItems = [
  { href: '/admin', label: 'Overview', icon: HomeIcon },
  { href: '/admin/programs', label: 'Programs', icon: ClipboardDocumentListIcon },
  { href: '/admin/analytics', label: 'Analytics', icon: ChartBarIcon },
  { href: '/admin/targeting', label: 'Targeting', icon: MegaphoneIcon },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { isAuthenticated, logout } = useAppStore();

  useEffect(() => {
    if (!isAuthenticated) router.push('/onboarding');
  }, [isAuthenticated, router]);

  if (!isAuthenticated) return null;

  return (
    <div className="flex h-screen bg-gray-50">
      <aside className="hidden md:flex md:flex-col w-64 bg-gray-900 text-white">
        <div className="p-4 border-b border-gray-800">
          <Link href="/admin" className="flex items-center gap-2">
            <BoltIcon className="h-7 w-7 text-emerald-400" />
            <span className="text-lg font-bold">Grid<span className="text-emerald-400">Claim</span></span>
          </Link>
          <div className="mt-2 text-xs text-gray-500 font-medium uppercase tracking-wider">Utility Admin</div>
        </div>
        <nav className="flex-1 p-3 space-y-1">
          {navItems.map((item) => {
            const active = pathname === item.href;
            return (
              <Link key={item.href} href={item.href}
                className={cn('flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition',
                  active ? 'bg-gray-800 text-emerald-400' : 'text-gray-400 hover:bg-gray-800 hover:text-white'
                )}>
                <item.icon className="h-5 w-5" />{item.label}
              </Link>
            );
          })}
        </nav>
        <div className="p-3 border-t border-gray-800">
          <button onClick={() => { logout(); router.push('/'); }}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-gray-400 hover:bg-gray-800 hover:text-white transition">
            <ArrowRightOnRectangleIcon className="h-5 w-5" /> Sign Out
          </button>
        </div>
      </aside>
      <main className="flex-1 overflow-y-auto">{children}</main>
    </div>
  );
}
