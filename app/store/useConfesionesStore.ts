import { create } from "zustand";
import { seedAprobadas, seedPendientes, type Confesion } from "../data/seed";

type Store = {
  aprobadas: Confesion[];
  pendientes: Confesion[];
  likedIds: number[];
  addPendiente: (c: Confesion) => void;
  approve: (id: number) => void;
  reject: (id: number) => void;
  toggleLike: (id: number) => void;
};

export const useConfesionesStore = create<Store>()((set, get) => ({
  aprobadas: seedAprobadas,
  pendientes: seedPendientes,
  likedIds: [],
  addPendiente: (c) => set((s) => ({ pendientes: [c, ...s.pendientes] })),
  approve: (id) => set((s) => {
    const c = s.pendientes.find((x) => x.id === id);
    if (!c) return s;
    return { pendientes: s.pendientes.filter((x) => x.id !== id), aprobadas: [c, ...s.aprobadas] };
  }),
  reject: (id) => set((s) => ({ pendientes: s.pendientes.filter((x) => x.id !== id) })),
  toggleLike: (id) => set((s) => {
    if (s.likedIds.includes(id)) return s;
    return { aprobadas: s.aprobadas.map((x) => x.id === id ? { ...x, likes: x.likes + 1 } : x), likedIds: [...s.likedIds, id] };
  })
}));
