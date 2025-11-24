'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import {
  LayoutDashboard,
  ShoppingBag,
  Printer,
  Home,
  User,
  Settings,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  DollarSign,
} from 'lucide-react';
import { Button } from '@/components/ui/button';

const navigation = [
  {
    name: 'Dashboard',
    href: '/dashboard',
    icon: LayoutDashboard,
    color: 'text-blue-600 dark:text-blue-400',
  },
  {
    name: 'Marketplace',
    href: '/marketplace',
    icon: ShoppingBag,
    color: 'text-purple-600 dark:text-purple-400',
  },
  {
    name: 'SplitZone',
    href: '/splitzone',
    icon: DollarSign,
    color: 'text-emerald-600 dark:text-emerald-400',
  },
  {
    name: 'Printing',
    href: '/printing',
    icon: Printer,
    color: 'text-green-600 dark:text-green-400',
  },
  {
    name: 'Rentplace',
    href: '/rentplace',
    icon: Home,
    color: 'text-orange-600 dark:text-orange-400',
  },
];

const secondaryNavigation = [
  { name: 'Profile', href: '/profile', icon: User },
  { name: 'Settings', href: '/settings', icon: Settings },
];

export const Sidebar = () => {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);

  return (
    <aside
      className={cn(
        'hidden md:flex md:flex-col bg-gradient-to-b from-white to-gray-50 dark:from-gray-800 dark:to-gray-900 border-r border-gray-200 dark:border-gray-700 transition-all duration-300 flex-shrink-0 shadow-sm',
        collapsed ? 'w-16' : 'w-64'
      )}
    >
      <div className="flex flex-col h-full">
        {/* Header Section */}
        {!collapsed && (
          <div className="px-4 pt-5 pb-3">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-white" />
              </div>
              <div>
                <h2 className="text-sm font-bold text-gray-900 dark:text-white">Student Hub</h2>
                <p className="text-xs text-gray-500 dark:text-gray-400">Super App</p>
              </div>
            </div>
          </div>
        )}

        {/* Collapse/Expand Button */}
        <div className={cn('px-3 pb-3', collapsed ? 'flex justify-center' : 'flex justify-end')}>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setCollapsed(!collapsed)}
            className="h-8 w-8 hover:bg-gray-200 dark:hover:bg-gray-700"
          >
            {collapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
          </Button>
        </div>

        {/* Main Navigation */}
        <nav className="flex-1 px-3 space-y-1 overflow-y-auto">
          {!collapsed && (
            <div className="px-3 mb-2">
              <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Services
              </p>
            </div>
          )}

          {navigation.map((item) => {
            const isActive = pathname.startsWith(item.href);
            const Icon = item.icon;
            return (
              <Link
                key={item.name}
                href={item.href}
                className={cn(
                  'group flex items-center px-3 py-2.5 text-sm font-medium rounded-lg transition-all duration-200',
                  isActive
                    ? 'bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/30 dark:to-purple-900/30 text-gray-900 dark:text-white shadow-sm border border-blue-100 dark:border-blue-800'
                    : 'text-gray-700 dark:text-gray-300 hover:bg-white dark:hover:bg-gray-800 hover:shadow-sm',
                  collapsed && 'justify-center px-2'
                )}
                title={collapsed ? item.name : undefined}
              >
                <Icon
                  className={cn(
                    'h-5 w-5 flex-shrink-0 transition-colors',
                    isActive
                      ? item.color
                      : 'text-gray-500 dark:text-gray-400 group-hover:text-gray-700 dark:group-hover:text-gray-300',
                    !collapsed && 'mr-3'
                  )}
                />
                {!collapsed && <span className="flex-1">{item.name}</span>}
                {!collapsed && isActive && (
                  <div className="ml-auto">
                    <div className="h-2 w-2 rounded-full bg-gradient-to-r from-blue-500 to-purple-500"></div>
                  </div>
                )}
              </Link>
            );
          })}

          {/* Divider */}
          <div className="py-3">
            <div
              className={cn(
                'border-t border-gray-200 dark:border-gray-700',
                collapsed ? 'mx-2' : 'mx-3'
              )}
            ></div>
          </div>

          {!collapsed && (
            <div className="px-3 mb-2">
              <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Account
              </p>
            </div>
          )}

          {/* Secondary Navigation */}
          {secondaryNavigation.map((item) => {
            const isActive = pathname.startsWith(item.href);
            const Icon = item.icon;
            return (
              <Link
                key={item.name}
                href={item.href}
                className={cn(
                  'group flex items-center px-3 py-2.5 text-sm font-medium rounded-lg transition-all duration-200',
                  isActive
                    ? 'bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white'
                    : 'text-gray-700 dark:text-gray-300 hover:bg-white dark:hover:bg-gray-800 hover:shadow-sm',
                  collapsed && 'justify-center px-2'
                )}
                title={collapsed ? item.name : undefined}
              >
                <Icon
                  className={cn(
                    'h-5 w-5 flex-shrink-0 text-gray-500 dark:text-gray-400 group-hover:text-gray-700 dark:group-hover:text-gray-300',
                    !collapsed && 'mr-3'
                  )}
                />
                {!collapsed && <span>{item.name}</span>}
              </Link>
            );
          })}
        </nav>

        {/* Footer - Quick Stats or Info */}
        {!collapsed && (
          <div className="px-3 py-4 border-t border-gray-200 dark:border-gray-700">
            <div className="bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-lg p-3 border border-blue-100 dark:border-blue-800">
              <div className="flex items-center space-x-2 mb-1">
                <Sparkles className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                <p className="text-xs font-semibold text-gray-900 dark:text-white">Pro Tip</p>
              </div>
              <p className="text-xs text-gray-600 dark:text-gray-400">
                Use keyboard shortcuts to navigate faster!
              </p>
            </div>
          </div>
        )}
      </div>
    </aside>
  );
};
