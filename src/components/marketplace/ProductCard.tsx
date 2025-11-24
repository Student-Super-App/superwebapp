'use client';

import { Product } from '@/types/marketplace';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Heart, Eye } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { cn } from '@/lib/utils';

interface ProductCardProps {
  product: Product;
  showActions?: boolean;
}

export const ProductCard = ({ product, showActions = false }: ProductCardProps) => {
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
      'New': 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400',
      'Like New': 'bg-teal-100 text-teal-700 dark:bg-teal-900/30 dark:text-teal-400',
      'Good': 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400',
      'Fair': 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400',
      'Poor': 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
    };
    return colors[condition] || colors.Good;
  };

  return (
    <Link href={`/marketplace/${product._id}`}>
      <Card className="group overflow-hidden hover:shadow-lg transition-all duration-300 border hover:border-blue-200 dark:hover:border-blue-800 h-full flex flex-col dark:bg-gray-800 dark:border-gray-700">
        {/* Image Section - Smaller height */}
        <div className="relative h-32 sm:h-36 overflow-hidden bg-gray-100 dark:bg-gray-900">
          {product.images && product.images.length > 0 ? (
            <Image
              src={product.images[0]}
              alt={product.title}
              fill
              className="object-cover group-hover:scale-110 transition-transform duration-300"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-800">
              <span className="text-2xl">📦</span>
            </div>
          )}

          {/* Category Badge */}
          <div className="absolute top-1.5 left-1.5 flex justify-between w-[calc(100%-0.75rem)]">
            <Badge className={cn('text-[9px] px-1.5 py-0.5', getCategoryColor(product.category))}>
              {product.category}
            </Badge>
            {!product.isAvailable && (
              <Badge variant="destructive" className="text-[9px] px-1.5 py-0.5">
                Sold
              </Badge>
            )}
          </div>

          {/* Favorite Button */}
          {showActions && (
            <button
              className="absolute top-1.5 right-1.5 p-1 rounded-full bg-white/90 dark:bg-gray-800/90 hover:bg-white dark:hover:bg-gray-700 transition-colors"
              onClick={(e) => e.preventDefault()}
            >
              <Heart className="w-3 h-3 text-gray-600 dark:text-gray-400" />
            </button>
          )}
        </div>

        {/* Content - Tightened spacing */}
        <CardContent className="flex-1 p-2.5">
          <h3 className="font-semibold text-sm mb-1 line-clamp-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors dark:text-gray-100">
            {product.title}
          </h3>

          <p className="text-[11px] text-gray-600 dark:text-gray-400 line-clamp-2 mb-1.5">
            {product.description}
          </p>

          <Badge className={cn('text-[9px] px-1.5 py-0.5', getConditionColor(product.condition))}>
            {product.condition}
          </Badge>
        </CardContent>

        {/* Footer - Compact layout */}
        <CardFooter className="p-2.5 pt-0 flex items-center justify-between border-t dark:border-gray-700">
          <span className="text-base font-bold text-blue-600 dark:text-blue-400">
            ${product.price.toFixed(2)}
          </span>

          <div className="flex items-center text-[11px] text-gray-500 dark:text-gray-400">
            <Eye className="w-3 h-3 mr-0.5" />
            <span>{product.views || 0}</span>
          </div>
        </CardFooter>
      </Card>
    </Link>
  );
};
