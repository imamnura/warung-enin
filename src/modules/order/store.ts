"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";

export type CartItem = {
  menuId: string;
  name: string;
  price: number;
  quantity: number;
  image?: string;
  notes?: string;
};

type CartStore = {
  items: CartItem[];
  addItem: (item: Omit<CartItem, "quantity"> & { quantity?: number }) => void;
  removeItem: (menuId: string) => void;
  updateQuantity: (menuId: string, quantity: number) => void;
  updateNotes: (menuId: string, notes: string) => void;
  clearCart: () => void;
  getTotalItems: () => number;
  getTotalPrice: () => number;
};

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],

      addItem: (item) => {
        const existingItem = get().items.find((i) => i.menuId === item.menuId);
        if (existingItem) {
          set({
            items: get().items.map((i) =>
              i.menuId === item.menuId
                ? { ...i, quantity: i.quantity + (item.quantity || 1) }
                : i
            ),
          });
        } else {
          set({
            items: [...get().items, { ...item, quantity: item.quantity || 1 }],
          });
        }
      },

      removeItem: (menuId) => {
        set({ items: get().items.filter((i) => i.menuId !== menuId) });
      },

      updateQuantity: (menuId, quantity) => {
        if (quantity <= 0) {
          get().removeItem(menuId);
        } else {
          set({
            items: get().items.map((i) =>
              i.menuId === menuId ? { ...i, quantity } : i
            ),
          });
        }
      },

      updateNotes: (menuId, notes) => {
        set({
          items: get().items.map((i) =>
            i.menuId === menuId ? { ...i, notes } : i
          ),
        });
      },

      clearCart: () => set({ items: [] }),

      getTotalItems: () =>
        get().items.reduce((total, item) => total + item.quantity, 0),

      getTotalPrice: () =>
        get().items.reduce(
          (total, item) => total + item.price * item.quantity,
          0
        ),
    }),
    {
      name: "cart-storage",
    }
  )
);
