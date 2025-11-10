'use client';

import { AuthGuard } from '@/components/AuthGuard';
import { Header } from '@/components/common/Header';
import { Sidebar } from '@/components/common/Sidebar';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import Link from 'next/link';
import { useAppSelector } from '@/store/hooks';

export default function DashboardPage() {
  const { user } = useAppSelector((state) => state.auth);

  const services = [
    {
      title: 'Marketplace',
      description: 'Buy and sell items with other students',
      icon: '🛒',
      href: '/marketplace',
      color: 'bg-blue-50',
    },
    {
      title: 'Printing',
      description: 'Print your documents quickly and easily',
      icon: '🖨️',
      href: '/printing',
      color: 'bg-green-50',
    },
    {
      title: 'Rentplace',
      description: 'Find or list accommodation near campus',
      icon: '🏠',
      href: '/rentplace',
      color: 'bg-purple-50',
    },
  ];

  return (
    <AuthGuard>
      <div className="flex flex-col h-screen overflow-hidden">
        <Header />
        <div className="flex flex-1 overflow-hidden">
          <Sidebar />
          <main className="flex-1 overflow-y-auto bg-gray-50 dark:bg-gray-900">
            <div className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">
              <div className="mb-8">
                <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-gray-100">
                  Welcome back, {user?.firstName}!
                </h1>
                <p className="text-gray-600 dark:text-gray-400 mt-2">
                  Access all student services from your dashboard
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                {services.map((service) => (
                  <Link key={service.title} href={service.href}>
                    <Card className="hover:shadow-lg transition-shadow cursor-pointer h-full dark:bg-gray-800 dark:border-gray-700">
                      <CardHeader className={`${service.color} rounded-t-lg dark:bg-opacity-20`}>
                        <div className="text-4xl mb-2">{service.icon}</div>
                        <CardTitle className="dark:text-gray-100">{service.title}</CardTitle>
                        <CardDescription className="dark:text-gray-400">{service.description}</CardDescription>
                      </CardHeader>
                      <CardContent className="pt-4">
                        <span className="text-sm text-blue-600 dark:text-blue-400 font-medium">
                          Explore →
                        </span>
                      </CardContent>
                    </Card>
                  </Link>
                ))}
              </div>

              <div className="mt-8 sm:mt-12 grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
                <Card className="dark:bg-gray-800 dark:border-gray-700">
                  <CardHeader>
                    <CardTitle className="text-lg dark:text-gray-100">Quick Stats</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600 dark:text-gray-400">Active Listings</span>
                        <span className="font-semibold dark:text-gray-100">0</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600 dark:text-gray-400">Print Orders</span>
                        <span className="font-semibold dark:text-gray-100">0</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600 dark:text-gray-400">Saved Properties</span>
                        <span className="font-semibold dark:text-gray-100">0</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="dark:bg-gray-800 dark:border-gray-700">
                  <CardHeader>
                    <CardTitle className="text-lg dark:text-gray-100">Recent Activity</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-gray-500 dark:text-gray-400">No recent activity</p>
                  </CardContent>
                </Card>

                <Card className="dark:bg-gray-800 dark:border-gray-700">
                  <CardHeader>
                    <CardTitle className="text-lg dark:text-gray-100">Profile</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <div className="text-sm">
                        <span className="text-gray-600 dark:text-gray-400">Email: </span>
                        <span className="font-medium dark:text-gray-100">{user?.email}</span>
                      </div>
                      <div className="text-sm">
                        <span className="text-gray-600 dark:text-gray-400">Status: </span>
                        <span className={`font-medium ${user?.isEmailVerified ? 'text-green-600 dark:text-green-400' : 'text-yellow-600 dark:text-yellow-400'}`}>
                          {user?.isEmailVerified ? 'Verified' : 'Unverified'}
                        </span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </main>
        </div>
      </div>
    </AuthGuard>
  );
}
