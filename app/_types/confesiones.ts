export type Category = "random" | "amor" | "academico";

export type Comment = {
  id: number;
  user: string;
  content: string;
  date: number;
  image?: string;
};

export type Confesion = {
  id: number;
  user: string;
  nexo: string;
  content: string;
  category: Category;
  date: number;
  likes: number;
  comments: Comment[];
};
