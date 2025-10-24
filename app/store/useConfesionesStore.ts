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
import type { Confesion, Category, Carrera } from "../data/seed";
import { CARRERAS_DISPONIBLES } from "../data/seed";

const normalizarCarrera = (value: string): string => {
  const sanitized = value.trim().toUpperCase();
  const match = CARRERAS_DISPONIBLES.find(
    (item) => item.toUpperCase() === sanitized
  );
  return match ?? CARRERAS_DISPONIBLES[0];
};

const obtenerDocumentoConfesion = async (firebaseId?: string, confId?: number) => {
  if (firebaseId) return doc(db, "confesiones", firebaseId);
  if (typeof confId === "number") {
    const snap = await getDocs(query(collection(db, "confesiones"), where("id", "==", confId)));
    const first = snap.docs[0];
    if (first) return first.ref;
  }
  return null;
};

export type ModerationLogEntry = {
  id?: string;
  action: "approved" | "rejected";
  timestamp: number;
  user: { id?: string; name?: string | null };
  reason?: string;
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
        const now = Date.now();

        const carreraNormalizada = normalizarCarrera(carrera);

        const nuevaConfesion: ConfesionModerada = {
          id,
          content: content.trim(),
          category,
          carrera: carreraNormalizada,
          date: now,
          likes: 0,
          image: image ?? null,
          status: "pending",
          approvedAt: null,
          approvedBy: null,
          rejectedAt: null,
          rejectionReason: null,
          moderationLogs: [],
        };

        try {
          const docRef = await addDoc(collection(db, "confesiones"), {
            ...nuevaConfesion,
          });

          set((state) => ({
            pendientes: [
              { ...nuevaConfesion, firebaseId: docRef.id },
              ...state.pendientes,
            ],
          }));

          return true;
        } catch (err) {
          console.error("Error al crear confesión:", err);
          return false;
        }
      },
      approve: async (id, moderator) => {
        const now = Date.now();
        const moderatorName = moderator?.name ?? null;
        const moderatorId = moderator?.id;

        const origen =
          get().pendientes.find((c) => c.id === id) ??
          get().rechazadas.find((c) => c.id === id) ??
          get().aprobadas.find((c) => c.id === id);

        if (!origen) {
          console.error("No se encontró la confesión a aprobar:", id);
          return;
        }

        const logPayload = buildModerationLog("approved", now, moderator);

        try {
          const confRef = await obtenerDocumentoConfesion(origen.firebaseId, id);
          if (!confRef) {
            console.error("No se encontró el documento en Firestore para aprobar:", id);
            return;
          }

          await updateDoc(confRef, {
            status: "approved",
            approvedAt: now,
            approvedBy: moderatorName ?? moderatorId ?? null,
            rejectedAt: null,
            rejectionReason: null,
          });

          const logRef = await addDoc(collection(confRef, "moderationLogs"), logPayload);
          const logEntry: ModerationLogEntry = { id: logRef.id, ...logPayload };

          const updatedConfesion: ConfesionModerada = {
            ...origen,
            firebaseId: origen.firebaseId ?? confRef.id,
            status: "approved",
            approvedAt: now,
            approvedBy: moderatorName ?? moderatorId ?? null,
            rejectedAt: null,
            rejectionReason: null,
            moderationLogs: [...(origen.moderationLogs ?? []), logEntry],
          };

          set((state: State & Actions) => {
            const pendientes = state.pendientes.filter((c) => c.id !== id);
            const rechazadas = state.rechazadas.filter((c) => c.id !== id);
            const aprobadas = [
              updatedConfesion,
              ...state.aprobadas.filter((c) => c.id !== id),
            ].sort((a, b) => b.date - a.date);

            return {
              pendientes,
              rechazadas,
              aprobadas,
            } satisfies Partial<State>;
          });
        } catch (err) {
          console.error("Error al aprobar:", err);
        }
      },
      reject: async (id, reason, moderator) => {
        const now = Date.now();
        const moderatorName = moderator?.name ?? null;
        const moderatorId = moderator?.id;
        const trimmedReason = reason?.trim() ?? null;

        const origen =
          get().pendientes.find((c) => c.id === id) ??
          get().aprobadas.find((c) => c.id === id) ??
          get().rechazadas.find((c) => c.id === id);

        if (!origen) {
          console.error("No se encontró la confesión a rechazar:", id);
          return;
        }

        const logPayload = buildModerationLog("rejected", now, moderator, trimmedReason);

        try {
          const confRef = await obtenerDocumentoConfesion(origen.firebaseId, id);
          if (!confRef) {
            console.error("No se encontró el documento en Firestore para rechazar:", id);
            return;
          }

          await updateDoc(confRef, {
            status: "rejected",
            approvedAt: null,
            approvedBy: null,
            rejectedAt: now,
            rejectionReason: trimmedReason,
          });

          const logRef = await addDoc(collection(confRef, "moderationLogs"), logPayload);
          const logEntry: ModerationLogEntry = { id: logRef.id, ...logPayload };

          const updatedConfesion: ConfesionModerada = {
            ...origen,
            firebaseId: origen.firebaseId ?? confRef.id,
            status: "rejected",
            approvedAt: null,
            approvedBy: null,
            rejectedAt: now,
            rejectionReason: trimmedReason,
            moderationLogs: [...(origen.moderationLogs ?? []), logEntry],
          };

          set((state: State & Actions) => {
            const pendientes = state.pendientes.filter((c) => c.id !== id);
            const aprobadas = state.aprobadas.filter((c) => c.id !== id);
            const rechazadas = [
              updatedConfesion,
              ...state.rechazadas.filter((c) => c.id !== id),
            ].sort((a, b) => b.date - a.date);

            return {
              pendientes,
              aprobadas,
              rechazadas,
            } satisfies Partial<State>;
          });
        } catch (err) {
          console.error(" Error al rechazar:", err);
        }
      },
      toggleLike: async (id) => {
        const user = auth.currentUser;
        if (!user) {
          console.warn("Usuario no autenticado");
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
          console.error("Error al cambiar like:", err);
          console.error("Error al cambiar like:", err);
        }
      },
      seed: (aprobadas, pendientes, rechazadas) =>
        set({
          aprobadas: aprobadas.map((c) => ({
            ...c,
            carrera: normalizarCarrera(c.carrera ?? ""),
            status: c.status ?? "approved",
            moderationLogs: c.moderationLogs ?? [],
          })),
          pendientes: pendientes.map((c) => ({
            ...c,
            carrera: normalizarCarrera(c.carrera ?? ""),
            status: c.status ?? "pending",
            moderationLogs: c.moderationLogs ?? [],
          })),
          rechazadas: (rechazadas ?? []).map((c) => ({
            ...c,
            carrera: normalizarCarrera(c.carrera ?? ""),
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
        const interesNormalizadas = carrerasDeInteres
          .map((carrera) => normalizarCarrera(carrera))
          .filter((value, index, arr) => arr.indexOf(value) === index);

        if (interesNormalizadas.length === 0)
          return [...aprobadas].sort((a, b) => b.date - a.date);

        const confesionesDeInteres: ConfesionModerada[] = [];
        const confesionesOtras: ConfesionModerada[] = [];

        aprobadas.forEach((conf) => {
          const carreraNormalizada = normalizarCarrera(conf.carrera ?? "");
          const confNormalizada =
            conf.carrera === carreraNormalizada ? conf : { ...conf, carrera: carreraNormalizada };

          if (interesNormalizadas.includes(carreraNormalizada)) {
            confesionesDeInteres.push(confNormalizada);
          } else {
            confesionesOtras.push(confNormalizada);
          }
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

          const mapDocs = async (snap: typeof pendingSnap) => {
            const items = await Promise.all(
              snap.docs.map(async (docSnap) => {
                const data = docSnap.data() as ConfesionModerada;
                const logsSnap = await getDocs(collection(docSnap.ref, "moderationLogs"));
                const moderationLogs = logsSnap.docs
                  .map((log) => ({
                    id: log.id,
                    ...(log.data() as Omit<ModerationLogEntry, "id">),
                  }))
                  .sort((a, b) => (a.timestamp ?? 0) - (b.timestamp ?? 0));

                return {
                  ...data,
                  carrera: normalizarCarrera(data.carrera ?? ""),
                  firebaseId: docSnap.id,
                  moderationLogs,
                };
              })
            );
            return items;
          };

          const [pendientes, aprobadas, rechazadas] = await Promise.all([
            mapDocs(pendingSnap),
            mapDocs(approvedSnap),
            mapDocs(rejectedSnap),
          ]);

          set({
            pendientes,
            aprobadas: aprobadas.sort((a, b) => (b.date ?? 0) - (a.date ?? 0)),
            rechazadas: rechazadas.sort((a, b) => (b.rejectedAt ?? 0) - (a.rejectedAt ?? 0)),
          });
        } catch (err) {
          console.error("Error al cargar confesiones:", err);
          console.error("Error al cargar confesiones:", err);
        }
      },
    }),
    {
      name: "confesiones-storage",
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);

const buildModerationLog = (
  action: ModerationLogEntry["action"],
  timestamp: number,
  moderator?: ModeratorInfo,
  reason?: string | null
): Omit<ModerationLogEntry, "id"> => {
  const user: ModerationLogEntry["user"] = {};
  if (moderator?.id) user.id = moderator.id;
  if (moderator?.name) user.name = moderator.name;
  const log: Omit<ModerationLogEntry, "id"> & { reason?: string } = {
    action,
    timestamp,
    user,
  };
  if (reason) log.reason = reason;
  return log;
};
