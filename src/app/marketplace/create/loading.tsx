export default function Loading() {
  return (
    <div className="flex flex-col h-screen overflow-hidden">
      {/* Header Skeleton */}
      <div className="h-16 bg-white dark:bg-gray-800 border-b dark:border-gray-700" />
      
      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar Skeleton */}
        <div className="hidden md:block w-64 bg-white dark:bg-gray-800 border-r dark:border-gray-700" />
        
        {/* Content Skeleton */}
        <main className="flex-1 overflow-y-auto bg-gray-50 dark:bg-gray-900">
          <div className="max-w-3xl mx-auto p-4 sm:p-6 lg:p-8">
            <div className="animate-pulse space-y-4">
              <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-48" />
              <div className="h-64 bg-gray-200 dark:bg-gray-700 rounded" />
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
