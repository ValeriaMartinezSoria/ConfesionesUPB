import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { User, signOut } from "firebase/auth";
import { auth } from "../data/firebase";
import type { Carrera, Facultad, Category } from "../data/seed";
import { CARRERAS_DISPONIBLES, FACULTADES_DISPONIBLES } from "../data/seed";

export { CARRERAS_DISPONIBLES, FACULTADES_DISPONIBLES };
export type { Carrera, Facultad, Category };

type UserPreferences = {
  categoriesOfInterest: Category[];
  notifyOnTrending?: boolean;
};

type UserStore = {
  user: User | null;
  carrerasDeInteres: Carrera[];
  facultadesDeInteres: Facultad[];
  preferences: UserPreferences;
  hasCompletedOnboarding: boolean;
  loading: boolean;

  setUser: (user: User | null) => void;
  setLoading: (value: boolean) => void;

  addCarreraDeInteres: (carrera: Carrera) => void;
  removeCarreraDeInteres: (carrera: Carrera) => void;
  setCarrerasDeInteres: (carreras: Carrera[]) => void;

  addFacultadDeInteres: (facultad: Facultad) => void;
  removeFacultadDeInteres: (facultad: Facultad) => void;
  setFacultadesDeInteres: (facultades: Facultad[]) => void;

  setPreferences: (preferences: Partial<UserPreferences>) => void;
  addCategoryOfInterest: (category: Category) => void;
  removeCategoryOfInterest: (category: Category) => void;

  setHasCompletedOnboarding: (completed: boolean) => void;

  logout: () => Promise<void>;
};

export const useUserStore = create<UserStore>()(
  persist(
    (set, get) => ({
      user: null,
      carrerasDeInteres: [],
      facultadesDeInteres: [],
      preferences: {
        categoriesOfInterest: [],
        notifyOnTrending: true,
      },
      hasCompletedOnboarding: false,
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

      setCarrerasDeInteres: (carreras) => {
        set({ carrerasDeInteres: carreras });
      },

      addFacultadDeInteres: (facultad) => {
        const { facultadesDeInteres } = get();
        if (!facultadesDeInteres.includes(facultad)) {
          set({ facultadesDeInteres: [...facultadesDeInteres, facultad] });
        }
      },

      removeFacultadDeInteres: (facultad) => {
        const { facultadesDeInteres } = get();
        set({
          facultadesDeInteres: facultadesDeInteres.filter((f) => f !== facultad),
        });
      },

      setFacultadesDeInteres: (facultades) => {
        set({ facultadesDeInteres: facultades });
      },

      setPreferences: (newPreferences) => {
        const { preferences } = get();
        set({ preferences: { ...preferences, ...newPreferences } });
      },

      addCategoryOfInterest: (category) => {
        const { preferences } = get();
        if (!preferences.categoriesOfInterest.includes(category)) {
          set({
            preferences: {
              ...preferences,
              categoriesOfInterest: [...preferences.categoriesOfInterest, category],
            },
          });
        }
      },

      removeCategoryOfInterest: (category) => {
        const { preferences } = get();
        set({
          preferences: {
            ...preferences,
            categoriesOfInterest: preferences.categoriesOfInterest.filter(
              (c) => c !== category
            ),
          },
        });
      },

      setHasCompletedOnboarding: (completed) => {
        set({ hasCompletedOnboarding: completed });
      },

      logout: async () => {
        try {
          await signOut(auth);
          set({
            user: null,
            carrerasDeInteres: [],
            facultadesDeInteres: [],
            preferences: {
              categoriesOfInterest: [],
              notifyOnTrending: true,
            },
            hasCompletedOnboarding: false,
          });
          console.log("Sesión cerrada correctamente");
        } catch (error) {
          console.error("Error al cerrar sesión:", error);
        }
      },
    }),
    {
      name: "user-storage",
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({
        carrerasDeInteres: state.carrerasDeInteres,
        facultadesDeInteres: state.facultadesDeInteres,
        preferences: state.preferences,
        hasCompletedOnboarding: state.hasCompletedOnboarding,
      }),
    }
  )
);
