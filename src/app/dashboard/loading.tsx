import { SkeletonStats } from "@/shared/ui/Skeleton";

export default function DashboardLoading() {
  return (
    <div className="space-y-8">
      <div>
        <div className="h-8 w-48 bg-gray-200 rounded animate-pulse mb-2" />
        <div className="h-4 w-64 bg-gray-200 rounded animate-pulse" />
      </div>
      <SkeletonStats />
    </div>
  );
}
