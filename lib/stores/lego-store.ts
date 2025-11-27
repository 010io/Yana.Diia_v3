import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface LegoComponent {
  id: string;
  uniqueId: number;
  name: string;
  category: string;
  props?: Record<string, any>;
  dataSource?: 'mock' | 'live';
  status?: 'connected' | 'disconnected';
}

interface LegoStore {
  items: LegoComponent[];
  addItem: (item: LegoComponent) => void;
  removeItem: (uniqueId: number) => void;
  updateItem: (uniqueId: number, updates: Partial<LegoComponent>) => void;
  setItems: (items: LegoComponent[]) => void;
  clearCanvas: () => void;
}

export const useLegoStore = create<LegoStore>()(
  persist(
    (set) => ({
      items: [],
      addItem: (item) => set((state) => ({ items: [...state.items, item] })),
      removeItem: (uniqueId) =>
        set((state) => ({ items: state.items.filter((i) => i.uniqueId !== uniqueId) })),
      updateItem: (uniqueId, updates) =>
        set((state) => ({
          items: state.items.map((item) =>
            item.uniqueId === uniqueId ? { ...item, ...updates } : item
          ),
        })),
      setItems: (items) => set({ items }),
      clearCanvas: () => set({ items: [] }),
    }),
    {
      name: 'lego-storage', // unique name for localStorage key
    }
  )
);
