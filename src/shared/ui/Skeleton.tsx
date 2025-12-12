import React from "react";

export const Skeleton: React.FC<{ className?: string }> = ({ className }) => {
  return (
    <div
      className={`animate-pulse bg-gray-200 rounded ${className}`}
      aria-busy="true"
      aria-live="polite"
    />
  );
};

export const SkeletonCard: React.FC = () => {
  return (
    <div className="bg-white rounded-2xl shadow-md p-5 space-y-4 border border-gray-100">
      <Skeleton className="h-56 w-full rounded-xl" />
      <Skeleton className="h-6 w-3/4" />
      <Skeleton className="h-4 w-full" />
      <Skeleton className="h-4 w-2/3" />
      <div className="flex items-center justify-between pt-2 pb-4 border-b border-gray-100">
        <Skeleton className="h-8 w-28" />
        <Skeleton className="h-8 w-20 rounded-full" />
      </div>
      <div className="space-y-3">
        <div className="flex items-center justify-center gap-3">
          <Skeleton className="h-10 w-10 rounded-full" />
          <Skeleton className="h-6 w-12" />
          <Skeleton className="h-10 w-10 rounded-full" />
        </div>
        <Skeleton className="h-12 w-full rounded-xl" />
      </div>
    </div>
  );
};

export const SkeletonTable: React.FC<{ rows?: number }> = ({ rows = 5 }) => {
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      {/* Header */}
      <div className="border-b p-4">
        <div className="flex gap-4 mb-4">
          <Skeleton className="h-10 w-64" />
          <Skeleton className="h-10 w-32" />
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              {[1, 2, 3, 4, 5].map((i) => (
                <th key={i} className="px-6 py-3">
                  <Skeleton className="h-4 w-24" />
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {Array.from({ length: rows }).map((_, i) => (
              <tr key={i} className="border-b">
                {[1, 2, 3, 4, 5].map((j) => (
                  <td key={j} className="px-6 py-4">
                    <Skeleton className="h-4 w-full" />
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="p-4 flex items-center justify-between border-t">
        <Skeleton className="h-8 w-32" />
        <div className="flex gap-2">
          {[1, 2, 3, 4, 5].map((i) => (
            <Skeleton key={i} className="h-8 w-8 rounded" />
          ))}
        </div>
        <Skeleton className="h-8 w-32" />
      </div>
    </div>
  );
};

export const SkeletonStats: React.FC = () => {
  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
      {[1, 2, 3, 4].map((i) => (
        <div key={i} className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between mb-4">
            <Skeleton className="h-5 w-32" />
            <Skeleton className="h-8 w-8 rounded-full" />
          </div>
          <Skeleton className="h-8 w-24 mb-2" />
          <Skeleton className="h-4 w-40" />
        </div>
      ))}
    </div>
  );
};

export const SkeletonGrid: React.FC<{ items?: number }> = ({ items = 9 }) => {
  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {Array.from({ length: items }).map((_, i) => (
        <SkeletonCard key={i} />
      ))}
    </div>
  );
};
