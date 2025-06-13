export interface MoneyNote {
  id: string;
  amount: number;
  description: string;
  date: string; // YYYY-MM-DD
  time: string; // HH:mm
  category: string;
}

export interface MoneyNoteFormData {
  amount: number;
  description: string;
  date: string;
  time: string;
  category: string;
}

export interface CustomCategory {
  id: string;
  name: string;
  color: string;
  icon: string; // Lucide icon name
} 