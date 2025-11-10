'use client';

import { useState } from 'react';
import { Header } from '@/components/common/Header';
import { Sidebar } from '@/components/common/Sidebar';
import { Button } from '@/components/ui/button';
import { ProductCard } from '@/components/marketplace/ProductCard';
import { ProductFilters } from '@/components/marketplace/ProductFilters';
import { EmptyState } from '@/components/common/EmptyState';
import { useProducts } from '@/features/marketplace/hooks';
import { ProductFilters as Filters } from '@/types/marketplace';
import { Plus, TrendingUp, Package } from 'lucide-react';
import Link from 'next/link';
import { useAppSelector } from '@/store/hooks';

export const dynamic = 'force-dynamic';

export default function MarketplacePage() {
  const { user } = useAppSelector((state) => state.auth);
  const [filters, setFilters] = useState<Filters>({
    page: 1,
    limit: 12,
    sortBy: 'createdAt',
    sortOrder: 'desc',
  });

  const { data, isLoading, error } = useProducts(filters);
  const products = data?.data || [];
  const pagination = data?.pagination;

  const handleFiltersChange = (newFilters: Filters) => {
    setFilters({ ...newFilters, page: 1 }); // Reset to page 1 when filters change
  };

  const handleClearFilters = () => {
    setFilters({
      page: 1,
      limit: 12,
      sortBy: 'createdAt',
      sortOrder: 'desc',
    });
  };

  const handlePageChange = (newPage: number) => {
    setFilters({ ...filters, page: newPage });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="flex flex-col h-screen overflow-hidden">
      <Header />
      <div className="flex flex-1 overflow-hidden">
        <Sidebar />
        <main className="flex-1 overflow-y-auto bg-gray-50 dark:bg-gray-900">
          <div className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">
            {/* Header Section */}
            <div className="mb-6">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                  <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-gray-100 flex items-center gap-2">
                    <Package className="w-8 h-8 text-blue-600 dark:text-blue-400" />
                    Student Marketplace
                  </h1>
                  <p className="text-gray-600 dark:text-gray-400 mt-1">
                    Buy and sell items with other students
                  </p>
                </div>
                {user && (
                  <Link href="/marketplace/create">
                    <Button className="w-full sm:w-auto bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
                      <Plus className="w-4 h-4 mr-2" />
                      List Item
                    </Button>
                  </Link>
                )}
              </div>

              {/* Stats Bar */}
              {pagination && (
                <div className="mt-4 p-4 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 flex items-center justify-between">
                  <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                    <TrendingUp className="w-4 h-4" />
                    <span>
                      Showing {products.length} of {pagination.total} products
                    </span>
                  </div>
                  {pagination.pages > 1 && (
                    <span className="text-sm text-gray-500 dark:text-gray-400">
                      Page {pagination.page} of {pagination.pages}
                    </span>
                  )}
                </div>
              )}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
              {/* Filters Sidebar */}
              <div className="lg:col-span-1">
                <ProductFilters
                  filters={filters}
                  onFiltersChange={handleFiltersChange}
                  onClear={handleClearFilters}
                  className="sticky top-4"
                />
              </div>

              {/* Products Grid */}
              <div className="lg:col-span-3">
                {isLoading ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6">
                    {[...Array(6)].map((_, i) => (
                      <div
                        key={i}
                        className="h-96 bg-gray-200 dark:bg-gray-700 rounded-lg animate-pulse"
                      />
                    ))}
                  </div>
                ) : error ? (
                  <div className="text-center py-12">
                    <p className="text-red-600 dark:text-red-400">
                      Failed to load products. Please try again later.
                    </p>
                  </div>
                ) : products.length === 0 ? (
                  <EmptyState
                    title="No products found"
                    description="Try adjusting your filters or check back later for new listings"
                    icon={<Package className="w-16 h-16 text-gray-400" />}
                    action={
                      Object.keys(filters).length > 2 ? (
                        <Button onClick={handleClearFilters} variant="outline">
                          Clear Filters
                        </Button>
                      ) : user ? (
                        <Link href="/marketplace/create">
                          <Button>
                            <Plus className="w-4 h-4 mr-2" />
                            List Your First Item
                          </Button>
                        </Link>
                      ) : undefined
                    }
                  />
                ) : (
                  <>
                    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6">
                      {products.map((product) => (
                        <ProductCard key={product._id} product={product} showActions={!!user} />
                      ))}
                    </div>

                    {/* Pagination */}
                    {pagination && pagination.pages > 1 && (
                      <div className="mt-8 flex items-center justify-center gap-2">
                        <Button
                          variant="outline"
                          onClick={() => handlePageChange(pagination.page - 1)}
                          disabled={pagination.page === 1}
                          className="dark:bg-gray-800 dark:border-gray-700"
                        >
                          Previous
                        </Button>
                        <div className="flex items-center gap-1">
                          {[...Array(pagination.pages)].map((_, i) => {
                            const pageNum = i + 1;
                            // Show first, last, current, and adjacent pages
                            if (
                              pageNum === 1 ||
                              pageNum === pagination.pages ||
                              Math.abs(pageNum - pagination.page) <= 1
                            ) {
                              return (
                                <Button
                                  key={pageNum}
                                  variant={pageNum === pagination.page ? 'default' : 'outline'}
                                  onClick={() => handlePageChange(pageNum)}
                                  className={pageNum === pagination.page ? 'bg-blue-600 hover:bg-blue-700' : 'dark:bg-gray-800 dark:border-gray-700'}
                                >
                                  {pageNum}
                                </Button>
                              );
                            } else if (
                              pageNum === pagination.page - 2 ||
                              pageNum === pagination.page + 2
                            ) {
                              return <span key={pageNum} className="px-2 dark:text-gray-400">...</span>;
                            }
                            return null;
                          })}
                        </div>
                        <Button
                          variant="outline"
                          onClick={() => handlePageChange(pagination.page + 1)}
                          disabled={pagination.page === pagination.pages}
                          className="dark:bg-gray-800 dark:border-gray-700"
                        >
                          Next
                        </Button>
                      </div>
                    )}
                  </>
                )}
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
