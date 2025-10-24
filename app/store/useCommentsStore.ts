import { create } from "zustand";
import {
  collection,
  addDoc,
  onSnapshot,
  query,
  where,
  orderBy,
  updateDoc,
  doc,
  getDoc,
} from "firebase/firestore";
import { db, auth } from "../data/firebase";


type Comment = {
  id: string;
  text: string;
  createdAt: number;
  confessionId: number;
  image?: string | null;
  likes: number;
  userId: string;
  likedBy: string[]; 
};

type CommentsState = {
  commentsByConfession: Record<number, Comment[]>;
  loading: boolean;
  addComment: (confessionId: number, text: string, image?: string) => Promise<void>;
  toggleLike: (commentId: string) => Promise<void>;
  subscribeToComments: (confessionId: number) => () => void;
};

export const useCommentsStore = create<CommentsState>((set, get) => ({
  commentsByConfession: {},
  loading: false,

  addComment: async (confessionId, text, image) => {
    const trimmedText = text?.trim() || "";

  
    if (!trimmedText && !image) return;

    try {
      const user = auth.currentUser;
      if (!user) throw new Error("Usuario no autenticado.");

      const commentData = {
        text: trimmedText,
        confessionId,
        createdAt: Date.now(),
        likes: 0,
        userId: user.uid,
        image: image || null,
        likedBy: [], 
      };

      await addDoc(collection(db, "comments"), commentData);
    } catch (err) {
      console.error(" Error al agregar comentario:", err);
    }
  },


  toggleLike: async (commentId) => {
    try {
      const user = auth.currentUser;
      if (!user) throw new Error("Usuario no autenticado.");

      const commentRef = doc(db, "comments", commentId);
      const snap = await getDoc(commentRef);

      if (!snap.exists()) return;

      const data = snap.data() as Comment;
      const likedBy = data.likedBy || [];
      const hasLiked = likedBy.includes(user.uid);

   
      const newLikedBy = hasLiked
        ? likedBy.filter((uid) => uid !== user.uid)
        : [...likedBy, user.uid];

      await updateDoc(commentRef, {
        likedBy: newLikedBy,
        likes: newLikedBy.length,
      });
    } catch (err) {
      console.error(" Error al alternar like:", err);
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
