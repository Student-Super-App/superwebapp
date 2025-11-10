'use client';

import { AuthGuard } from '@/components/AuthGuard';
import { Header } from '@/components/common/Header';
import { Sidebar } from '@/components/common/Sidebar';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useMyProducts, useUpdateProduct, useDeleteProduct } from '@/features/marketplace/hooks';
import { Package, Plus, Edit, Trash2, Eye, MessageCircle, TrendingUp } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { useState } from 'react';
import type { Product } from '@/types/marketplace';

export const dynamic = 'force-dynamic';

export default function MyListingsPage() {
  const { data, isLoading } = useMyProducts();
  const updateProduct = useUpdateProduct();
  const deleteProduct = useDeleteProduct();
  
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const products = data?.data || [];

  const handleToggleAvailability = (product: Product) => {
    updateProduct.mutate({
      id: product._id,
      data: { isAvailable: !product.isAvailable },
    });
  };

  const handleDelete = (productId: string) => {
    if (confirm('Are you sure you want to delete this listing? This action cannot be undone.')) {
      setDeletingId(productId);
      deleteProduct.mutate(productId, {
        onSettled: () => setDeletingId(null),
      });
    }
  };

  // Calculate stats
  const stats = {
    total: products.length,
    active: products.filter((p) => p.isAvailable).length,
    sold: products.filter((p) => !p.isAvailable).length,
    totalViews: products.reduce((sum, p) => sum + (p.views || 0), 0),
  };

  return (
    <AuthGuard>
      <div className="flex flex-col h-screen overflow-hidden">
        <Header />
        <div className="flex flex-1 overflow-hidden">
          <Sidebar />
          <main className="flex-1 overflow-y-auto bg-gray-50 dark:bg-gray-900">
            <div className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">
              {/* Header */}
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
                <div className="flex items-center gap-3 mb-4 sm:mb-0">
                  <div className="p-2 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg">
                    <Package className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
                      My Listings
                    </h1>
                    <p className="text-gray-600 dark:text-gray-400">
                      Manage your marketplace items
                    </p>
                  </div>
                </div>
                <Link href="/marketplace/create">
                  <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
                    <Plus className="w-4 h-4 mr-2" />
                    List New Item
                  </Button>
                </Link>
              </div>

              {/* Stats Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                <Card className="p-4 dark:bg-gray-800 dark:border-gray-700">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600 dark:text-gray-400">Total Listings</p>
                      <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                        {stats.total}
                      </p>
                    </div>
                    <Package className="w-8 h-8 text-blue-600 dark:text-blue-400" />
                  </div>
                </Card>

                <Card className="p-4 dark:bg-gray-800 dark:border-gray-700">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600 dark:text-gray-400">Active</p>
                      <p className="text-2xl font-bold text-green-600 dark:text-green-400">
                        {stats.active}
                      </p>
                    </div>
                    <TrendingUp className="w-8 h-8 text-green-600 dark:text-green-400" />
                  </div>
                </Card>

                <Card className="p-4 dark:bg-gray-800 dark:border-gray-700">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600 dark:text-gray-400">Sold</p>
                      <p className="text-2xl font-bold text-gray-600 dark:text-gray-400">
                        {stats.sold}
                      </p>
                    </div>
                    <Package className="w-8 h-8 text-gray-600 dark:text-gray-400" />
                  </div>
                </Card>

                <Card className="p-4 dark:bg-gray-800 dark:border-gray-700">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600 dark:text-gray-400">Total Views</p>
                      <p className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                        {stats.totalViews}
                      </p>
                    </div>
                    <Eye className="w-8 h-8 text-purple-600 dark:text-purple-400" />
                  </div>
                </Card>
              </div>

              {/* Products List */}
              {isLoading ? (
                <div className="grid grid-cols-1 gap-4">
                  {[1, 2, 3].map((i) => (
                    <Card key={i} className="p-6 dark:bg-gray-800 dark:border-gray-700">
                      <div className="animate-pulse flex gap-4">
                        <div className="w-32 h-32 bg-gray-200 dark:bg-gray-700 rounded" />
                        <div className="flex-1 space-y-3">
                          <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-1/3" />
                          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-2/3" />
                          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/4" />
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              ) : products.length === 0 ? (
                <Card className="p-12 text-center dark:bg-gray-800 dark:border-gray-700">
                  <div className="flex flex-col items-center">
                    <Package className="w-16 h-16 text-gray-400 mb-4" />
                    <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2">
                      No Listings Yet
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400 mb-6">
                      Start selling by creating your first listing!
                    </p>
                    <Link href="/marketplace/create">
                      <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
                        <Plus className="w-4 h-4 mr-2" />
                        Create Listing
                      </Button>
                    </Link>
                  </div>
                </Card>
              ) : (
                <div className="grid grid-cols-1 gap-4">
                  {products.map((product) => (
                    <Card
                      key={product._id}
                      className="p-4 sm:p-6 dark:bg-gray-800 dark:border-gray-700 hover:shadow-lg transition-shadow"
                    >
                      <div className="flex flex-col sm:flex-row gap-4">
                        {/* Image */}
                        <Link
                          href={`/marketplace/${product._id}`}
                          className="relative w-full sm:w-32 h-48 sm:h-32 bg-gray-100 dark:bg-gray-900 rounded-lg overflow-hidden flex-shrink-0"
                        >
                          {product.images && product.images.length > 0 ? (
                            <Image
                              src={product.images[0]}
                              alt={product.title}
                              fill
                              className="object-cover"
                              sizes="(max-width: 640px) 100vw, 128px"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center">
                              <span className="text-4xl">📦</span>
                            </div>
                          )}
                        </Link>

                        {/* Details */}
                        <div className="flex-1 min-w-0">
                          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2 mb-3">
                            <div className="flex-1 min-w-0">
                              <Link href={`/marketplace/${product._id}`}>
                                <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100 hover:text-blue-600 dark:hover:text-blue-400 truncate">
                                  {product.title}
                                </h3>
                              </Link>
                              <p className="text-2xl font-bold text-blue-600 dark:text-blue-400 mt-1">
                                ${product.price.toFixed(2)}
                              </p>
                            </div>
                            <div className="flex gap-2">
                              <Badge
                                variant={product.isAvailable ? 'default' : 'secondary'}
                                className={
                                  product.isAvailable
                                    ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                                    : ''
                                }
                              >
                                {product.isAvailable ? 'Active' : 'Sold'}
                              </Badge>
                              <Badge variant="outline" className="dark:border-gray-600">
                                {product.category}
                              </Badge>
                            </div>
                          </div>

                          <p className="text-gray-600 dark:text-gray-400 line-clamp-2 mb-3">
                            {product.description}
                          </p>

                          <div className="flex flex-wrap gap-4 text-sm text-gray-600 dark:text-gray-400 mb-4">
                            <div className="flex items-center gap-1">
                              <Eye className="w-4 h-4" />
                              <span>{product.views || 0} views</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <MessageCircle className="w-4 h-4" />
                              <span>Condition: {product.condition}</span>
                            </div>
                          </div>

                          {/* Actions */}
                          <div className="flex flex-wrap gap-2">
                            <Link href={`/marketplace/${product._id}`}>
                              <Button variant="outline" size="sm" className="dark:bg-gray-700 dark:border-gray-600">
                                <Eye className="w-4 h-4 mr-2" />
                                View
                              </Button>
                            </Link>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleToggleAvailability(product)}
                              disabled={updateProduct.isPending}
                              className="dark:bg-gray-700 dark:border-gray-600"
                            >
                              <Edit className="w-4 h-4 mr-2" />
                              {product.isAvailable ? 'Mark as Sold' : 'Mark as Available'}
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleDelete(product._id)}
                              disabled={deletingId === product._id}
                              className="text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 dark:bg-gray-700 dark:border-gray-600"
                            >
                              <Trash2 className="w-4 h-4 mr-2" />
                              {deletingId === product._id ? 'Deleting...' : 'Delete'}
                            </Button>
                          </div>
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              )}
            </div>
          </main>
        </div>
      </div>
    </AuthGuard>
  );
}
