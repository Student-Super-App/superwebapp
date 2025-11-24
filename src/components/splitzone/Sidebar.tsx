'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import {
  LayoutDashboard,
  Users,
  Receipt,
  DollarSign,
  User,
  Settings,
  ChevronRight,
} from 'lucide-react';

const navigation = [
  {
    name: 'Dashboard',
    href: '/splitzone',
    icon: LayoutDashboard,
  },
  {
    name: 'Groups',
    href: '/splitzone/groups',
    icon: Users,
    children: [
      { name: 'All Groups', href: '/splitzone/groups' },
      { name: 'Create Group', href: '/splitzone/groups/new' },
    ],
  },
  {
    name: 'Expenses',
    href: '/splitzone/expenses',
    icon: Receipt,
    children: [
      { name: 'All Expenses', href: '/splitzone/expenses' },
      { name: 'Add Expense', href: '/splitzone/expenses/new' },
    ],
  },
  {
    name: 'Settlements',
    href: '/splitzone/settlements',
    icon: DollarSign,
    children: [
      { name: 'All Settlements', href: '/splitzone/settlements' },
      { name: 'Record Payment', href: '/splitzone/settlements/new' },
    ],
  },
  {
    name: 'Profile',
    href: '/splitzone/profile',
    icon: User,
  },
  {
    name: 'Settings',
    href: '/splitzone/settings',
    icon: Settings,
  },
];

export function Sidebar() {
  const pathname = usePathname();

  const isActive = (href: string) => {
    if (href === '/splitzone') {
      return pathname === href;
    }
    return pathname.startsWith(href);
  };

  return (
    <aside className="w-64 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 h-full">
      <div className="p-6">
        <h2 className="text-2xl font-bold text-blue-600 dark:text-blue-400">SplitZone</h2>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Expense Management</p>
      </div>

      <nav className="px-3 space-y-1">
        {navigation.map((item) => {
          const isItemActive = isActive(item.href);
          const Icon = item.icon;

          return (
            <div key={item.name}>
              <Link
                href={item.href}
                className={cn(
                  'flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors',
                  isItemActive
                    ? 'bg-blue-50 text-blue-600 dark:bg-blue-950 dark:text-blue-400'
                    : 'text-slate-700 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800'
                )}
              >
                <Icon className="h-5 w-5" />
                <span className="flex-1">{item.name}</span>
                {item.children && (
                  <ChevronRight
                    className={cn('h-4 w-4 transition-transform', isItemActive && 'rotate-90')}
                  />
                )}
              </Link>

              {item.children && isItemActive && (
                <div className="ml-11 mt-1 space-y-1">
                  {item.children.map((child) => (
                    <Link
                      key={child.name}
                      href={child.href}
                      className={cn(
                        'block px-3 py-1.5 text-sm rounded-md transition-colors',
                        pathname === child.href
                          ? 'text-blue-600 bg-blue-50 dark:text-blue-400 dark:bg-blue-950'
                          : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50 dark:text-slate-400 dark:hover:text-slate-200 dark:hover:bg-slate-800'
                      )}
                    >
                      {child.name}
                    </Link>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </nav>

      <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-slate-200 dark:border-slate-800">
        <div className="text-xs text-slate-500 dark:text-slate-400">
          <p className="font-medium">Quick Actions</p>
          <div className="mt-2 space-y-1">
            <Link
              href="/splitzone/expenses/new"
              className="block text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
            >
              + Add Expense
            </Link>
            <Link
              href="/splitzone/settlements/new"
              className="block text-emerald-600 hover:text-emerald-700 dark:text-emerald-400 dark:hover:text-emerald-300"
            >
              + Record Payment
            </Link>
          </div>
        </div>
      </div>
    </aside>
  );
}
