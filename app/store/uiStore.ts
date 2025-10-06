import { create } from "zustand";

type Theme = "light" | "dark";

type UIStore = {
  theme: Theme;
  isAdmin: boolean;
  setTheme: (t: Theme) => void;
  toggleTheme: () => void;
  toggleAdmin: () => void;
};

export const useUIStore = create<UIStore>((set, get) => ({
  theme: "light",
  isAdmin: false,
  setTheme: (t) => set({ theme: t }),
  toggleTheme: () => set({ theme: get().theme === "light" ? "dark" : "light" }),
  toggleAdmin: () => set((s) => ({ isAdmin: !s.isAdmin })),
}));
