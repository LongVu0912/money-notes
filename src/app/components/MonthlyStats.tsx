import React from "react";
import { CustomCategory } from "../../types/money-note";
import { getNotesByDate } from "../../utils/storage";

interface MonthlyStatsProps {
  selectedMonth: string; // Format: YYYY-MM
  categories: CustomCategory[];
}

export default function MonthlyStats({
  selectedMonth,
  categories,
}: MonthlyStatsProps) {
  const [monthlyStats, setMonthlyStats] = React.useState<{
    total: number;
    byCategory: { [key: string]: number };
  }>({ total: 0, byCategory: {} });

  React.useEffect(() => {
    // Get all days in the selected month
    const [year, month] = selectedMonth.split("-").map(Number);
    const daysInMonth = new Date(year, month, 0).getDate();

    let total = 0;
    const byCategory: { [key: string]: number } = {};

    // Calculate stats for each day in the month
    for (let day = 1; day <= daysInMonth; day++) {
      const date = `${year}-${month.toString().padStart(2, "0")}-${day
        .toString()
        .padStart(2, "0")}`;
      const notes = getNotesByDate(date);

      notes.forEach((note) => {
        total += note.amount;
        byCategory[note.category] =
          (byCategory[note.category] || 0) + note.amount;
      });
    }

    setMonthlyStats({ total, byCategory });
  }, [selectedMonth]);

  return (
    <div className="bg-gray-800 rounded-xl p-4 shadow-sm">
      <h2 className="text-xl font-bold text-white mb-4">
        Monthly Statistics -{" "}
        {new Date(selectedMonth + "-01").toLocaleDateString("en-US", {
          year: "numeric",
          month: "long",
        })}
      </h2>

      <div className="mb-4">
        <h3 className="text-lg font-semibold text-white mb-2">
          Total: {monthlyStats.total.toLocaleString()} VND
        </h3>
      </div>

      <div className="space-y-3">
        {Object.entries(monthlyStats.byCategory).map(([categoryId, amount]) => {
          const category = categories.find((cat) => cat.id === categoryId);
          if (!category) return null;

          const percentage = (amount / monthlyStats.total) * 100;

          return (
            <div key={categoryId} className="bg-gray-700 rounded-lg p-3">
              <div className="flex justify-between items-center mb-2">
                <div className="flex items-center space-x-2">
                  <div
                    className="w-6 h-6 rounded-lg flex items-center justify-center"
                    style={{ backgroundColor: category.color }}
                  >
                    {/* Icon will be added here */}
                  </div>
                  <span className="text-white font-medium">
                    {category.name}
                  </span>
                </div>
                <span className="text-white font-medium">
                  {amount.toLocaleString()} VND
                </span>
              </div>
              <div className="w-full bg-gray-600 rounded-full h-2">
                <div
                  className="h-2 rounded-full"
                  style={{
                    width: `${percentage}%`,
                    backgroundColor: category.color,
                  }}
                />
              </div>
              <div className="text-right mt-1">
                <span className="text-sm text-gray-400">
                  {percentage.toFixed(1)}%
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
