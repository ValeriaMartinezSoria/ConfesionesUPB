import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { db, auth } from "../data/firebase";
import {
  addDoc,
  collection,
  doc,
  updateDoc,
  deleteDoc,
  getDocs,
  query,
  where,
  setDoc,
} from "firebase/firestore";
import type { Confesion, Category } from "../data/seed";
import type { Carrera } from "./useUserStore";

type State = {
  pendientes: Confesion[];
  aprobadas: Confesion[];
  likedIds: number[];
};

type Actions = {
  addPendiente: (c: { content: string; category: Category; carrera: string; image?: any }) => Promise<void>;
  approve: (id: number) => Promise<void>;
  reject: (id: number) => Promise<void>;
  toggleLike: (id: number) => Promise<void>;
  seed: (aprobadas: Confesion[], pendientes: Confesion[]) => void;
  clearStorage: () => Promise<void>;
  getAprobadasSorted: (carrerasDeInteres: Carrera[]) => Confesion[];
};

export const useConfesionesStore = create<State & Actions>()(
  persist(
    (set, get) => ({
      pendientes: [],
      aprobadas: [],
      likedIds: [],

      // ✅ Guardar confesión nueva como "pending" en Firestore
      addPendiente: async ({ content, category, carrera, image }) => {
        const id = Math.floor(Math.random() * 1_000_000) + 1000;
        const nueva: Confesion = {
          id,
          content,
          category,
          carrera,
          date: Date.now(),
          likes: 0,
          image: image || null,
          nexo: "Anónimo",
        };

        try {
          await addDoc(collection(db, "confesiones"), {
            ...nueva,
            status: "pending",
          });
          set((s) => ({ pendientes: [nueva, ...s.pendientes] }));
        } catch (err) {
          console.error("❌ Error al agregar confesión:", err);
        }
      },

      // ✅ Aprobar confesión
      approve: async (id) => {
        const { pendientes } = get();
        const c = pendientes.find((x) => x.id === id);
        if (!c) return;

        try {
          const q = query(collection(db, "confesiones"), where("id", "==", id));
          const snapshot = await getDocs(q);
          snapshot.forEach(async (docSnap) => {
            await updateDoc(doc(db, "confesiones", docSnap.id), {
              status: "approved",
              date: Date.now(),
            });
          });

          set((s) => ({
            pendientes: s.pendientes.filter((x) => x.id !== id),
            aprobadas: [{ ...c, date: Date.now() }, ...s.aprobadas],
          }));
        } catch (err) {
          console.error("❌ Error al aprobar:", err);
        }
      },

      // ✅ Rechazar confesión
      reject: async (id) => {
        const { pendientes } = get();
        const c = pendientes.find((x) => x.id === id);
        if (!c) return;

        try {
          const q = query(collection(db, "confesiones"), where("id", "==", id));
          const snapshot = await getDocs(q);
          snapshot.forEach(async (docSnap) => {
            await updateDoc(doc(db, "confesiones", docSnap.id), {
              status: "rejected",
            });
          });

          set((s) => ({
            pendientes: s.pendientes.filter((x) => x.id !== id),
          }));
        } catch (err) {
          console.error("❌ Error al rechazar:", err);
        }
      },

      // ✅ Likes en subcolección /likes/{userUID}
      toggleLike: async (id) => {
        const user = auth.currentUser;
        if (!user) {
          console.warn("⚠️ Usuario no autenticado");
          return;
        }

        const { likedIds } = get();
        const has = likedIds.includes(id);

        try {
          const q = query(collection(db, "confesiones"), where("id", "==", id));
          const snapshot = await getDocs(q);
          snapshot.forEach(async (docSnap) => {
            const confRef = doc(db, "confesiones", docSnap.id);
            const likeRef = doc(collection(confRef, "likes"), user.uid);

            if (has) {
              await deleteDoc(likeRef);
              await updateDoc(confRef, { likes: (docSnap.data().likes || 0) - 1 });
            } else {
              await setDoc(likeRef, { likedAt: Date.now() });
              await updateDoc(confRef, { likes: (docSnap.data().likes || 0) + 1 });
            }
          });

          // Actualiza el estado local
          set((s) => ({
            likedIds: has
              ? s.likedIds.filter((x) => x !== id)
              : [...s.likedIds, id],
            aprobadas: s.aprobadas.map((c) =>
              c.id === id ? { ...c, likes: c.likes + (has ? -1 : 1) } : c
            ),
          }));
        } catch (err) {
          console.error("❌ Error al cambiar like:", err);
        }
      },

      seed: (aprobadas, pendientes) => set({ aprobadas, pendientes }),

      clearStorage: async () => {
        await AsyncStorage.removeItem("confesiones-storage");
        set({ pendientes: [], aprobadas: [], likedIds: [] });
      },

      getAprobadasSorted: (carrerasDeInteres) => {
        const { aprobadas } = get();
        if (carrerasDeInteres.length === 0)
          return [...aprobadas].sort((a, b) => b.date - a.date);

        const confesionesDeInteres: Confesion[] = [];
        const confesionesOtras: Confesion[] = [];

        aprobadas.forEach((conf) => {
          if (carrerasDeInteres.includes(conf.carrera as Carrera))
            confesionesDeInteres.push(conf);
          else confesionesOtras.push(conf);
        });

        confesionesDeInteres.sort((a, b) => b.date - a.date);
        confesionesOtras.sort((a, b) => b.date - a.date);

        return [...confesionesDeInteres, ...confesionesOtras];
      },
    }),
    {
      name: "confesiones-storage",
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
