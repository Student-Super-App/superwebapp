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
          <div className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">
            <div className="animate-pulse space-y-4">
              <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-48" />
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="h-24 bg-gray-200 dark:bg-gray-700 rounded" />
                ))}
              </div>
              <div className="space-y-4">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="h-32 bg-gray-200 dark:bg-gray-700 rounded" />
                ))}
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
