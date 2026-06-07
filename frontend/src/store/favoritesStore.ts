import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface FavoritesState {
  favorites: string[];
  toggleFavorite: (dishId: string) => void;
}

export const useFavoritesStore = create<FavoritesState>()(
  persist(
    (set, get) => ({
      favorites: [],
      toggleFavorite: (dishId) => {
        const exists = get().favorites.includes(dishId);
        set({ favorites: exists ? get().favorites.filter((id) => id !== dishId) : [...get().favorites, dishId] });
      },
    }),
    { name: 'el-garcero-favorites' },
  ),
);
