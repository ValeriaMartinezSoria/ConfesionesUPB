import { create } from "zustand";
import type { Confesion, Category } from "../data/seed";

type State = {
  pendientes: Confesion[];
  aprobadas: Confesion[];
  likedIds: number[];
};

type Actions = {
  addPendiente: (c: { content: string; category: Category; carrera: string; imageUri?: string }) => void;
  approve: (id: number) => void;
  reject: (id: number) => void;
  toggleLike: (id: number) => void;
  seed: (aprobadas: Confesion[], pendientes: Confesion[]) => void;
};

export const useConfesionesStore = create<State & Actions>((set, get) => ({
  pendientes: [],
  aprobadas: [],
  likedIds: [],

  addPendiente: ({ content, category, carrera, imageUri }) => {
    const id = Math.floor(Math.random() * 1_000_000) + 1000;
    const nuevo: Confesion = {
      id,
      content,
      category,
      carrera,
      date: Date.now(),
      likes: 0,
      imageUri,
      nexo: "Anónimo",
    };
    set((s) => ({ pendientes: [nuevo, ...s.pendientes] }));
  },

  approve: (id) => {
    const { pendientes, aprobadas } = get();
    const c = pendientes.find((x) => x.id === id);
    if (!c) return;
    set({
      pendientes: pendientes.filter((x) => x.id !== id),
      aprobadas: [{ ...c, date: Date.now() }, ...aprobadas],
    });
  },

  reject: (id) => {
    set((s) => ({ pendientes: s.pendientes.filter((x) => x.id !== id) }));
  },

  toggleLike: (id) => {
    const { likedIds } = get();
    const has = likedIds.includes(id);
    set((s) => ({
      likedIds: has ? s.likedIds.filter((x) => x !== id) : [...s.likedIds, id],
      aprobadas: s.aprobadas.map((c) =>
        c.id === id ? { ...c, likes: c.likes + (has ? -1 : 1) } : c
      ),
    }));
  },

  seed: (aprobadas, pendientes) => set({ aprobadas, pendientes }),
}));
