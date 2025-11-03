import { create } from "zustand";

export type ThemePref = "light" | "dark" | "system";

type State = {
  isAdmin: boolean;
  theme: ThemePref;
};

type Actions = {
  toggleAdmin: () => void;
  setTheme: (t: ThemePref) => void;
};

export const useUIStore = create<State & Actions>((set) => ({
  isAdmin: false,
  theme: "system",
  toggleAdmin: () => set((s) => ({ isAdmin: !s.isAdmin })),
  setTheme: (t) => set({ theme: t }),
}));
