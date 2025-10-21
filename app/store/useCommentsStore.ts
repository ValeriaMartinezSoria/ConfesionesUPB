import { create } from "zustand";

interface CommentsState {
  commentsByConfession: Record<number, string[]>; 
  addComment: (confessionId: number, comment: string) => void;
}

export const useCommentsStore = create<CommentsState>((set) => ({
  commentsByConfession: {},

  addComment: (confessionId, comment) =>
    set((state) => {
      const existing = state.commentsByConfession[confessionId] || [];
      return {
        commentsByConfession: {
          ...state.commentsByConfession,
          [confessionId]: [...existing, comment],
        },
      };
    }),
}));
