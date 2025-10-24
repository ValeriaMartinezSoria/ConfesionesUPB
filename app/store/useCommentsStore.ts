import { create } from "zustand";
import {
  collection,
  addDoc,
  onSnapshot,
  query,
  where,
  orderBy,
  doc,
  setDoc,
  deleteDoc,
  getDoc,
  updateDoc,
  increment,
  serverTimestamp,
} from "firebase/firestore";
import { db, auth } from "../data/firebase";

type Comment = {
  id: string;
  text: string;
  createdAt: number;
  confessionId: number;
  image?: string;
  likes: number;
  userId: string;
};

type CommentsState = {
  commentsByConfession: Record<number, Comment[]>;
  loading: boolean;
  addComment: (confessionId: number, text: string, image?: string) => Promise<void>;
  subscribeToComments: (confessionId: number) => () => void;
  toggleLike: (commentId: string) => Promise<void>;
};

export const useCommentsStore = create<CommentsState>((set, get) => ({
  commentsByConfession: {},
  loading: false,


  addComment: async (confessionId, text, image) => {
    if (!text.trim() && !image) return;
    try {
      const user = auth.currentUser;
      if (!user) {
        console.warn("Usuario no autenticado");
        return;
      }

      const commentData: any = {
        text: text.trim(),
        confessionId,
        createdAt: Date.now(),
        likes: 0,
        userId: user.uid, 
      };

      if (image) {
        commentData.image = image;
      }

      await addDoc(collection(db, "comments"), commentData);
      console.log("Comentario agregado con UID:", user.uid);
    } catch (err) {
      console.error(" Error al agregar comentario:", err);
    }
  },

  subscribeToComments: (confessionId) => {
    const q = query(
      collection(db, "comments"),
      where("confessionId", "==", confessionId),
      orderBy("createdAt", "asc")
    );

    return onSnapshot(q, (snapshot) => {
      const comments = snapshot.docs.map((docSnap) => ({
        id: docSnap.id,
        ...(docSnap.data() as Omit<Comment, "id">),
      }));

      set((state) => ({
        commentsByConfession: {
          ...state.commentsByConfession,
          [confessionId]: comments,
        },
      }));
    });
  },


  toggleLike: async (commentId: string) => {
    try {
      const user = auth.currentUser;
      if (!user) {
        console.warn("Usuario no autenticado");
        return;
      }

      const likeRef = doc(db, "comments", commentId, "likes", user.uid);
      const commentRef = doc(db, "comments", commentId);
      const likeSnap = await getDoc(likeRef);

      if (likeSnap.exists()) {

        await deleteDoc(likeRef);
        await updateDoc(commentRef, { likes: increment(-1) });
        console.log(" Like eliminado por:", user.uid);
      } else {
      
        await setDoc(likeRef, { liked: true, userId: user.uid, createdAt: serverTimestamp() });
        await updateDoc(commentRef, { likes: increment(1) });
        console.log(" Like agregado por:", user.uid);
      }
    } catch (err) {
      console.error(" Error al alternar like:", err);
    }
  },
}));
