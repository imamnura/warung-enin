"use client";

type ReviewStatsProps = {
  stats: {
    averageRating: number;
    totalReviews: number;
    ratingDistribution: {
      5: number;
      4: number;
      3: number;
      2: number;
      1: number;
    };
  };
};

export function ReviewStats({ stats }: ReviewStatsProps) {
  if (stats.totalReviews === 0) {
    return (
      <div className="bg-white rounded-lg p-6 text-center">
        <p className="text-gray-500">Belum ada review</p>
      </div>
    );
  }

  const getPercentage = (count: number) => {
    return ((count / stats.totalReviews) * 100).toFixed(0);
  };

  return (
    <div className="bg-white rounded-lg p-6">
      <div className="flex items-center gap-6 mb-6">
        <div className="text-center">
          <div className="text-5xl font-bold text-primary mb-1">
            {stats.averageRating}
          </div>
          <div className="flex items-center gap-1 mb-1">
            {[1, 2, 3, 4, 5].map((star) => (
              <span key={star} className="text-xl">
                {star <= Math.round(stats.averageRating) ? "⭐" : "☆"}
              </span>
            ))}
          </div>
          <p className="text-sm text-gray-600">{stats.totalReviews} ulasan</p>
        </div>

        <div className="flex-1 space-y-2">
          {[5, 4, 3, 2, 1].map((rating) => {
            const count = stats.ratingDistribution[rating as 1 | 2 | 3 | 4 | 5];
            const percentage = getPercentage(count);

            return (
              <div key={rating} className="flex items-center gap-2 text-sm">
                <span className="w-3">{rating}</span>
                <span>⭐</span>
                <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-yellow-400"
                    style={{ width: `${percentage}%` }}
                  />
                </div>
                <span className="w-12 text-right text-gray-600">
                  {count} ({percentage}%)
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
