'use client';

export function ContentSkeleton() {
  return (
    <div className="flex-1 p-8 bg-gray-50 dark:bg-gray-900 animate-pulse">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Title Skeleton */}
        <div className="h-8 w-64 bg-gray-200 dark:bg-gray-700 rounded"></div>
        
        {/* Stats Grid Skeleton */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="bg-white dark:bg-gray-800 rounded-lg border dark:border-gray-700 p-6 space-y-3">
              <div className="h-4 w-24 bg-gray-200 dark:bg-gray-700 rounded"></div>
              <div className="h-8 w-16 bg-gray-200 dark:bg-gray-700 rounded"></div>
            </div>
          ))}
        </div>

        {/* Chart Skeleton */}
        <div className="bg-white dark:bg-gray-800 rounded-lg border dark:border-gray-700 p-6 space-y-4">
          <div className="h-6 w-48 bg-gray-200 dark:bg-gray-700 rounded"></div>
          <div className="h-64 bg-gray-100 dark:bg-gray-700 rounded"></div>
        </div>
      </div>
    </div>
  );
}

export function ListSkeleton() {
  return (
    <div className="flex-1 p-8 bg-gray-50 dark:bg-gray-900 animate-pulse">
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="h-8 w-48 bg-gray-200 dark:bg-gray-700 rounded"></div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="bg-white dark:bg-gray-800 rounded-lg border dark:border-gray-700 overflow-hidden">
              <div className="h-48 bg-gray-200 dark:bg-gray-700"></div>
              <div className="p-4 space-y-3">
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded"></div>
                <div className="h-4 w-2/3 bg-gray-200 dark:bg-gray-700 rounded"></div>
                <div className="h-6 w-24 bg-gray-200 dark:bg-gray-700 rounded"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export function FormSkeleton() {
  return (
    <div className="flex-1 p-8 bg-gray-50 dark:bg-gray-900 animate-pulse">
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="h-8 w-64 bg-gray-200 dark:bg-gray-700 rounded"></div>
        
        <div className="bg-white dark:bg-gray-800 rounded-lg border dark:border-gray-700 p-6 space-y-4">
          <div className="h-6 w-48 bg-gray-200 dark:bg-gray-700 rounded"></div>
          <div className="space-y-3">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-10 bg-gray-100 dark:bg-gray-700 rounded"></div>
            ))}
          </div>
          <div className="h-10 w-32 bg-gray-200 dark:bg-gray-700 rounded"></div>
        </div>
      </div>
    </div>
  );
}
