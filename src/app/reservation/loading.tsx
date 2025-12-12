import { SkeletonGrid } from "@/shared/ui/Skeleton";

export default function ReservationLoading() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Enhanced Hero Section Skeleton */}
      <div className="relative bg-gradient-to-br from-primary via-primary/90 to-secondary py-16 overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(255,255,255,0.8),transparent_50%)]" />
        </div>

        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center space-y-6">
            <div className="h-14 w-3/4 max-w-2xl bg-white/20 rounded-xl animate-pulse mx-auto" />
            <div className="h-6 w-2/3 max-w-xl bg-white/20 rounded-lg animate-pulse mx-auto" />
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-4">
              <div className="h-12 w-40 bg-white/20 rounded-full animate-pulse" />
              <div className="h-12 w-40 bg-white/20 rounded-full animate-pulse" />
            </div>
          </div>
        </div>
      </div>

      {/* Content Section Skeleton */}
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            {/* Search & Filter Skeleton */}
            <div className="bg-white rounded-2xl shadow-lg p-6 mb-8 animate-pulse">
              <div className="h-12 bg-gray-200 rounded-xl mb-6" />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <div className="h-4 w-20 bg-gray-200 rounded mb-2" />
                  <div className="h-12 bg-gray-200 rounded-xl" />
                </div>
                <div>
                  <div className="h-4 w-20 bg-gray-200 rounded mb-2" />
                  <div className="h-12 bg-gray-200 rounded-xl" />
                </div>
              </div>
            </div>

            {/* Section Header Skeleton */}
            <div className="mb-6 space-y-2">
              <div className="h-8 w-48 bg-gray-200 rounded animate-pulse" />
              <div className="h-5 w-32 bg-gray-200 rounded animate-pulse" />
            </div>

            {/* Menu Grid Skeleton */}
            <SkeletonGrid items={6} />
          </div>

          {/* Cart Sidebar Skeleton */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-lg p-6 sticky top-4 animate-pulse">
              <div className="flex items-center justify-between mb-6">
                <div className="h-8 w-32 bg-gray-200 rounded" />
                <div className="h-8 w-16 bg-gray-200 rounded-full" />
              </div>
              <div className="text-center py-12">
                <div className="w-20 h-20 bg-gray-200 rounded-full mx-auto mb-4" />
                <div className="h-5 w-40 bg-gray-200 rounded mx-auto" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
