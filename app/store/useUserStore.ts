import { create } from "zustand";
import { User, signOut } from "firebase/auth";
import { auth } from "../data/firebase";

export const CARRERAS_DISPONIBLES = [
  "Administración de Empresas",
  "Ingeniería de Sistemas",
  "Diseño Gráfico",
  "Psicología",
  "Derecho",
] as const;

export type Carrera = (typeof CARRERAS_DISPONIBLES)[number];

type UserStore = {
  user: User | null;
  carrerasDeInteres: Carrera[];
  loading: boolean;
  setUser: (user: User | null) => void;
  setLoading: (value: boolean) => void;
  addCarreraDeInteres: (carrera: Carrera) => void;
  removeCarreraDeInteres: (carrera: Carrera) => void;
  logout: () => Promise<void>;
};

export const useUserStore = create<UserStore>((set, get) => ({
  user: null,
  carrerasDeInteres: [],
  loading: true,

  setUser: (user) => set({ user }),
  setLoading: (value) => set({ loading: value }),

  addCarreraDeInteres: (carrera) => {
    const { carrerasDeInteres } = get();
    if (!carrerasDeInteres.includes(carrera)) {
      set({ carrerasDeInteres: [...carrerasDeInteres, carrera] });
    }
  },

  removeCarreraDeInteres: (carrera) => {
    const { carrerasDeInteres } = get();
    set({
      carrerasDeInteres: carrerasDeInteres.filter((c) => c !== carrera),
    });
  },

  logout: async () => {
  try {
    await signOut(auth);
    set({ user: null, carrerasDeInteres: [] });
    console.log(" Sesión cerrada correctamente");
  } catch (error) {
    console.error("Error al cerrar sesión:", error);
  }
},
}));
