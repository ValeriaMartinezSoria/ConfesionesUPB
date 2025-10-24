import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Alert } from "react-native";
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


export type ModerationLogEntry = {
  id?: string;
  action: "approved" | "rejected";
  timestamp: number;
  user: { id?: string; name?: string | null }
  reason?: string | null;  
};

export type ModeratorInfo = { id?: string; name?: string | null };

export type ConfesionModerada = Confesion & {
  firebaseId?: string;
  status?: "pending" | "approved" | "rejected";
  approvedAt?: number | null;
  approvedBy?: string | null;
  rejectedAt?: number | null;
  rejectionReason?: string | null;
  moderationLogs?: ModerationLogEntry[];
};

type State = {
  pendientes: ConfesionModerada[];
  aprobadas: ConfesionModerada[];
  rechazadas: ConfesionModerada[];
  likedIds: number[];
};

type Actions = {
  addPendiente: (c: { content: string; category: Category; carrera: string; image?: any }) => Promise<boolean>;
  approve: (id: number, moderator?: ModeratorInfo) => Promise<void>;
  reject: (id: number, reason?: string, moderator?: ModeratorInfo) => Promise<void>;
  toggleLike: (id: number) => Promise<void>;
  seed: (aprobadas: ConfesionModerada[], pendientes: ConfesionModerada[], rechazadas?: ConfesionModerada[]) => void;
  clearStorage: () => Promise<void>;
  getAprobadasSorted: (carrerasDeInteres: Carrera[]) => ConfesionModerada[];
  loadConfesiones: () => Promise<void>;
};

