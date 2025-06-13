"use client";

import React, { useState, useEffect } from "react";
import {
  ChevronLeft,
  ChevronRight,
  Calendar,
  ShoppingBag,
  CupSoda,
  Hamburger,
  Utensils,
  Fuel,
  Gamepad2 as Game,
  Train,
  Coffee,
  Film,
} from "lucide-react";
import { CustomCategory } from "../../types/money-note";
import { getNotesByDate, getCategories } from "../../utils/storage";
import Link from "next/link";

// Create a map of available icons
const availableIcons = {
  ShoppingBag,
  CupSoda,
  Hamburger,
  Utensils,
  Fuel,
  Game,
  Train,
  Coffee,
  Film,
} as const;

type IconName = keyof typeof availableIcons;

export default function StatisticsPage() {
  const [selectedMonth, setSelectedMonth] = useState(
    new Date().toISOString().slice(0, 7)
  );
  const [categories, setCategories] = useState<CustomCategory[]>([]);
  const [monthlyStats, setMonthlyStats] = useState<{
    total: number;
    byCategory: { [key: string]: number };
  }>({ total: 0, byCategory: {} });

  useEffect(() => {
    setCategories(getCategories());
  }, []);

  useEffect(() => {
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

  const getCategoryIcon = (categoryId: string) => {
    const category = categories.find((cat) => cat.id === categoryId);
    return category?.icon || "ShoppingBag";
  };

  const handlePrevMonth = () => {
    const [year, month] = selectedMonth.split("-").map(Number);
    const newDate = new Date(year, month - 2, 1);
    setSelectedMonth(newDate.toISOString().slice(0, 7));
  };

  const handleNextMonth = () => {
    const [year, month] = selectedMonth.split("-").map(Number);
    const newDate = new Date(year, month, 1);
    newDate.setMonth(newDate.getMonth() + 1);
    console.log(newDate);
    setSelectedMonth(newDate.toISOString().slice(0, 7));
  };

  return (
    <main className="min-h-screen bg-gray-900">
      {/* Header */}
      <div className="bg-gray-800 shadow-sm">
        <div className="max-w-md mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link
              href="/"
              className="text-blue-400 hover:text-blue-300 p-2 hover:bg-gray-700 rounded-lg transition-colors"
            >
              <ChevronLeft size={20} />
            </Link>
            <h1 className="text-2xl font-bold text-white">
              Monthly Statistics
            </h1>
            <div className="w-10" /> {/* Spacer for alignment */}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-md mx-auto px-4 py-6">
        {/* Month Selector */}
        <div className="mb-6">
          <div className="flex items-center space-x-2">
            <button
              onClick={handlePrevMonth}
              className="p-2 hover:bg-gray-700 rounded-lg transition-colors text-gray-300"
            >
              <ChevronLeft size={20} />
            </button>
            <div className="flex-1 relative">
              <Calendar
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                size={18}
              />
              <input
                type="month"
                value={selectedMonth}
                onChange={(e) => setSelectedMonth(e.target.value)}
                className="w-full p-2 pl-10 border border-gray-600 rounded-lg bg-gray-700 text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <button
              onClick={handleNextMonth}
              className="p-2 hover:bg-gray-700 rounded-lg transition-colors text-gray-300"
            >
              <ChevronRight size={20} />
            </button>
          </div>
        </div>

        {/* Statistics Content */}
        <div className="bg-gray-800 rounded-xl p-4 shadow-sm">
          <h2 className="text-xl font-bold text-white mb-4">
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
            {Object.entries(monthlyStats.byCategory).map(
              ([categoryId, amount]) => {
                const category = categories.find(
                  (cat) => cat.id === categoryId
                );
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
                          {React.createElement(
                            availableIcons[
                              getCategoryIcon(categoryId) as IconName
                            ],
                            { size: 14, className: "text-white" }
                          )}
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
              }
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
