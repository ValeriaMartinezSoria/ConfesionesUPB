import { create } from "zustand";

type Theme = "light" | "dark" | "system";

type UiState = {
  theme: Theme;
  isAdmin: boolean;
  toggleTheme: () => void;
  setAdmin: (v: boolean) => void;
};

export const useUiStore = create<UiState>((set, get) => ({
  theme: "light",
  isAdmin: false,
  toggleTheme: () => {
    const next = get().theme === "dark" ? "light" : "dark";
    set({ theme: next });
  },
  setAdmin: (v) => set({ isAdmin: v }),
}));
