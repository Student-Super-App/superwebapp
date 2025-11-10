'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ProductFilters as Filters, PRODUCT_CATEGORIES, PRODUCT_CONDITIONS } from '@/types/marketplace';
import { Search, SlidersHorizontal, X } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ProductFiltersProps {
  filters: Filters;
  onFiltersChange: (filters: Filters) => void;
  onClear: () => void;
  className?: string;
}

export const ProductFilters = ({ filters, onFiltersChange, onClear, className }: ProductFiltersProps) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const handleChange = (key: keyof Filters, value: string | number | undefined) => {
    onFiltersChange({ ...filters, [key]: value || undefined });
  };

  const activeFiltersCount = Object.values(filters).filter(v => v !== undefined && v !== '').length;

  return (
    <Card className={cn('dark:bg-gray-800 dark:border-gray-700', className)}>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <SlidersHorizontal className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            <CardTitle className="text-lg dark:text-gray-100">Filters</CardTitle>
            {activeFiltersCount > 0 && (
              <span className="px-2 py-0.5 text-xs bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 rounded-full">
                {activeFiltersCount}
              </span>
            )}
          </div>
          <div className="flex items-center gap-2">
            {activeFiltersCount > 0 && (
              <Button
                variant="ghost"
                size="sm"
                onClick={onClear}
                className="h-8 text-xs"
              >
                <X className="w-3 h-3 mr-1" />
                Clear
              </Button>
            )}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsExpanded(!isExpanded)}
              className="md:hidden h-8"
            >
              {isExpanded ? 'Hide' : 'Show'}
            </Button>
          </div>
        </div>
      </CardHeader>

      <CardContent className={cn(
        'space-y-4',
        !isExpanded && 'hidden md:block'
      )}>
        {/* Search */}
        <div className="space-y-2">
          <Label htmlFor="search" className="text-sm font-medium dark:text-gray-200">
            Search
          </Label>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <Input
              id="search"
              type="text"
              placeholder="Search products..."
              value={filters.search || ''}
              onChange={(e) => handleChange('search', e.target.value)}
              className="pl-9 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100"
            />
          </div>
        </div>

        {/* Category */}
        <div className="space-y-2">
          <Label htmlFor="category" className="text-sm font-medium dark:text-gray-200">
            Category
          </Label>
          <select
            id="category"
            value={filters.category || ''}
            onChange={(e) => handleChange('category', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">All Categories</option>
            {PRODUCT_CATEGORIES.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
        </div>

        {/* Condition */}
        <div className="space-y-2">
          <Label htmlFor="condition" className="text-sm font-medium dark:text-gray-200">
            Condition
          </Label>
          <select
            id="condition"
            value={filters.condition || ''}
            onChange={(e) => handleChange('condition', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">All Conditions</option>
            {PRODUCT_CONDITIONS.map((condition) => (
              <option key={condition} value={condition}>
                {condition}
              </option>
            ))}
          </select>
        </div>

        {/* Price Range */}
        <div className="space-y-2">
          <Label className="text-sm font-medium dark:text-gray-200">Price Range</Label>
          <div className="grid grid-cols-2 gap-2">
            <div>
              <Input
                type="number"
                placeholder="Min"
                value={filters.minPrice || ''}
                onChange={(e) => handleChange('minPrice', e.target.value ? Number(e.target.value) : undefined)}
                min="0"
                className="dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100"
              />
            </div>
            <div>
              <Input
                type="number"
                placeholder="Max"
                value={filters.maxPrice || ''}
                onChange={(e) => handleChange('maxPrice', e.target.value ? Number(e.target.value) : undefined)}
                min="0"
                className="dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100"
              />
            </div>
          </div>
        </div>

        {/* Sort By */}
        <div className="space-y-2">
          <Label htmlFor="sortBy" className="text-sm font-medium dark:text-gray-200">
            Sort By
          </Label>
          <select
            id="sortBy"
            value={filters.sortBy || 'createdAt'}
            onChange={(e) => handleChange('sortBy', e.target.value as 'price' | 'createdAt' | 'views')}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="createdAt">Newest First</option>
            <option value="price">Price</option>
            <option value="views">Most Viewed</option>
          </select>
        </div>

        {/* Sort Order */}
        {filters.sortBy && (
          <div className="space-y-2">
            <Label htmlFor="sortOrder" className="text-sm font-medium dark:text-gray-200">
              Order
            </Label>
            <select
              id="sortOrder"
              value={filters.sortOrder || 'desc'}
              onChange={(e) => handleChange('sortOrder', e.target.value as 'asc' | 'desc')}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="desc">
                {filters.sortBy === 'price' ? 'High to Low' : 'Descending'}
              </option>
              <option value="asc">
                {filters.sortBy === 'price' ? 'Low to High' : 'Ascending'}
              </option>
            </select>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
