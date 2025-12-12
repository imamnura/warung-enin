import { SkeletonTable } from "@/shared/ui/Skeleton";

export default function CustomersLoading() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="h-8 w-32 bg-gray-200 rounded animate-pulse" />
        <div className="h-10 w-40 bg-gray-200 rounded-lg animate-pulse" />
      </div>
      <SkeletonTable rows={10} />
    </div>
  );
}
