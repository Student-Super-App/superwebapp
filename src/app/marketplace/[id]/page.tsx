'use client';

import { use, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { ProductCard } from '@/components/marketplace/ProductCard';
import { ImageCarousel } from '@/components/marketplace/ImageCarousel';
import {
  useProduct,
  useIncrementViews,
  useSimilarProducts,
  useCreateChat,
} from '@/features/marketplace/hooks';
import { useAppSelector } from '@/store/hooks';
import { MessageCircle, Eye, Clock, User, MapPin, Share2, Heart, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export const dynamic = 'force-dynamic';

interface ProductDetailPageProps {
  params: Promise<{ id: string }>;
}

export default function ProductDetailPage({ params }: ProductDetailPageProps) {
  const { id } = use(params);
  const router = useRouter();
  const { user } = useAppSelector((state) => state.auth);

  const { data: productData, isLoading, error } = useProduct(id);
  const { data: similarData } = useSimilarProducts(id, 4);
  const incrementViews = useIncrementViews();
  const createChat = useCreateChat();

  const product = productData?.data;
  const similarProducts = similarData?.data || [];

  // Increment views when product loads
  useEffect(() => {
    if (product) {
      incrementViews.mutate(id);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const handleStartChat = () => {
    if (!user) {
      router.push('/login');
      return;
    }
    createChat.mutate(id);
  };

  const getCategoryColor = (category: string) => {
    const colors: Record<string, string> = {
      Electronics: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
      Books: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
      Furniture: 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400',
      Clothing: 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400',
      Sports: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
      'Musical Instruments': 'bg-pink-100 text-pink-700 dark:bg-pink-900/30 dark:text-pink-400',
      Other: 'bg-gray-100 text-gray-700 dark:bg-gray-900/30 dark:text-gray-400',
    };
    return colors[category] || colors.Other;
  };

  const getConditionColor = (condition: string) => {
    const colors: Record<string, string> = {
      New: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400',
      'Like New': 'bg-teal-100 text-teal-700 dark:bg-teal-900/30 dark:text-teal-400',
      Good: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400',
      Fair: 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400',
      Poor: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
    };
    return colors[condition] || colors.Good;
  };

  if (isLoading) {
    return (
      <div className="flex flex-col min-h-screen">
        <main className="flex-1 bg-gray-50 dark:bg-gray-900">
          <div className="w-full px-4 sm:px-6 lg:px-8 py-6">
            <div className="animate-pulse space-y-6">
              <div className="h-96 bg-gray-200 dark:bg-gray-700 rounded-lg" />
              <div className="h-64 bg-gray-200 dark:bg-gray-700 rounded-lg" />
            </div>
          </div>
        </main>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="flex flex-col min-h-screen">
        <main className="flex-1 bg-gray-50 dark:bg-gray-900">
          <div className="w-full px-4 sm:px-6 lg:px-8 py-6">
            <Card className="p-12 text-center dark:bg-gray-800 dark:border-gray-700">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2">
                Product Not Found
              </h2>
              <p className="text-gray-600 dark:text-gray-400 mb-6">
                The product you&apos;re looking for doesn&apos;t exist or has been removed.
              </p>
              <Link href="/marketplace">
                <Button>
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back to Marketplace
                </Button>
              </Link>
            </Card>
          </div>
        </main>
      </div>
    );
  }

  const isOwnProduct = user?._id === product.seller?._id;

  return (
    <div className="flex flex-col min-h-screen">
      <main className="flex-1 bg-gray-50 dark:bg-gray-900">
        <div className="w-full px-2 sm:px-6 lg:px-4 py-1">
          {/* Back Button */}
          <Button
            variant="ghost"
            onClick={() => router.back()}
            className="mb-4 dark:hover:bg-gray-800"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>

          <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 lg:gap-8">
            {/* Image Gallery - Left Side (3 columns on large screens) */}
            <div className="lg:col-span-3 ">
              <Card className="p-4 dark:bg-gray-800 dark:border-gray-700">
                <ImageCarousel
                  images={product.images && product.images.length > 0 ? product.images : []}
                  productTitle={product.title}
                />
              </Card>
            </div>

            {/* Product Info - Right Side (2 columns on large screens) */}
            <div className="lg:col-span-2 space-y-4">
              {/* Product Details */}
              <Card className="p-6 dark:bg-gray-800 dark:border-gray-700">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-gray-100 mb-3">
                      {product.title}
                    </h1>
                    <div className="flex flex-wrap gap-2 mb-4">
                      <Badge className={getCategoryColor(product.category)}>
                        {product.category}
                      </Badge>
                      <Badge className={getConditionColor(product.condition)}>
                        {product.condition}
                      </Badge>
                      {!product.isAvailable && <Badge variant="destructive">Sold</Badge>}
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="icon"
                      className="dark:bg-gray-700 dark:border-gray-600"
                    >
                      <Heart className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="icon"
                      className="dark:bg-gray-700 dark:border-gray-600"
                    >
                      <Share2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>

                <div className="prose dark:prose-invert max-w-none mb-6">
                  <h3 className="text-lg font-semibold mb-2 dark:text-gray-100">Description</h3>
                  <p className="text-gray-700 dark:text-gray-300 whitespace-pre-wrap">
                    {product.description}
                  </p>
                </div>

                <div className="grid grid-cols-3 gap-4 pt-4 border-t dark:border-gray-700">
                  <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                    <Eye className="w-4 h-4" />
                    <span>{product.views || 0} views</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                    <Clock className="w-4 h-4" />
                    <span>{new Date(product.createdAt).toLocaleDateString()}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                    <MapPin className="w-4 h-4" />
                    <span>Campus</span>
                  </div>
                </div>
              </Card>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Price & Actions */}
              <Card className="p-6 sticky top-20 dark:bg-gray-800 dark:border-gray-700">
                <div className="mb-6">
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Price</p>
                  <p className="text-4xl font-bold text-blue-600 dark:text-blue-400">
                    ${product.price.toFixed(2)}
                  </p>
                </div>

                {product.isAvailable ? (
                  !isOwnProduct ? (
                    <div className="space-y-3">
                      <Button
                        onClick={handleStartChat}
                        className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                        disabled={createChat.isPending}
                      >
                        <MessageCircle className="w-4 h-4 mr-2" />
                        {createChat.isPending ? 'Starting Chat...' : 'Chat with Seller'}
                      </Button>
                      {!user && (
                        <p className="text-xs text-center text-gray-500 dark:text-gray-400">
                          Login required to chat
                        </p>
                      )}
                    </div>
                  ) : (
                    <Link href="/marketplace/my-listings">
                      <Button
                        variant="outline"
                        className="w-full dark:bg-gray-700 dark:border-gray-600"
                      >
                        Manage This Listing
                      </Button>
                    </Link>
                  )
                ) : (
                  <Button disabled className="w-full">
                    Item Sold
                  </Button>
                )}
              </Card>

              {/* Seller Info */}
              {product.seller && (
                <Card className="p-6 dark:bg-gray-800 dark:border-gray-700">
                  <h3 className="font-semibold mb-4 flex items-center gap-2 dark:text-gray-100">
                    <User className="w-4 h-4" />
                    Seller Information
                  </h3>
                  <div className="space-y-2">
                    <p className="text-sm">
                      <span className="text-gray-600 dark:text-gray-400">Name:</span>{' '}
                      <span className="font-medium dark:text-gray-100">
                        {product.seller.firstName} {product.seller.lastName}
                      </span>
                    </p>
                    <p className="text-sm">
                      <span className="text-gray-600 dark:text-gray-400">Email:</span>{' '}
                      <span className="font-medium dark:text-gray-100">{product.seller.email}</span>
                    </p>
                  </div>
                </Card>
              )}
            </div>
          </div>

          {/* Similar Products */}
          {similarProducts.length > 0 && (
            <div className="mt-12">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-6">
                Similar Products
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {similarProducts.map((similar) => (
                  <ProductCard key={similar._id} product={similar} showActions={!!user} />
                ))}
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
