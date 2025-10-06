import { create } from "zustand";
export type Mode = "system" | "light" | "dark";
type S = { mode: Mode; setMode: (m: Mode) => void };
export const useAppearance = create<S>((set) => ({ mode: "system", setMode: (mode) => set({ mode }) }));
