'use client';

import { useState } from 'react';
import Image from 'next/image';
import { ChevronLeft, ChevronRight, X, ZoomIn, ZoomOut } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface ImageCarouselProps {
  images: string[];
  productTitle: string;
}

export function ImageCarousel({ images, productTitle }: ImageCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isZoomed, setIsZoomed] = useState(false);

  const goToPrevious = () => {
    setCurrentIndex((prevIndex) => (prevIndex === 0 ? images.length - 1 : prevIndex - 1));
    setIsZoomed(false);
  };

  const goToNext = () => {
    setCurrentIndex((prevIndex) => (prevIndex === images.length - 1 ? 0 : prevIndex + 1));
    setIsZoomed(false);
  };

  const goToImage = (index: number) => {
    setCurrentIndex(index);
    setIsZoomed(false);
  };


  if (images.length === 0) {
    return (
      <div className="relative aspect-square bg-gray-100 dark:bg-gray-800 rounded-lg flex items-center justify-center">
        <Image
          src="/placeholder-product.png"
          alt={productTitle}
          fill
          className="object-contain p-8"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
      </div>
    );
  }

  return (
    <>
      {/* Main Carousel */}
      <div className="space-y-4">
        {/* Main Image */}
        <div className="relative aspect-square bg-gray-100 dark:bg-gray-800 rounded-lg overflow-hidden group">
          <Image
            src={images[currentIndex]}
            alt={`${productTitle} - Image ${currentIndex + 1}`}
            fill
            className="object-contain cursor-zoom-in transition-transform duration-300 hover:scale-105"
            sizes="(max-width: 400px) 100vw"
            priority
          />

          {/* Navigation Arrows */}
          {images.length > 1 && (
            <>
              <Button
                variant="ghost"
                size="icon"
                className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/90 dark:bg-gray-800/90 hover:bg-white dark:hover:bg-gray-800 opacity-0 group-hover:opacity-100 transition-opacity"
                onClick={(e) => {
                  e.stopPropagation();
                  goToPrevious();
                }}
              >
                <ChevronLeft className="w-5 h-5" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/90 dark:bg-gray-800/90 hover:bg-white dark:hover:bg-gray-800 opacity-0 group-hover:opacity-100 transition-opacity"
                onClick={(e) => {
                  e.stopPropagation();
                  goToNext();
                }}
              >
                <ChevronRight className="w-5 h-5" />
              </Button>
            </>
          )}

          {/* Image Counter */}
          {images.length > 1 && (
            <div className="absolute bottom-4 right-4 bg-black/60 text-white px-3 py-1 rounded-full text-sm font-medium">
              {currentIndex + 1} / {images.length}
            </div>
          )}
        </div>

        {/* Thumbnail Gallery */}
        {images.length > 1 && (
          <div className="grid grid-cols-5 sm:grid-cols-6 md:grid-cols-5 lg:grid-cols-6 gap-2">
            {images.map((image, index) => (
              <button
                key={index}
                onClick={() => goToImage(index)}
                className={cn(
                  'relative aspect-square rounded-lg overflow-hidden border-2 transition-all hover:scale-105',
                  currentIndex === index
                    ? 'border-blue-600 dark:border-blue-500 ring-2 ring-blue-600/20'
                    : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
                )}
              >
                <Image
                  src={image}
                  alt={`${productTitle} thumbnail ${index + 1}`}
                  fill
                  className="object-cover"
                  sizes="100px"
                />
              </button>
            ))}
          </div>
        )}
      </div>
    </>
  );
}
