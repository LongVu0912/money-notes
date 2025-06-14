import { MoneyNote, CustomCategory } from "../types/money-note";

const STORAGE_KEYS = {
  MONEY_NOTES: "money-notes",
  CATEGORIES: "custom-categories",
};

export const getMoneyNotes = (): MoneyNote[] => {
  if (typeof window === "undefined") return [];
  const notes = localStorage.getItem(STORAGE_KEYS.MONEY_NOTES);
  return notes ? JSON.parse(notes) : [];
};

export const saveMoneyNote = (note: MoneyNote): void => {
  const notes = getMoneyNotes();
  const idx = notes.findIndex((n) => n.id === note.id);
  if (idx !== -1) {
    notes[idx] = note; // update existing
  } else {
    notes.push(note); // add new
  }
  localStorage.setItem(STORAGE_KEYS.MONEY_NOTES, JSON.stringify(notes));
};

export const deleteMoneyNote = (id: string): void => {
  const notes = getMoneyNotes();
  const filteredNotes = notes.filter((note) => note.id !== id);
  localStorage.setItem(STORAGE_KEYS.MONEY_NOTES, JSON.stringify(filteredNotes));
};

export const getNotesByDate = (date: string): MoneyNote[] => {
  const notes = getMoneyNotes();
  return notes.filter((note) => note.date === date);
};

// Category management
export const getCategories = (): CustomCategory[] => {
  if (typeof window === "undefined") return [];
  const categories = localStorage.getItem(STORAGE_KEYS.CATEGORIES);
  return categories ? JSON.parse(categories) : [];
};

export const saveCategory = (category: CustomCategory): void => {
  const categories = getCategories();
  const idx = categories.findIndex((c) => c.id === category.id);
  if (idx !== -1) {
    categories[idx] = category; // update existing
  } else {
    categories.push(category); // add new
  }
  localStorage.setItem(STORAGE_KEYS.CATEGORIES, JSON.stringify(categories));
};

export const deleteCategory = (id: string): void => {
  const categories = getCategories();
  const filteredCategories = categories.filter((cat) => cat.id !== id);
  localStorage.setItem(
    STORAGE_KEYS.CATEGORIES,
    JSON.stringify(filteredCategories)
  );
};
