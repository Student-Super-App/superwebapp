'use client';

import { AuthGuard } from '@/components/AuthGuard';
import { Header } from '@/components/common/Header';
import { Sidebar } from '@/components/common/Sidebar';
import { Button } from '@/components/ui/button';
import { EmptyState } from '@/components/common/EmptyState';
import Link from 'next/link';

export default function RentplacePage() {
  const properties = []; // This will be populated with React Query

  return (
    <AuthGuard>
      <div className="flex flex-col h-screen overflow-hidden">
        <Header />
        <div className="flex flex-1 overflow-hidden">
          <Sidebar />
          <main className="flex-1 overflow-y-auto bg-gray-50 dark:bg-gray-900">
            <div className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">
              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-6 sm:mb-8 gap-4">
                <div>
                  <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-gray-100">Rentplace</h1>
                  <p className="text-gray-600 dark:text-gray-400 mt-2">
                    Find or list accommodation near campus
                  </p>
                </div>
                <Link href="/rentplace/add">
                  <Button className="w-full sm:w-auto">Add Property</Button>
                </Link>
              </div>

              {properties.length === 0 ? (
                <EmptyState
                  title="No properties available"
                  description="Be the first to list a property or check back later"
                  icon={<div className="text-6xl">🏠</div>}
                  action={
                    <Link href="/rentplace/add">
                      <Button>List Your Property</Button>
                    </Link>
                  }
                />
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                  {/* Properties will be mapped here */}
                </div>
              )}
            </div>
          </main>
        </div>
      </div>
    </AuthGuard>
  );
}
