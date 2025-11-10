import { ContentSkeleton } from '@/components/common/Skeletons';

export default function DashboardLoading() {
  return (
    <div className="flex flex-col h-screen overflow-hidden bg-gray-50 dark:bg-gray-900">
      {/* Simple Header Skeleton */}
      <header className="sticky top-0 z-50 w-full border-b border-gray-200 dark:border-gray-700 bg-white/95 dark:bg-gray-900/95 backdrop-blur supports-[backdrop-filter]:bg-white/60 dark:supports-[backdrop-filter]:bg-gray-900/60">
        <div className="w-full px-4 sm:px-6 lg:px-8 h-16 flex items-center">
          <div className="h-8 w-32 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
        </div>
      </header>
      
      <div className="flex flex-1 overflow-hidden">
        {/* Simple Sidebar Skeleton */}
        <aside className="hidden md:flex flex-col flex-shrink-0 w-64 border-r border-gray-200 dark:border-gray-700 bg-gradient-to-b from-white to-gray-50 dark:from-gray-800 dark:to-gray-900 h-full shadow-sm">
          <div className="flex flex-col h-full py-4">
            <div className="px-4 pt-1 pb-3 mb-3">
              <div className="h-8 w-40 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
            </div>
            <div className="flex-1 px-3 space-y-2">
              {[1, 2, 3, 4, 5].map((i) => (
                <div key={i} className="h-10 bg-gray-200 dark:bg-gray-700 rounded-lg animate-pulse"></div>
              ))}
            </div>
          </div>
        </aside>
        
        <ContentSkeleton />
      </div>
    </div>
  );
}
