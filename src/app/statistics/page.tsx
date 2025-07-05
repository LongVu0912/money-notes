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
import { CustomCategory, MoneyNote } from "../../types/money-note";
import {
  getNotesByDate,
  getCategories,
  getMoneyNotes,
} from "../../utils/storage";
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
  const [modalCategory, setModalCategory] = useState<CustomCategory | null>(
    null
  );
  const [modalNotes, setModalNotes] = useState<MoneyNote[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);

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
    const newDate = new Date(year, month - 1, 1);
    setSelectedMonth(newDate.toISOString().slice(0, 7));
  };

  const handleNextMonth = () => {
    const [year, month] = selectedMonth.split("-").map(Number);
    const newDate = new Date(year, month, 1);
    newDate.setMonth(newDate.getMonth() + 1);
    console.log(newDate);
    setSelectedMonth(newDate.toISOString().slice(0, 7));
  };

  // Helper to get all notes for a category in the selected month
  const getNotesForCategoryInMonth = (categoryId: string) => {
    const notes = getMoneyNotes();
    return notes.filter((note) => {
      return (
        note.category === categoryId && note.date.startsWith(selectedMonth)
      );
    });
  };

  return (
    <main className="min-h-screen bg-slate-900">
      {/* Header */}
      <div className="bg-slate-900 shadow-sm border-b border-slate-800">
        <div className="max-w-md mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link
              href="/"
              className="text-cyan-400 hover:text-cyan-300 p-2 hover:bg-slate-800 rounded-lg transition-colors"
            >
              <ChevronLeft size={20} />
            </Link>
            <h1 className="text-2xl font-bold text-white tracking-tight">
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
              className="p-2 hover:bg-slate-800 rounded-lg transition-colors text-slate-300"
            >
              <ChevronLeft size={20} />
            </button>
            <div className="flex-1 relative">
              <Calendar
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400"
                size={18}
              />
              <input
                type="month"
                value={selectedMonth}
                onChange={(e) => setSelectedMonth(e.target.value)}
                className="w-full p-2 pl-10 border border-slate-800 rounded-lg bg-slate-800 text-white focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 placeholder:text-slate-400"
              />
            </div>
            <button
              onClick={handleNextMonth}
              className="p-2 hover:bg-slate-800 rounded-lg transition-colors text-slate-300"
            >
              <ChevronRight size={20} />
            </button>
          </div>
        </div>

        {/* Statistics Content */}
        <div className="bg-slate-800 rounded-xl p-4 shadow-sm border border-slate-700">
          <h2 className="text-xl font-bold text-white mb-4 tracking-tight">
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
            {Object.entries(monthlyStats.byCategory)
              .sort((a, b) => b[1] - a[1])
              .map(([categoryId, amount]) => {
                const category = categories.find(
                  (cat) => cat.id === categoryId
                );
                if (!category) return null;

                const percentage = (amount / monthlyStats.total) * 100;

                return (
                  <div
                    key={categoryId}
                    className="bg-slate-900 rounded-lg p-3 border border-slate-800 cursor-pointer hover:border-cyan-400 transition-colors"
                    onClick={() => {
                      setModalCategory(category);
                      setModalNotes(getNotesForCategoryInMonth(categoryId));
                      setIsModalOpen(true);
                    }}
                  >
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
                    <div className="w-full bg-slate-700 rounded-full h-2">
                      <div
                        className="h-2 rounded-full"
                        style={{
                          width: `${percentage}%`,
                          backgroundColor: category.color,
                        }}
                      />
                    </div>
                    <div className="text-right mt-1">
                      <span className="text-sm text-slate-400">
                        {percentage.toFixed(1)}%
                      </span>
                    </div>
                  </div>
                );
              })}
          </div>
        </div>
        {/* Modal for category notes */}
        {isModalOpen && modalCategory && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50">
            <div className="bg-slate-900 w-full max-w-md rounded-2xl p-6 mx-4 shadow-xl border border-slate-800 relative">
              <button
                onClick={() => setIsModalOpen(false)}
                className="absolute top-4 right-4 text-slate-400 hover:text-slate-200 p-2 hover:bg-slate-800 rounded-full transition-colors"
                aria-label="Close"
              >
                ×
              </button>
              <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                <span
                  className="w-6 h-6 rounded-lg flex items-center justify-center"
                  style={{ backgroundColor: modalCategory.color }}
                >
                  {React.createElement(
                    availableIcons[modalCategory.icon as IconName],
                    { size: 16, className: "text-white" }
                  )}
                </span>
                {modalCategory.name}
              </h2>
              {modalNotes.length === 0 ? (
                <div className="text-center text-slate-400 py-8">
                  No notes for this category in this month.
                </div>
              ) : (
                <ul className="divide-y divide-slate-800 max-h-80 overflow-y-auto">
                  {modalNotes.map((note) => (
                    <li key={note.id} className="py-3 flex flex-col gap-1">
                      <span className="text-slate-300 text-sm">
                        {note.date} {note.time}
                      </span>
                      <span className="text-white font-medium">
                        {note.amount.toLocaleString()} VND
                      </span>
                      <span className="text-slate-400 text-sm">
                        {note.description}
                      </span>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
