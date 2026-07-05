import { create } from "zustand";
import { persist } from "zustand/middleware";

interface UiState {
  sidebarPinned: boolean;
  togglePinned: () => void;
}

export const useUiStore = create<UiState>()(
  persist(
    (set) => ({
      sidebarPinned: false,
      togglePinned: () => set((state) => ({ sidebarPinned: !state.sidebarPinned })),
    }),
    { name: "acrex-ui" },
  ),
);
