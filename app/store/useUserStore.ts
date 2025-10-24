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

type UserData = {
  carrerasDeInteres: Carrera[];
  facultadesDeInteres: Facultad[];
  preferences: UserPreferences;
  hasCompletedOnboarding: boolean;
};

type UserStore = {
  user: User | null;
  carrerasDeInteres: Carrera[];
  facultadesDeInteres: Facultad[];
  preferences: UserPreferences;
  hasCompletedOnboarding: boolean;
  loading: boolean;
  userDataMap: Record<string, UserData>;

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
  loadUserData: (userId: string) => void;
  saveUserData: () => void;

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
      userDataMap: {},

      setUser: (user) => {
        set({ user });
        if (user) {
          get().loadUserData(user.uid);
        }
      },
      setLoading: (value) => set({ loading: value }),

      loadUserData: (userId) => {
        const { userDataMap } = get();
        const userData = userDataMap[userId];
        if (userData) {
          console.log("📂 Loading user data for:", userId);
          set({
            carrerasDeInteres: userData.carrerasDeInteres,
            facultadesDeInteres: userData.facultadesDeInteres,
            preferences: userData.preferences,
            hasCompletedOnboarding: userData.hasCompletedOnboarding,
          });
        } else {
          console.log("🆕 New user, resetting data for:", userId);
          set({
            carrerasDeInteres: [],
            facultadesDeInteres: [],
            preferences: {
              categoriesOfInterest: [],
              notifyOnTrending: true,
            },
            hasCompletedOnboarding: false,
          });
        }
      },

      saveUserData: () => {
        const { user, carrerasDeInteres, facultadesDeInteres, preferences, hasCompletedOnboarding, userDataMap } = get();
        if (user) {
          console.log("💾 Saving user data for:", user.uid);
          set({
            userDataMap: {
              ...userDataMap,
              [user.uid]: {
                carrerasDeInteres,
                facultadesDeInteres,
                preferences,
                hasCompletedOnboarding,
              },
            },
          });
        }
      },

      addCarreraDeInteres: (carrera) => {
        const { carrerasDeInteres, saveUserData } = get();
        if (!carrerasDeInteres.includes(carrera)) {
          set({ carrerasDeInteres: [...carrerasDeInteres, carrera] });
          saveUserData();
        }
      },

      removeCarreraDeInteres: (carrera) => {
        const { carrerasDeInteres, saveUserData } = get();
        set({
          carrerasDeInteres: carrerasDeInteres.filter((c) => c !== carrera),
        });
        saveUserData();
      },

      setCarrerasDeInteres: (carreras) => {
        set({ carrerasDeInteres: carreras });
        get().saveUserData();
      },

      addFacultadDeInteres: (facultad) => {
        const { facultadesDeInteres, saveUserData } = get();
        if (!facultadesDeInteres.includes(facultad)) {
          set({ facultadesDeInteres: [...facultadesDeInteres, facultad] });
          saveUserData();
        }
      },

      removeFacultadDeInteres: (facultad) => {
        const { facultadesDeInteres, saveUserData } = get();
        set({
          facultadesDeInteres: facultadesDeInteres.filter((f) => f !== facultad),
        });
        saveUserData();
      },

      setFacultadesDeInteres: (facultades) => {
        set({ facultadesDeInteres: facultades });
        get().saveUserData();
      },

      setPreferences: (newPreferences) => {
        const { preferences, saveUserData } = get();
        set({ preferences: { ...preferences, ...newPreferences } });
        saveUserData();
      },

      addCategoryOfInterest: (category) => {
        const { preferences, saveUserData } = get();
        if (!preferences.categoriesOfInterest.includes(category)) {
          set({
            preferences: {
              ...preferences,
              categoriesOfInterest: [...preferences.categoriesOfInterest, category],
            },
          });
          saveUserData();
        }
      },

      removeCategoryOfInterest: (category) => {
        const { preferences, saveUserData } = get();
        set({
          preferences: {
            ...preferences,
            categoriesOfInterest: preferences.categoriesOfInterest.filter(
              (c) => c !== category
            ),
          },
        });
        saveUserData();
      },

      setHasCompletedOnboarding: (completed) => {
        set({ hasCompletedOnboarding: completed });
        get().saveUserData();
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
        userDataMap: state.userDataMap,
      }),
    }
  )
);
