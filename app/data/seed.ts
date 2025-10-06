export type Category = "random" | "amor" | "academico";
export type Comment = { id: number; user: string; content: string; date: number };
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

export const seedPendientes: Confesion[] = [
  { id: 1001, user: "anon", nexo: "Bloque 6", content: "Quiero confesar que me da miedo presentar mi primer parcial, pero lo voy a intentar.", category: "random", date: Date.now() - 1000 * 60 * 30, likes: 0, comments: [] }
];

export const seedAprobadas: Confesion[] = [
  { id: 1, user: "anon", nexo: "Cafetería", content: "Me puse nervios@ hablando con mi crush en la fila 😅", category: "amor", date: Date.now() - 1000 * 60 * 60 * 2, likes: 12, comments: [] },
  { id: 2, user: "anon", nexo: "Biblioteca", content: "Estudié toda la noche y aún así me confundí en el examen.", category: "academico", date: Date.now() - 1000 * 60 * 45, likes: 7, comments: [] },
  { id: 3, user: "anon", nexo: "Pasillo central", content: "El evento de ayer estuvo buenísimo 🔥", category: "random", date: Date.now() - 1000 * 60 * 10, likes: 3, comments: [] }
];