export const useConfesionesStore = create<State & Actions>()(
  persist(
    (set, get) => ({
      pendientes: [],
      aprobadas: [],
      rechazadas: [],
      likedIds: [],

 
      addPendiente: async ({ content, category, carrera, image }) => {
        const id = Math.floor(Math.random() * 1_000_000) + 1000;
        const nueva: ConfesionModerada = {
          id,
          content,
          category,
          carrera,
          date: Date.now(),
          likes: 0,
          image: image || null,
          nexo: "Anónimo",
          status: "pending",
          moderationLogs: [],
        };

        try {
          const ref = await addDoc(collection(db, "confesiones"), nueva);
          set((s) => ({
            pendientes: [{ ...nueva, firebaseId: ref.id }, ...s.pendientes],
          }));
          Alert.alert("Enviado", "Tu confesión está en revisión");
          return true;
        } catch (err) {
          console.error("Error al agregar confesión:", err);
          return false;
        }
      },

      approve: async (id, moderator) => {
        const { pendientes } = get();
        const c = pendientes.find((x) => x.id === id);
        if (!c) return;

        const approvedAt = Date.now();
        const moderatorInfo = moderator ?? {
          id: auth.currentUser?.uid ?? "unknown",
          name: auth.currentUser?.displayName ?? "Moderador",
        };
        const userPayload = {
          id: moderatorInfo.id ?? "unknown",
          name: moderatorInfo.name ?? "Moderador",
        };

        let logForState: ModerationLogEntry = {
          action: "approved",
          timestamp: approvedAt,
          user: userPayload,
          reason: null, 
        };

        try {
          const q = query(collection(db, "confesiones"), where("id", "==", id));
          const snapshot = await getDocs(q);
          if (snapshot.empty) return;

          await Promise.all(
            snapshot.docs.map(async (docSnap) => {
              const confRef = doc(db, "confesiones", docSnap.id);
              const logRef = await addDoc(collection(confRef, "moderationLogs"), logForState);
              logForState = { ...logForState, id: logRef.id };
              await updateDoc(confRef, {
                status: "approved",
                approvedAt,
                approvedBy: userPayload.name,
                rejectedAt: null,
                rejectionReason: null,
                date: approvedAt,
              });
            })
          );

          set((s) => {
            const firebaseId = snapshot.docs[0]?.id ?? c.firebaseId;
            const updated = {
              ...c,
              firebaseId,
              status: "approved" as const,
              approvedAt,
              approvedBy: userPayload.name ?? null,
              rejectedAt: null,
              rejectionReason: null,
              date: approvedAt,
              moderationLogs: [...(c.moderationLogs ?? []), logForState],
            };
            return {
              pendientes: s.pendientes.filter((x) => x.id !== id),
              aprobadas: [updated, ...s.aprobadas.filter((x) => x.id !== id)],
              rechazadas: s.rechazadas.filter((x) => x.id !== id),
            };
          });
        } catch (err) {
          console.error("Error al aprobar:", err);
        }
      },

      reject: async (id, reason, moderator) => {
        const { pendientes } = get();
        const c = pendientes.find((x) => x.id === id);
        if (!c) return;

        const rejectedAt = Date.now();
        const cleanedReason = reason?.trim() || null; 
        const moderatorInfo = moderator ?? {
          id: auth.currentUser?.uid ?? "unknown",
          name: auth.currentUser?.displayName ?? "Moderador",
        };
        const userPayload = {
          id: moderatorInfo.id ?? "unknown",
          name: moderatorInfo.name ?? "Moderador",
        };

        let logForState: ModerationLogEntry = {
          action: "rejected",
          timestamp: rejectedAt,
          user: userPayload,
          reason: cleanedReason, 
        };

        try {
          const q = query(collection(db, "confesiones"), where("id", "==", id));
          const snapshot = await getDocs(q);
          if (snapshot.empty) return;

          await Promise.all(
            snapshot.docs.map(async (docSnap) => {
              const confRef = doc(db, "confesiones", docSnap.id);
              const logRef = await addDoc(collection(confRef, "moderationLogs"), logForState);
              logForState = { ...logForState, id: logRef.id };

              await updateDoc(confRef, {
                status: "rejected",
                rejectedAt,
                rejectionReason: cleanedReason,
              });
            })
          );

          set((s) => {
            const firebaseId = snapshot.docs[0]?.id ?? c.firebaseId;
            const updated = {
              ...c,
              firebaseId,
              status: "rejected" as const,
              approvedAt: null,
              approvedBy: null,
              rejectedAt,
              rejectionReason: cleanedReason,
              moderationLogs: [...(c.moderationLogs ?? []), logForState],
            };
            return {
              pendientes: s.pendientes.filter((x) => x.id !== id),
              rechazadas: [updated, ...s.rechazadas.filter((x) => x.id !== id)],
            };
          });
        } catch (err) {
          console.error(" Error al rechazar:", err);
        }
      },


      toggleLike: async (id) => {
        const user = auth.currentUser;
        if (!user) {
          console.warn("Usuario no autenticado");
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


      seed: (aprobadas, pendientes, rechazadas) =>
        set({
          aprobadas: aprobadas.map((c) => ({
            ...c,
            status: c.status ?? "approved",
            moderationLogs: c.moderationLogs ?? [],
          })),
          pendientes: pendientes.map((c) => ({
            ...c,
            status: c.status ?? "pending",
            moderationLogs: c.moderationLogs ?? [],
          })),
          rechazadas: (rechazadas ?? []).map((c) => ({
            ...c,
            status: c.status ?? "rejected",
            moderationLogs: c.moderationLogs ?? [],
          })),
        }),

      clearStorage: async () => {
        await AsyncStorage.removeItem("confesiones-storage");
        set({ pendientes: [], aprobadas: [], rechazadas: [], likedIds: [] });
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

    
      loadConfesiones: async () => {
        try {
          const confesionesRef = collection(db, "confesiones");
          const [pendingSnap, approvedSnap, rejectedSnap] = await Promise.all([
            getDocs(query(confesionesRef, where("status", "==", "pending"))),
            getDocs(query(confesionesRef, where("status", "==", "approved"))),
            getDocs(query(confesionesRef, where("status", "==", "rejected"))),
          ]);

          const mapDocs = (snap: typeof pendingSnap) =>
            snap.docs.map((docSnap) => {
              const data = docSnap.data() as ConfesionModerada;
              return {
                ...data,
                firebaseId: docSnap.id,
                moderationLogs: data.moderationLogs ?? [],
              };
            });

          set({
            pendientes: mapDocs(pendingSnap),
            aprobadas: mapDocs(approvedSnap).sort((a, b) => (b.date ?? 0) - (a.date ?? 0)),
            rechazadas: mapDocs(rejectedSnap).sort((a, b) => (b.rejectedAt ?? 0) - (a.rejectedAt ?? 0)),
          });
        } catch (err) {
          console.error("❌ Error al cargar confesiones:", err);
        }
      },
    }),
    {
      name: "confesiones-storage",
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
