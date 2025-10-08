import { create } from 'zustand';

type User = {
  id: string;
  name: string;
  email: string;
  token: string;
}

const initialUser = null;

export const CARRERAS_DISPONIBLES = [
  'Administración de Empresas',
  'Ingeniería de Sistemas',
  'Diseño Gráfico',
  'Psicología',
  'Derecho'
] as const;

export type Carrera = typeof CARRERAS_DISPONIBLES[number];

type UserStore = {
  user: User | null;
  carrerasDeInteres: Carrera[];
  setUser: (user: User | null) => void;
  addCarreraDeInteres: (carrera: Carrera) => void;
  removeCarreraDeInteres: (carrera: Carrera) => void;
  logout: () => void;
};

export const useUserStore = create<UserStore>((set, get) => ({
  user: initialUser,
  carrerasDeInteres: [],
  setUser: (user) => set({ user }),
  addCarreraDeInteres: (carrera) => {
    const { carrerasDeInteres } = get();
    if (!carrerasDeInteres.includes(carrera)) {
      set({ carrerasDeInteres: [...carrerasDeInteres, carrera] });
    }
  },
  removeCarreraDeInteres: (carrera) => {
    const { carrerasDeInteres } = get();
    set({ carrerasDeInteres: carrerasDeInteres.filter(c => c !== carrera) });
  },
  logout: () => set({ user: null, carrerasDeInteres: [] })
}));