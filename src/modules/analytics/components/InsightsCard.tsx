interface InsightsCardProps {
  insights: {
    peakHours: Array<{ hour: number; count: number }>;
  };
}

export function InsightsCard({ insights }: InsightsCardProps) {
  const formatHour = (hour: number) => {
    return `${hour.toString().padStart(2, "0")}:00`;
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h3 className="text-lg font-bold mb-4">💡 Business Insights</h3>

      <div className="space-y-4">
        <div className="border-l-4 border-blue-500 pl-4">
          <h4 className="font-semibold text-gray-900 mb-2">Jam Sibuk</h4>
          <div className="space-y-2">
            {insights.peakHours.map((item, index) => (
              <div
                key={item.hour}
                className="flex items-center justify-between"
              >
                <span className="text-sm text-gray-600">
                  {index + 1}. {formatHour(item.hour)} -{" "}
                  {formatHour(item.hour + 1)}
                </span>
                <span className="text-sm font-semibold text-blue-600">
                  {item.count} order
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="border-l-4 border-green-500 pl-4">
          <h4 className="font-semibold text-gray-900 mb-2">Rekomendasi</h4>
          <ul className="space-y-2 text-sm text-gray-600">
            <li className="flex items-start gap-2">
              <span className="text-green-500">✓</span>
              <span>
                Siapkan stok lebih banyak di jam sibuk untuk menghindari
                kehabisan menu
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-green-500">✓</span>
              <span>Fokuskan promosi untuk menu dengan penjualan rendah</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-green-500">✓</span>
              <span>
                Pertimbangkan member program untuk customer dengan belanja
                tinggi
              </span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
