import { create } from "zustand";
import { collection, addDoc, onSnapshot, query, where, orderBy } from "firebase/firestore";
import { db } from "../data/firebase";

type Comment = {
  id: string;
  text: string;
  createdAt: number;
  confessionId: number;
  image?: string;
  likes?: number;
};

type CommentsState = {
  commentsByConfession: Record<number, Comment[]>;
  loading: boolean;
  addComment: (confessionId: number, text: string, image?: string) => Promise<void>;
  subscribeToComments: (confessionId: number) => () => void;
};

export const useCommentsStore = create<CommentsState>((set, get) => ({
  commentsByConfession: {},
  loading: false,

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
