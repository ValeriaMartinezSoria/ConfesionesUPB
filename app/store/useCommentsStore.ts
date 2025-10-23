import { create } from "zustand";
import type { Comment } from "../types/confesiones";

interface CommentsState {
  commentsByConfession: Record<number, Comment[]>;
  addComment: (confessionId: number, comment: Omit<Comment, "id" | "date"> & { image?: string }) => void;
}

let NEXT_COMMENT_ID = 1;

export const useCommentsStore = create<CommentsState>((set) => ({
  commentsByConfession: {},

  addComment: (confessionId, comment) =>
    set((state) => {
      const existing = state.commentsByConfession[confessionId] || [];
      const newComment: Comment = {
        id: NEXT_COMMENT_ID++,
        user: comment.user,
        content: comment.content,
        date: Date.now(),
        image: comment.image,
      };
      return {
        commentsByConfession: {
          ...state.commentsByConfession,
          [confessionId]: [...existing, newComment],
        },
      };
    }),
}));
