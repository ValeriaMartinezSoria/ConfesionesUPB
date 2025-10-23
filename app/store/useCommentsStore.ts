import { create } from "zustand";
import { collection, addDoc, onSnapshot, query, where, orderBy } from "firebase/firestore";
import { db } from "../data/firebase";

type Comment = {
  id: string;
  text: string;
  createdAt: number;
  confessionId: number;
};

type CommentsState = {
  commentsByConfession: Record<number, Comment[]>;
  loading: boolean;
  addComment: (confessionId: number, text: string) => Promise<void>;
  subscribeToComments: (confessionId: number) => () => void; // ✅ corregido
};

export const useCommentsStore = create<CommentsState>((set, get) => ({
  commentsByConfession: {},
  loading: false,

  addComment: async (confessionId, text) => {
    if (!text.trim()) return;
    try {
      await addDoc(collection(db, "comments"), {
        text,
        confessionId,
        createdAt: Date.now(),
      });
    } catch (err) {
      console.error("Error al agregar comentario:", err);
    }
  },

  subscribeToComments: (confessionId) => {
    const q = query(
      collection(db, "comments"),
      where("confessionId", "==", confessionId),
      orderBy("createdAt", "asc")
    );

    // ✅ devuelve función de limpieza (unsubscribe)
    return onSnapshot(q, (snapshot) => {
      const comments = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...(doc.data() as Omit<Comment, "id">),
      }));
      set((state) => ({
        commentsByConfession: {
          ...state.commentsByConfession,
          [confessionId]: comments,
        },
      }));
    });
  },
}));
