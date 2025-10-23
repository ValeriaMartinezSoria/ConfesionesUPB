import { create } from "zustand";
import { collection, addDoc, onSnapshot, query, where, orderBy } from "firebase/firestore";
import { db } from "../data/firebase";

type Comment = {
  id: string;
  text: string;
  createdAt: number;
  confessionId: number;
<<<<<<< HEAD
=======
  image?: string;
  likes?: number;
>>>>>>> upstream/feat/image-upload
};

type CommentsState = {
  commentsByConfession: Record<number, Comment[]>;
  loading: boolean;
<<<<<<< HEAD
  addComment: (confessionId: number, text: string) => Promise<void>;
  subscribeToComments: (confessionId: number) => () => void; // ✅ corregido
=======
  addComment: (confessionId: number, text: string, image?: string) => Promise<void>;
  subscribeToComments: (confessionId: number) => () => void;
>>>>>>> upstream/feat/image-upload
};

export const useCommentsStore = create<CommentsState>((set, get) => ({
  commentsByConfession: {},
  loading: false,

<<<<<<< HEAD
  addComment: async (confessionId, text) => {
    if (!text.trim()) return;
    try {
      await addDoc(collection(db, "comments"), {
        text,
        confessionId,
        createdAt: Date.now(),
      });
=======
  addComment: async (confessionId, text, image) => {
    if (!text.trim() && !image) return;
    try {
      const commentData: any = {
        text: text.trim(),
        confessionId,
        createdAt: Date.now(),
        likes: 0,
      };
      
      if (image) {
        commentData.image = image;
      }
      
      await addDoc(collection(db, "comments"), commentData);
>>>>>>> upstream/feat/image-upload
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

<<<<<<< HEAD
    // ✅ devuelve función de limpieza (unsubscribe)
=======
>>>>>>> upstream/feat/image-upload
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
