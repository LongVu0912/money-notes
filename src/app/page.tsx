"use client";

import React, { useState, useEffect } from "react";
import {
  MoneyNote,
  MoneyNoteFormData,
  CustomCategory,
} from "../types/money-note";
import {
  saveMoneyNote,
  deleteMoneyNote,
  getNotesByDate,
  getCategories,
  saveCategory,
  deleteCategory,
} from "../utils/storage";
import {
  Plus,
  Calendar,
  X,
  Trash2,
  Settings,
  ChevronLeft,
  ChevronRight,
  Sun,
  Clock,
  CupSoda,
  Moon,
  Hamburger,
  ShoppingBag,
  Utensils,
  Fuel,
  Gamepad2 as Game,
  Train,
  Coffee,
  Film,
  Download,
  Upload,
  Pencil,
  BarChart2,
} from "lucide-react";
import Link from "next/link";

type IconName = keyof typeof availableIcons;

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

export default function Home() {
  const [notes, setNotes] = useState<MoneyNote[]>([]);
  const [categories, setCategories] = useState<CustomCategory[]>([]);
  const [selectedDate, setSelectedDate] = useState(
    new Date().toISOString().split("T")[0]
  );
  const [formData, setFormData] = useState<MoneyNoteFormData>({
    amount: 0,
    description: "",
    date: new Date().toISOString().split("T")[0],
    time: new Date().toLocaleTimeString("en-US", {
      hour12: false,
      hour: "2-digit",
      minute: "2-digit",
    }),
    category: "",
  });
  const [amountInput, setAmountInput] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [newCategory, setNewCategory] = useState<Omit<CustomCategory, "id">>({
    name: "",
    color: "#000000",
    icon: "ShoppingBag" as IconName,
  });
  const [editingCategory, setEditingCategory] = useState<CustomCategory | null>(
    null
  );
  const [confirmDelete, setConfirmDelete] = useState<{
    isOpen: boolean;
    type: "note" | "category";
    id: string;
    name?: string;
  }>({
    isOpen: false,
    type: "note",
    id: "",
  });

  useEffect(() => {
    setNotes(getNotesByDate(selectedDate));
    setCategories(getCategories());
  }, [selectedDate]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newNote: MoneyNote = {
      ...formData,
      id: Date.now().toString(),
      date: selectedDate,
    };
    saveMoneyNote(newNote);
    setNotes([...notes, newNote]);
    setFormData({
      amount: 0,
      description: "",
      date: selectedDate,
      time: new Date().toLocaleTimeString("en-US", {
        hour12: false,
        hour: "2-digit",
        minute: "2-digit",
      }),
      category: "",
    });
    setAmountInput("");
    setIsModalOpen(false);
  };

  const handleDelete = (id: string) => {
    const note = notes.find((n) => n.id === id);
    setConfirmDelete({
      isOpen: true,
      type: "note",
      id,
      name: note?.description,
    });
  };

  const handleAddCategory = (e: React.FormEvent) => {
    e.preventDefault();
    const category: CustomCategory = {
      ...newCategory,
      id: Date.now().toString(),
    };
    saveCategory(category);
    setCategories([...categories, category]);
    setNewCategory({
      name: "",
      color: "#000000",
      icon: "ShoppingBag" as IconName,
    });
  };

  const handleDeleteCategory = (id: string) => {
    const category = categories.find((c) => c.id === id);
    setConfirmDelete({
      isOpen: true,
      type: "category",
      id,
      name: category?.name,
    });
  };

  const handleConfirmDelete = () => {
    if (confirmDelete.type === "note") {
      deleteMoneyNote(confirmDelete.id);
      setNotes(notes.filter((note) => note.id !== confirmDelete.id));
    } else {
      deleteCategory(confirmDelete.id);
      setCategories(categories.filter((cat) => cat.id !== confirmDelete.id));
    }
    setConfirmDelete({ isOpen: false, type: "note", id: "" });
  };

  const getCategoryColor = (categoryId: string) => {
    const category = categories.find((cat) => cat.id === categoryId);
    return category?.color || "#000000";
  };

  const getCategoryName = (categoryId: string) => {
    const category = categories.find((cat) => cat.id === categoryId);
    return category?.name || "Uncategorized";
  };

  const getCategoryIcon = (categoryId: string) => {
    const category = categories.find((cat) => cat.id === categoryId);
    return category?.icon || "ShoppingBag";
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const getTimeRange = (time: string) => {
    const [hours] = time.split(":").map(Number);
    if (hours >= 6 && hours < 12) return "morning";
    if (hours >= 12 && hours < 18) return "afternoon";
    return "evening";
  };

  const groupNotesByTimeRange = (notes: MoneyNote[]) => {
    const groups = {
      morning: notes.filter((note) => getTimeRange(note.time) === "morning"),
      afternoon: notes.filter(
        (note) => getTimeRange(note.time) === "afternoon"
      ),
      evening: notes.filter((note) => getTimeRange(note.time) === "evening"),
    };
    return groups;
  };

  const timeRangeLabels = {
    morning: { label: "Morning (06:00 - 12:00)", icon: Sun },
    afternoon: { label: "Afternoon (12:00 - 18:00)", icon: Clock },
    evening: { label: "Evening (18:00 - 06:00)", icon: Moon },
  };

  return (
    <main className="min-h-screen bg-slate-900">
      {/* Header */}
      <div className="bg-slate-900 shadow-sm border-b border-slate-800">
        <div className="max-w-md mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold text-white tracking-tight">
              Money Notes
            </h1>
            <div className="flex items-center space-x-2">
              <Link
                href="/statistics"
                className="text-cyan-400 hover:text-cyan-300 p-2 hover:bg-slate-800 rounded-lg transition-colors"
                title="View Statistics"
              >
                <BarChart2 size={20} />
              </Link>
              <button
                onClick={() => setIsSettingsOpen(true)}
                className="text-cyan-400 hover:text-cyan-300 p-2 hover:bg-slate-800 rounded-lg transition-colors"
              >
                <Settings size={20} />
              </button>
            </div>
          </div>
          <div className="mt-4 flex items-center space-x-2">
            <button
              onClick={() => {
                const date = new Date(selectedDate);
                date.setDate(date.getDate() - 1);
                setSelectedDate(date.toISOString().split("T")[0]);
              }}
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
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="w-full p-2 pl-10 border border-slate-800 rounded-lg bg-slate-800 text-white focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 placeholder:text-slate-400"
              />
            </div>
            <button
              onClick={() => {
                const date = new Date(selectedDate);
                date.setDate(date.getDate() + 1);
                setSelectedDate(date.toISOString().split("T")[0]);
              }}
              className="p-2 hover:bg-slate-800 rounded-lg transition-colors text-slate-300"
            >
              <ChevronRight size={20} />
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-md mx-auto px-4 py-6">
        {/* Date Summary */}
        <div className="bg-gradient-to-r from-cyan-900 to-cyan-950 rounded-xl shadow-sm p-4 mb-6 text-white border border-slate-800">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-lg font-semibold mb-0.5 tracking-tight">
                {formatDate(selectedDate)}
              </h1>
              <h4 className="text-md font-medium mb-0.5 text-cyan-300">
                {notes
                  .reduce((sum, note) => sum + note.amount, 0)
                  .toLocaleString()}{" "}
              </h4>
            </div>
            <button
              onClick={() => setIsModalOpen(true)}
              className="bg-cyan-400 text-white p-2 rounded-lg hover:bg-cyan-500 transition-colors shadow-sm"
            >
              <Plus size={20} />
            </button>
          </div>
        </div>

        {/* Notes List */}
        <div className="space-y-6">
          {notes.length === 0 ? (
            <div className="text-center py-12 bg-slate-900 rounded-xl shadow-sm border border-slate-800">
              <p className="text-slate-400">No notes for this date</p>
            </div>
          ) : (
            Object.entries(groupNotesByTimeRange(notes)).map(
              ([range, rangeNotes]) =>
                rangeNotes.length > 0 && (
                  <div key={range} className="space-y-3">
                    <div className="flex items-center space-x-2 text-slate-400 mb-2">
                      {React.createElement(
                        timeRangeLabels[range as keyof typeof timeRangeLabels]
                          .icon,
                        { size: 18 }
                      )}
                      <h3 className="font-medium">
                        {
                          timeRangeLabels[range as keyof typeof timeRangeLabels]
                            .label
                        }
                      </h3>
                    </div>
                    {rangeNotes.map((note) => (
                      <div
                        key={note.id}
                        className="bg-slate-800 p-4 rounded-xl shadow-sm hover:shadow-md transition-shadow border border-slate-700"
                      >
                        <div className="flex justify-between items-start">
                          <div className="flex-1">
                            <div className="flex items-center space-x-2 mb-2">
                              <div
                                className="w-8 h-8 rounded-lg flex items-center justify-center"
                                style={{
                                  backgroundColor: getCategoryColor(
                                    note.category
                                  ),
                                }}
                              >
                                {React.createElement(
                                  availableIcons[
                                    getCategoryIcon(note.category) as IconName
                                  ],
                                  {
                                    size: 18,
                                    className: "text-white",
                                  }
                                )}
                              </div>
                              <span className="text-base text-slate-300">
                                {getCategoryName(note.category)}
                              </span>
                              <span className="text-sm text-slate-400">
                                {note.time}
                              </span>
                            </div>
                            <p className="font-medium text-sm text-white">
                              {note.description}
                            </p>
                            <p className="text-md font-bold text-white mt-1">
                              {note.amount.toLocaleString()}
                            </p>
                          </div>
                          <button
                            onClick={() => handleDelete(note.id)}
                            className="text-red-400 hover:text-red-300 p-2 hover:bg-slate-800 rounded-lg transition-colors"
                          >
                            <Trash2 size={18} />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )
            )
          )}
        </div>
      </div>

      {/* Add Note Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-slate-900 w-full max-w-md rounded-2xl p-6 mx-4 shadow-xl border border-slate-800 max-h-screen overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-white">Add New Note</h2>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-slate-400 hover:text-slate-200 p-2 hover:bg-slate-800 rounded-full transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-1">
                    Amount
                  </label>
                  <input
                    type="text"
                    value={amountInput}
                    onChange={(e) => {
                      const value = e.target.value;
                      setAmountInput(value);
                      if (value === "" || /^\d*\.?\d*$/.test(value)) {
                        setFormData({
                          ...formData,
                          amount: value === "" ? 0 : parseFloat(value),
                        });
                      }
                    }}
                    className="w-full p-2 rounded-lg bg-slate-800 text-white border border-slate-800 focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 placeholder:text-slate-400"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-1">
                    Time
                  </label>
                  <input
                    type="time"
                    value={formData.time}
                    onChange={(e) =>
                      setFormData({ ...formData, time: e.target.value })
                    }
                    className="w-full p-3 border border-gray-600 rounded-lg bg-gray-700 text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1">
                  Description
                </label>
                <input
                  type="text"
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  className="w-full p-3 border border-gray-600 rounded-lg bg-gray-700 text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1">
                  Category
                </label>
                <select
                  value={formData.category}
                  onChange={(e) =>
                    setFormData({ ...formData, category: e.target.value })
                  }
                  className="w-full p-3 border border-gray-600 rounded-lg bg-gray-700 text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  required
                >
                  <option value="">Select a category</option>
                  {categories.map((category) => (
                    <option key={category.id} value={category.id}>
                      {category.name}
                    </option>
                  ))}
                </select>
              </div>

              <button
                type="submit"
                className="w-full bg-blue-600 text-white p-3 rounded-lg hover:bg-blue-700 transition-colors"
              >
                Save Note
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Settings Modal */}
      {isSettingsOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-gray-800 w-full max-w-md rounded-2xl p-6 mx-4 shadow-xl max-h-screen overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-white">Categories</h2>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => {
                    const settings = {
                      categories: categories,
                      exportDate: new Date().toISOString(),
                    };
                    const blob = new Blob([JSON.stringify(settings, null, 2)], {
                      type: "application/json",
                    });
                    const url = URL.createObjectURL(blob);
                    const a = document.createElement("a");
                    a.href = url;
                    a.download = `money-note-settings-${
                      new Date().toISOString().split("T")[0]
                    }.json`;
                    document.body.appendChild(a);
                    a.click();
                    document.body.removeChild(a);
                    URL.revokeObjectURL(url);
                  }}
                  className="text-blue-400 hover:text-blue-300 p-2 hover:bg-gray-700 rounded-lg transition-colors"
                  title="Export Settings"
                >
                  <Download size={20} />
                </button>
                <label
                  className="text-blue-400 hover:text-blue-300 p-2 hover:bg-gray-700 rounded-lg transition-colors cursor-pointer"
                  title="Import Settings"
                >
                  <input
                    type="file"
                    accept=".json"
                    className="hidden"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        const reader = new FileReader();
                        reader.onload = (event) => {
                          try {
                            const settings = JSON.parse(
                              event.target?.result as string
                            );
                            if (
                              settings.categories &&
                              Array.isArray(settings.categories)
                            ) {
                              // Clear existing categories
                              categories.forEach((cat) =>
                                deleteCategory(cat.id)
                              );
                              // Import new categories
                              settings.categories.forEach(
                                (cat: CustomCategory) => {
                                  saveCategory(cat);
                                }
                              );
                              setCategories(settings.categories);
                            }
                          } catch (error) {
                            console.error("Error importing settings:", error);
                            alert("Invalid settings file");
                          }
                        };
                        reader.readAsText(file);
                      }
                    }}
                  />
                  <Upload size={20} />
                </label>
                <button
                  onClick={() => setIsSettingsOpen(false)}
                  className="text-gray-400 hover:text-gray-300 p-2 hover:bg-gray-700 rounded-full transition-colors"
                >
                  <X size={20} />
                </button>
              </div>
            </div>

            <form onSubmit={handleAddCategory} className="space-y-4 mb-6">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  Name
                </label>
                <input
                  type="text"
                  value={newCategory.name}
                  onChange={(e) =>
                    setNewCategory({ ...newCategory, name: e.target.value })
                  }
                  className="w-full p-3 border border-gray-600 rounded-lg bg-gray-700 text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </div>

              <div className="grid grid-cols-1 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">
                    Color
                  </label>
                  <input
                    type="color"
                    value={newCategory.color}
                    onChange={(e) =>
                      setNewCategory({ ...newCategory, color: e.target.value })
                    }
                    className="w-full h-12 p-1 border border-gray-600 rounded-lg bg-gray-700"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">
                    Icon
                  </label>
                  <div className="relative">
                    <select
                      value={newCategory.icon}
                      onChange={(e) =>
                        setNewCategory({
                          ...newCategory,
                          icon: e.target.value as IconName,
                        })
                      }
                      className="w-full h-12 p-3 border border-gray-600 rounded-lg bg-gray-700 text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 appearance-none"
                    >
                      {Object.keys(availableIcons).map((iconName) => (
                        <option key={iconName} value={iconName}>
                          {iconName}
                        </option>
                      ))}
                    </select>
                    <div className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none">
                      {React.createElement(
                        availableIcons[newCategory.icon as IconName],
                        { size: 18, className: "text-white" }
                      )}
                    </div>
                  </div>
                </div>
              </div>

              <button
                type="submit"
                className="w-full bg-blue-600 text-white p-3 rounded-lg hover:bg-blue-700 transition-colors"
              >
                Add Category
              </button>
            </form>

            <div className="space-y-3">
              {categories.map((category) => (
                <div
                  key={category.id}
                  className="flex items-center justify-between p-3 border border-gray-600 rounded-lg bg-gray-700"
                >
                  <div className="flex items-center space-x-3">
                    <div
                      className="w-8 h-8 rounded-lg flex items-center justify-center"
                      style={{ backgroundColor: category.color }}
                    >
                      {React.createElement(
                        availableIcons[category.icon as IconName],
                        {
                          size: 18,
                          className: "text-white",
                        }
                      )}
                    </div>
                    <span className="font-medium text-white">
                      {category.name}
                    </span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => setEditingCategory(category)}
                      className="text-blue-400 hover:text-blue-300 p-2 hover:bg-gray-600 rounded-lg transition-colors"
                      title="Edit Category"
                    >
                      <Pencil size={18} />
                    </button>
                    <button
                      onClick={() => handleDeleteCategory(category.id)}
                      className="text-red-400 hover:text-red-300 p-2 hover:bg-gray-600 rounded-lg transition-colors"
                      title="Delete Category"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Edit Category Modal */}
      {editingCategory && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-gray-800 w-full max-w-md rounded-2xl p-6 mx-4 shadow-xl max-h-screen overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-white">Edit Category</h2>
              <button
                onClick={() => setEditingCategory(null)}
                className="text-gray-400 hover:text-gray-300 p-2 hover:bg-gray-700 rounded-full transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                if (editingCategory) {
                  saveCategory(editingCategory);
                  setCategories(
                    categories.map((cat) =>
                      cat.id === editingCategory.id ? editingCategory : cat
                    )
                  );
                  setEditingCategory(null);
                }
              }}
              className="space-y-4"
            >
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  Name
                </label>
                <input
                  type="text"
                  value={editingCategory.name}
                  onChange={(e) =>
                    setEditingCategory({
                      ...editingCategory,
                      name: e.target.value,
                    })
                  }
                  className="w-full p-3 border border-gray-600 rounded-lg bg-gray-700 text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </div>

              <div className="grid grid-cols-1 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">
                    Color
                  </label>
                  <input
                    type="color"
                    value={editingCategory.color}
                    onChange={(e) =>
                      setEditingCategory({
                        ...editingCategory,
                        color: e.target.value,
                      })
                    }
                    className="w-full h-12 p-1 border border-gray-600 rounded-lg bg-gray-700"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">
                    Icon
                  </label>
                  <div className="relative">
                    <select
                      value={editingCategory.icon}
                      onChange={(e) =>
                        setEditingCategory({
                          ...editingCategory,
                          icon: e.target.value as IconName,
                        })
                      }
                      className="w-full h-12 p-3 border border-gray-600 rounded-lg bg-gray-700 text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 appearance-none"
                    >
                      {Object.keys(availableIcons).map((iconName) => (
                        <option key={iconName} value={iconName}>
                          {iconName}
                        </option>
                      ))}
                    </select>
                    <div className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none">
                      {React.createElement(
                        availableIcons[editingCategory.icon as IconName],
                        { size: 18, className: "text-white" }
                      )}
                    </div>
                  </div>
                </div>
              </div>

              <button
                type="submit"
                className="w-full bg-blue-600 text-white p-3 rounded-lg hover:bg-blue-700 transition-colors"
              >
                Save Changes
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {confirmDelete.isOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-gray-800 w-full max-w-md rounded-2xl p-6 mx-4 shadow-xl max-h-screen overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-white">Confirm Delete</h2>
              <button
                onClick={() =>
                  setConfirmDelete({ isOpen: false, type: "note", id: "" })
                }
                className="text-gray-400 hover:text-gray-300 p-2 hover:bg-gray-700 rounded-full transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            <p className="text-gray-300 mb-6">
              Are you sure you want to delete this {confirmDelete.type}?
              {confirmDelete.name && (
                <span className="font-medium text-white">
                  {" "}
                  &ldquo;{confirmDelete.name}&rdquo;
                </span>
              )}
            </p>

            <div className="flex space-x-3">
              <button
                onClick={() =>
                  setConfirmDelete({ isOpen: false, type: "note", id: "" })
                }
                className="flex-1 p-3 border border-gray-600 rounded-lg hover:bg-gray-700 transition-colors text-white"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmDelete}
                className="flex-1 bg-red-600 text-white p-3 rounded-lg hover:bg-red-700 transition-colors"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
