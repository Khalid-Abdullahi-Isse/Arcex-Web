import { create } from "zustand";
import { persist } from "zustand/middleware";

interface FavoritesState {
  ids: string[];
  hasHydrated: boolean;
  toggle: (id: string) => void;
  remove: (id: string) => void;
  has: (id: string) => boolean;
  setHasHydrated: (value: boolean) => void;
}

export const useFavoritesStore = create<FavoritesState>()(
  persist(
    (set, get) => ({
      ids: [],
      hasHydrated: false,
      toggle: (id) =>
        set((state) => ({
          ids: state.ids.includes(id)
            ? state.ids.filter((x) => x !== id)
            : [...state.ids, id],
        })),
      remove: (id) => set((state) => ({ ids: state.ids.filter((x) => x !== id) })),
      has: (id) => get().ids.includes(id),
      setHasHydrated: (value) => set({ hasHydrated: value }),
    }),
    {
      name: "acrex-favorites",
      partialize: (state) => ({ ids: state.ids }),
      onRehydrateStorage: () => (state) => {
        state?.setHasHydrated(true);
      },
    },
  ),
);
