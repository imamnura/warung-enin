import { SkeletonGrid } from "@/shared/ui/Skeleton";

export default function MenuLoading() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="h-8 w-32 bg-gray-200 rounded animate-pulse" />
        <div className="h-10 w-40 bg-gray-200 rounded-lg animate-pulse" />
      </div>

      {/* Search and Filters Skeleton */}
      <div className="space-y-4 bg-white rounded-lg shadow-md p-6">
        <div className="h-10 bg-gray-200 rounded-lg animate-pulse" />
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <div className="h-4 w-20 bg-gray-200 rounded mb-2 animate-pulse" />
            <div className="h-10 bg-gray-200 rounded-lg animate-pulse" />
          </div>
          <div className="flex-1">
            <div className="h-4 w-20 bg-gray-200 rounded mb-2 animate-pulse" />
            <div className="h-10 bg-gray-200 rounded-lg animate-pulse" />
          </div>
        </div>
      </div>

      <SkeletonGrid items={9} />
    </div>
  );
}
