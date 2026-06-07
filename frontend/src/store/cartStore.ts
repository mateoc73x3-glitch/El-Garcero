import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Dish } from '../types/domain';

interface CartItem extends Dish {
  quantity: number;
}

interface CartState {
  items: CartItem[];
  addItem: (dish: Dish) => void;
  removeItem: (id: string) => void;
  clear: () => void;
}

export const useCartStore = create<CartState>()(
  persist(
    (set) => ({
      items: [],
      addItem: (dish) =>
        set((state) => {
          const existing = state.items.find((item) => item._id === dish._id);
          if (existing) {
            return {
              items: state.items.map((item) =>
                item._id === dish._id ? { ...item, quantity: item.quantity + 1 } : item,
              ),
            };
          }
          return { items: [...state.items, { ...dish, quantity: 1 }] };
        }),
      removeItem: (id) => set((state) => ({ items: state.items.filter((item) => item._id !== id) })),
      clear: () => set({ items: [] }),
    }),
    { name: 'el-garcero-cart' },
  ),
);
